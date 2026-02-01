const palettes = [
  "#0015ff",
  "#ff00a1",
  "#90fe00",
  "#8400ff",
  "#00fff7",
  "#ff7300",
];

const normalOfFace = (p1, p2, p3) => {
  // @ts-ignore
  const s1 = p5.Vector.sub(p1, p2);
  // @ts-ignore
  const s2 = p5.Vector.sub(p3, p2);

  const normal = s2.cross(s1);
  return normal;
};

const getProspectivePoint = (point, screen) => {
  if (point.z < 0) {
    return createVector(Infinity, Infinity, 0);
  }
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

class Cone {
  constructor(x, y, z, h, radius, length, sides = 8) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.rOuter = radius;
    this.rInner = length;

    this.points = [];

    const topPoint = createVector(x, length / 2, z);

    const angle = 360 / sides;

    for (let i = 0; i < sides; i++) {
      const dx = Math.cos(radians(i * angle)) * radius;
      const dz = Math.sin(radians(i * angle)) * radius;
      const dy = -length / 2;

      const point = createVector(x + dx, y + dy, z + dz);
      this.points.push(point);
    }

    const faces = [];

    for (let i = 0; i < sides; i++) {
      const p1 = this.points[i];
      const p2 = this.points[(i + 1) % sides];

      faces.push({
        points: [p1, p2, topPoint],
        color: palettes[i % palettes.length],
      });
      // faces.push({
      //   points: [topPoint, p2, p1],
      //   color: palettes[i % palettes.length],
      // });
    }

    this.faces = faces;
    this.updateShape();
  }

  updateShape() {
    this.manageFaces();
    this.prinatablePoints();
  }

  manageFaces = () => {
    this.faces = this.faces.map((each) => ({
      ...each,
      normal: normalOfFace(...each.points.slice(0, 3)),
      center: centerOfFace(...each.points),
    }));

    this.faces = this.faces.sort((a, b) => {
      // @ts-ignore
      return b.normal.dot(b.center) - a.normal.dot(a.center);
    });
  };

  prinatablePoints() {
    this.manageFaces();
    this.printable = this.faces.map((face) => {
      return {
        points: face.points.map((each) => getProspectivePoint(each, SCREEN_Z)),
        color: face.color,
      };
    });
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
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = this.angleBetween(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
    const [v1, v2] = this.angleBetween(this.pos, reference, degree, a1, a2);
    this.pos[a1] = v1;
    this.pos[a2] = v2;

    this.prinatablePoints();
  }
}
class Cylinder {
  constructor(x, y, z, h, radius, length, sides = 8) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.rOuter = radius;
    this.rInner = length;

    this.points = [];
    const totalAngle = 360;
    const angle = 360 / sides;
    for (let i = 0; i < sides; i++) {
      const dx = Math.sin(radians(i * angle)) * radius;
      const dy = Math.cos(radians(i * angle)) * radius;
      const dz = length;
      const point = createVector(x + dx, y + dy, z + dz);
      this.points.push(point);
    }

    for (let i = 0; i < sides; i++) {
      const dx = Math.sin(radians(i * angle)) * radius;
      const dy = Math.cos(radians(i * angle)) * radius;
      const dz = -length;
      const point = createVector(x + dx, y + dy, z + dz);
      this.points.push(point);
    }

    const faces = [];

    for (let i = 0; i < sides; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + sides];
      const p3 = this.points[sides + (i + 1) % sides];
      const p4 = this.points[(i + 1) % sides];

      faces.push({
        points: [p1, p2, p3, p4],
        color: palettes[i % palettes.length],
      });
      faces.push({
        points: [p4, p3, p2, p1],
        color: palettes[i % palettes.length],
      });
    }

    this.faces = faces;
    this.updateShape();
  }

  updateShape() {
    this.manageFaces();
    this.prinatablePoints();
  }

  manageFaces = () => {
    this.faces = this.faces.map((each) => ({
      ...each,
      normal: normalOfFace(...each.points.slice(0, 3)),
      center: centerOfFace(...each.points),
    }));

    this.faces = this.faces.sort((a, b) => {
      // @ts-ignore
      return b.normal.dot(b.center) - a.normal.dot(a.center);
    });
  };

  prinatablePoints() {
    this.manageFaces();
    this.printable = this.faces.map((face) => {
      return {
        points: face.points.map((each) => getProspectivePoint(each, SCREEN_Z)),
        color: face.color,
      };
    });
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
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = this.angleBetween(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
    const [v1, v2] = this.angleBetween(this.pos, reference, degree, a1, a2);
    this.pos[a1] = v1;
    this.pos[a2] = v2;

    this.prinatablePoints();
  }
}

class Star {
  constructor(x, y, z, h, rOuter, rInner, sides = 8) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.rOuter = rOuter;
    this.rInner = rInner;

    this.points = [];
    const top = createVector(x, y - h / 2, z);
    const bottom = createVector(x, y + h / 2, z);

    for (let i = 0; i < sides; i++) {
      const angle = TWO_PI * (i / sides);
      const radius = (i % 2 === 0) ? rOuter : rInner;
      const px = x + cos(angle) * radius;
      const pz = z + sin(angle) * radius;
      this.points.push(createVector(px, y, pz));
    }

    this.points.push(top);
    this.points.push(bottom);

    const faces = [];

    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      faces.push({
        points: [this.points[i], this.points[next], top],
        color: palettes[i % palettes.length],
      });
    }

    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      faces.push({
        points: [this.points[next], this.points[i], bottom],
        color: palettes[i % palettes.length],
      });
    }

    this.faces = faces;
    this.updateShape();
  }

  updateShape() {
    this.manageFaces();
    this.prinatablePoints();
  }

  manageFaces = () => {
    this.faces = this.faces.map((each) => ({
      ...each,
      normal: normalOfFace(...each.points.slice(0, 3)),
      center: centerOfFace(...each.points),
    }));

    this.faces = this.faces.sort((a, b) => {
      // @ts-ignore
      return b.normal.dot(b.center) - a.normal.dot(a.center);
    });
  };

  prinatablePoints() {
    this.manageFaces();
    this.printable = this.faces.map((face) => {
      return {
        points: face.points.map((each) => getProspectivePoint(each, SCREEN_Z)),
        color: face.color,
      };
    });
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
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = this.angleBetween(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
    const [v1, v2] = this.angleBetween(this.pos, reference, degree, a1, a2);
    this.pos[a1] = v1;
    this.pos[a2] = v2;

    this.prinatablePoints();
  }
}

class Pyramid {
  constructor(x, y, z, h, w, d) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.w = w;
    this.d = d;

    this.OGCenter = createVector(x, y, z);
    this.rotations = { x: 0, y: 0, z: 0 };

    const w2 = w / 2;
    const d2 = d / 2;

    const p1 = createVector(x - w2, y, z - d2); // F-L
    const p2 = createVector(x - w2, y, z + d2); // B-L
    const p3 = createVector(x + w2, y, z + d2); // B-R
    const p4 = createVector(x + w2, y, z - d2); // F-R

    const p5 = createVector(x, y - h, z); // top

    this.points = [p1, p2, p3, p4, p5];
    this.faces = [
      { x, y, z, points: [p4, p3, p2, p1], color: palettes[0] },
      { x: x - w2, y: y + h / 2, z, points: [p1, p2, p5], color: palettes[1] },
      { x, y: y + h / 2, z: z + d2, points: [p2, p3, p5], color: palettes[2] },
      { x: x + w2, y: y + h / 2, z, points: [p3, p4, p5], color: palettes[3] },
      { x, y: y + h / 2, z: z - d2, points: [p4, p1, p5], color: palettes[4] },
    ];

    this.manageFaces();

    this.prinatablePoints();
  }

  updateShape() {
    this.manageFaces();
    this.prinatablePoints();
  }

  manageFaces = () => {
    this.faces = this.faces.map((each) => ({
      ...each,
      normal: normalOfFace(...each.points.slice(0, 3)),
      center: centerOfFace(...each.points),
    }));

    this.faces = this.faces.sort((a, b) => {
      return b.normal.dot(b.center) - a.normal.dot(a.center);
    });
  };

  prinatablePoints() {
    this.manageFaces();
    this.printable = this.faces.map((face) => {
      return {
        points: face.points.map((each) => getProspectivePoint(each, SCREEN_Z)),
        color: face.color,
      };
    });
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
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = this.angleBetween(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
    const [v1, v2] = this.angleBetween(this.pos, reference, degree, a1, a2);
    this.pos[a1] = v1;
    this.pos[a2] = v2;

    this.prinatablePoints();
  }
}

class Cube {
  constructor(x, y, z, h, w, d, color = palettes) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.w = w;
    this.d = d;

    this.OGCenter = createVector(x, y, z);
    this.rotations = { x: 0, y: 0, z: 0 }; // rotations in the plane

    const w2 = w / 2;
    const h2 = h / 2;
    const d2 = d / 2;

    const p1 = createVector(x - w2, y - h2, z - d2); // F-T-L
    const p2 = createVector(x - w2, y + h2, z - d2); // F-B-L
    const p3 = createVector(x + w2, y + h2, z - d2); // F-B-R
    const p4 = createVector(x + w2, y - h2, z - d2); // F-T-R
    const p5 = createVector(x + w2, y - h2, z + d2); // B-T-R
    const p6 = createVector(x + w2, y + h2, z + d2); // B-B-R
    const p7 = createVector(x - w2, y + h2, z + d2); // B-B-L
    const p8 = createVector(x - w2, y - h2, z + d2); // B-T-L

    this.points = [p1, p2, p3, p4, p5, p6, p7, p8];

    const c0 = color[0 % color.length];
    const c1 = color[1 % color.length];
    const c2 = color[2 % color.length];
    const c3 = color[3 % color.length];
    const c4 = color[4 % color.length];
    const c5 = color[5 % color.length];

    this.faces = [
      { x, y, z: z - d2, points: [p1, p2, p3, p4], color: c0 }, // front
      { x, y, z: z + d2, points: [p5, p6, p7, p8], color: c1 }, // back
      { x: x - w2, y, z, points: [p8, p7, p2, p1], color: c2 }, // left
      { x: x + w2, y, z, points: [p4, p3, p6, p5], color: c3 }, // right
      { x, y: y - h2, z, points: [p8, p1, p4, p5], color: c4 }, // top
      { x, y: y + h2, z, points: [p2, p7, p6, p3], color: c5 }, // bottom
    ];

    stroke(1);

    this.manageFaces();

    this.prinatablePoints();
  }
  updateShape() {
    this.manageFaces();
    this.prinatablePoints();
  }

  manageFaces = () => {
    this.faces = this.faces.map((each) => ({
      ...each,
      normal: normalOfFace(...each.points.slice(0, 3)),
      center: centerOfFace(...each.points),
    }));

    this.faces = this.faces.sort((a, b) => {
      return b.normal.dot(b.center) - a.normal.dot(a.center);
    });
  };

  prinatablePoints() {
    this.manageFaces();
    this.printable = this.faces.map((face) => {
      return {
        points: face.points.map((each) => getProspectivePoint(each, SCREEN_Z)),
        color: face.color,
      };
    });
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
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = this.angleBetween(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
    const [v1, v2] = this.angleBetween(this.pos, reference, degree, a1, a2);
    this.pos[a1] = v1;
    this.pos[a2] = v2;

    this.prinatablePoints();
  }
}
