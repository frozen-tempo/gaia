import React, { useState } from "react";
import { projectData, Load } from "typings";
import { useMemo } from "react";

function LoadTable(props: {
  loads: Load[];
  setEditedLoad: Function;
  setLoadEditOpen: Function;
}) {
  const loadData = useMemo(() => props.loads, [props.loads]);

  function handleEdit(event: any, load: Load) {
    switch (event.detail) {
      case 2:
        props.setLoadEditOpen(true);
        props.setEditedLoad(load);
    }
  }

  const loadItems = loadData?.map((load, index) => (
    <tr key={load.loadID} onClick={() => handleEdit(event, load)}>
      <td>{"00" + (index + 1)}</td>
      <td>{load.loadType}</td>
      <td>{load.loadDescr}</td>
      <td>{load.loadValue}</td>
      <td>{load.loadUnits}</td>
    </tr>
  ));

  return (
    <div className="table-container">
      <table>
        <tbody>
          <tr className="table-headers">
            <th>LOAD NO.</th>
            <th>LOAD TYPE</th>
            <th>LOAD DESCRIPT.</th>
            <th>LOAD VALUE</th>
            <th>UNITS</th>
          </tr>
          {loadItems}
        </tbody>
      </table>
    </div>
  );
}

export default LoadTable;
