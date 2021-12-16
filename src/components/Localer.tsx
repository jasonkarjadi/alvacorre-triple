import { Box } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { LocalerAitems } from "./LocalerAitem";
import { TitleTag } from "./TitleTag";

export const Localer: FC = () => {
  const { t, lang } = useTranslation("navbar");
  return (
    <Menu placement="top" isLazy>
      <MenuButton textAlign="center" pos="relative">
        <TitleTag title={t("title")} tagline={t("tagline")} />
        <Box as="span" fontSize="x-small" pos="absolute" top="0" right="-4">
          {lang.toUpperCase()}
        </Box>
      </MenuButton>
      <MenuList userSelect="none">
        <LocalerAitems lang={lang} ns="navbar" />
      </MenuList>
    </Menu>
  );
};
