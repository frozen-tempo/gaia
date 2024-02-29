import schemeDesignData from "../src/data/scheme-design-chart-data.json";
import RayCasting from "./RayCasting";

function designInternalColumn(designLoad: number, rebarCurve: number[][]) {
  var internalColumnSquare = 0;

  var closestColumnWidth = rebarCurve.reduce(function (
    prev: number[],
    curr: number[]
  ) {
    return Math.abs(curr[0] - designLoad) < Math.abs(prev[0] - designLoad)
      ? curr
      : prev;
  });

  return (internalColumnSquare = Math.ceil(closestColumnWidth[1] / 25) * 25);
}

function designOtherColumn(
  designLoad: number,
  momentCurves: { [key: string]: { [key: string]: number[][] } },
  rebarCurves: { [key: string]: { [key: string]: number[][] } },
  loadKey: string,
  spanGoal: number,
  rebarRatio: string
) {
  var columnSizeSquare = 0;

  for (const [columnSize, curve] of Object.entries(momentCurves)) {
    const loadCurve = curve[loadKey as keyof typeof curve];
    const columnDesignMoment = loadCurve.reduce(function (
      prev: number[],
      curr: number[]
    ) {
      return Math.abs(curr[0] - spanGoal) < Math.abs(prev[0] - spanGoal)
        ? curr
        : prev;
    });
    const rebarCurve: number[][] = (
      rebarCurves as {
        [key: string]: { [key: string]: number[][] };
      }
    )[columnSize][rebarRatio];
    if (RayCasting(columnDesignMoment[1], designLoad, rebarCurve)) {
      columnSizeSquare = +columnSize;
      break;
    }
  }
  return columnSizeSquare;
}

function RCColumnDesign(
  internalColumnLoad: number,
  edgeColumnLoad: number,
  cornerColumnLoad: number,
  spanGoal: number,
  loadKey: string,
  rebarRatio: string
) {
  const internalColumnSquare = designInternalColumn(
    internalColumnLoad,
    schemeDesignData.internalRCColumn[
      rebarRatio as keyof typeof schemeDesignData.internalRCColumn
    ]
  );

  const edgeColumnSquare = designOtherColumn(
    edgeColumnLoad,
    schemeDesignData.EdgeRCColumnDesign1,
    schemeDesignData.EdgeRCColumnDesign2,
    loadKey,
    spanGoal,
    rebarRatio
  );
  const cornerColumnSquare = designOtherColumn(
    cornerColumnLoad,
    schemeDesignData.CornerRCColumnDesign1,
    schemeDesignData.CornerRCColumnDesign2,
    loadKey,
    spanGoal,
    rebarRatio
  );

  return {
    internalColumn: {
      size: internalColumnSquare,
      material: "RC",
    },
    edgeColumn: { size: edgeColumnSquare, material: "RC" },
    cornerColumn: { size: cornerColumnSquare, material: "RC" },
  };
}

export default RCColumnDesign;
