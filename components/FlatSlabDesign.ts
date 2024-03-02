import React from "react";
import { Load, loadingTotals, projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";
import simpleLTD from "./SimpleLTD";
import RCColumnDesign from "./RCColumnDesign";

function FlatSlabDesign(designData: projectData) {
  /* Find Find LL Curve from Flat Slab Data */
  function getTotalLoads(loads: Load[]) {
    let loadTotal = 0;
    let groundTotal = 0;
    let roofTotal = 0;
    loads.map((load) => {
      if (load.loadGround === false && load.loadRoof === false) {
        loadTotal = loadTotal + +load.loadValue;
      } else if (load.loadGround && load.loadRoof === false) {
        groundTotal = groundTotal + +load.loadValue;
      } else {
        roofTotal = roofTotal + +load.loadValue;
      }
    });
    return { loadTotal, groundTotal, roofTotal };
  }

  const deadLoads = getTotalLoads(designData.deadLoads);
  const liveLoads = getTotalLoads(designData.liveLoads);

  var flatSlabCurves = Object.keys(schemeDesignData.flatSlab);
  const LLGoal = (deadLoadsTotal: number, liveLoadsTotal: number): number => {
    if (deadLoadsTotal > 0 && liveLoadsTotal > 0) {
      return (1.25 * (deadLoads.loadTotal - 1.5)) / 1.5 + liveLoads.loadTotal;
    } else {
      return 2.5;
    }
  };
  var closestLL = +flatSlabCurves.reduce(function (prev: string, curr: string) {
    return Math.abs(
      parseInt(curr) - LLGoal(deadLoads.loadTotal, liveLoads.loadTotal)
    ) <
      Math.abs(
        parseInt(prev) - LLGoal(deadLoads.loadTotal, liveLoads.loadTotal)
      )
      ? curr
      : prev;
  });

  const loadKey: string = (Math.round(closestLL * 2) / 2).toString();
  const LLCurve: number[][] =
    schemeDesignData.flatSlab[
      loadKey as keyof typeof schemeDesignData.flatSlab
    ];

  /* Find Max Span for Tables */
  const spanGoal = Math.max(designData.xGrid, designData.yGrid);

  var closestSpan = LLCurve.reduce(function (prev: number[], curr: number[]) {
    return Math.abs(curr[0] - spanGoal) < Math.abs(prev[0] - spanGoal)
      ? curr
      : prev;
  });

  const slabDepth = Math.floor(closestSpan[1] / 5) * 5;

  /* LTD for Flat Slab */
  const numFloors =
    Math.floor(designData.buildingHeight / designData.floorHeight) - 1;

  const slabSW = (slabDepth / 1000) * 25;

  const floorArea = designData.xGrid * designData.yGrid;

  // Internal Column Simple LTD
  const internalLTD = simpleLTD(
    floorArea,
    slabSW,
    designData.deadLoads,
    designData.liveLoads,
    numFloors
  );

  // Edge Column Simple LTD
  const edgeLTD = simpleLTD(
    floorArea / 2,
    slabSW,
    designData.deadLoads,
    designData.liveLoads,
    numFloors
  );

  // Corner Column Simple LTD
  const cornerLTD = simpleLTD(
    floorArea / 4,
    slabSW,
    designData.deadLoads,
    designData.liveLoads,
    numFloors
  );

  const rebarRatio = designData.projectSettings.rebarRate;

  const columnSizing = RCColumnDesign(
    internalLTD.columnLoadULS,
    edgeLTD.columnLoadULS,
    cornerLTD.columnLoadULS,
    spanGoal,
    loadKey,
    rebarRatio
  );

  // Column Loads Including Column SW

  const internalColumnULSLTD =
    internalLTD.columnLoadULS +
    1.35 *
      designData.buildingHeight *
      (columnSizing.internalColumn.size / 1000) ** 2 *
      25;
  const edgeColumnULSLTD =
    edgeLTD.columnLoadULS +
    1.35 *
      designData.buildingHeight *
      (columnSizing.edgeColumn.size / 1000) ** 2 *
      25;
  const cornerColumnULSLTD =
    cornerLTD.columnLoadULS +
    1.35 *
      designData.buildingHeight *
      (columnSizing.cornerColumn.size / 1000) ** 2 *
      25;

  // Carbon Calculation
  const GIA = 4 * designData.xGrid * designData.yGrid * (numFloors + 1); // Gross Internal Floor Area
  const cornerColumnArea = (4 * columnSizing.cornerColumn.size ** 2) / 1000000;
  const edgeColumnArea = (4 * columnSizing.edgeColumn.size ** 2) / 1000000;
  const internalColumnArea = columnSizing.internalColumn.size ** 2 / 1000000;

  const columnCarbon = carbonData.Concrete.filter(
    (a) => a.name == designData.projectSettings.concreteColumnCarbon
  );

  const slabCarbon = carbonData.Concrete.filter(
    (a) => a.name == designData.projectSettings.concreteSlabCarbon
  );

  const rebarCarbon = carbonData.Rebar.filter(
    (a) => a.name == designData.projectSettings.rebarCarbon
  );

  const columnVolume =
    (cornerColumnArea + edgeColumnArea + internalColumnArea) *
    designData.buildingHeight;

  const slabArea = 4 * designData.xGrid * designData.yGrid * (numFloors + 1);

  const slabVolume = slabArea * (slabDepth / 1000);

  const rebarVolume =
    (+designData.projectSettings.rebarRate.slice(
      0,
      designData.projectSettings.rebarRate.length - 1
    ) /
      100) *
    (columnVolume + slabVolume);

  // Column Embodied Carbon
  const columnEmbodied = {
    A1_A3: columnVolume * columnCarbon[0].density * columnCarbon[0]["A1_A3"],
    A4: columnVolume * columnCarbon[0].density * columnCarbon[0]["A4"],
    A5:
      columnVolume *
      columnCarbon[0].density *
      ((columnCarbon[0]["A1_A3"] + columnCarbon[0]["A4"]) *
        columnCarbon[0]["WF"]),
    C2: columnVolume * columnCarbon[0].density * columnCarbon[0]["C2"],
    "C3/C4": columnVolume * columnCarbon[0].density * columnCarbon[0]["C3_C4"],
    D: columnVolume * columnCarbon[0].density * columnCarbon[0]["D"],
    Sequestration:
      columnVolume * columnCarbon[0].density * columnCarbon[0]["sequestration"],
  };

  // Slab Embodied Carbon
  const slabEmbodied = {
    A1_A3: slabVolume * slabCarbon[0].density * slabCarbon[0]["A1_A3"],
    A4: slabVolume * slabCarbon[0].density * slabCarbon[0]["A4"],
    A5:
      slabVolume *
      slabCarbon[0].density *
      ((slabCarbon[0]["A1_A3"] + slabCarbon[0]["A4"]) * slabCarbon[0]["WF"]),
    C2: slabVolume * slabCarbon[0].density * slabCarbon[0]["C2"],
    "C3/C4": slabVolume * slabCarbon[0].density * slabCarbon[0]["C3_C4"],
    D: slabVolume * slabCarbon[0].density * slabCarbon[0]["D"],
    Sequestration:
      slabVolume * slabCarbon[0].density * slabCarbon[0]["sequestration"],
  };

  // Rebar Embodied Carbon
  const rebarEmbodied = {
    A1_A3: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["A1_A3"],
    A4: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["A4"],
    A5:
      rebarVolume *
      rebarCarbon[0].density *
      ((rebarCarbon[0]["A1_A3"] + rebarCarbon[0]["A4"]) * rebarCarbon[0]["WF"]),
    C2: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["C2"],
    "C3/C4": rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["C3_C4"],
    D: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["D"],
    Sequestration:
      rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["sequestration"],
  };

  const A1_A5 =
    (columnEmbodied["A1_A3"] +
      columnEmbodied.A4 +
      columnEmbodied.A5 +
      (slabEmbodied["A1_A3"] + slabEmbodied.A4 + slabEmbodied.A5) +
      (rebarEmbodied["A1_A3"] + rebarEmbodied.A4 + rebarEmbodied.A5)) /
    GIA;

  return {
    schemeType: "RC Flat Slab",
    structuralDepth: slabDepth,
    internalColumn:
      internalLTD.columnLoadULS > 10000
        ? "No Valid Design"
        : columnSizing.internalColumn.size + "mm Square",
    edgeColumn:
      columnSizing.edgeColumn.size == 0
        ? "No Valid Design"
        : columnSizing.edgeColumn.size + "mm Square",
    cornerColumn:
      columnSizing.cornerColumn.size == 0
        ? "No Valid Design"
        : columnSizing.cornerColumn.size + "mm Square",
    internalULSLoad: internalColumnULSLTD.toFixed(2),
    edgeULSLoad: edgeColumnULSLTD.toFixed(2),
    cornerULSLoad: cornerColumnULSLTD.toFixed(2),
    grossInternalFloorArea: GIA.toFixed(2),
    A1_A5: A1_A5.toFixed(2),
  };
}

export default FlatSlabDesign;
