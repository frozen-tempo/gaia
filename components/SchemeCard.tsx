import React, { useState } from "react";
import { projectData } from "typings";
import FlatSlabDesign from "./FlatSlabDesign";
import * as d3 from "d3";
import SteelHCUDesign from "./SteelHCUDesign";
import getTotalLoads from "./getLoadingTotals";

function SchemeCard(designData: projectData) {
  let designs = [];
  const flatSlab = FlatSlabDesign(designData);
<<<<<<< HEAD
  const HCUSteel = SteelHCUDesign(
    designData,
    getTotalLoads(designData.deadLoads).loadTotal,
    getTotalLoads(designData.deadLoads).groundTotal,
    getTotalLoads(designData.deadLoads).roofTotal,
    getTotalLoads(designData.liveLoads).loadTotal,
    getTotalLoads(designData.liveLoads).groundTotal,
    getTotalLoads(designData.liveLoads).roofTotal
  );
=======
  const HCUSteel = SteelHCUDesign(designData);
>>>>>>> ca90a46ccb676b93fc8fe58d38f283558a4a8dc7

  designs.push(flatSlab);
  designs.push(HCUSteel);

  const schemeCardElements = designs.map((scheme) => (
    <div key={scheme?.schemeType} className={"scheme-card"}>
      <h2>{scheme?.schemeType}</h2>
      <img
        className="scheme-image"
        src="/Flat-Slab-Icon.svg"
        alt="flat-slab-icon"
      />
      <p>{`Structural Depth: ${scheme?.structuralDepth}`}</p>
      {scheme?.schemeType != "RC Flat Slab" ? (
<<<<<<< HEAD
        <p>{scheme?.validSteelBeams[0]}</p>
=======
        <p>{`Steel Beam: ${scheme?.validSteelBeams}`}</p>
>>>>>>> ca90a46ccb676b93fc8fe58d38f283558a4a8dc7
      ) : (
        ""
      )}
      <p>{`Internal Column: ${scheme?.internalColumn}`}</p>
      <p>{`Edge Column: ${scheme?.edgeColumn}`}</p>
      <p>{`Corner Column: ${scheme?.cornerColumn}`}</p>
      <p>{`Internal Column Load (ULS): ${scheme?.internalULSLoad} kN`}</p>
      <p>{`Edge Column Load (ULS): ${scheme?.edgeULSLoad} kN`}</p>
      <p>{`Corner Column Load (ULS): ${scheme?.cornerULSLoad} kN`}</p>
      <p>{`Gross Internal Floor Area: ${scheme?.grossInternalFloorArea} m2`}</p>
      <p>{`Embodied Carbon (A1-A5): ${scheme?.A1_A5} kgCo2/m2`}</p>
    </div>
  ));

  return <div className="scheme-card-container">{schemeCardElements}</div>;
}

export default SchemeCard;
