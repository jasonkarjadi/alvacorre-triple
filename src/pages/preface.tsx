import { Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { Layout } from "../components/Layout";
import { TitleTag } from "../components/TitleTag";
import { TitleTags } from "../types";

interface MyPrefaceProps {
  titleTags: TitleTags;
}

const MyPreface: FC<MyPrefaceProps> = ({ titleTags }) => {
  const { t } = useTranslation("prefaceFill");
  return (
    <Layout align="flex-start">
      <TitleTag
        titleTags={titleTags}
        placement="bottom-start"
        textAlign="start"
      />
      <Text flex={1} w="full">
        {t("preface")}
      </Text>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "preface");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });

  return {
    props: { titleTags },
  };
};

export default MyPreface;
