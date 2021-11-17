import { HStack } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { GlobeAikon, HomeAikon, InfoAikon, UserAikon } from "./Aikon";
import { AikonLink } from "./LinkBaten";

const navItems = [
  {
    string: "home",
    aikon: <HomeAikon />,
  },
  {
    string: "preface",
    aikon: <InfoAikon />,
  },
  {
    string: "globe",
    aikon: <GlobeAikon />,
  },
  {
    string: "creator",
    aikon: <UserAikon />,
  },
];

export const NavBar: FC = () => {
  const { t } = useTranslation("navbar");
  return (
    <HStack as="nav" spacing={3} w="full" justify="center">
      {navItems.map((x, i) => (
        <AikonLink key={x.string} href={`/${i ? x.string : ""}`}>
          {x.aikon}
          {t(x.string)}
        </AikonLink>
      ))}
    </HStack>
  );
};
