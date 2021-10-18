import { HStack } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { GlobeAikon, HomeAikon, InfoAikon, UserAikon } from "./Aikon";
import { AikonLink } from "./LinkBaten";

export const NavBar: FC = () => {
  const { t } = useTranslation("navbar");
  return (
    <HStack as="nav" spacing={3} w="full" justify="center" bg="gray.300" py={6}>
      <AikonLink href="/">
        <HomeAikon />
        {t("home")}
      </AikonLink>
      <AikonLink href="/preface">
        <InfoAikon />
        {t("preface")}
      </AikonLink>
      <AikonLink href="/globe">
        <GlobeAikon />
        {t("globe")}
      </AikonLink>
      <AikonLink href="/creator">
        <UserAikon />
        {t("creator")}
      </AikonLink>
    </HStack>
  );
};
