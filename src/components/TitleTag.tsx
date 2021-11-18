import { Heading, Text } from "@chakra-ui/layout";
import { FC } from "react";

interface TitleTagProps {
  title: string;
  tagline: string;
  main: boolean;
}

export const TitleTag: FC<TitleTagProps> = ({ title, tagline, main }) => {
  return (
    <>
      <Heading as="h1" fontSize={main ? "3xl" : "2xl"}>
        {title}
      </Heading>
      <Text fontSize={main ? "" : "x-small"}>{tagline}</Text>
    </>
  );
};
