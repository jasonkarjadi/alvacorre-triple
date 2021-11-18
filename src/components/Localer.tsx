import { Menu, MenuButton, MenuList } from "@chakra-ui/menu";
import { UsePopperProps } from "@chakra-ui/popper";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import { MenuAitems } from "./MenuAitem";
import { TitleTag } from "./TitleTag";

interface LocalerProps {
  ns: string;
  placement?: UsePopperProps["placement"];
}

export const Localer: FC<LocalerProps> = ({ ns, placement }) => {
  const { t, lang } = useTranslation(ns);
  return (
    <Menu placement={placement} isLazy={true}>
      <MenuButton textAlign="center">
        <TitleTag title={t("title")} tagline={t("tagline")} main={true} />
      </MenuButton>
      <MenuList userSelect="none">
        <MenuAitems lang={lang} ns={ns} />
      </MenuList>
    </Menu>
  );
};
