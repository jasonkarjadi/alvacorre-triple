import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Image from "next/image";
import { FC } from "react";
import ProfilePicture from "../../public/DSC_8106.jpg";
import { ContentWrap } from "../components/ContentWrap";

const CreatorPage: FC = () => {
  const { t } = useTranslation("creator");
  return (
    <ContentWrap>
      <Head>
        <title>
          {t("navbar:creator")}
          {t("navbar:|")}
          {t("navbar:title")}
        </title>
      </Head>
      <Heading fontSize="lg" mb={3}>
        {t("navbar:creator").toUpperCase()}
      </Heading>
      <Flex>
        <Box mr={3}>
          <Box w={32} h={32} overflow="hidden" border="solid tan">
            <Image src={ProfilePicture} alt="Picture of Author" />
          </Box>
          <Text textAlign="center">{"Jason Karjadi"}</Text>
        </Box>
        <Box>
          <Text w="full">{t("body")}</Text>
          <Text>jason@karjadi.com</Text>
        </Box>
      </Flex>
    </ContentWrap>
  );
};

export default CreatorPage;
