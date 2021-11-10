import { Box, useBoolean } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC, useRef } from "react";
import { Globe } from "../components/Globe";
import { Layout } from "../components/Layout";
import { Slide } from "../components/Slide";
import { TitleTag } from "../components/TitleTag";
import { TitleTags } from "../types";

interface MyGlobeProps {
  titleTags: TitleTags;
}

const MyGlobe: FC<MyGlobeProps> = ({ titleTags }) => {
  const [isSlide, setIsSlide] = useBoolean(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  return (
    <Layout align="flex-end">
      <TitleTag
        titleTags={titleTags}
        placement="bottom-end"
        textAlign="end"
        justifyContent="flex-end"
      />
      <Box flex={1} w="full" ref={wrapRef} pos="relative">
        <Globe wrapRef={wrapRef} setBool={setIsSlide} />
        <AnimatePresence>
          {isSlide && <Slide setBool={setIsSlide} />}
        </AnimatePresence>
      </Box>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "globe");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });
  return { props: { titleTags } };
};

export default MyGlobe;

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
