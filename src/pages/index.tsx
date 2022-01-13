import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { FC } from "react";
import { ContentWrap } from "../components/ContentWrap";

const IndexPage: FC = () => {
  const { t } = useTranslation("home");
  return (
    <ContentWrap bg="no-repeat url('/WillowVisual.jpg')" bgSize="cover">
      <Head>
        <title>{t("navbar:title")}</title>
      </Head>
    </ContentWrap>
  );
};

export default IndexPage;
