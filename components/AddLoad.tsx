import React, { useState } from "react";
import { Load, projectData } from "typings";
import uuid from "react-uuid";

function AddLoad(props: any) {
  const [loadData, setLoadData] = useState<Load>({
    loadNumber: "",
    loadID: uuid(),
    loadType: "",
    loadDescr: "",
    loadValue: 0,
    loadUnits: "kPa",
    loadGround: false,
    loadRoof: false,
    loadingNature: props.loadingNature,
  });

  function handleChange(event: any) {
    const { name, value, type, checked } = event.target;
    setLoadData((prevLoadData) => {
      return {
        ...prevLoadData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  function handleClose(loadingNature: string) {
    props.setIsOpen(false);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    if (props.loadingNature === "DL")
      props.setProjectData((prevProjectData: projectData) => {
        return {
          ...prevProjectData,
          deadLoads: [...prevProjectData.deadLoads, loadData],
        };
      });
    else if (props.loadingNature === "LL")
      props.setProjectData((prevProjectData: projectData) => {
        return {
          ...prevProjectData,
          liveLoads: [...prevProjectData.liveLoads, loadData],
        };
      });
    handleClose(props.loadingNature);
  }

  return (
    <div className="popup">
      <form className="box" onSubmit={handleSubmit}>
        <label className="input-box-title">
          Load Type
          <select
            name="loadType"
            className="input-box"
            value={loadData.loadType}
            onChange={handleChange}
          >
            <option value="" disabled>
              Choose Load Type
            </option>
            {props.loadSubTypes.map((loadType: any) => (
              <option key={loadType.Type} value={loadType.Type}>
                {loadType.Type}
              </option>
            ))}
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
            onChange={handleChange}
            step="0.01"
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
            onChange={handleChange}
            disabled={
              (document.querySelector("#loadRoof") as HTMLInputElement)?.checked
                ? true
                : false
            }
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
            onChange={handleChange}
            disabled={
              (document.querySelector("#loadGround") as HTMLInputElement)
                ?.checked
                ? true
                : false
            }
          />
        </label>
        <input className="popup-button" type="submit" value="Add Load" />
        <button
          type="button"
          className="popup-button"
          onClick={() => handleClose(props.loadingNature)}
        >
          Close
        </button>
      </form>
    </div>
  );
}
export default AddLoad;
