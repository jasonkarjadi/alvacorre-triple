import { Button } from "@chakra-ui/button";
import { Link, Square } from "@chakra-ui/layout";
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
        <Button
          as={Link}
          {...props}
          bg="tan"
          _hover={{ border: "solid", textDecorationThickness: "2px" }}
          _active={{ bg: "transparent" }}
        />
      </NextLink>
    );
  };
  return (
    <Square
      as={isRoute ? Square : MergedLink}
      size={16}
      borderRadius="xl"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      fontSize="xx-small"
      fontWeight="bold"
    >
      {children}
    </Square>
  );
};
