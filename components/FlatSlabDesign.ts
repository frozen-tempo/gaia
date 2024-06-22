import React from "react";
import { Load, projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";
import simpleLTD from "./SimpleLTD";
import RCColumnDesign from "./RCColumnDesign";
import embodiedCarbonCalculation from "./embodiedCarbonCalculation";
import getTotalLoads from "./getLoadingTotals";

function FlatSlabDesign(designData: projectData) {
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

  const GIA =
    4 *
    designData.xGrid *
    designData.yGrid *
    Math.floor(designData.buildingHeight / designData.floorHeight);

  const columnCarbon = JSON.parse(
    JSON.stringify(
      carbonData.Concrete.filter(
        (a) => a.name == designData.projectSettings.concreteColumnCarbon
      )[0]
    )
  );

  const slabCarbon = JSON.parse(
    JSON.stringify(
      carbonData.Concrete.filter(
        (a) => a.name == designData.projectSettings.concreteSlabCarbon
      )[0]
    )
  );

  const rebarCarbon = JSON.parse(
    JSON.stringify(
      carbonData.Rebar.filter(
        (a) => a.name == designData.projectSettings.rebarCarbon
      )[0]
    )
  );

  const cornerColumnArea = (4 * columnSizing.cornerColumn.size ** 2) / 1000000;
  const edgeColumnArea = (4 * columnSizing.edgeColumn.size ** 2) / 1000000;
  const internalColumnArea = columnSizing.internalColumn.size ** 2 / 1000000;

  const columnVolume =
    (cornerColumnArea + edgeColumnArea + internalColumnArea) *
    designData.buildingHeight;

  const slabVolume =
    4 *
    designData.xGrid *
    designData.yGrid *
    (numFloors + 1) *
    (slabDepth / 1000);

  const rebarVolume =
    (+designData.projectSettings.rebarRate.slice(
      0,
      designData.projectSettings.rebarRate.length - 1
    ) /
      100) *
    (columnVolume + slabVolume);

  const columnEmbodiedCarbon = embodiedCarbonCalculation(designData, {
    elementType: "Columns",
    material: "RC",
    materialSpec: designData.projectSettings.concreteColumnCarbon,
    volume: columnVolume,
    rebarRate: designData.projectSettings.rebarRate,
    carbonData: columnCarbon,
  });

  const slabEmbodiedCarbon = embodiedCarbonCalculation(designData, {
    elementType: "Slab",
    material: "RC",
    materialSpec: designData.projectSettings.concreteSlabCarbon,
    volume: slabVolume,
    rebarRate: designData.projectSettings.rebarRate,
    carbonData: slabCarbon,
  });

  const rebarEmbodiedCarbon = embodiedCarbonCalculation(designData, {
    elementType: "Rebar",
    material: "Steel",
    materialSpec: designData.projectSettings.rebarCarbon,
    volume: rebarVolume,
    rebarRate: designData.projectSettings.rebarRate,
    carbonData: rebarCarbon,
  });

  const A1_A5 =
    columnEmbodiedCarbon.A1_A5 +
    slabEmbodiedCarbon.A1_A5 +
    rebarEmbodiedCarbon.A1_A5;

  return {
    schemeType: "RC Flat Slab",
<<<<<<< HEAD
    structuralDepth: slabDepth,
    validSteelBeams: [],
=======
    structuralDepth: slabDepth + "mm",
>>>>>>> ca90a46ccb676b93fc8fe58d38f283558a4a8dc7
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
    internalULSLoad: parseFloat(internalColumnULSLTD.toFixed(2)),
    edgeULSLoad: parseFloat(edgeColumnULSLTD.toFixed(2)),
    cornerULSLoad: parseFloat(cornerColumnULSLTD.toFixed(2)),
    grossInternalFloorArea: GIA,
    A1_A5: Math.round(A1_A5 / GIA),
  };
}

export default FlatSlabDesign;
