import { Load } from "typings";

function getTotalLoads(loads: Load[]) {
  let loadTotal = 0;
  let groundTotal = 0;
  let roofTotal = 0;
  let facadeTotal = 0;
  loads.map((load) => {
    if (
      load.loadGround === false &&
      load.loadRoof === false &&
      load.loadType !== "Facade"
    ) {
      loadTotal = loadTotal + +load.loadValue;
    } else if (load.loadGround && load.loadRoof === false) {
      groundTotal = groundTotal + +load.loadValue;
    } else if (load.loadRoof && load.loadGround === false) {
      roofTotal = roofTotal + +load.loadValue;
    } else if (load.loadType === "Facade") {
      facadeTotal = facadeTotal + +load.loadValue;
    }
  });
  return { loadTotal, groundTotal, roofTotal, facadeTotal };
}

export default getTotalLoads;
