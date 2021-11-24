import { Button, ButtonProps } from "@chakra-ui/button";
import { Box, Link } from "@chakra-ui/layout";
import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { FC, forwardRef } from "react";

interface AikonLinkProps {
  href: LinkProps["href"];
  leftIcon?: JSX.Element;
}

export const AikonLink: FC<AikonLinkProps> = ({ children, href, leftIcon }) => {
  const { pathname } = useRouter();
  const isRoute = href === pathname;
  const MergedLink = forwardRef<any, any>((props, ref) => {
    return (
      <NextLink href={href}>
        <Button as={Link} {...props} ref={ref} />
      </NextLink>
    );
  });
  MergedLink.displayName = "MergedLink";
  const BaseFormat: FC<ButtonProps> = (props) => {
    return (
      <Button
        {...props}
        leftIcon={leftIcon}
        h={9}
        flex={1}
        px="0"
        borderTopRadius="none"
        borderBottomRadius="xl"
        fontSize="x-small"
        iconSpacing={1}
      >
        {children}
      </Button>
    );
  };
  if (isRoute) {
    return <BaseFormat as={Box} bg="orange.100" _hover={{}} _active={{}} />;
  } else {
    return (
      <BaseFormat
        as={MergedLink}
        bg="transparent"
        _hover={{ bg: "orange.100", textDecorationThickness: "1px" }}
      />
    );
  }
};
