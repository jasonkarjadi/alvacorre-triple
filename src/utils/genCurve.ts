import { geoInterpolate } from "d3-geo";
import {
  CubicBezierCurve3,
  Mesh,
  MeshBasicMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import { Pnts } from "../types";
import { toXYZ } from "./toXYZ";

export const genCurve = (start: Pnts[number], end: Pnts[number], rad = 1) => {
  const [ax, ay, az] = toXYZ(start.LAT, start.LNG, rad);
  const [dx, dy, dz] = toXYZ(end.LAT, end.LNG, rad);
  const vA = new Vector3(ax, ay, az);
  const vD = new Vector3(dx, dy, dz);

  const interpol = geoInterpolate([start.LNG, start.LAT], [end.LNG, end.LAT]);
  const geoB = interpol(0.25);
  const geoC = interpol(0.75);
  const arcHeight = vA.distanceTo(vD) * 0.5 + rad;
  const [bx, by, bz] = toXYZ(geoB[1], geoB[0], arcHeight);
  const [cx, cy, cz] = toXYZ(geoC[1], geoC[0], arcHeight);
  const vB = new Vector3(bx, by, bz);
  const vC = new Vector3(cx, cy, cz);
  const curve = new CubicBezierCurve3(vA, vB, vC, vD);

  const line = new Mesh(
    new TubeGeometry(curve, 32, 0.1, 8),
    new MeshBasicMaterial({ color: 0xf78f2e })
  );
  return line;
};
// need to add shader function based on from A or AB
