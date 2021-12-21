import { Box, BoxProps } from "@chakra-ui/layout";
import { FC } from "react";

export const ContentWrap: FC<BoxProps> = (props) => {
  return <Box h="full" w="full" p={3} bg="orange.100" {...props} />;
};
