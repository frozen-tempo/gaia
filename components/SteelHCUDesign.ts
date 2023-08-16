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

  // Parse HCU Data to Find Shallowest Valid Slab
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
  const slabSW =
    HCUDesignTable[hollowCoreDepth as keyof typeof HCUDesignTable].selfWeight;

  // Steel Beam Design returns a list of valid beams ordered from lightest to heaviest
  const validSteelBeams = SteelBeamDesign(
    deadLoadTotal * slabSpan,
    liveLoadTotal * slabSpan,
    beamSpan,
    "full",
    "UB",
    360
  );

  // Load Takedown

  const numFloors = designData.buildingHeight / designData.floorHeight - 1;

  const intermediateInternalColumnArea =
    designData.xGrid * designData.yGrid * numFloors;

  const otherInternalColumnArea = designData.xGrid * designData.yGrid;

  const internalLTD = simpleLTD(
    intermediateInternalColumnArea,
    otherInternalColumnArea
  );

  const edgeLTD = simpleLTD(
    intermediateInternalColumnArea / 2,
    otherInternalColumnArea / 2
  );

  const cornerLTD = simpleLTD(
    intermediateInternalColumnArea / 4,
    otherInternalColumnArea / 4
  );

  return {
    schemeType: "Steel Beam & HCU Slab",
    structuralDepth: hollowCoreDepth,
    validSteelBeams: validSteelBeams.validBeams,
    internalColumnSquare: slabSW,
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
