import earcut from "earcut";
import { BufferGeometry, Float32BufferAttribute } from "three";
import { PolyCoords } from "../pages/globe";
import { geoPolyTrnglt, interpLine } from "./geoPolyTrnglt";
import { toXYZ } from "./toXYZ";

export const genMeshGeom = (coords: PolyCoords, rad = 1, res = 5) => {
  const { pnts, inds } = geoPolyTrnglt(coords, res);
  const xyzs = [pnts].map((c) => c.map(([lng, lat]) => toXYZ(lat, lng, rad))); // shorten?
  const verts = earcut.flatten(xyzs).vertices; // shorten?
  const meshGeom = new BufferGeometry();
  meshGeom.setIndex(inds);
  meshGeom.setAttribute("position", new Float32BufferAttribute(verts, 3));
  meshGeom.computeVertexNormals();
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
  lineGeom.setIndex(outerInds);
  lineGeom.setAttribute("position", new Float32BufferAttribute(outerVerts, 3));
  return lineGeom;
};
