import { Image, Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { Layout } from "../components/Layout";
import { TitleTag } from "../components/TitleTag";

interface MyCreatorProps {
  titleTags: { locale: string; title: string; tagline: string }[];
}

const MyCreator: FC<MyCreatorProps> = ({ titleTags }) => {
  return (
    <Layout isCover={true}>
      <Image alt="my profile picture" />
      <TitleTag
        titleTags={titleTags}
        placement="bottom"
        textAlign="center"
        justifyContent="center"
      />
      <Text w="full" flex={1}>
        Lorem Ipsum
      </Text>
    </Layout>
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
