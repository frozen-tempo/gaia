import { projectData, schemeDesign, Load } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";
import SteelBeamDesign from "./SteelBeamDesign";
import SteelColumnDesign from "./SteelColumnDesign";
import simpleLTD from "./SimpleLTD";
import getTotalLoads from "./getLoadingTotals";
import embodiedCarbonCalculation from "./embodiedCarbonCalculation";

interface HCUDesignData {
  design: [[]];
  selfWeight: number;
}

function SteelHCUDesign(designData: projectData) {
  // Hollowcore Design from Bison / Forterra Precast HCU Load Tables

  const HCUDesignTable = schemeDesignData.precastHCU;
  const slabSpan = designData.xGrid;
  const beamSpan = designData.yGrid;
  const steelDensity = 7850; // kg/m3
  var hollowCoreDepth = "";
  var depthFound = false;

  const deadLoads = getTotalLoads(designData.deadLoads);
  const liveLoads = getTotalLoads(designData.liveLoads);

  const slabDesignLoad = deadLoads.loadTotal + liveLoads.loadTotal;

  const floorArea = slabSpan * beamSpan;
  const numFloors =
    Math.floor(designData.buildingHeight / designData.floorHeight) - 1;

  const GIA =
    4 *
    slabSpan *
    beamSpan *
    Math.floor(designData.buildingHeight / designData.floorHeight);

  hollowCoreDepth = "No Valid Design";
  // Parse HCU Data to Find Shallowest Valid Slab
  for (const [slabDepth, data] of Object.entries(HCUDesignTable).sort()) {
    data.design.forEach((dataPoint) => {
      if (dataPoint[0] >= slabDesignLoad && dataPoint[1] >= slabSpan) {
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

  // Steel Column Design at Concept Stage
  var validSteelInternalColumns = SteelColumnDesign(
    designData,
    internalLTD.columnLoadULS
  );

  // Steel Column Design at Concept Stage
  var validSteelEdgeColumns = SteelColumnDesign(
    designData,
    edgeLTD.columnLoadULS
  );

  // Steel Column Design at Concept Stage
  var validSteelCornerColumns = SteelColumnDesign(
    designData,
    cornerLTD.columnLoadULS
  );

  if (hollowCoreDepth == "No Valid Design") {
    validSteelBeams = ["No Valid Design"];
    validSteelInternalColumns = ["No Valid Design"];
  }

  console.log(validSteelInternalColumns);

  const columnVolume =
    (Number(validSteelInternalColumns.slice(-1)[0].slice(-3)) / steelDensity +
      (4 * Number(validSteelEdgeColumns.slice(-1)[0].slice(-3))) /
        steelDensity +
      (4 * Number(validSteelCornerColumns.slice(-1)[0].slice(-3))) /
        steelDensity) *
    designData.buildingHeight;

  const beamVolume =
    (Number(validSteelBeams[0].slice(-3)) / steelDensity) *
    (numFloors + 1) *
    (6 * beamSpan + 6 * slabSpan);

  const slabVolume =
    ((numFloors + 1) *
      4 *
      (Number(
        HCUDesignTable[hollowCoreDepth as keyof typeof HCUDesignTable]
          .selfWeight
      ) *
        beamSpan *
        slabSpan *
        1000)) /
    9.81 /
    2500;

  const steelCarbon = JSON.parse(
    JSON.stringify(
      carbonData.Steel.filter(
        (a) => a.name == designData.projectSettings.steelCarbon
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

  const columnEmbodiedCarbon = embodiedCarbonCalculation(designData, {
    elementType: "Columns",
    material: "Steel",
    materialSpec: designData.projectSettings.steelCarbon,
    volume: columnVolume,
    rebarRate: designData.projectSettings.rebarRate,
    carbonData: steelCarbon,
  });

  const beamEmbodiedCarbon = embodiedCarbonCalculation(designData, {
    elementType: "Beams",
    material: "Steel",
    materialSpec: designData.projectSettings.steelCarbon,
    volume: beamVolume,
    rebarRate: "",
    carbonData: steelCarbon,
  });

  const slabEmbodiedCarbon = embodiedCarbonCalculation(designData, {
    elementType: "Slabs",
    material: "RC",
    materialSpec: designData.projectSettings.concreteSlabCarbon,
    volume: beamVolume,
    rebarRate: designData.projectSettings.rebarRate,
    carbonData: slabCarbon,
  });

  const A1_A5 =
    columnEmbodiedCarbon.A1_A5 +
    beamEmbodiedCarbon.A1_A5 +
    slabEmbodiedCarbon.A1_A5;

  return {
    schemeType: "Steel Beam & HCU Slab",
    structuralDepth: hollowCoreDepth,
    validSteelBeams: validSteelBeams[0],
    internalColumn: validSteelInternalColumns.slice(-1),
    edgeColumn: validSteelEdgeColumns.slice(-1),
    cornerColumn: validSteelCornerColumns.slice(-1),
    internalULSLoad: internalLTD.columnLoadULS.toFixed(2),
    edgeULSLoad: edgeLTD.columnLoadULS.toFixed(2),
    cornerULSLoad: cornerLTD.columnLoadULS.toFixed(2),
    grossInternalFloorArea: GIA,
    A1_A5: Math.round(A1_A5 / GIA),
  };
}

export default SteelHCUDesign;
