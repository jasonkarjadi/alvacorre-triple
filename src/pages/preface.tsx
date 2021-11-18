import { Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { Localer } from "../components/Localer";

const PrefacePage: FC = () => {
  const { t } = useTranslation("prefaceFill");
  return (
    <>
      <Localer ns="preface" placement="bottom" />
      <Text flex={1} w="full">
        {t("prefaceA")}
      </Text>
    </>
  );
};

export default PrefacePage;
