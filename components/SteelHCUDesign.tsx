import React from "react";
import { InternalSymbolName } from "typescript";
import { projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";
interface HCUDesignData {
  design: [[]];
  selfWeight: number;
}

function SteelHCUDesign(
  designData: projectData,
  deadLoadTotal: number,
  groundDeadTotal: number,
  roofDeadTotal: number,
  liveLoadTotal: number,
  groundLiveTotal: number,
  roofLiveTotal: number
) {
  // Hollowcore Design from Bison / Forterra Precast HCU Load Tables

  const HCUDesignTable: {} = schemeDesignData.precastHCU;
  const slabSpan = designData.xGrid;
  const beamSpan = designData.yGrid;
  const slabDesignLoad = deadLoadTotal + liveLoadTotal;
  var slabSpec = "";
  var validSlab = false;

  Object.keys(HCUDesignTable)
    .sort()
    .map((depth) => {
      const depthData = HCUDesignTable[
        depth as keyof typeof HCUDesignTable
      ] as HCUDesignData;
      depthData.design.map((dataPoint: number[]) => {
        if (dataPoint[0] > slabDesignLoad && dataPoint[1] > slabSpan) {
          slabSpec = depth;
          validSlab = true;
        }
      })
      if (validSlab) {
        return;
      }
    });
  console.log(slabSpec);

  return {
    schemeType: "Steel Beam & HCU Slab",
    structuralDepth: "slabDepth",
    internalColumnSquare: "internalColumnSquare",
    edgeColumnSquare: "edgeColumnSquare",
    cornerColumnSquare: "cornerColumnSquare",
    internalULSLoad: "internalColumnLoadULS",
    edgeULSLoad: "edgeColumnLoadULS",
    cornerULSLoad: "cornerColumnLoadULS",
    grossInternalFloorArea: "GIA",
    A1_A5: "A1_A5",
  };
}

export default SteelHCUDesign;
