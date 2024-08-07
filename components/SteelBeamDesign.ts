import * as SteelBeamProps from "../src/data/steel-beam-properties.json";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import { projectData } from "typings";

function SteelBeamDesign(
  designData: projectData,
  deadLoad: number,
  liveLoad: number
) {
  const UBDesignData = schemeDesignData.steelUBBeamDesign;
  const ULSLineLoad = 1.35 * deadLoad + 1.5 * liveLoad; //kN/m
  const ULSMoment = (ULSLineLoad * designData.yGrid ** 2) / 8; //kNm
  const beamDesignData = Object.entries(UBDesignData);

  var validBeamList: string[] = [];
  beamDesignData.forEach((beam: any) => {
    const beamLengths = Object.keys(beam[1]);
    beamLengths.forEach((length) => {
      const momentCapacity = beam[1][length as keyof (typeof beam)[1]];
      if (
        momentCapacity >= ULSMoment &&
        parseFloat(length) >= designData.yGrid
      ) {
        if (!validBeamList.includes(beam[0])) {
          validBeamList.push(beam[0]);
        }
      }
    });
  });
  return validBeamList.reverse();
}
export default SteelBeamDesign;
