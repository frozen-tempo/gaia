import { projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";
import SteelBeamDesign from "./SteelBeamDesign";
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

  const HCUDesignTable = schemeDesignData.precastHCU;
  const slabSpan = designData.xGrid;
  const beamSpan = designData.yGrid;
  const slabDesignLoad = deadLoadTotal + liveLoadTotal;
  var hollowCoreDepth = "";
  var depthFound = false;

  for (const [slabDepth, data] of Object.entries(HCUDesignTable).sort()) {
    data.design.forEach((dataPoint) => {
      if (dataPoint[0] > slabDesignLoad && dataPoint[1] > slabSpan) {
        console.log(hollowCoreDepth);
        hollowCoreDepth = slabDepth;
        depthFound = true;
        return;
      }
    });
    if (depthFound) {
      break;
    }
  }

  SteelBeamDesign(
    deadLoadTotal * slabSpan,
    liveLoadTotal * slabSpan,
    beamSpan,
    "full",
    "UB",
    360
  );

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
