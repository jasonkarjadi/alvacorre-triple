import { HStack } from "@chakra-ui/react";

interface HorizBarProps {
  top?: string | number;
  bottom?: string | number;
}

const HorizBar: React.FC<HorizBarProps> = ({ children, top, bottom }) => {
  return (
    <HStack
      w="full"
      h={14}
      spacing={3}
      px={3}
      pos="absolute"
      left={0}
      top={top}
      bottom={bottom}
    >
      {children}
    </HStack>
  );
};

export default HorizBar;
