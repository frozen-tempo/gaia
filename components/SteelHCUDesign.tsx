import React from "react";
import { InternalSymbolName } from "typescript";
import { projectData, schemeDesign } from "typings";
import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";
import carbonData from "../src/data/carbon-data.json";
import ProjectSettings from "./ProjectSettings";

function SteelHCUDesign(
  designData: projectData,
  deadLoadTotal: number,
  groundDeadTotal: number,
  roofDeadTotal: number,
  liveLoadTotal: number,
  groundLiveTotal: number,
  roofLiveTotal: number
) {
  // Hollowcore Design from Bison / Forterra Precast HCU Load Tables
  return {
    schemeType: "Steel Beam & HCU Slab",
  };
}

export default SteelHCUDesign;
