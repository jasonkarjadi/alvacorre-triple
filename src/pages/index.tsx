import { Image } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import { FC } from "react";
import { PageLayout } from "../components/Layout";
import { TitleTag } from "../components/TitleTag";
import { TitleTags } from "../types";

interface MyIndexProps {
  titleTags: TitleTags;
}

const MyIndex: FC<MyIndexProps> = ({ titleTags }) => {
  return (
    <PageLayout>
      <Image flex={1} alt="main visual" />
      <TitleTag
        titleTags={titleTags}
        placement="top"
        textAlign="center"
        justifyContent="center"
      />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "home");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });
  return { props: { titleTags } };
};

export default MyIndex;
