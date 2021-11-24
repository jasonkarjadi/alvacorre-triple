import { Box } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { UsePopperProps } from "@chakra-ui/popper";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { LocalerAitems } from "./LocalerAitem";
import { TitleTag } from "./TitleTag";

interface LocalerProps {
  ns: string;
  placement?: UsePopperProps["placement"];
}

export const Localer: FC<LocalerProps> = ({ ns, placement }) => {
  const { t, lang } = useTranslation(ns);
  return (
    <Menu placement={placement} isLazy>
      <MenuButton textAlign="center" pos="relative">
        <TitleTag title={t("title")} tagline={t("tagline")} main={true} />
        <Box as="span" fontSize="small" pos="absolute" top="1" right="-5">
          {lang.toUpperCase()}
        </Box>
      </MenuButton>
      <MenuList userSelect="none">
        <LocalerAitems lang={lang} ns={ns} />
      </MenuList>
    </Menu>
  );
};
