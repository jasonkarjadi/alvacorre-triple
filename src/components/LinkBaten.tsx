import { Box, Link } from "@chakra-ui/react";
import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

interface AikonLinkProps {
  href: LinkProps["href"];
}

export const AikonLink: FC<AikonLinkProps> = ({ children, href }) => {
  const { pathname } = useRouter();
  const isRoute = href === pathname;
  const MergedLink: FC = (props) => {
    return (
      <NextLink href={href}>
        <Link {...props} />
      </NextLink>
    );
  };
  return (
    <Box
      as={isRoute ? Box : MergedLink}
      w={16}
      h={16}
      borderRadius="xl"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      fontSize="x-small"
      fontWeight="bold"
      bg={isRoute ? "" : "gray.400"}
      children={children}
    />
  );
};
