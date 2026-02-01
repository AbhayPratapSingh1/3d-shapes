class Cuboid {
  constructor(x, y, z, h, w, s, color = [100, 100, 100, 50]) {
    this.angle = 0;
    this.center = createVector(x, y, z);

    this.h = h;
    this.w = w;
    this.s = s;

    this.p1 = createVector(x + w / 2, y - h / 2, z + s / 2);
    this.p2 = createVector(x + w / 2, y + h / 2, z + s / 2);
    this.p3 = createVector(x - w / 2, y + h / 2, z + s / 2);
    this.p4 = createVector(x - w / 2, y - h / 2, z + s / 2);

    this.p5 = createVector(x + w / 2, y - h / 2, z - s / 2);
    this.p6 = createVector(x + w / 2, y + h / 2, z - s / 2);
    this.p7 = createVector(x - w / 2, y + h / 2, z - s / 2);
    this.p8 = createVector(x - w / 2, y - h / 2, z - s / 2);
    this.color = color;
    this.depth = SCREEN_Z;

    this.points = [
      this.p1,
      this.p2,
      this.p3,
      this.p4,
      this.p5,
      this.p6,
      this.p7,
      this.p8,
    ];
  }

  draw() {
    const toDraw = this.points.map((each) =>
      getProspectivePoint(each, this.depth)
    );

    toDraw.forEach((point) => {
      circle(point.x, point.y, 5);
    });

    this.points.forEach((point) => circle(point.x, point.y, 5));

    const faces = [
      [0, 1, 2, 3, 0],
      [0, 4, 5, 1, 0],
      [3, 0, 4, 7, 3],
      [3, 7, 6, 2, 3],
      [5, 1, 2, 6, 5],
      [4, 5, 6, 7, 4],
    ];

    faces.forEach((face) => {
      fill(this.color);
      beginShape();
      face.forEach((index) => vertex(toDraw[index].x, toDraw[index].y));
      endShape();
    });

    const linesIndex = [[1, 5], [2, 6], [3, 7], [0, 4]];
    linesIndex.forEach(([i, j]) =>
      line(toDraw[i].x, toDraw[i].y, toDraw[j].x, toDraw[j].y)
    );
  }

  angleBetween(p1, p2, da, k1 = "x", k2 = "z") {
    const dx = p1[k1] - p2[k1];
    const dz = p1[k2] - p2[k2];

    const angle = Math.atan2(dz, dx) + radians(da);
    const radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

    const key1 = Math.sin(angle) * radius + p2[k2];
    const key2 = Math.cos(angle) * radius + p2[k1];

    return [key2, key1];
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.center;
    this.points.forEach((point, i) => {
      const [v1, v2] = this.angleBetween(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
  }
}
