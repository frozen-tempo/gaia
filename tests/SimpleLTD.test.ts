import simpleLTD from "../components/SimpleLTD";
import { Load } from "typings";

test("simpleLTD Test Case 1: ", () => {
  expect(simpleLTD(0, 0, [], [], 0)).toEqual({
    columnLoadULS: 0,
    columnLoadSLS: 0,
  });
});

const floorArea = 56.25;
const floorSW = 6.5;
const numFloors = 9;
const deadLoads: Load[] = [
  {
    loadNumber: "1",
    loadID: "ID1",
    loadType: "Other",
    loadDescr: "Dead Load",
    loadValue: 1.5,
    loadUnits: "kN/m2",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Permanent",
  },
];
const liveLoads: Load[] = [
  {
    loadNumber: "2",
    loadID: "ID2",
    loadType: "Other",
    loadDescr: "Live Load",
    loadValue: 5,
    loadUnits: "kN/m2",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Imposed",
  },
];

test("simpleLTD Test Case 2: ", () => {
  expect(
    simpleLTD(floorArea, floorSW, deadLoads, liveLoads, numFloors)
  ).toEqual({ columnLoadULS: 9757.96875, columnLoadSLS: 6946.875 });
});
