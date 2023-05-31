import React, { useState } from "react";
import { projectData } from "typings";

function ProjectSettings(props: any) {
  const [settings, setSettings] = useState(props.projectSettings);

  function handleChange(event: any) {
    const { name, value, type, checked } = event.target;
    const updatedProjectSettings = {
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    };
    setSettings(updatedProjectSettings);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    props.setProjectData((prevProjectData: projectData) => {
      return {
        ...prevProjectData,
        projectSettings: settings,
      };
    });
    handleClose();
  }

  function handleClose() {
    props.setIsOpen(false);
  }
  return (
    <div className="popup">
      <form className="box" onSubmit={handleSubmit}>
        <h2>Project Settings</h2>
        <label className="input-box-title">
          Rebar Rate
          <select
            name="rebarRate"
            className="input-box"
            value={settings.rebarRate}
            onChange={handleChange}
            style={{ width: "250px", marginBlock: "15px" }}
          >
            <option value="" disabled>
              Choose Rebar Rate
            </option>
            {props.rebarRates.map((rebarRate: any) => (
              <option key={rebarRate} value={rebarRate}>
                {rebarRate}
              </option>
            ))}
          </select>
        </label>
        <label className="input-box-title">
          Concrete Column Spec for Carbon Calculation
          <select
            name="concreteColumnCarbon"
            className="input-box"
            value={settings.concreteColumnCarbon}
            onChange={handleChange}
            style={{ width: "250px", marginBlock: "15px" }}
          >
            <option value="" disabled>
              Choose Concrete Spec.
            </option>
            {props.concreteCarbon.map((concreteCarbon: any) => (
              <option key={concreteCarbon} value={concreteCarbon}>
                {concreteCarbon}
              </option>
            ))}
          </select>
        </label>
        <label className="input-box-title">
          Concrete Beam Spec for Carbon Calculation
          <select
            name="concreteBeamCarbon"
            className="input-box"
            value={settings.concreteBeamCarbon}
            onChange={handleChange}
            style={{ width: "250px", marginBlock: "15px" }}
          >
            <option value="" disabled>
              Choose Concrete Spec.
            </option>
            {props.concreteCarbon.map((concreteCarbon: any) => (
              <option key={concreteCarbon} value={concreteCarbon}>
                {concreteCarbon}
              </option>
            ))}
          </select>
        </label>
        <label className="input-box-title">
          Concrete Slab Spec for Carbon Calculation
          <select
            name="concreteSlabCarbon"
            className="input-box"
            value={settings.concreteSlabCarbon}
            onChange={handleChange}
            style={{ width: "250px", marginBlock: "15px" }}
          >
            <option value="" disabled>
              Choose Concrete Spec.
            </option>
            {props.concreteCarbon.map((concreteCarbon: any) => (
              <option key={concreteCarbon} value={concreteCarbon}>
                {concreteCarbon}
              </option>
            ))}
          </select>
        </label>
        <label className="input-box-title">
          Rebar Spec for Carbon Calculation
          <select
            name="rebarCarbon"
            className="input-box"
            value={settings.rebarCarbon}
            onChange={handleChange}
            style={{ width: "250px", marginBlock: "15px" }}
          >
            <option value="" disabled>
              Choose Rebar Spec.
            </option>
            {props.rebarCarbon.map((rebarCarbon: any) => (
              <option key={rebarCarbon} value={rebarCarbon}>
                {rebarCarbon}
              </option>
            ))}
          </select>
        </label>
        <input className="popup-button" type="submit" value="Save Settings" />
        <button
          type="button"
          className="popup-button"
          onClick={() => handleClose()}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default ProjectSettings;
