import { Box, SystemProps, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { NavBar } from "./NavBar";

interface PageLayoutProps {
  align?: SystemProps["alignItems"];
}

export const AppLayout: FC = ({ children }) => {
  return (
    <Box h="full" p={3}>
      <VStack h="full" spacing={0} bg="gray.900">
        {children}
        <NavBar />
      </VStack>
    </Box>
  );
};

export const PageLayout: FC<PageLayoutProps> = ({ children, align }) => {
  return (
    <VStack spacing={6} flex={1} w="full" p={6} align={align}>
      {children}
    </VStack>
  );
};
