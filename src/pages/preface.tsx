import { Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { Layout } from "../components/Layout";
import { TitleTag } from "../components/TitleTag";

interface MyPrefaceProps {
  titleTags: { locale: string; title: string; tagline: string }[];
}

const MyPreface: FC<MyPrefaceProps> = ({ titleTags }) => {
  return (
    <Layout isCover={false} align="flex-start">
      <TitleTag
        titleTags={titleTags}
        placement="bottom-start"
        textAlign="start"
      />
      <Text flex={1} w="full">
        Lorem Ipsum
      </Text>
    </Layout>
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
