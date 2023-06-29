import React from "react";

function SteelBeamDesign(
  deadLoad: number,
  liveLoad: number,
  length: number,
  lateralRestraints: number
) {
  const ULSLineLoad = 1.35 * deadLoad + 1.5 * liveLoad;
  const SLSLineLoad = deadLoad + liveLoad;

  return {
    ZRequired: ZRequired,
    IRequired: IRequired,
    ShearAreaRequired: ShearAreaRequired,
  };
}

export default SteelBeamDesign;
