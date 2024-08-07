import { projectData, schemeDesign, Load } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";
import SteelBeamDesign from "./SteelBeamDesign";
import SteelColumnDesign from "./SteelColumnDesign";
import simpleLTD from "./SimpleLTD";
import getTotalLoads from "./getLoadingTotals";

interface HCUDesignData {
  design: [[]];
  selfWeight: number;
}

function SteelHCUDesign(designData: projectData) {
  // Hollowcore Design from Bison / Forterra Precast HCU Load Tables

  const HCUDesignTable = schemeDesignData.precastHCU;
  const slabSpan = designData.xGrid;
  const beamSpan = designData.yGrid;
  var hollowCoreDepth = "";
  var depthFound = false;

  const deadLoads = getTotalLoads(designData.deadLoads);
  const liveLoads = getTotalLoads(designData.liveLoads);

  const slabDesignLoad = deadLoads.loadTotal + liveLoads.loadTotal;

  const floorArea = designData.xGrid * designData.yGrid;
  const numFloors =
    Math.floor(designData.buildingHeight / designData.floorHeight) - 1;

  const GIA =
    4 *
    designData.xGrid *
    designData.yGrid *
    Math.floor(designData.buildingHeight / designData.floorHeight);

  hollowCoreDepth = "No Valid Design";
  // Parse HCU Data to Find Shallowest Valid Slab
  for (const [slabDepth, data] of Object.entries(HCUDesignTable).sort()) {
    data.design.forEach((dataPoint) => {
      if (dataPoint[0] >= slabDesignLoad && dataPoint[1] >= slabSpan) {
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

  // Steel Beam Design returns a list of valid beams ordered from lightest to heaviest
  var validSteelBeams: string[] = SteelBeamDesign(
    designData,
    deadLoads.loadTotal * slabSpan,
    liveLoads.loadTotal * slabSpan
  );

  // Steel Column Design at Concept Stage (20% built-in conservatism at this early stage)
  var validSteelInternalColumns = SteelColumnDesign(
    designData,
    internalLTD.columnLoadULS
  );

  if (hollowCoreDepth == "No Valid Design") {
    validSteelBeams = ["No Valid Design"];
    validSteelInternalColumns = ["No Valid Design"];
  }

  return {
    schemeType: "Steel Beam & HCU Slab",
    structuralDepth: hollowCoreDepth,
    validSteelBeams: validSteelBeams[0],
    internalColumn: validSteelInternalColumns.slice(-1),
    edgeColumn: "edgeColumnSquare",
    cornerColumn: "cornerColumnSquare",
    internalULSLoad: internalLTD.columnLoadULS.toFixed(2),
    edgeULSLoad: edgeLTD.columnLoadULS.toFixed(2),
    cornerULSLoad: cornerLTD.columnLoadULS.toFixed(2),
    grossInternalFloorArea: GIA,
    A1_A5: "A1_A5",
  };
}

export default SteelHCUDesign;
