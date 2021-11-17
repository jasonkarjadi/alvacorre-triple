import { Box, VStack } from "@chakra-ui/layout";
import { FC } from "react";
import { NavBar } from "./NavBar";

export const AppLayout: FC = ({ children }) => {
  return (
    <Box h="full" p={3}>
      <VStack h="full" spacing={6} p={6} bg="orange.100">
        {children}
        <NavBar />
      </VStack>
    </Box>
  );
};
