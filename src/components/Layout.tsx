import { VStack, SystemProps } from "@chakra-ui/react";
import { FC } from "react";
import { NavBar } from "./NavBar";

interface LayoutProps {
  isCover?: boolean;
  align?: SystemProps["alignItems"];
}

export const Layout: FC<LayoutProps> = ({ children, isCover, align }) => {
  return (
    <VStack p={3} h="full" spacing={0}>
      <VStack
        spacing={6}
        flex={1}
        w="full"
        p={6}
        bg={isCover ? "gray.100" : "white"}
        align={align}
      >
        {children}
      </VStack>
      <NavBar />
    </VStack>
  );
};
