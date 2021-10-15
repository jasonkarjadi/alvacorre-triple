import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import setLanguage from "next-translate/setLanguage";
import { useRouter } from "next/router";
import { FC } from "react";

interface TitleTagProps {
  titleTags: { locale: string; title: string; tagline: string }[];
  placement?: any;
  textAlign?: any;
}

export const TitleTag: FC<TitleTagProps> = ({
  titleTags,
  placement,
  textAlign,
}) => {
  const { locale } = useRouter();
  const filtered = titleTags.filter(
    (titleTag) => titleTag.locale === locale
  )[0];

  return (
    <Menu placement={placement} isLazy={true}>
      <MenuButton>
        <Box textAlign={textAlign}>
          <Heading as="h1" fontSize="4xl">
            {filtered.title}
          </Heading>
          <Heading fontSize="md" fontWeight="normal">
            {filtered.tagline}
          </Heading>
        </Box>
      </MenuButton>
      <MenuList>
        {titleTags
          .filter((titleTag) => titleTag.locale !== locale)
          .map((titleTag) => (
            <MenuItem
              key={titleTag.locale}
              justifyContent={textAlign}
              onClick={async () => await setLanguage(`${titleTag.locale}`)}
            >
              <Box textAlign={textAlign}>
                <Heading as="h1" fontSize="2xl">
                  {titleTag.title}
                </Heading>
                <Heading fontSize="x-small" fontWeight="normal">
                  {titleTag.tagline}
                </Heading>
              </Box>
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
};
