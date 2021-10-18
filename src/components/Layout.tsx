import { Box, SystemProps, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { NavBar } from "./NavBar";

interface LayoutProps {
  isCover?: boolean;
  align?: SystemProps["alignItems"];
}

export const Layout: FC<LayoutProps> = ({ children, isCover, align }) => {
  return (
    <Box h="full" p={3}>
      <VStack h="full" spacing={0} bg={isCover ? "gray.100" : "white"}>
        <VStack spacing={6} flex={1} w="full" p={6} align={align}>
          {children}
        </VStack>
        <NavBar />
      </VStack>
    </Box>
  );
};
