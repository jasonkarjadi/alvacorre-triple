import { Box, HStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface TopBarProps {
  itemState1: {
    item1: string | null;
    setItem1: Dispatch<SetStateAction<string | null>>;
  };
  itemState2: {
    item2: string | null;
    setItem2: Dispatch<SetStateAction<string | null>>;
  };
}

const TopBar: React.FC<TopBarProps> = ({
  itemState1: { item1, setItem1 },
  itemState2: { item2, setItem2 },
}) => {
  return (
    <HStack
      w="full"
      spacing="12px"
      px="12px"
      pos="absolute"
      top="12px"
      left="0"
    >
      {!item1 ? (
        <Box h="98px" border="gray dashed 1px" flex={1}></Box>
      ) : (
        <Box h="98px" bg="gray" flex={1}></Box>
      )}
      {!item2 ? (
        <Box h="98px" border="gray dashed 1px" flex={1}></Box>
      ) : (
        <Box h="98px" bg="gray" flex={1}></Box>
      )}
    </HStack>
  );
};

export default TopBar;
