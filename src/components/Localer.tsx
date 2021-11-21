import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { UsePopperProps } from "@chakra-ui/popper";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { MenuAitems } from "./MenuAitem";
import { TitleTag } from "./TitleTag";
import { Box } from "@chakra-ui/layout";

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
        <Box as="span" pos="absolute" top="0" right="-5">
          {lang.toUpperCase()}
        </Box>
      </MenuButton>
      <MenuList userSelect="none">
        <MenuAitems lang={lang} ns={ns} />
      </MenuList>
    </Menu>
  );
};
