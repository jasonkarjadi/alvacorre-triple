import { Box, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { Globe } from "../components/Globe";
import { NavBar } from "../components/NavBar";
import { TitleTag } from "../components/TitleTag";

interface MyGlobeProps {
  titleTags: { locale: string; title: string; tagline: string }[];
  clickables: {
    iso: string;
    coords: { x: number; y: number; z: number };
  }[];
}

const MyGlobe: FC<MyGlobeProps> = ({ titleTags, clickables }) => {
  return (
    <Box py={3} paddingRight={3} h="100vh">
      <VStack py={3} paddingRight={3} spacing={0} h="full" bg="gray.200">
        <VStack spacing={8} flex={1} w="full" p={8} align="end" bg="white">
          <TitleTag titleTags={titleTags} textAlign="end" />
          <Globe clickables={clickables} />
        </VStack>
        <NavBar />
      </VStack>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: { locale: string; title: string; tagline: string }[] = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "globe");
    const title = t("title");
    const tagline = t("tagline");
    titleTags.push({ locale, title, tagline });
  });

  const clickables = [
    {
      iso: "id",
      coords: {
        x: 0.9140165430070886,
        y: -0.013775448070460912,
        z: -0.4054429628687974,
      },
    },
    {
      iso: "jp",
      coords: {
        x: 0.5372766576225415,
        y: 0.5906732692963204,
        z: -0.6020289711573246,
      },
    },
    {
      iso: "en",
      coords: {
        x: -0.034051759463686306,
        y: 0.822919263139182,
        z: 0.5671369887706965,
      },
    },
  ];

  return {
    props: {
      titleTags,
      clickables,
    },
  };
};

export default MyGlobe;

// const content = [
//   {
//     langName: "en",
//     family: "ine",
//     type: {
//       form: "analyt",
//       wordOrder: "SVO",
//     },
//   },
//   {
//     langName: "jp",
//     family: "jpx",
//     type: {
//       form: "synthe",
//       wordOrder: "SOV",
//     },
//   },
//   {
//     langName: "id",
//     family: "map",
//     type: {
//       form: "synthe",
//       wordOrder: "SVO",
//     },
//   },
// ];

// English => Latin, French, Greek, Dutch, Spanish, Italian, Indian, German, Arabic
// Japanese => Chinese
// Indonesian => Dutch, Arabic, Sanskrit, Hokkien, Portuguese, English