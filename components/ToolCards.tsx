import React, { useState } from "react";
import internalToolsData from "../src/data/internal-tools-data.json";
import { ITools } from "typings";
import Link from "next/link";

function ToolCards() {
  const internalTools: ITools[] = internalToolsData.tools;

  const toolElements = internalTools.map((tool) => (
    <Link key={tool.toolName} href={tool.toolExtension}>
      <div className="tool-card" key={tool.toolName}>
        <h2 className="tool-name">{tool.toolName}</h2>
        <h3 className="tool-author">Developed by: {tool.toolAuthor}</h3>
        <p className="tool-description">{tool.toolDescription}</p>
      </div>
    </Link>
  ));

  return <>{toolElements}</>;
}

export default ToolCards;
