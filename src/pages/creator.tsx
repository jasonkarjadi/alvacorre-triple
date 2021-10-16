import { Image, Text, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { NavBar } from "../components/NavBar";
import { TitleTag } from "../components/TitleTag";

interface MyCreatorProps {
  titleTags: { locale: string; title: string; tagline: string }[];
}

const MyCreator: FC<MyCreatorProps> = ({ titleTags }) => {
  return (
    <VStack p={3} h="100vh" spacing={0}>
      <VStack spacing={8} flex={1} bg="gray.200" w="full" p={8}>
        <Image alt="my profile picture" />
        <TitleTag titleTags={titleTags} textAlign="center" />
        <Text w="full" flex={1}>
          Lorem Ipsum
        </Text>
      </VStack>
      <NavBar />
    </VStack>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: { locale: string; title: string; tagline: string }[] = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "creator");
    const title = t("title");
    const tagline = t("tagline");
    titleTags.push({ locale, title, tagline });
  });

  return {
    props: { titleTags },
  };
};

export default MyCreator;
