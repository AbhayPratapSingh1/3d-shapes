const drawAxis = () => {
  strokeWeight(1);
  line(0, (height / 2) - 2, width, (height / 2) - 2);
  line((width / 2) - 2, 0, (width / 2) - 2, height);
};

const toDegree = (radian) => {
  return (180 / Math.PI) * radian;
};

const rotateObj = (cube, isEye = false) => {
  const reference = isEye ? createVector(0, 0, 0) : undefined;

  if (keyIsDown(UP_ARROW)) {
    cube.rotate(1, "z", "y", reference);
  }
  if (keyIsDown(DOWN_ARROW)) {
    cube.rotate(1, "y", "z", reference);
  }

  if (keyIsDown(LEFT_ARROW)) {
    cube.rotate(1, "z", "x", reference);
  }

  if (keyIsDown(RIGHT_ARROW)) {
    cube.rotate(1, "x", "z", reference);
  }
  if (keyIsDown(67)) {
    cube.rotate(1, "x", "y", reference);
  }
  if (keyIsDown(90)) {
    cube.rotate(1, "y", "x", reference);
  }
};

const zoom = (cube, isEye = false) => {
  const delta = isEye ? 10 : -10;

  if (keyIsDown(189)) {
    cube.points.forEach((point) => point.z += delta);

    cube.pos.z += delta;
  }
  if (keyIsDown(187)) {
    cube.points.forEach((point) => point.z -= delta);

    cube.pos.z -= delta;
  }
};

const move = (cube, isEye = false) => {
  const delta = isEye ? -10 : 10;

  if (keyIsDown(87)) {
    cube.points.forEach((point) => point.y -= delta);
    cube.pos.y -= delta;
  }
  if (keyIsDown(83)) {
    cube.points.forEach((point) => point.y += delta);
    cube.pos.y += delta;
  }
  if (keyIsDown(65)) {
    cube.points.forEach((point) => point.x -= delta);
    cube.pos.x -= delta;
  }
  if (keyIsDown(68)) {
    cube.points.forEach((point) => point.x += delta);
    cube.pos.x += delta;
  }
  if (keyIsDown(81)) {
    cube.points.forEach((point) => point.z -= delta);
    cube.pos.z -= delta;
  }
  if (keyIsDown(69)) {
    cube.points.forEach((point) => point.z += delta);
    cube.pos.z += delta;
  }
};
