import { Box, useBoolean } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC, useEffect, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { PageLayout } from "../components/Layout";
import { Slide } from "../components/Slide";
import { TitleTag } from "../components/TitleTag";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import countries from "../data/ne_50m_admin_0_countries";
import { Ctrys, Pnts, Rels, TitleTags } from "../types";
import { useGlobe } from "../utils/useGlobe";

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
  const three = useGlobe(countries, points, relations);

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
        {rect && <Canvas rect={rect} three={three} />}
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
