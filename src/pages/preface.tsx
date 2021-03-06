import { Text, Heading } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { FC } from "react";
import { ContentWrap } from "../components/ContentWrap";

const PrefacePage: FC = () => {
  const { t } = useTranslation("preface");
  return (
    <ContentWrap>
      <Head>
        <title>
          {t("navbar:preface")}
          {t("navbar:|")}
          {t("navbar:title")}
        </title>
      </Head>
      <Heading fontSize="lg" mb={3}>
        {t("navbar:preface").toUpperCase()}
      </Heading>
      <Text w="full">{t("body")}</Text>
    </ContentWrap>
  );
};

export default PrefacePage;
