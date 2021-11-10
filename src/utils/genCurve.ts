import { geoInterpolate } from "d3-geo";
import {
  CubicBezierCurve3,
  Line,
  LineBasicMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import { toXYZ } from "./toXYZ";

export const genCurve = (start: any, end: any, rad = 1) => {
  const [ax, ay, az] = toXYZ(start.lat, start.lng, rad);
  const [dx, dy, dz] = toXYZ(end.lat, end.lng, rad);
  const vA = new Vector3(ax, ay, az);
  const vD = new Vector3(dx, dy, dz);

  const interpol = geoInterpolate([start.lng, start.lat], [end.lng, end.lat]);
  const geoB = interpol(0.25);
  const geoC = interpol(0.75);
  const arcHeight = vA.distanceTo(vD) * 0.5 + rad;
  const [bx, by, bz] = toXYZ(geoB[1], geoB[0], arcHeight);
  const [cx, cy, cz] = toXYZ(geoC[1], geoC[0], arcHeight);
  const vB = new Vector3(bx, by, bz);
  const vC = new Vector3(cx, cy, cz);
  const curve = new CubicBezierCurve3(vA, vB, vC, vD);

  const curveObject = new Line(
    new TubeGeometry(curve, 20, 0.01, 8),
    new LineBasicMaterial({ color: 0x00ff00 })
  );
  return curveObject;
};
