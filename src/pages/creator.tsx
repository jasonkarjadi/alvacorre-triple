import { Image, Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { PageLayout } from "../components/Layout";
import { TitleTag } from "../components/TitleTag";
import { TitleTags } from "../types";

interface MyCreatorProps {
  titleTags: TitleTags;
}

const MyCreator: FC<MyCreatorProps> = ({ titleTags }) => {
  const { t } = useTranslation("creatorFill");
  return (
    <PageLayout>
      <Image alt="my profile picture" />
      <TitleTag
        titleTags={titleTags}
        placement="bottom"
        textAlign="center"
        justifyContent="center"
      />
      <Text w="full" flex={1}>
        {t("creator")}
      </Text>
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "creator");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });
  return { props: { titleTags } };
};

export default MyCreator;
