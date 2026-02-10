/// <reference types="p5/global" />
// @ts-nocheck

const SCREEN_Z = 700;

const OBJECTS = [];
let MODE = "Eye";
let ITEM_INDEX = 0;

let CAR;
const tempWorld = (OBJECTS) => {
  //                  x y   z      h    w    d
  const r1 = new Cube(0, 50, 2000, 10, 400, 4000, ["black"], [0, 0, 0, 0]);
  OBJECTS.push(r1);

  const r2 = new Cube(1800, 50, 4000, 10, 4000, 400, ["black"], [0, 0, 0, 0]);
  OBJECTS.push(r2);

  const r3 = new Cube(4000, 50, 5300, 10, 400, 3000, ["black"], [0, 0, 0, 0]);
  OBJECTS.push(r3);

  const r4 = new Cube(3200, 50, 6800, 10, 2000, 400, ["black"], [0, 0, 0, 0]);
  OBJECTS.push(r4);
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // const cube = new Cube(0, 50, 0, 10, 400, 4000, ["black"], "white");
  // OBJECTS.push(cube);
  tempWorld(OBJECTS);
  CAR = new Cube(0, 30, 50, 20, 20, 20, ["blue"], "red");
  // OBJECTS.push(cube2);

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

  // const cylinder = new Cylinder(
  //   100,
  //   -100,
  //   1000,
  //   200,
  //   200,
  //   400,
  //   100,
  //   ["black"],
  //   "red",
  // );
  // OBJECTS.push(cylinder);

  // const cone = new Cone(100, -100, 1000, 800, 200, 200, 40, ["black"], "green");
  // OBJECTS.push(cone);
}


function draw() {
  translate(width / 2, height / 2);
  background(205);

  callbacks(OBJECTS, MODE, ITEM_INDEX);

  const faces = getAllFacesWithDetail(OBJECTS);
  const clippedFaces = faces.map((face) => clipFace(face)).filter((each) =>
    each.points.length > 0
  );

  const visibleFaces = getVisibleFaces(clippedFaces);

  // const sortedFaces = getSortedFaces(visibleFaces);

  const toDraw = getPrintablePoint(visibleFaces);

  toDraw.forEach((face) => {
    drawFace(face);
  });

  // console.log(CAR);

  const carFaces = getAllFacesWithDetail([CAR]);
  const visible = getVisibleFaces(carFaces);
  const toDrawCar = getPrintablePoint(visible);
  toDrawCar.forEach((face) => drawFace(face));
  // console.log(carFaces);

  metaData();
  stroke(0);
  // noLoop();
}
