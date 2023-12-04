import FlatSlabDesign from "../components/FlatSlabDesign";

test("Test Case 1: ", () => {
  expect(
    FlatSlabDesign(
      {
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
        deadLoads: [],
        liveLoads: [],
        projectSettings: {
          rebarRate: "1%",
          concreteColumnCarbon: "Insitu - C30/37 - 35% GGBS",
          concreteBeamCarbon: "Insitu - C30/37 - 35% GGBS",
          concreteSlabCarbon: "Insitu - C30/37 - 35% GGBS",
          rebarCarbon: "Steel - Rebar (UK CARES)",
          steelCarbon: "Steel - Europe Sections",
        },
        entryFieldsFilled: false,
      },
      1.5,
      0,
      0,
      5,
      0,
      0
    )
  ).toEqual({
    schemeType: "RC Flat Slab",
    structuralDepth: 200,
    internalColumnSquare: 300,
    edgeColumnSquare: 300,
    cornerColumnSquare: 225,
    internalULSLoad: "1419.75",
    edgeULSLoad: "816.19",
    cornerULSLoad: "415.69",
    grossInternalFloorArea: "400.00",
    A1_A5: "73.20",
  });
});

test("Test Case 2: ", () => {
  expect(
    FlatSlabDesign(
      {
        projectTitle: "",
        projectNumber: "",
        author: "",
        checker: "",
        dateCreated: "",
        dateChecked: "",
        buildingHeight: 15,
        floorHeight: 2.5,
        buildingType: "",
        xGrid: 6,
        yGrid: 6,
        fireRating: 0,
        natFreq: 0,
        deadLoads: [],
        liveLoads: [],
        projectSettings: {
          rebarRate: "3%",
          concreteColumnCarbon: "Insitu - C40/50 - 25% GGBS",
          concreteBeamCarbon: "Insitu - C40/50 - 25% GGBS",
          concreteSlabCarbon: "Insitu - C40/50 - 25% GGBS",
          rebarCarbon: "Steel - Rebar (UK CARES)",
          steelCarbon: "Steel - Europe Sections",
        },
        entryFieldsFilled: false,
      },
      1.5,
      0,
      0,
      6,
      0,
      0
    )
  ).toEqual({
    schemeType: "RC Flat Slab",
    structuralDepth: 230,
    internalColumnSquare: 400,
    edgeColumnSquare: 400,
    cornerColumnSquare: 300,
    internalULSLoad: "3742.20",
    edgeULSLoad: "2154.60",
    cornerULSLoad: "1097.55",
    grossInternalFloorArea: "864.00",
    A1_A5: "84.65",
  });
});
