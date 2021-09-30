import { HStack } from "@chakra-ui/react";
import { FC } from "react";

interface HorizBarProps {
  isTop: boolean;
}

const HorizBar: FC<HorizBarProps> = ({ children, isTop }) => {
  return (
    <HStack
      w="full"
      h={14}
      spacing={3}
      px={3}
      pos="absolute"
      left={0}
      top={isTop ? 3 : undefined}
      bottom={!isTop ? 3 : undefined}
    >
      {children}
    </HStack>
  );
};

export default HorizBar;
