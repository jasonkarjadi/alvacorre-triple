import { Box } from "@chakra-ui/layout";
import { FC } from "react";

interface InfoTextProps {
  tuple: [string, string | number];
}

export const InfoText: FC<InfoTextProps> = ({ tuple }) => {
  if (typeof tuple[1] === "string") {
    return <Box>A</Box>;
  } else if (tuple[1] === 1) {
    return <Box>B</Box>;
  } else {
    return <Box>C</Box>;
  }
};
