import { Load } from "typings";
import getTotalLoads from "./getLoadingTotals";

function simpleLTD(
  floorArea: number,
  floorSW: number,
  deadLoads: Load[],
  liveLoads: Load[],
  numFloors: number
) {
  const totalDeadLoads = getTotalLoads(deadLoads);
  const totalLiveLoads = getTotalLoads(liveLoads);

  const intermediateColumnArea = floorArea * numFloors;

  const totalFloorSW = floorSW * (intermediateColumnArea + floorArea);
  const totalSDL =
    intermediateColumnArea * totalDeadLoads.loadTotal +
    intermediateColumnArea * totalDeadLoads.roofTotal;
  const totalLL =
    intermediateColumnArea * totalLiveLoads.loadTotal +
    intermediateColumnArea * totalLiveLoads.roofTotal;

  const columnLoadULS = 1.35 * (totalFloorSW + totalSDL) + 1.5 * totalLL;
  const columnLoadSLS = totalFloorSW + totalSDL + totalLL;

  return {
    columnLoadULS: columnLoadULS,
    columnLoadSLS: columnLoadSLS,
  };
}
export default simpleLTD;
