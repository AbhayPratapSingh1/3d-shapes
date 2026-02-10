// @ts-nocheck
const rotatePointAroundPoint = (p1, p2, da, k1 = "x", k2 = "z") => {
  const dx = p1[k1] - p2[k1];
  const dz = p1[k2] - p2[k2];

  const angle = Math.atan2(dz, dx) + radians(da);
  const radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

  const key1 = Math.sin(angle) * radius + p2[k2];
  const key2 = Math.cos(angle) * radius + p2[k1];

  return [key2, key1];
};

/////////////
/////////////

const normalOfFace = (p1, p2, p3) => {
  const s1 = p5.Vector.sub(p1, p2);
  const s2 = p5.Vector.sub(p3, p2);

  const normal = s2.cross(s1);

  return normal;
};

const getProspectivePoint = (point, screen) => {
  // if (point.z < 0.1) {
  //   return createVector(
  //     screen.width * Math.sign(point.x),
  //     screen.height * Math.sign(point.y),
  //     0,
  //   );
  // }
  const zUnitVector = createVector(0, 0, 1);

  const zProjectionP1 = point.dot(zUnitVector);

  const ratio = screen / zProjectionP1;

  const xRatio = ratio * point.x;
  const yRatio = ratio * point.y;

  return createVector(xRatio, yRatio, screen);
};

const centerOfFace = (...points) => {
  const faceCenterX = points.reduce((s, p) => s + p.x, 0) / points.length;
  const faceCenterY = points.reduce((s, p) => s + p.y, 0) / points.length;

  const faceCenterZ = points.reduce((s, p) => s + p.z, 0) / points.length;
  return createVector(faceCenterX, faceCenterY, faceCenterZ);
};

const metaData = () => {
  push();
  noStroke();
  fill(0);
  translate(-width / 2, -height / 2);
  text(`mode : ${MODE}`, width - 150, 20);
  text(`Item-Index : ${ITEM_INDEX}`, width - 150, 40);
  text(`FPS : ${Math.floor(frameRate())}`, width - 150, 60);
  pop();
};

/// THIS IS FOR THE PRINITNIG
/// THIS IS FOR THE PRINITNIG
/// THIS IS FOR THE PRINITNIG
/// THIS IS FOR THE PRINITNIG

const getNormalAndCenter = (face) => {
  const normal = normalOfFace(...(face.points));
  const center = centerOfFace(...(face.points));

  return {
    points: face.points,
    center,
    normal,
    color: face.color,
    strokeColor: face.strokeColor,
  };
};
const NEAR_Z = 0;

const isInside = (p) => p.z > NEAR_Z;

const getAllFacesWithDetail = (objects) => {
  const faces = objects.flatMap((each) => each.getFaces());
  const faceWithNormalAndCenter = faces.map((face) => getNormalAndCenter(face));
  return faceWithNormalAndCenter;
};

const getSortedFaces = (faces) => {
  return faces.sort((a, b) => b.center.z - a.center.z);
};

const getPrintablePoint = (faces) => {
  const toPrint = [];
  for (const face of faces) {
    const points = face.points.map((point) =>
      getProspectivePoint(point, SCREEN_Z)
    );
    toPrint.push({ ...face, points });
  }
  return toPrint;
};

const getVisibleFaces = (faces) => {
  return faces.filter((face) => face.normal.dot(face.center) < 0);
};

const dbg = (x) => console.log(x) || x;

const getClippedPoint = (p1, p2) => {
  const targetZ = 0.1;

  const diff = p2.z - p1.z;

  const ratio = diff === 0 ? 0 : ((targetZ - p1.z) / diff);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const x = (dx * ratio) + p1.x;
  const y = (dy * ratio) + p1.y;
  return createVector(x, y, targetZ);
};

const SCREEN_Z = 700;

const clipFace = (face) => {
  const points = [];
  const facePoints = face.points;
  for (let i = 0; i < facePoints.length; i++) {
    const prev = facePoints.at(i - 1);
    const current = facePoints[i];
    const next = facePoints[(i + 1) % facePoints.length];
    if (current.z >= 0.1) {
      if (next.z >= 0.1) {
        points.push(next);
      } else {
        points.push(getClippedPoint(current, next));
      }
    } else {
      if (next.z >= 0.1) {
        points.push(getClippedPoint(current, next));
        points.push(next);
      }
    }
  }
  return { ...face, points };
};

const drawFace = (face) => {
  if (!face.points || face.points.length < 3) return;

  fill(face.color);
  stroke(face.strokeColor || [0, 0, 0, 0]);
  strokeWeight(1);

  beginShape();
  for (const point of face.points) {
    // if (!point) continue;
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
};

// const getClippedPoint = (p1, p2) => {
//   const t = (NEAR_Z - p1.z) / (p2.z - p1.z);
//   return createVector(
//     p1.x + (p2.x - p1.x) * t,
//     p1.y + (p2.y - p1.y) * t,
//     NEAR_Z,
//   );
// };
// const clipFace = (face) => {
//   const pts = face.points;
//   if (!pts || pts.length < 2) return { ...face, points: [] };

//   const clipped = [];

//   for (let i = 0; i < pts.length; i++) {
//     const curr = pts[i];
//     const next = pts[(i + 1) % pts.length];

//     if (!curr || !next) continue;

//     const currInside = isInside(curr);
//     const nextInside = isInside(next);

//     if (currInside && nextInside) {
//       clipped.push(next);
//     } else if (currInside && !nextInside) {
//       clipped.push(getClippedPoint(curr, next));
//     } else if (!currInside && nextInside) {
//       clipped.push(getClippedPoint(curr, next));
//       clipped.push(next);
//     }
//   }

//   return { ...face, points: clipped };
// };
