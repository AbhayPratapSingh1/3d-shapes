/// <reference types="p5/global" />
// @ts-nocheck

const SCREEN_Z = 700;

const OBJECTS = [];
let MODE = "Object";
let ITEM_INDEX = 0;

const drawFace = (face) => {
  fill(face.color);
  noStroke();
  beginShape();
  for (const point of face.points) {
    vertex(point.x, point.y);
  }
  vertex(face.points[0].x, face.points[0].y);
  endShape();
};

function setup() {
  createCanvas(1600, 1000);
  pixelDensity(1);
  const cube = new Cube(100, -100, 1000, 200, 200, 200);x
  OBJECTS.push(cube);
  // const py = new Pyramid(100, -100, 1000, 200, 200, 200);
  // OBJECTS.push(py);
  // const cuboid = new Cube(100, -100, 1000, 200, 200, 400);
  // OBJECTS.push(cuboid);
  // const star = new Star(100, -100, 1000, 200, 200, 400);
  // OBJECTS.push(star);
  // const star2 = new Star(100, -100, 1000, 200, 200, 400, 16);
  // OBJECTS.push(star2);
  // const star3 = new Star(100, -100, 1000, 200, 200, 400, 32);
  // OBJECTS.push(star3);
  // const star4 = new Star(100, -100, 1000, 200, 200, 400, 72);
  // OBJECTS.push(star4);
  // const newShape = new Cone(100, -100, 1000, 200, 200, 400, 3);
  // console.log(newShape.faces);

  // OBJECTS.push(newShape);
}

const callback = (cube) => {
  if (keyIsDown(87)) {
    cube.rotate(1, "z", "y");
  }
  if (keyIsDown(83)) {
    cube.rotate(1, "y", "z");
  }
  if (keyIsDown(65)) {
    cube.rotate(1, "z", "x");
  }
  if (keyIsDown(68)) {
    cube.rotate(1, "x", "z");
  }
};

const manageFaces = (faces) => {
  const detailedFaces = faces.map((face) => {
    const normal = normalOfFace(...face.points.slice(0, 3));
    const center = centerOfFace(...face.points);

    return {
      ...face,
      normal,
      center,
      depth: center.z,
    };
  }).filter((face) => face.normal.dot(createVector(0, 0, 1)) < 0)
    .sort((a, b) => b.depth - a.depth);

  return detailedFaces;
};

const sortFaces = () => {
  const faces = OBJECTS.flatMap((each) => each.printable);

  const managedFace = manageFaces(faces);
  const printable = managedFace.map((face) => {
    return {
      points: face.points.map((each) => getProspectivePoint(each, SCREEN_Z)),
      color: face.color,
    };
  });
  return printable;
};

const showDetail = () => {
  stroke(1);
  fill(1);
  text(`mode : ${MODE}`, (width / 2) - 150, (-height / 2) + 30);
  text(`Item-Index : ${ITEM_INDEX}`, (width / 2) - 150, (-height / 2) + 60);
};

function draw() {
  translate(width / 2, height / 2);
  background(205);

  callbacks();

  objectCallbacks(OBJECTS, MODE, ITEM_INDEX);

  const toDraw = sortFaces(OBJECTS);
  toDraw.forEach((face) => {
    drawFace(face);
  });

  showDetail();
  stroke(0);
  // noLoop();
}
