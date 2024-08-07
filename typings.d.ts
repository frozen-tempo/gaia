export interface ITools {
  toolName: string;
  toolAuthor: string;
  toolDescription: string;
  toolImage: string;
  toolExtension: string;
  sections: any;
}

export interface Load {
  loadNumber: string;
  loadID: string;
  loadType: string;
  loadDescr: string;
  loadValue: number;
  loadUnits: string;
  loadGround: boolean;
  loadRoof: boolean;
  loadingNature: string;
}

export interface elementData {
  elementType: string;
  material: string;
  materialSpec: string;
  volume: number;
  rebarRate: string;
  carbonData: {
    name: string;
    A1_A3: number;
    A4: number;
    WF: number;
    C2: number;
    C3_C4: number;
    D: number;
    sequestration: number;
    density: number;
  };
}

export interface loadingTotals {
  loadTotal: number;
  groundTotal: number;
  roofTotal: number;
}

export interface projectData {
  projectTitle: string;
  projectNumber: string;
  author: string;
  checker: string;
  dateCreated: string;
  dateChecked: string;
  buildingHeight: number;
  floorHeight: number;
  buildingType: string;
  xGrid: number;
  yGrid: number;
  fireRating: number;
  natFreq: number;
  deadLoads: Load[];
  liveLoads: Load[];
  projectSettings: {
    rebarRate: string;
    concreteColumnCarbon: string;
    concreteBeamCarbon: string;
    concreteSlabCarbon: string;
    rebarCarbon: string;
    steelCarbon: string;
  };
  entryFieldsFilled: boolean;
}

export interface schemeDesign {
  schemeType: string;
  structuralDepth: number;
  validSteelBeams: string;
  internalColumn: string;
  edgeColumn: string;
  cornerColumn: string;
  internalULSLoad: number;
  edgeULSLoad: number;
  cornerULSLoad: number;
  grossInternalFloorArea: number;
  A1_A5: number;
}

export interface ubBeam {
  mass: number;
  h: number;
  b: number;
  tw: number;
  tf: number;
  r: number;
  d: number;
  cw_tw: number;
  cf_tf: number;
  C: number;
  N: number;
  n: number;
  Imajor: number;
  Iminor: number;
  imajor: number;
  iminor: number;
  Smajor: number;
  Sminor: number;
  Zmajor: number;
  Zminor: number;
  U: number;
  X: number;
  Iw: number;
  IT: number;
  A: number;
}
