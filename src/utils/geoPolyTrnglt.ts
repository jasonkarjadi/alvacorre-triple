import { mean, merge } from "d3-array";
import { Delaunay } from "d3-delaunay";
import { geoBounds, geoContains, geoDistance, geoInterpolate } from "d3-geo";
import earcut from "earcut";
import { Polygon } from "geojson";
import { PolyCoords } from "../types";
import { toXYZ } from "./toXYZ";

export const geoPolyTrnglt = (polygon: PolyCoords, rad = 1, res = 5) => {
  const boundsGeom: Polygon = { type: "Polygon", coordinates: polygon };
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(boundsGeom);
  const contour = polygon.map((c) => interpLine(c, res));
  const edgePnts: [number, number][] = merge(contour);
  const innerPnts =
    Math.min(Math.abs(maxLng - minLng), Math.abs(maxLat - minLat)) < res
      ? []
      : getGeoSpiralGrid(res, { minLng, maxLng, minLat, maxLat }).filter(
          (pnt) => geoContains(boundsGeom, pnt)
        );
  const pnts = [...edgePnts, ...innerPnts];
  const xyzs = pnts.map(([lng, lat]) => toXYZ(lat, lng, rad));
  const verts = earcut.flatten([xyzs]).vertices;
  let inds: number[] = [];
  if (!innerPnts.length) {
    const { vertices, holes } = earcut.flatten(contour);
    inds = earcut(vertices, holes, 2);
  } else {
    const trngls = Delaunay.from(pnts).triangles;
    for (let i = 0; i < trngls.length; i += 3) {
      const idxs = [2, 1, 0].map((idx) => trngls[i + idx]);
      const trngl = idxs.map((indice) => pnts[indice]);
      if (idxs.some((ind) => ind < edgePnts.length)) {
        const trnglCentroid = [0, 1].map((coordIdx) =>
          mean(trngl, (p) => p[coordIdx])
        );
        if (!geoContains(boundsGeom, trnglCentroid as [number, number]))
          continue;
      }
      inds.push(...idxs);
    }
  }
  return { verts, inds };
};

export const interpLine = (lineCoords: [number, number][], maxDist = 1) => {
  const result: [number, number][] = [];
  let prevPnt: [number, number] | undefined;
  lineCoords.map((pnt) => {
    if (prevPnt) {
      const dist = (geoDistance(pnt, prevPnt) * 180) / Math.PI;
      if (dist > maxDist) {
        const interp = geoInterpolate(prevPnt, pnt);
        const tStep = 1 / Math.ceil(dist / maxDist);
        for (let t = tStep; t < 1; t += tStep) {
          result.push(interp(t));
        }
      }
    }
    result.push((prevPnt = pnt));
  });
  return result;
};

const getGeoSpiralGrid = (
  pntsDist: number,
  { minLng, maxLng, minLat, maxLat }: { [key: string]: number }
) => {
  const numPnts = Math.round((360 / pntsDist) ** 2 / Math.PI);
  const phi = (1 + Math.sqrt(5)) / 2;
  const getPntLng = (idx: number) => (((idx / phi) * 360) % 360) - 180;
  const getPntLat = (idx: number) =>
    (Math.acos((2 * idx) / numPnts - 1) / Math.PI) * 180 - 90;
  const getPntIdx = (lat: number) =>
    (numPnts * (Math.cos(((lat + 90) * Math.PI) / 180) + 1)) / 2;
  const pntIdxRange = [
    Math.ceil(getPntIdx(maxLat)),
    Math.floor(getPntIdx(minLat)),
  ]; // shorten?
  const isLngInRange = // shorten?
    minLng === undefined && maxLng === undefined
      ? () => true
      : minLng === undefined
      ? (lng: number) => lng <= maxLng
      : maxLng === undefined
      ? (lng: number) => lng >= minLng
      : maxLng >= minLng
      ? (lng: number) => lng >= minLng && lng <= maxLng
      : (lng: number) => lng >= minLng || lng <= maxLng;
  const pnts: [number, number][] = [];
  for (let i = pntIdxRange[0]; i <= pntIdxRange[1]; i++) {
    const lng = getPntLng(i);
    isLngInRange(lng) && pnts.push([lng, getPntLat(i)]);
  }
  return pnts;
};
