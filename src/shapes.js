const WORLD_ITEMS = {
  palettes: [
    "#0015ff",
    "#ff00a1",
    "#90fe00",
    "#8400ff",
    "#00fff7",
    "#ff7300",
  ],
}
// const WORLD_ITEMS.palettes =;

class Cone {
  constructor(
    x,
    y,
    z,
    h,
    radius,
    length,
    sides = 8,
    color = WORLD_ITEMS.palettes,
    strokeColor = "black",
  ) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.rOuter = radius;
    this.rInner = length;
    this.sides = sides;
    this.color = color;
    this.strokeColor = strokeColor;

    this.points = this.createVertices();
  }

  createVertices() {
    const points = [];
    const angleStep = TWO_PI / this.sides;
    const top = createVector(this.pos.x, this.pos.y - this.h / 2, this.pos.z);
    points.push(top);

    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep;
      const px = this.pos.x + cos(angle) * this.rOuter;
      const pz = this.pos.z + sin(angle) * this.rOuter;
      const py = this.pos.y + this.h / 2;
      points.push(createVector(px, py, pz));
    }

    return points;
  }

  getFaces() {
    const top = this.points[0];
    const basePoints = this.points.slice(1);
    const faces = [];

    for (let i = 0; i < this.sides; i++) {
      const next = (i + 1) % this.sides;

      faces.push({
        points: [basePoints[i], basePoints[next], top],
        color: this.color[i % this.color.length],
        strokeColor: this.strokeColor,
      });
    }
    faces.push({
      points: basePoints.reverse(),
      color: this.color[0],
      strokeColor: this.strokeColor,
    });
    return faces;
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });

    const [v1, v2] = rotatePointAroundPoint(
      this.pos,
      reference,
      degree,
      a1,
      a2,
    );
    this.pos[a1] = v1;
    this.pos[a2] = v2;
  }
}

class Cylinder {
  constructor(
    x,
    y,
    z,
    h,
    radius,
    length,
    sides = 8,
    color = WORLD_ITEMS.palettes,
    strokeColor = "black",
  ) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.rOuter = radius;
    this.rInner = length;
    this.sides = sides;
    this.color = color;
    this.strokeColor = strokeColor;

    this.points = this.createVertices();
  }

  createVertices() {
    const points = [];
    const angleStep = TWO_PI / this.sides;
    const halfHeight = this.h / 2;

    // top circle
    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep;
      const px = this.pos.x + cos(angle) * this.rOuter;
      const pz = this.pos.z + sin(angle) * this.rOuter;
      const py = this.pos.y - halfHeight;
      points.push(createVector(px, py, pz));
    }

    // bottom circle
    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep;
      const px = this.pos.x + cos(angle) * this.rOuter;
      const pz = this.pos.z + sin(angle) * this.rOuter;
      const py = this.pos.y + halfHeight;
      points.push(createVector(px, py, pz));
    }

    return points;
  }

  getFaces() {
    const faces = [];
    const top = this.points.slice(0, this.sides);
    const bottom = this.points.slice(this.sides);

    // side faces
    for (let i = 0; i < this.sides; i++) {
      const next = (i + 1) % this.sides;
      faces.push({
        points: [bottom[i], bottom[next], top[next], top[i]],
        color: this.color[i % this.color.length],
        strokeColor: this.strokeColor,
      });
    }

    faces.push({
      points: top,
      color: this.color[0],
      strokeColor: this.strokeColor,
    }, {
      points: bottom.reverse(),
      color: this.color[0],
      strokeColor: this.strokeColor,
    });
    return faces;
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });

    const [v1, v2] = rotatePointAroundPoint(
      this.pos,
      reference,
      degree,
      a1,
      a2,
    );
    this.pos[a1] = v1;
    this.pos[a2] = v2;
  }
}

class Star {
  constructor(
    x,
    y,
    z,
    h,
    rOuter,
    rInner,
    sides = 8,
    color = WORLD_ITEMS.palettes,
    strokeColor = "black",
  ) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.color = color;
    this.strokeColor = strokeColor;

    this.rOuter = rOuter;
    this.rInner = rInner;

    this.points = [];

    this.top = createVector(x, y - h / 2, z);
    this.bottom = createVector(x, y + h / 2, z);

    for (let i = 0; i < sides; i++) {
      const angle = TWO_PI * (i / sides);
      const radius = (i % 2 === 0) ? rOuter : rInner;
      const px = x + cos(angle) * radius;
      const pz = z + sin(angle) * radius;
      this.points.push(createVector(px, y, pz));
    }

    this.points.push(this.top);
    this.points.push(this.bottom);
    this.sides = sides;
  }

  getFaces() {
    const faces = [];

    for (let i = 0; i < this.sides; i++) {
      const next = (i + 1) % this.sides;
      faces.push({
        points: [this.points[i], this.points[next], this.top],
        color: WORLD_ITEMS.palettes[i % WORLD_ITEMS.palettes.length],
        strokeColor: this.strokeColor,
      });
    }

    for (let i = 0; i < this.sides; i++) {
      const next = (i + 1) % this.sides;
      faces.push({
        points: [this.points[next], this.points[i], this.bottom],
        color: WORLD_ITEMS.palettes[i % WORLD_ITEMS.palettes.length],
        strokeColor: this.strokeColor,
      });
    }

    return faces;
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
    const [v1, v2] = rotatePointAroundPoint(
      this.pos,
      reference,
      degree,
      a1,
      a2,
    );
    this.pos[a1] = v1;
    this.pos[a2] = v2;
  }
}

class Pyramid {
  constructor(x, y, z, h, w, d, colors) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.w = w;
    this.d = d;

    this.OGCenter = this.pos.copy();
    this.rotations = { x: 0, y: 0, z: 0 };

    this.colors = colors || WORLD_ITEMS.palettes;

    this.points = this.createVertices();
  }

  createVertices() {
    const w2 = this.w / 2;
    const d2 = this.d / 2;

    const p1 = createVector(this.pos.x - w2, this.pos.y, this.pos.z - d2); // F-L
    const p2 = createVector(this.pos.x - w2, this.pos.y, this.pos.z + d2); // B-L
    const p3 = createVector(this.pos.x + w2, this.pos.y, this.pos.z + d2); // B-R
    const p4 = createVector(this.pos.x + w2, this.pos.y, this.pos.z - d2); // F-R
    const p5 = createVector(this.pos.x, this.pos.y - this.h, this.pos.z); // Top

    return [p1, p2, p3, p4, p5];
  }

  getFaces() {
    const [p1, p2, p3, p4, p5] = this.points;
    return [
      { points: [p4, p3, p2, p1], color: this.colors[0] }, // base
      { points: [p1, p2, p5], color: this.colors[1] }, // side 1
      { points: [p2, p3, p5], color: this.colors[2] }, // side 2
      { points: [p3, p4, p5], color: this.colors[3] }, // side 3
      { points: [p4, p1, p5], color: this.colors[4] }, // side 4
    ];
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.pos;

    this.points.forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });

    const [v1, v2] = rotatePointAroundPoint(
      this.pos,
      reference,
      degree,
      a1,
      a2,
    );
    this.pos[a1] = v1;
    this.pos[a2] = v2;
  }
}

class Cube {
  constructor(x, y, z, h, w, d, color, strokeColor = "black") {
    color = color || WORLD_ITEMS.palettes;

    this.pos = createVector(x, y, z);
    this.h = h;
    this.w = w;
    this.d = d;

    this.OGCenter = createVector(x, y, z);
    this.rotations = { x: 0, y: 0, z: 0 };

    this.strokeColor = strokeColor;
    this.color = color;

    this.points = this.createVertices();
  }

  createVertices() {
    const w2 = this.w / 2;
    const h2 = this.h / 2;
    const d2 = this.d / 2;

    const p1 = createVector(-w2, -h2, -d2).add(this.pos); // F-T-L
    const p2 = createVector(-w2, +h2, -d2).add(this.pos); // F-B-L
    const p3 = createVector(+w2, +h2, -d2).add(this.pos); // F-B-R
    const p4 = createVector(+w2, -h2, -d2).add(this.pos); // F-T-R
    const p5 = createVector(+w2, -h2, +d2).add(this.pos); // B-T-R
    const p6 = createVector(+w2, +h2, +d2).add(this.pos); // B-B-R
    const p7 = createVector(-w2, +h2, +d2).add(this.pos); // B-B-L
    const p8 = createVector(-w2, -h2, +d2).add(this.pos); // B-T-L
    return [p1, p2, p3, p4, p5, p6, p7, p8];
  }

  getFaces() {
    const [p1, p2, p3, p4, p5, p6, p7, p8] = this.points;

    const f1 = [p1, p2, p3, p4]; // front
    const f2 = [p5, p6, p7, p8]; // back
    const f3 = [p8, p7, p2, p1]; // left
    const f4 = [p4, p3, p6, p5]; // right
    const f5 = [p8, p1, p4, p5]; // top
    const f6 = [p2, p7, p6, p3]; // bottom

    const val = [f1, f2, f3, f4, f5, f6].map((points, i) => ({
      strokeColor: this.strokeColor,
      color: this.color[i % this.color.length],
      points,
    }));

    return val;
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.pos;

    this.points.forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });

    const [v1, v2] = rotatePointAroundPoint(
      this.pos,
      reference,
      degree,
      a1,
      a2,
    );
    this.pos[a1] = v1;
    this.pos[a2] = v2;
  }
}
