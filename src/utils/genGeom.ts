import earcut from "earcut";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { PolyCoords } from "../types";
import { geoPolyTrnglt, interpLine } from "./geoPolyTrnglt";
import { toXYZ } from "./toXYZ";

export const genMeshGeom = (coords: PolyCoords, rad = 1, res = 5) => {
  const { verts, inds } = geoPolyTrnglt(coords, rad, res);
  const meshGeom = new BufferGeometry();
  meshGeom
    .setIndex(inds)
    .setAttribute("position", new Float32BufferAttribute(verts, 3))
    .computeVertexNormals();
  return meshGeom;
};

export const genLineGeom = (coords: PolyCoords, rad = 1, res = 5) => {
  const xyzs = coords.map((c) =>
    interpLine(c, res).map(([lng, lat]) => toXYZ(lat, lng, rad))
  );
  const { vertices, holes } = earcut.flatten(xyzs);
  const firstHoleIdx = holes[0] || Infinity;
  const outerVerts = vertices.slice(0, firstHoleIdx),
    holeVerts = vertices.slice(firstHoleIdx);
  const holesIdx = new Set(holes);
  const numPnts = Math.round(vertices.length / 3);
  const outerInds: number[] = [],
    holeInds: number[] = [];
  for (let vIdx = 1; vIdx < numPnts; vIdx++) {
    if (!holesIdx.has(vIdx)) {
      if (vIdx < firstHoleIdx) {
        outerInds.push(vIdx - 1, vIdx);
      } else {
        holeInds.push(vIdx - 1 - firstHoleIdx, vIdx - firstHoleIdx);
      }
    }
  }
  if (holes.length) {
    outerInds.concat(holeInds);
    outerVerts.concat(holeVerts);
  }
  const lineGeom = new BufferGeometry();
  lineGeom
    .setIndex(outerInds)
    .setAttribute("position", new Float32BufferAttribute(outerVerts, 3));
  return lineGeom;
};

export const genGeoms = (polys: PolyCoords[], rad = 1, res = 5) => {
  const meshGeoms = polys.map((c) => genMeshGeom(c, rad, res)) || [];
  const lineGeoms = polys.map((c) => genLineGeom(c, rad, res)) || [];
  return { meshGeoms, lineGeoms };
};
