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
}

export interface schemeDesign {
  schemeType: string;
  structuralDepth: number;
}
