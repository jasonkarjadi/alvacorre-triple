import { Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { Localer } from "../components/Localer";

const CreatorPage: FC = () => {
  const { t } = useTranslation("creator");
  return (
    <>
      {/* <Image alt="my profile picture" /> */}
      <Localer ns="creator" placement="bottom" />
      <Text w="full" flex={1} textAlign="justify">
        {t("creator")}
      </Text>
    </>
  );
};

export default CreatorPage;
