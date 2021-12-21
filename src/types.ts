import { ColorRepresentation } from "three";

export type TitleTags = { locale: string; title: string; tagline: string }[];
export type PolyCoords = [number, number][][];
export type FeatProps = {
  NAME: string;
  [key: string]: string | number | null;
};
export type FeatGeom =
  | { type: "Polygon"; coordinates: PolyCoords }
  | { type: "MultiPolygon"; coordinates: PolyCoords[] };
export type BBox = [number, number, number, number];
export type FeatColl = {
  type: "FeatureCollection";
  name: string;
  crs: { type: "name"; properties: { name: string } };
  features: {
    type: "Feature";
    properties: FeatProps;
    bbox: BBox;
    geometry: FeatGeom;
  }[];
  bbox: BBox;
};
export type Ctry = {
  NAME: string;
  LAT: number;
  LNG: number;
  LISTABLES: string[];
  bbox?: BBox;
  geometry: FeatGeom;
};
export type Rel = {
  A: string;
  B: string;
  FROM: "A" | "AB";
  LISTABLES: string[];
};
export type Fam = {
  FAMILY: string;
  COUNTRIES: string[];
  COLOR: ColorRepresentation;
};
