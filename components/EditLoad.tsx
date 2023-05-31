import React, { use } from "react";
import { useState } from "react";
import { Load, projectData } from "typings";

function EditLoad(props: any) {
  const [newLoad, setNewLoad] = useState<Load>(props.load);

  function handleChange(event: any) {
    const { name, value, type, checked } = event.target;
    setNewLoad((prevNewLoad) => {
      return {
        ...prevNewLoad,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function deleteLoad(loadID: string) {
    event?.preventDefault();
    if (newLoad.loadingNature === "DL") {
      props.setProjectData((prevProjectData: projectData) => {
        return {
          ...prevProjectData,
          deadLoads: prevProjectData.deadLoads.filter(
            (load) => load.loadID !== newLoad.loadID
          ),
        };
      });
    } else {
      props.setProjectData((prevProjectData: projectData) => {
        return {
          ...prevProjectData,
          liveLoads: prevProjectData.liveLoads.filter(
            (load) => load.loadID !== newLoad.loadID
          ),
        };
      });
    }
    props.setLoadEditOpen(false);
  }

  function handleEdit(loadID: string) {
    event?.preventDefault();
    if (newLoad.loadingNature === "DL") {
      props.setProjectData((prevProjectData: projectData) => {
        return {
          ...prevProjectData,
          deadLoads: prevProjectData.deadLoads.map((load) =>
            load.loadID === newLoad.loadID ? (load = newLoad) : load
          ),
        };
      });
    } else {
      props.setProjectData((prevProjectData: projectData) => {
        return {
          ...prevProjectData,
          liveLoads: prevProjectData.liveLoads.map((load) =>
            load.loadID === newLoad.loadID ? (load = newLoad) : load
          ),
        };
      });
    }
    props.setLoadEditOpen(false);
  }

  const loadSubTypes =
    newLoad.loadingNature === "DL" ? props.DLSubTypes : props.LLSubTypes;

  return (
    <div className="popup">
      <form className="box" onSubmit={() => handleEdit(newLoad.loadID)}>
        <label className="input-box-title">
          Load Type
          <select name="loadType" className="input-box" onChange={handleChange}>
            {loadSubTypes?.map((loadType: any) => {
              if (loadType.Type === newLoad.loadType) {
                return (
                  <option key={loadType.Type} value={loadType.Type}>
                    {loadType.Type}
                  </option>
                );
              } else {
                return (
                  <option key={loadType.Type} value={loadType.Type}>
                    {loadType.Type}
                  </option>
                );
              }
            })}
          </select>
        </label>
        <label
          className="input-box-title"
          style={{ width: "250px", marginBlock: "15px" }}
        >
          Load Description
          <input
            type=""
            name="loadDescr"
            className="input-box"
            onChange={handleChange}
            value={newLoad.loadDescr}
          />
        </label>
        <label
          className="input-box-title"
          style={{ width: "250px", marginBlock: "15px" }}
        >
          Load Value
          <input
            type="number"
            name="loadValue"
            className="input-box"
            step="0.01"
            onChange={handleChange}
            value={newLoad.loadValue}
          />
        </label>
        <label
          className="input-box-title"
          style={{ width: "250px", marginBlock: "15px" }}
        >
          Load Units
          <input
            type="text"
            name="loadUnits"
            className="input-box"
            value="kPa"
            disabled
          />
        </label>
        <label
          className="input-box-title"
          style={{
            width: "250px",
            marginBlock: "15px",
            textAlign: "center",
          }}
        >
          Ground Floor Load?
          <input
            id="loadGround"
            type="checkbox"
            name="loadGround"
            className="input-box"
            disabled={
              (document.querySelector("#loadRoof") as HTMLInputElement)?.checked
                ? true
                : false
            }
            onChange={handleChange}
            checked={newLoad.loadGround ? true : false}
          />
        </label>
        <label
          className="input-box-title"
          style={{
            width: "250px",
            marginBlock: "15px",
            textAlign: "center",
          }}
        >
          Roof Load?
          <input
            id="loadRoof"
            type="checkbox"
            name="loadRoof"
            className="input-box"
            disabled={
              (document.querySelector("#loadGround") as HTMLInputElement)
                ?.checked
                ? true
                : false
            }
            onChange={handleChange}
            checked={newLoad.loadRoof ? true : false}
          />
        </label>
        <input className="scheme-button" type="submit" value="Save Edit" />
        <button
          type="button"
          className="popup-button"
          onClick={() => deleteLoad(newLoad.loadID)}
        >
          Delete Load
        </button>
      </form>
    </div>
  );
}

export default EditLoad;
