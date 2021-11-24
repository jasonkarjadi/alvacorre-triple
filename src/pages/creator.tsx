import { Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { Localer } from "../components/Localer";

const CreatorPage: FC = () => {
  const { t } = useTranslation("creator");
  return (
    <>
      {/* <Image alt="my profile picture" /> */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "120px",
          background: "black",
        }}
      />
      <Localer ns="creator" placement="bottom" />
      <Text w="full" textAlign="justify">
        {t("creator")}
      </Text>
    </>
  );
};

export default CreatorPage;
