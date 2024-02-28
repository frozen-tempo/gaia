import getTotalLoads from "../components/getLoadingTotals";
import { Load } from "typings";

test("getTotalLoads Test Case 1: ", () => {
  expect(getTotalLoads([])).toEqual({
    loadTotal: 0,
    groundTotal: 0,
    roofTotal: 0,
    facadeTotal: 0,
  });
});

const loadCase1: Load[] = [
  {
    loadNumber: "1",
    loadID: "ID1",
    loadType: "Other",
    loadDescr: "Test Load",
    loadValue: 1.5,
    loadUnits: "kN",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Permanent",
  },
];

test("getTotalLoads Test Case 2: ", () => {
  expect(getTotalLoads(loadCase1)).toEqual({
    loadTotal: 1.5,
    groundTotal: 0,
    roofTotal: 0,
    facadeTotal: 0,
  });
});

const loadCase2: Load[] = [
  {
    loadNumber: "1",
    loadID: "ID1",
    loadType: "Other",
    loadDescr: "Test Load",
    loadValue: 150,
    loadUnits: "kN",
    loadGround: true,
    loadRoof: false,
    loadingNature: "Permanent",
  },
];

test("getTotalLoads Test Case 3: ", () => {
  expect(getTotalLoads(loadCase2)).toEqual({
    loadTotal: 0,
    groundTotal: 150,
    roofTotal: 0,
    facadeTotal: 0,
  });
});

const loadCase3: Load[] = [
  {
    loadNumber: "1",
    loadID: "ID1",
    loadType: "Other",
    loadDescr: "Load 1",
    loadValue: 100,
    loadUnits: "kN",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Permanent",
  },
  {
    loadNumber: "2",
    loadID: "ID2",
    loadType: "Ground",
    loadDescr: "Load 2",
    loadValue: 150,
    loadUnits: "kN",
    loadGround: true,
    loadRoof: false,
    loadingNature: "Permanent",
  },
  {
    loadNumber: "3",
    loadID: "ID3",
    loadType: "Roof",
    loadDescr: "Load 3",
    loadValue: 200,
    loadUnits: "kN",
    loadGround: false,
    loadRoof: true,
    loadingNature: "Permanent",
  },
  {
    loadNumber: "4",
    loadID: "ID4",
    loadType: "Facade",
    loadDescr: "Load 4",
    loadValue: 250,
    loadUnits: "kN",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Permanent",
  },
];

test("getTotalLoads Test Case 4: ", () => {
  expect(getTotalLoads(loadCase3)).toEqual({
    loadTotal: 100,
    groundTotal: 150,
    roofTotal: 200,
    facadeTotal: 250,
  });
});

const loadCase4: Load[] = [
  {
    loadNumber: "1",
    loadID: "ID1",
    loadType: "Other",
    loadDescr: "Load 1",
    loadValue: 100,
    loadUnits: "kN",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Permanent",
  },
  {
    loadNumber: "2",
    loadID: "ID2",
    loadType: "Ground",
    loadDescr: "Load 2",
    loadValue: 100,
    loadUnits: "kN",
    loadGround: false,
    loadRoof: false,
    loadingNature: "Permanent",
  },
];

test("getTotalLoads Test Case 5: ", () => {
  expect(getTotalLoads(loadCase4)).toEqual({
    loadTotal: 200,
    groundTotal: 0,
    roofTotal: 0,
    facadeTotal: 0,
  });
});
