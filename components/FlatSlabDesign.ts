import React from "react";
import { InternalSymbolName } from "typescript";
import { projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";

function FlatSlabDesign(
  designData: projectData,
  deadLoadTotal: number,
  groundDeadTotal: number,
  roofDeadTotal: number,
  liveLoadTotal: number,
  groundLiveTotal: number,
  roofLiveTotal: number
) {
  /* Find Find LL Curve from Flat Slab Data */
  var flatSlabCurves = Object.keys(schemeDesignData.flatSlab);
  const LLGoal = (deadLoadTotal: number, liveLoadTotal: number): number => {
    if (deadLoadTotal > 0 && liveLoadTotal > 0) {
      return (1.25 * (deadLoadTotal - 1.5)) / 1.5 + liveLoadTotal;
    } else {
      return 2.5;
    }
  };
  var closestLL = +flatSlabCurves.reduce(function (prev: string, curr: string) {
    return Math.abs(parseInt(curr) - LLGoal(deadLoadTotal, liveLoadTotal)) <
      Math.abs(parseInt(prev) - LLGoal(deadLoadTotal, liveLoadTotal))
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
  const numFloors = designData.buildingHeight / designData.floorHeight - 1;

  const intermediateInternalColumnArea =
    designData.xGrid * designData.yGrid * numFloors;

  const otherInternalColumnArea = designData.xGrid * designData.yGrid;
  const slabSW = (slabDepth / 1000) * 25;

  function simpleLTD(intermediateColumnArea: number, otherColumnArea: number) {
    const totalSlabSWColumn =
      slabSW * (intermediateColumnArea + otherColumnArea);

    const totalSDLColumn =
      intermediateColumnArea * deadLoadTotal + otherColumnArea * roofDeadTotal;

    const totalLLColumn =
      intermediateColumnArea * liveLoadTotal + otherColumnArea * roofLiveTotal;

    const columnLoadSLS = totalSlabSWColumn + totalLLColumn + totalSDLColumn;

    const columnLoadULS =
      1.35 * totalSlabSWColumn + 1.5 * totalLLColumn + 1.35 * totalSDLColumn;
    return {
      columnLoadULS: columnLoadULS,
      columnLoadSLS: columnLoadSLS,
    };
  }

  // Internal Column Simple LTD
  const internalLTD = simpleLTD(
    intermediateInternalColumnArea,
    otherInternalColumnArea
  );

  // Edge Column Simple LTD
  const edgeLTD = simpleLTD(
    intermediateInternalColumnArea / 2,
    otherInternalColumnArea / 2
  );

  // Corner Column Simple LTD
  const cornerLTD = simpleLTD(
    intermediateInternalColumnArea / 4,
    otherInternalColumnArea / 4
  );

  const rebarRatio = designData.projectSettings.rebarRate;

  // Use chart data for internal column sizing
  const internalRebarCurve =
    schemeDesignData.internalRCColumn[
      rebarRatio as keyof typeof schemeDesignData.internalRCColumn
    ];

  var closestColumnWidth = internalRebarCurve.reduce(function (
    prev: number[],
    curr: number[]
  ) {
    return Math.abs(curr[0] - internalLTD.columnLoadULS) <
      Math.abs(prev[0] - internalLTD.columnLoadULS)
      ? curr
      : prev;
  });

  const internalColumnSquare = Math.ceil(closestColumnWidth[1] / 25) * 25;
  var edgeColumnSquare = 225;
  var cornerColumnSquare = 225;

  // Use chart data for edge column sizing
  for (const [edgeColumnSize, curve] of Object.entries(
    schemeDesignData.EdgeRCColumnDesign1
  )) {
    const loadCurve = loadKey
      ? curve[loadKey as keyof typeof curve]
      : curve["2.5"];
    const edgeColumnDesignMoment = loadCurve.reduce(function (
      prev: number[],
      curr: number[]
    ) {
      return Math.abs(curr[0] - spanGoal) < Math.abs(prev[0] - spanGoal)
        ? curr
        : prev;
    });
    const rebarCurve: number[][] = (
      schemeDesignData.EdgeRCColumnDesign2 as {
        [key: string]: { [key: string]: number[][] };
      }
    )[edgeColumnSize][rebarRatio];
    if (
      RayCasting(edgeColumnDesignMoment[1], edgeLTD.columnLoadULS, rebarCurve)
    ) {
      edgeColumnSquare = +edgeColumnSize;
      break;
    }
  }

  // Use chart data for corner column sizing
  for (const [cornerColumnSize, curve] of Object.entries(
    schemeDesignData.CornerRCColumnDesign1
  )) {
    const loadCurve = loadKey
      ? curve[loadKey as keyof typeof curve]
      : curve["2.5"];
    const cornerColumnDesignMoment = loadCurve.reduce(function (
      prev: number[],
      curr: number[]
    ) {
      return Math.abs(curr[0] - spanGoal) < Math.abs(prev[0] - spanGoal)
        ? curr
        : prev;
    });
    const rebarCurve: number[][] = (
      schemeDesignData.CornerRCColumnDesign2 as {
        [key: string]: { [key: string]: number[][] };
      }
    )[cornerColumnSize][rebarRatio];
    if (
      RayCasting(
        cornerColumnDesignMoment[1],
        cornerLTD.columnLoadULS,
        rebarCurve
      )
    ) {
      cornerColumnSquare = +cornerColumnSize;
      break;
    }
  }

  // Column Loads Including Column SW

  const internalColumnULSLTD =
    internalLTD.columnLoadULS +
    1.35 * designData.buildingHeight * (internalColumnSquare / 1000) ** 2 * 25;
  const edgeColumnULSLTD =
    edgeLTD.columnLoadULS +
    1.35 * designData.buildingHeight * (edgeColumnSquare / 1000) ** 2 * 25 * 4;
  const cornerColumnULSLTD =
    cornerLTD.columnLoadULS +
    1.35 *
      designData.buildingHeight *
      (cornerColumnSquare / 1000) ** 2 *
      25 *
      4;

  // Carbon Calculation
  const GIA = 4 * designData.xGrid * designData.yGrid * (numFloors + 1); // Gross Internal Floor Area
  const cornerColumnArea = (4 * cornerColumnSquare ** 2) / 1000000;
  const edgeColumnArea = (4 * edgeColumnSquare ** 2) / 1000000;
  const internalColumnArea = internalColumnSquare ** 2 / 1000000;

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
    "A1-A3": columnVolume * columnCarbon[0].density * columnCarbon[0]["A1-A3"],
    A4: columnVolume * columnCarbon[0].density * columnCarbon[0]["A4"],
    A5:
      columnVolume *
      columnCarbon[0].density *
      ((columnCarbon[0]["A1-A3"] + columnCarbon[0]["A4"]) *
        columnCarbon[0]["WF"]),
    C2: columnVolume * columnCarbon[0].density * columnCarbon[0]["C2"],
    "C3/C4": columnVolume * columnCarbon[0].density * columnCarbon[0]["C3/C4"],
    D: columnVolume * columnCarbon[0].density * columnCarbon[0]["D"],
    Sequestration:
      columnVolume * columnCarbon[0].density * columnCarbon[0]["Sequestration"],
  };

  // Slab Embodied Carbon
  const slabEmbodied = {
    "A1-A3": slabVolume * slabCarbon[0].density * slabCarbon[0]["A1-A3"],
    A4: slabVolume * slabCarbon[0].density * slabCarbon[0]["A4"],
    A5:
      slabVolume *
      slabCarbon[0].density *
      ((slabCarbon[0]["A1-A3"] + slabCarbon[0]["A4"]) * slabCarbon[0]["WF"]),
    C2: slabVolume * slabCarbon[0].density * slabCarbon[0]["C2"],
    "C3/C4": slabVolume * slabCarbon[0].density * slabCarbon[0]["C3/C4"],
    D: slabVolume * slabCarbon[0].density * slabCarbon[0]["D"],
    Sequestration:
      slabVolume * slabCarbon[0].density * slabCarbon[0]["Sequestration"],
  };

  // Rebar Embodied Carbon
  const rebarEmbodied = {
    "A1-A3": rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["A1-A3"],
    A4: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["A4"],
    A5:
      rebarVolume *
      rebarCarbon[0].density *
      ((rebarCarbon[0]["A1-A3"] + rebarCarbon[0]["A4"]) * rebarCarbon[0]["WF"]),
    C2: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["C2"],
    "C3/C4": rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["C3/C4"],
    D: rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["D"],
    Sequestration:
      rebarVolume * rebarCarbon[0].density * rebarCarbon[0]["Sequestration"],
  };

  const A1_A5 =
    (columnEmbodied["A1-A3"] +
      columnEmbodied.A4 +
      columnEmbodied.A5 +
      (slabEmbodied["A1-A3"] + slabEmbodied.A4 + slabEmbodied.A5) +
      (rebarEmbodied["A1-A3"] + rebarEmbodied.A4 + rebarEmbodied.A5)) /
    GIA;

  return {
    schemeType: "RC Flat Slab",
    structuralDepth: slabDepth,
    validSteelBeams: "",
    internalColumnSquare: internalColumnSquare + "mm Square",
    edgeColumnSquare: edgeColumnSquare + "mm Square",
    cornerColumnSquare: cornerColumnSquare + "mm Square",
    internalULSLoad: internalColumnULSLTD.toFixed(2),
    edgeULSLoad: edgeColumnULSLTD.toFixed(2),
    cornerULSLoad: cornerColumnULSLTD.toFixed(2),
    grossInternalFloorArea: GIA.toFixed(2),
    A1_A5: A1_A5.toFixed(2),
  };
}

export default FlatSlabDesign;
