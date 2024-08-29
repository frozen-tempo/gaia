import React, { useState } from "react";
import { projectData } from "typings";
import FlatSlabDesign from "./FlatSlabDesign";
import SteelHCUDesign from "./SteelHCUDesign";
import Image from "next/image";

function SchemeCard(designData: projectData) {
  let designs = [];
  const flatSlab = FlatSlabDesign(designData);
  const HCUSteel = SteelHCUDesign(designData);

  designs.push(flatSlab);
  designs.push(HCUSteel);

  const schemeCardElements = designs.map((scheme) => (
    <div key={scheme?.schemeType} className="scheme-card">
      <h2>{scheme?.schemeType}</h2>
      <Image
        className="scheme-image"
        src="/Flat-Slab-Icon.svg"
        alt="flat-slab-icon"
        width={500}
        height={300}
      />
      <p>{`Structural Depth: ${scheme?.structuralDepth}`}</p>
      {scheme?.schemeType != "RC Flat Slab" ? (
        <p>{`Primary Beam: ${scheme?.validSteelBeams}`}</p>
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
