import { Heading, Text } from "@chakra-ui/layout";
import { FC } from "react";

interface TitleTagProps {
  title: string;
  tagline: string;
}

export const TitleTag: FC<TitleTagProps> = ({ title, tagline }) => {
  return (
    <>
      <Heading as="h1" fontSize="xl">
        {title.toUpperCase()}
      </Heading>
      <Text fontSize="x-small" fontWeight="bold" lineHeight="none">
        {tagline.toUpperCase()}
      </Text>
    </>
  );
};
