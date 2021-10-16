import { Image, VStack } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { NavBar } from "../components/NavBar";
import { TitleTag } from "../components/TitleTag";

interface MyIndexProps {
  titleTags: { locale: string; title: string; tagline: string }[];
}

const MyIndex: FC<MyIndexProps> = ({ titleTags }) => {
  return (
    <VStack p={3} h="100vh" spacing={0}>
      <VStack spacing={8} flex={1} bg="gray.200" w="full" p={8}>
        <Image flex={1} alt="main visual" />
        <TitleTag titleTags={titleTags} placement="top" textAlign="center" />
      </VStack>
      <NavBar />
    </VStack>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: { locale: string; title: string; tagline: string }[] = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "home");
    const title = t("title");
    const tagline = t("tagline");
    titleTags.push({ locale, title, tagline });
  });

  return {
    props: { titleTags },
  };
};

export default MyIndex;

// add UI indicating dots are clickable
// add highlight on clicked dot
// add curved lines indicating correlations feature
// solidify content for each language
// add common.json for each locale
// fix camera zoom or globe size
