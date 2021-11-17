import { Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import getT from "next-translate/getT";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { TitleTag } from "../components/TitleTag";
import { TitleTags } from "../types";

interface MyPrefaceProps {
  titleTags: TitleTags;
}

const MyPreface: FC<MyPrefaceProps> = ({ titleTags }) => {
  const { t } = useTranslation("prefaceFill");
  return (
    <>
      <TitleTag titleTags={titleTags} placement="bottom-start" />
      <Text flex={1} w="full">
        {t("prefaceA")}
      </Text>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locales }) => {
  const titleTags: TitleTags = [];
  locales?.map(async (locale) => {
    const t = await getT(locale, "preface");
    titleTags.push({ locale, title: t("title"), tagline: t("tagline") });
  });
  return { props: { titleTags } };
};

export default MyPreface;
