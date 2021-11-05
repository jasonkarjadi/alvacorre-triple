import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { Globe } from "../components/Globe";
import { Layout } from "../components/Layout";
import { TitleTag } from "../components/TitleTag";

type TitleTags = { locale: string; title: string; tagline: string }[];
export type PolyCoords = [number, number][][];
type FeatProps = { [index: string]: string | number | null };
type FeatGeom =
  | { type: "Polygon"; coordinates: PolyCoords }
  | { type: "MultiPolygon"; coordinates: PolyCoords[] };
type GeoJson = {
  type: "FeatureCollection";
  name: string;
  crs: { type: "name"; properties: { name: string } };
  features: {
    type: "Feature";
    properties: FeatProps;
    bbox: [number, number, number, number];
    geometry: FeatGeom;
  }[];
  bbox: [number, number, number, number];
};
export interface MyGlobeProps {
  titleTags: TitleTags;
  feats: { properties: FeatProps; geometry: FeatGeom }[];
}

const MyGlobe: FC<MyGlobeProps> = ({ titleTags, feats }) => {
  return (
    <Layout isCover={false} align="flex-end">
      <TitleTag
        titleTags={titleTags}
        placement="bottom-end"
        textAlign="end"
        justifyContent="flex-end"
      />
      <Globe feats={feats} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "globe");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });

  const res = await fetch(
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
  );
  const geojson: GeoJson = await res.json();
  const feats = geojson.features.map(({ properties, geometry }) => ({
    properties,
    geometry,
  }));

  // const contents = [
  //   {
  //     iso: "en",
  //     imports: ["la", "fr", "el", "nl", "es", "it", "hi", "de", "ar"],
  //     family: "ine",
  //     form: "anal",
  //     wordOrder: "SVO",
  //   },
  //   {
  //     iso: "id",
  //     imports: ["nl", "ar", "sa", "pt", "en", "zh"],
  //     family: "map",
  //     form: "synt",
  //     wordOrder: "SVO",
  //   },
  //   {
  //     iso: "jp",
  //     imports: ["zh", "en", "pt", "nl", "de", "fr"],
  //     family: "jpx",
  //     form: "synt",
  //     wordOrder: "SOV",
  //   },
  // ];

  return {
    props: {
      titleTags,
      feats,
    },
  };
};

export default MyGlobe;

// const languages = [
//   {
//     iso: "en",
//     coords: { lat: 55.3781, lng: -3.436 },
//   },
//   {
//     iso: "id",
//     coords: { lat: -0.7893, lng: 113.9213 },
//   },
//   {
//     iso: "jp",
//     coords: { lat: 36.2048, lng: 138.2529 },
//   },
// ];
