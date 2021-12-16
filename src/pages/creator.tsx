import { Box, Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

const CreatorPage: FC = () => {
  const { t } = useTranslation("creator");
  return (
    <Box flex={1} w="full">
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
    </Box>
  );
};

export default CreatorPage;
