import { Box, Heading, Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { UsePopperProps } from "@chakra-ui/popper";
import setLanguage from "next-translate/setLanguage";
import { useRouter } from "next/router";
import { FC } from "react";
import { TitleTags } from "../types";

interface TitleTagProps {
  titleTags: TitleTags;
  placement?: UsePopperProps["placement"];
}

export const TitleTag: FC<TitleTagProps> = ({ titleTags, placement }) => {
  const { locale } = useRouter();
  const curr = titleTags.filter((tT) => tT.locale === locale)[0];
  const notCurrs = titleTags.filter((tT) => tT.locale !== locale);
  return (
    <Menu placement={placement} isLazy={true}>
      <MenuButton textAlign="center">
        <Heading as="h1" fontSize="3xl">
          {curr.title}
        </Heading>
        <Text>{curr.tagline}</Text>
      </MenuButton>
      <MenuList userSelect="none">
        {notCurrs.map((tT) => (
          <MenuItem
            key={tT.locale}
            justifyContent="center"
            onClick={async () => await setLanguage(`${tT.locale}`)}
          >
            <Box textAlign="center">
              <Heading as="h1" fontSize="2xl">
                {tT.title}
              </Heading>
              <Text fontSize="x-small">{tT.tagline}</Text>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
