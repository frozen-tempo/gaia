import { projectData, elementData } from "typings";

function embodiedCarbonCalculation(
  designData: projectData,
  structureData: elementData[]
) {
  const GIA =
    4 *
    designData.xGrid *
    designData.yGrid *
    Math.floor(designData.buildingHeight / designData.floorHeight);

  var embodiedCarbonCollection: {}[] = [];
  structureData.forEach((element) => {
    const A1_A3 =
      element.volume * element.carbonData.density * element.carbonData.A1_A3;
    const A4 =
      element.volume * element.carbonData.density * element.carbonData.A4;
    const C2 =
      element.volume * element.carbonData.density * element.carbonData.C2;
    const C3_C4 =
      element.volume * element.carbonData.density * element.carbonData.C3_C4;
    const D =
      element.volume * element.carbonData.density * element.carbonData.D;
    const WF =
      element.volume *
      element.carbonData.density *
      (element.carbonData.A1_A3 + element.carbonData.A4) *
      element.carbonData.WF;
    const sequestration =
      element.volume *
      element.carbonData.density *
      element.carbonData.sequestration;
    embodiedCarbonCollection.push({
      elementType: element.elementType,
      A1_A3: A1_A3.toFixed(2),
      A4: A4.toFixed(2),
      WF: WF.toFixed(2),
      C2: C2.toFixed(2),
      C3_C4: C3_C4.toFixed(2),
      D: D.toFixed(2),
      sequestration: sequestration.toFixed(2),
    });
  });
  return { embodiedCarbonCollection };
}

export default embodiedCarbonCalculation;
