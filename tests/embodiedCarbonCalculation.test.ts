import { projectData, Load } from "typings";
import embodiedCarbonCalculation from "../components/embodiedCarbonCalculation";
import carbonData from "../src/data/carbon-data.json";

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

const projectData1 = {
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
};

const columnCarbon = carbonData.Concrete.filter(
  (a) => a.name == projectData1.projectSettings.concreteColumnCarbon
);

const carbonData1 = JSON.parse(JSON.stringify(columnCarbon[0]));
console.log(carbonData1);

const structureData1 = [
  {
    elementType: "internalColumn",
    material: "RC",
    materialSpec: projectData1.projectSettings.concreteColumnCarbon,
    volume: 0.9,
    rebarRate: "1%",
    carbonData: carbonData1,
  },
  {
    elementType: "edgeColumn",
    material: "RC",
    materialSpec: projectData1.projectSettings.concreteColumnCarbon,
    volume: 3.6,
    rebarRate: "1%",
    carbonData: carbonData1,
  },
  {
    elementType: "cornerColumn",
    material: "RC",
    materialSpec: projectData1.projectSettings.concreteColumnCarbon,
    volume: 2.025,
    rebarRate: "1%",
    carbonData: carbonData1,
  },
  {
    elementType: "cornerColumn",
    material: "RC",
    materialSpec: projectData1.projectSettings.concreteColumnCarbon,
    volume: 2.025,
    rebarRate: "1%",
    carbonData: carbonData1,
  },
];

test("Embodied Carbon Test Case 1: ", () => {
  expect(embodiedCarbonCalculation(projectData1, structureData1)).toEqual([
    {
      elementType: "internalColumn",
      A1_A3: 0,
      A4: 0,
      WF: 0,
      C2: 0,
      C3_C4: 0,
      D: 0,
      sequestration: 0,
    },
    {
      elementType: "internalColumn",
      A1_A3: 0,
      A4: 0,
      WF: 0,
      C2: 0,
      C3_C4: 0,
      D: 0,
      sequestration: 0,
    },
  ]);
});
