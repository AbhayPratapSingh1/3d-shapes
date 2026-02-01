/// <reference types="p5/global" />
// @ts-nocheck

const SCREEN_Z = 700;

const OBJECTS = [];
let MODE = "Object";
let ITEM_INDEX = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  const cube = new Cube(100, -100, 1000, 200, 200, 200, ["black"], "white");
  OBJECTS.push(cube);

  const py = new Pyramid(100, -100, 1000, 200, 200, 200);
  OBJECTS.push(py);
  const cuboid = new Cube(100, -100, 1000, 200, 200, 400);
  OBJECTS.push(cuboid);
  const star = new Star(100, -100, 1000, 200, 200, 400);
  OBJECTS.push(star);
  const star2 = new Star(100, -100, 1000, 200, 200, 400, 16);
  OBJECTS.push(star2);
  const star3 = new Star(100, -100, 1000, 200, 200, 400, 32);
  OBJECTS.push(star3);
  const star4 = new Star(100, -100, 1000, 200, 200, 400, 72);
  OBJECTS.push(star4);

  const cylinder = new Cylinder(
    100,
    -100,
    1000,
    200,
    200,
    400,
    100,
    ["black"],
    "red",
  );
  OBJECTS.push(cylinder);

  const cone = new Cone(100, -100, 1000, 800, 200, 200, 40, ["black"], "green");
  OBJECTS.push(cone);
}

function draw() {
  translate(width / 2, height / 2);
  background(205);

  callbacks(OBJECTS, MODE, ITEM_INDEX);

  const faces = getAllFacesWithDetail(OBJECTS);

  const visibleFaces = getVisibleFaces(faces);

  const sortedFaces = getSortedFaces(visibleFaces);

  const toDraw = getPrintablePoint(sortedFaces);

  toDraw.forEach((face) => {
    drawFace(face);
  });

  metaData();
  stroke(0);
}
