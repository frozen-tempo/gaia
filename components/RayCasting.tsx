import React from "react";

function RayCasting(xp: number, yp: number, polygon: number[][]) {
  var n = polygon.length,
    count = 0,
    x = xp,
    y = yp;

  for (let i = 0; i < n - 1; i++) {
    var side = {
      a: {
        x: polygon[i][0],
        y: polygon[i][1],
      },
      b: {
        x: polygon[i + 1][0],
        y: polygon[i + 1][1],
      },
    };
    var x1 = side.a.x,
      y1 = side.a.y,
      x2 = side.b.x,
      y2 = side.b.y;

    var x_intersect = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;

    if (y <= y1 != y <= y2 && x <= x_intersect) {
      count += 1;
    }
  }

  const isWithin = count % 2 == 0 ? false : true;

  return isWithin;
}

export default RayCasting;
