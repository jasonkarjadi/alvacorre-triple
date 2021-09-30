import { HStack } from "@chakra-ui/react";
import { FC } from "react";

interface HrzBarProps {
  isTop: boolean;
}

const HrzBar: FC<HrzBarProps> = ({ children, isTop }) => {
  return (
    <HStack
      w="full"
      spacing={3}
      px={3}
      pos="absolute"
      left={0}
      top={isTop ? 3 : undefined}
      bottom={!isTop ? 3 : undefined}
      align="end"
    >
      {children}
    </HStack>
  );
};

export default HrzBar;
