import FlatSlabDesign from "../components/FlatSlabDesign";
import { Load } from "typings";

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

test("Test Case 1: ", () => {
  expect(
    FlatSlabDesign({
      projectTitle: "",
      projectNumber: "",
      author: "",
      checker: "",
      dateCreated: "",
      dateChecked: "",
      buildingHeight: 10,
      floorHeight: 2.5,
      buildingType: "",
      xGrid: 5,
      yGrid: 5,
      fireRating: 0,
      natFreq: 0,
      deadLoads: deadLoads,
      liveLoads: liveLoads,
      projectSettings: {
        rebarRate: "1%",
        concreteColumnCarbon: "Insitu - C30/37 - 35% GGBS",
        concreteBeamCarbon: "Insitu - C30/37 - 35% GGBS",
        concreteSlabCarbon: "Insitu - C30/37 - 35% GGBS",
        rebarCarbon: "Steel - Rebar (UK CARES)",
        steelCarbon: "Steel - Europe Sections",
      },
      entryFieldsFilled: false,
    })
  ).toEqual({
    schemeType: "RC Flat Slab",
    structuralDepth: "200mm",
    internalColumn: "300mm Square",
    edgeColumn: "300mm Square",
    cornerColumn: "225mm Square",
    internalULSLoad: 1419.75,
    edgeULSLoad: 725.06,
    cornerULSLoad: 364.43,
    grossInternalFloorArea: 400,
    A1_A5: 73,
    validSteelBeams: null,
  });
});

test("Test Case 2: ", () => {
  expect(
    FlatSlabDesign({
      projectTitle: "",
      projectNumber: "",
      author: "",
      checker: "",
      dateCreated: "",
      dateChecked: "",
      buildingHeight: 25,
      floorHeight: 2.5,
      buildingType: "",
      xGrid: 7.5,
      yGrid: 7.5,
      fireRating: 0,
      natFreq: 0,
      deadLoads: deadLoads,
      liveLoads: liveLoads,
      projectSettings: {
        rebarRate: "1%",
        concreteColumnCarbon: "Insitu - C30/37 - 35% GGBS",
        concreteBeamCarbon: "Insitu - C30/37 - 35% GGBS",
        concreteSlabCarbon: "Insitu - C30/37 - 35% GGBS",
        rebarCarbon: "Steel - Rebar (UK CARES)",
        steelCarbon: "Steel - Europe Sections",
      },
      entryFieldsFilled: false,
    })
  ).toEqual({
    schemeType: "RC Flat Slab",
    structuralDepth: "260mm",
    internalColumn: "725mm Square",
    edgeColumn: "600mm Square",
    cornerColumn: "600mm Square",
    internalULSLoad: 10201.46,
    edgeULSLoad: 5182.73,
    cornerULSLoad: 2743.24,
    grossInternalFloorArea: 2250,
    A1_A5: 101,
    validSteelBeams: null,
  });
});
