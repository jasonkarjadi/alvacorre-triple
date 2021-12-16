import { HStack, VStack } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { AsiaAikon, BookAikon, InfoAikon, UserAikon } from "./Aikon";
import { AikonLink } from "./AikonLink";
import { Localer } from "./Localer";

export const AppLayout: FC = ({ children }) => {
  const { t } = useTranslation("navbar");
  return (
    <VStack h="full" justifyContent="space-between" spacing={0}>
      {children}
      <VStack w="full" spacing={1} pb={3} bg="tan">
        <HStack as="nav" spacing="0" w="full">
          <AikonLink href="/" leftIcon={<BookAikon />}>
            {t("home").toUpperCase()}
          </AikonLink>
          <AikonLink href="/preface" leftIcon={<InfoAikon />}>
            {t("preface").toUpperCase()}
          </AikonLink>
          <AikonLink href="/globe" leftIcon={<AsiaAikon />}>
            {t("globe").toUpperCase()}
          </AikonLink>
          <AikonLink href="/creator" leftIcon={<UserAikon />}>
            {t("creator").toUpperCase()}
          </AikonLink>
        </HStack>
        <Localer />
      </VStack>
    </VStack>
  );
};
