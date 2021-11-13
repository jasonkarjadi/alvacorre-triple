import { Box, useBoolean } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Globe } from "../components/Globe";
import { PageLayout } from "../components/Layout";
import { Slide } from "../components/Slide";
import { TitleTag } from "../components/TitleTag";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import countries from "../data/ne_110m_admin_0_countries";
import { Ctrys, Pnts, Rels, TitleTags } from "../types";
import { genGeoms } from "../utils/genGeom";

interface MyGlobeProps {
  titleTags: TitleTags;
  countries: Ctrys;
  points: Pnts;
  relations: Rels;
}

const MyGlobe: FC<MyGlobeProps> = ({
  titleTags,
  countries,
  points,
  relations,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [isSlide, setIsSlide] = useBoolean(false);
  const worldMemo = useMemo(() => {
    return countries.map(({ properties, geometry }) => {
      const polys =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;
      const { meshGeoms, lineGeoms } = genGeoms(polys, 50, 1);
      const ctryMesh = new Mesh(
        meshGeoms[0] && mergeBufferGeometries(meshGeoms),
        new MeshBasicMaterial({ color: 0x171923 })
      );
      ctryMesh.name = properties.NAME;
      const ctryLine = new LineSegments(
        lineGeoms[0] && mergeBufferGeometries(lineGeoms),
        new LineBasicMaterial({ color: 0xf6ad55 })
      );
      const ctryGroup = new Group().add(ctryMesh, ctryLine);
      return ctryGroup;
    });
  }, [countries]);

  useEffect(() => {
    const setResize = () => {
      setRect(undefined);
      setRect(wrapRef.current?.getBoundingClientRect());
    };
    addEventListener("resize", setResize);
    setResize();
    return () => {
      removeEventListener("resize", setResize);
    };
  }, []);

  return (
    <PageLayout align="flex-end">
      <TitleTag
        titleTags={titleTags}
        placement="bottom-end"
        textAlign="end"
        justifyContent="flex-end"
      />
      <Box flex={1} w="full" ref={wrapRef} pos="relative">
        {rect && (
          <Globe rect={rect} ctrys={worldMemo} pnts={points} rels={relations} />
        )}
        <AnimatePresence>
          {isSlide && <Slide setBool={setIsSlide} />}
        </AnimatePresence>
      </Box>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "globe");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });
  // const res = await fetch(
  //   "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
  // );
  // const featColl = await res.json();
  return { props: { titleTags, countries, points, relations } };
};

export default MyGlobe;
