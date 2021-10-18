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

interface TitleTagProps {
  titleTags: { locale: string; title: string; tagline: string }[];
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
  const filtered = titleTags.filter(
    (titleTag) => titleTag.locale === locale
  )[0];

  return (
    <Menu placement={placement} isLazy={true}>
      <MenuButton textAlign={textAlign}>
        <Heading as="h1" fontSize="3xl">
          {filtered.title}
        </Heading>
        <Text>{filtered.tagline}</Text>
      </MenuButton>
      <MenuList userSelect="none">
        {titleTags
          .filter((titleTag) => titleTag.locale !== locale)
          .map((titleTag) => (
            <MenuItem
              key={titleTag.locale}
              justifyContent={justifyContent}
              onClick={async () => await setLanguage(`${titleTag.locale}`)}
            >
              <Box textAlign={textAlign}>
                <Heading as="h1" fontSize="2xl">
                  {titleTag.title}
                </Heading>
                <Text fontSize="x-small">{titleTag.tagline}</Text>
              </Box>
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
};
