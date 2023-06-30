import React from "react";

function SteelBeamDesign(
  deadLoad: number,
  liveLoad: number,
  length: number,
  lengthRestrained: string,
  beamType: string,
  deflectionLimit: number
) {
  const ULSLineLoad = (1.35 * deadLoad) + (1.5 * liveLoad); //kN/m
  const SLSLineLoad = deadLoad + liveLoad; //kN/m
  const deflectionAllowed = length / deflectionLimit; //m

  const ULSMoment = (ULSLineLoad * length ** 2) / 8; //kNm
  const ULSShear = (ULSLineLoad * length) / 2; //kN

  const ZRequired = (ULSMoment * 1000000 / 355 ) / 1000; //cm3
  const IRequired =
    ((5 * SLSLineLoad * length ** 4) / (384 * 200000000 * deflectionAllowed)) *
    100000000; //cm4
  const ShearAreaRequired = (ULSShear * 1000) / (355 / Math.sqrt(3)); //mm2

  return {
    ZRequired: Number(ZRequired.toFixed(2)),
    IRequired: Number(IRequired.toFixed(2)),
    ShearAreaRequired: Number(ShearAreaRequired.toFixed(2)),
  };
}

export default SteelBeamDesign;
