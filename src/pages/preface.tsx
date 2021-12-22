import { Text } from "@chakra-ui/layout";
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
          {t("page")}
          {t("navbar:title")}
        </title>
      </Head>
      <Text w="full" textAlign="justify">
        &emsp;{t("preface")}
      </Text>
    </ContentWrap>
  );
};

export default PrefacePage;
