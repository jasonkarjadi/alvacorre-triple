export type TitleTags = { locale: string; title: string; tagline: string }[];
export type PolyCoords = [number, number][][];
export type FeatProps = { [index: string]: string | number | null };
export type FeatGeom =
  | { type: "Polygon"; coordinates: PolyCoords }
  | { type: "MultiPolygon"; coordinates: PolyCoords[] };
export type BBox = [number, number, number, number];
export interface GeoJson {
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
}
