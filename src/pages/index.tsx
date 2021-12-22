import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { FC } from "react";
import { ContentWrap } from "../components/ContentWrap";

const IndexPage: FC = () => {
  const { t } = useTranslation("home");
  return (
    <ContentWrap>
      <Head>
        <title>{t("navbar:title")}</title>
      </Head>
      {/* <Image flex={1} alt="main visual" /> */}
    </ContentWrap>
  );
};

export default IndexPage;
