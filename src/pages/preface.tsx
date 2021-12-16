import { Box, Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

const PrefacePage: FC = () => {
  const { t } = useTranslation("preface");
  return (
    <Box flex={1} w="full">
      <Text w="full" textAlign="justify">
        &emsp;{t("preface")}
      </Text>
    </Box>
  );
};

export default PrefacePage;
