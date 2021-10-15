import { Link } from "@chakra-ui/react";
import NextLink, { LinkProps } from "next/link";
import { FC } from "react";

interface AikonLinkProps {
  href: LinkProps["href"];
}

export const AikonLink: FC<AikonLinkProps> = ({ children, href }) => {
  return (
    <NextLink href={href}>
      <Link
        bg="gray.600"
        w={16}
        h={16}
        borderRadius="xl"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        fontSize="x-small"
        fontWeight="bold"
      >
        {children}
      </Link>
    </NextLink>
  );
};
