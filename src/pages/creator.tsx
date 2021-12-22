import { Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { FC } from "react";
import { ContentWrap } from "../components/ContentWrap";

const CreatorPage: FC = () => {
  const { t } = useTranslation("creator");
  return (
    <ContentWrap>
      <Head>
        <title>
          {t("page")}
          {t("navbar:title")}
        </title>
      </Head>
      {/* <Image alt="my profile picture" /> */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "120px",
          background: "black",
        }}
      />
      <Text w="full" textAlign="justify">
        {t("creator")}
      </Text>
    </ContentWrap>
  );
};

export default CreatorPage;
