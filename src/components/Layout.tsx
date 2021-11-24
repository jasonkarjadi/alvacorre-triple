import { Box, VStack } from "@chakra-ui/layout";
import { FC } from "react";
import { NavBar } from "./NavBar";

export const AppLayout: FC = ({ children }) => {
  return (
    <Box h="full" p={3}>
      <VStack h="full" spacing="0" bg="orange.100">
        <VStack h="full" w="full" spacing={6} p={6}>
          {children}
        </VStack>
        <NavBar />
      </VStack>
    </Box>
  );
};
