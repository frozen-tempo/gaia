import * as SteelBeamProps from "../src/data/steel-beam-properties.json";
import { ubBeam } from "../typings";

function SteelBeamDesign(
  deadLoad: number,
  liveLoad: number,
  length: number,
  lengthRestrained: string,
  beamType: string,
  deflectionLimit: number
) {
  var beamList: string[] = [];
  const ULSLineLoad = 1.35 * deadLoad + 1.5 * liveLoad; //kN/m
  const SLSLineLoad = deadLoad + liveLoad; //kN/m
  const deflectionAllowed = length / deflectionLimit; //m

  const ULSMoment = (ULSLineLoad * length ** 2) / 8; //kNm
  const ULSShear = (ULSLineLoad * length) / 2; //kN

  const ZRequired = (ULSMoment * 1000000) / 355 / 1000; //cm3
  const IRequired =
    ((5 * SLSLineLoad * length ** 4) / (384 * 200000000 * deflectionAllowed)) *
    100000000; //cm4
  const ShearAreaRequired = (ULSShear * 1000) / (355 / Math.sqrt(3)); //mm2

  function basicDesignCheck(beamID: string, beamData: any) {
    // Have included a 20% allowance for utilisation of the beam at the concept design stage to be slightly conservative
    if (
      beamData.Zmajor * 0.8 > ZRequired &&
      beamData.Imajor * 0.8 > IRequired
    ) {
      beamList.push(beamID);
    }
  }

  Object.keys(SteelBeamProps.UBs).forEach((beam) => {
    basicDesignCheck(
      beam,
      SteelBeamProps.UBs[beam as keyof typeof SteelBeamProps.UBs]
    );
  });

  return {
    //     validBeams: beamList.reverse(),
    //   };
  };
}

export default SteelBeamDesign;
