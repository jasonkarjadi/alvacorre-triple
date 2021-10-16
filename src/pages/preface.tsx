import { Box, Text, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { NavBar } from "../components/NavBar";
import { TitleTag } from "../components/TitleTag";

interface MyPrefaceProps {
  titleTags: { locale: string; title: string; tagline: string }[];
}

const MyPreface: FC<MyPrefaceProps> = ({ titleTags }) => {
  return (
    <Box py={3} paddingLeft={3} h="100vh">
      <VStack spacing={0} h="full" py={3} paddingLeft={3} bg="gray.200">
        <VStack spacing={8} flex={1} bg="white" w="full" p={8} align="start">
          <TitleTag titleTags={titleTags} textAlign="start" />
          <Text flex={1} w="full">
            Lorem Ipsum
          </Text>
        </VStack>
        <NavBar />
      </VStack>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: { locale: string; title: string; tagline: string }[] = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "preface");
    const title = t("title");
    const tagline = t("tagline");
    titleTags.push({ locale, title, tagline });
  });

  return {
    props: { titleTags },
  };
};

export default MyPreface;
