import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SystemProps,
  Text,
  UsePopperProps,
} from "@chakra-ui/react";
import setLanguage from "next-translate/setLanguage";
import { useRouter } from "next/router";
import { FC } from "react";
import { TitleTags } from "../types";

interface TitleTagProps {
  titleTags: TitleTags;
  placement?: UsePopperProps["placement"];
  textAlign?: SystemProps["textAlign"];
  justifyContent?: SystemProps["justifyContent"];
}

export const TitleTag: FC<TitleTagProps> = ({
  titleTags,
  placement,
  textAlign,
  justifyContent,
}) => {
  const { locale } = useRouter();
  const curr = titleTags.filter((tT) => tT.locale === locale)[0];
  return (
    <Menu placement={placement} isLazy={true}>
      <MenuButton textAlign={textAlign}>
        <Heading as="h1" fontSize="3xl">
          {curr.title}
        </Heading>
        <Text>{curr.tagline}</Text>
      </MenuButton>
      <MenuList userSelect="none">
        {titleTags
          .filter((tT) => tT.locale !== locale)
          .map((tT) => (
            <MenuItem
              key={tT.locale}
              justifyContent={justifyContent}
              onClick={async () => await setLanguage(`${tT.locale}`)}
            >
              <Box textAlign={textAlign}>
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
