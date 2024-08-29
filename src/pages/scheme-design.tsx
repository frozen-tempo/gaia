import AddLoad from "components/AddLoad";
import LoadTable from "components/LoadTable";
import SchemeCard from "components/SchemeCard";
import React, { useEffect, useState } from "react";
import { projectData } from "typings";
import internalToolsData from "src/data/internal-tools-data.json";
import EditLoad from "components/EditLoad";
import ProjectSettings from "components/ProjectSettings";

function SchemeMain() {
  const [projectData, setProjectData] = useState<projectData>({
    projectTitle: "",
    projectNumber: "",
    author: "",
    checker: "",
    dateCreated: "",
    dateChecked: "",
    buildingHeight: 0,
    floorHeight: 0,
    buildingType: "",
    xGrid: 0,
    yGrid: 0,
    fireRating: 0,
    natFreq: 0,
    deadLoads: [],
    liveLoads: [],
    projectSettings: {
      rebarRate: "0.8%",
      concreteColumnCarbon: "Insitu - C16/20 - CEM1 (OPC)",
      concreteBeamCarbon: "Insitu - C16/20 - CEM1 (OPC)",
      concreteSlabCarbon: "Insitu - C16/20 - CEM1 (OPC)",
      rebarCarbon: "Steel - Rebar (UK CARES)",
      steelCarbon: "Steel - Europe Sections",
    },
    entryFieldsFilled: false,
  });

  const DLSubTypes = internalToolsData.DLSubTypes;
  const LLSubTypes = internalToolsData.LLSubTypes;
  const RebarRates = internalToolsData.RebarRates;
  const ConcreteCarbon = internalToolsData.ConcreteCarbon;
  const RebarCarbon = internalToolsData.RebarCarbon;
  const SteelCarbon = internalToolsData.SteelCarbon;
  const TimberCarbon = internalToolsData.TimberCarbon;

  const [isDLOpen, setIsDLOpen] = useState(false);
  const [isLLOpen, setIsLLOpen] = useState(false);
  const [loadEditOpen, setLoadEditOpen] = useState(false);
  const [editedLoad, setEditedLoad] = useState();
  const [projectSettingOpen, setProjectSettingOpen] = useState(true);

  function viewReport() {
    alert("View Report");
  }

  function exportReport() {
    alert("Export Report");
  }

  function viewDetailedCalcs() {
    alert("View Detailed Calculations");
  }

  function handleChange(event: any) {
    const re = /^[0-9\b]+$/;
    if (re.test(event.target.value)) {
      setProjectData({
        ...projectData,
        [event.target.name]: +event.target.value,
      });
    } else {
      setProjectData({
        ...projectData,
        [event.target.name]: event.target.value,
      });
    }
  }

  function addDeadLoad() {
    setIsDLOpen(!isDLOpen);
  }

  function addLiveLoad() {
    setIsLLOpen(!isLLOpen);
  }

  function editProjectSettings() {
    setProjectSettingOpen(!projectSettingOpen);
  }

  function checkEntryForms(
    buildingHeight: number,
    floorHeight: number,
    xGrid: number,
    yGrid: number
  ) {
    if (buildingHeight > 0 && floorHeight > 0 && xGrid > 0 && yGrid > 0) {
      return true;
    } else {
      return false;
    }
  }

  projectData.entryFieldsFilled = checkEntryForms(
    projectData.buildingHeight,
    projectData.floorHeight,
    projectData.xGrid,
    projectData.yGrid
  );

  return (
    <main className="scheme-page">
      <div className="scheme-input-section">
        <section className="project-info">
          <h2 className="scheme-input-header">PROJECT INFORMATION</h2>
          <div className="input1">
            <label htmlFor="projectTitle" className="input-box-title">
              PROJECT TITLE
              <input
                type="text"
                name="projectTitle"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input2">
            <label htmlFor="projectNumber" className="input-box-title">
              PROJECT NO.
              <input
                type="text"
                name="projectNumber"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input3">
            <label htmlFor="author" className="input-box-title">
              AUTHOR
              <input
                type="text"
                name="author"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input4">
            <label htmlFor="checker" className="input-box-title">
              CHECKER
              <input
                type="text"
                name="checker"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input5">
            <label htmlFor="dateCreated" className="input-box-title">
              CREATED
              <input
                type="text"
                name="dateCreated"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input6">
            <label htmlFor="dateChecked" className="input-box-title">
              CHECKED
              <input
                type="text"
                name="dateChecked"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
        </section>
        <section className="building-info">
          <h2 className="scheme-input-header">BUILDING INFORMATION</h2>
          <div className="input1">
            <label htmlFor="buildingHeight" className="input-box-title">
              BUILDING HEIGHT (m)
              <input
                type="number"
                name="buildingHeight"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input2">
            <label htmlFor="floorHeight" className="input-box-title">
              FLOOR TO FLOOR (m)
              <input
                type="number"
                name="floorHeight"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input3">
            <label htmlFor="buildingType" className="input-box-title">
              BUILDING TYPE
              <input
                type="text"
                name="buildingType"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input4">
            <label htmlFor="xGrid" className="input-box-title">
              X GRID (m)
              <input
                type="number"
                name="xGrid"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input5">
            <label htmlFor="yGrid" className="input-box-title">
              Y GRID (m)
              <input
                type="number"
                name="yGrid"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input6">
            <label htmlFor="fireRating" className="input-box-title">
              FIRE RATING (mins)
              <input
                type="number"
                name="fireRating"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input7">
            <label htmlFor="natFreq" className="input-box-title">
              MIN. NATURAL FREQ. (Hz)
              <input
                type="number"
                name="natFreq"
                className="input-box"
                onChange={handleChange}
              />
            </label>
          </div>
        </section>
        <section className="loading-info">
          <h2 className="scheme-input-header">LOAD INFORMATION</h2>
          <div className="input1">
            <label htmlFor="deadLoads" className="input-box-title">
              PERMANENT LOADINGS (Gk)
            </label>
            <div className="add-load-button" onClick={addDeadLoad}>
              +
            </div>
            <LoadTable
              loads={projectData.deadLoads}
              setEditedLoad={setEditedLoad}
              setLoadEditOpen={setLoadEditOpen}
            />
          </div>
          <div className="input2">
            <label htmlFor="liveLoads" className="input-box-title">
              IMPOSED LOADINGS (Gk)
            </label>
            <div className="add-load-button" onClick={addLiveLoad}>
              +
            </div>
            <LoadTable
              loads={projectData.liveLoads}
              setEditedLoad={setEditedLoad}
              setLoadEditOpen={setLoadEditOpen}
            />
          </div>
        </section>
        <section className="scheme-button-container">
          <button
            className="scheme-button"
            onClick={() => editProjectSettings()}
          >
            PROJECT SETTINGS
          </button>
        </section>
      </div>

      {projectData.entryFieldsFilled && <SchemeCard {...projectData} />}

      {projectSettingOpen && (
        <ProjectSettings
          setIsOpen={setProjectSettingOpen}
          projectData={projectData}
          setProjectData={setProjectData}
          projectSettings={projectData.projectSettings}
          rebarRates={RebarRates}
          concreteCarbon={ConcreteCarbon}
          rebarCarbon={RebarCarbon}
          steelCarbon={SteelCarbon}
          timberCarbon={TimberCarbon}
        />
      )}
      {isDLOpen && (
        <AddLoad
          projectData={projectData}
          setProjectData={setProjectData}
          loadingNature="DL"
          setIsOpen={setIsDLOpen}
          loadSubTypes={DLSubTypes}
        />
      )}
      {isLLOpen && (
        <AddLoad
          projectData={projectData}
          setProjectData={setProjectData}
          loadingNature="LL"
          setIsOpen={setIsLLOpen}
          loadSubTypes={LLSubTypes}
        />
      )}
      {loadEditOpen && (
        <EditLoad
          load={editedLoad}
          DLSubTypes={DLSubTypes}
          LLSubTypes={LLSubTypes}
          setProjectData={setProjectData}
          setLoadEditOpen={setLoadEditOpen}
        />
      )}
    </main>
  );
}

export default SchemeMain;
