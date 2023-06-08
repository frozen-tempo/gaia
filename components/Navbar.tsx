import Link from "next/link";
import React, { useState } from "react";
import { ITools } from "typings";
import internalToolsData from "../src/data/internal-tools-data.json";

const handleToggle = (title1: string, title2: string) => {
  if (document.getElementById(title1)?.classList.contains("rotate")) {
    document.getElementById(title1)?.classList.remove("rotate");
    (document.getElementById(title2) as HTMLInputElement).style.display =
      "none";
  } else {
    document.getElementById(title1)?.classList.add("rotate");
    (document.getElementById(title2) as HTMLInputElement).style.display =
      "block";
  }
};

const dropDown: ITools[] = internalToolsData.tools;
const dropDownElements = dropDown.map((item) => (
  <div key={item.toolName} className="dropdown-container">
    <button
      className="dropdown-button"
      onClick={() => handleToggle(item.toolName + "1", item.toolName + "2")}
    >
      {item.toolName}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="dropdown-icon"
        id={item.toolName + "1"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>
    <ul
      className="dropdown-options"
      id={item.toolName + "2"}
      onClick={() => handleToggle(item.toolName + "1", item.toolName + "2")}
    >
      {item.sections.map(
        (section: { sectionName: string; sectionLink: string }) => (
          <Link key={section.sectionName} href={section.sectionLink}>
            <li>{section.sectionName}</li>
          </Link>
        )
      )}
    </ul>
  </div>
));

function Navbar() {
  return (
    <nav className="main-nav">
      <ul className="nav-items">
        <li>
          <Link href="/">
            <img className="nav-image" src="/WRD-logo.png" alt="wrd-logo" />
          </Link>
        </li>
        {dropDownElements}
      </ul>
    </nav>
  );
}

export default Navbar;
