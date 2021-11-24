import { HStack } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { AsiaAikon, BookAikon, InfoAikon, UserAikon } from "./Aikon";
import { AikonLink } from "./AikonLink";

export const NavBar: FC = () => {
  const navItems: [string, FC][] = [
    ["home", BookAikon],
    ["preface", InfoAikon],
    ["globe", AsiaAikon],
    ["creator", UserAikon],
  ];
  const { t } = useTranslation("navbar");
  return (
    <HStack as="nav" spacing="0" w="full" bg="tan">
      {navItems.map(([string, Aikon], i) => (
        <AikonLink
          key={string}
          href={`/${i ? string : ""}`}
          leftIcon={<Aikon />}
        >
          {t(string)}
        </AikonLink>
      ))}
    </HStack>
  );
};
