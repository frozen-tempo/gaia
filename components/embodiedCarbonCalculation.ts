import { projectData, elementData } from "typings";

function embodiedCarbonCalculation(
  designData: projectData,
  structureData: elementData
) {
  const A1_A3 =
    structureData.volume *
    structureData.carbonData.density *
    structureData.carbonData.A1_A3;
  const A4 =
    structureData.volume *
    structureData.carbonData.density *
    structureData.carbonData.A4;
  const C2 =
    structureData.volume *
    structureData.carbonData.density *
    structureData.carbonData.C2;
  const C3_C4 =
    structureData.volume *
    structureData.carbonData.density *
    structureData.carbonData.C3_C4;
  const D =
    structureData.volume *
    structureData.carbonData.density *
    structureData.carbonData.D;
  const WF =
    structureData.volume *
    structureData.carbonData.density *
    (structureData.carbonData.A1_A3 + structureData.carbonData.A4) *
    structureData.carbonData.WF;
  const sequestration =
    structureData.volume *
    structureData.carbonData.density *
    structureData.carbonData.sequestration;
  return {
    structureDataType: structureData.elementType,
    A1_A3: A1_A3,
    A4: A4,
    WF: WF,
    C2: C2,
    C3_C4: C3_C4,
    D: D,
    sequestration: sequestration,
    A1_A5: A1_A3 + A4 + WF,
  };
}

export default embodiedCarbonCalculation;
