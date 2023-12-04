import * as SteelBeamProps from "../src/data/steel-beam-properties.json";
import { ubBeam, projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";

function SteelColumnDesign(
  designData: projectData,
  internalColumnLoad: number,
  edgeColumnLoad: number,
  cornerColumnLoad: number
) {
  const UCDesignData = schemeDesignData.steelUCColumnDesign;
  const columnHeight = designData.floorHeight;

  Object.keys(UCDesignData).forEach((columnSize) => {
    console.log(typeof columnHeight);
  });

  return;
}

export default SteelColumnDesign;
