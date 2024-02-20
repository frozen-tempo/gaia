import * as SteelBeamProps from "../src/data/steel-beam-properties.json";
import { ubBeam, projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";

function SteelColumnDesign(designData: projectData, columnLoad: number) {
  const sectionProps = SteelBeamProps;
  const UCDesignData = schemeDesignData.steelUCColumnDesign;
  const columnHeight = designData.floorHeight;
  const columnDesignData = Object.entries(UCDesignData);

  function getValidColumns(
    columnData: any,
    designLoad: number,
    columnHeight: number
  ) {
    var validColumnList: string[] = [];
    columnData.forEach((column: any) => {
      const colLengths = Object.keys(column[1]);
      colLengths.forEach((length) => {
        const loadCapacity = column[1][length as keyof (typeof column)[1]];
        if (loadCapacity >= designLoad && parseFloat(length) >= columnHeight) {
          if (!validColumnList.includes(column[0])) {
            validColumnList.push(column[0]);
          }
        }
      });
    });
    return validColumnList;
  }

  const validColumns = getValidColumns(
    columnDesignData,
    columnLoad,
    columnHeight
  );

  return validColumns;
}

export default SteelColumnDesign;
