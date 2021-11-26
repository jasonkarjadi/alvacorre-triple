import { Button, ButtonGroup, IconButton } from "@chakra-ui/button";
import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
import Trans from "next-translate/Trans";
import { FC, useState } from "react";
import { LeftAikon, RightAikon } from "./Aikon";

interface InfoWindowProps {
  curr: string;
  pair: string | number;
}

export const InfoWindow: FC<InfoWindowProps> = ({ curr, pair }) => {
  const [pageNum, setPageNum] = useState(1);
  const [pageGrp, setPageGrp] = useState(1);

  return (
    <VStack
      pos="absolute"
      top="0"
      left="0"
      h="full"
      w="full"
      spacing={6}
      bg="orange.100"
    >
      {pair !== 2 ? (
        <Box w="full" flex={1}>
          <DynamicNamespaces
            namespaces={pair === 1 ? ["characteristics"] : ["relations"]}
            fallback="Loading..."
          >
            <Trans
              i18nKey={`${
                pair === 1 ? "characteristics" : "relations"
              }:${curr} ${pair}.${pageNum}`}
              components={{
                Heading: <Heading key={pageNum} />,
                Text: <Text key={pageNum} />,
                Table: <Table key={pageNum} />,
                Thead: <Thead key={pageNum} />,
                Tbody: <Tbody key={pageNum} />,
                Tr: <Tr key={pageNum} />,
                Th: <Th key={pageNum} />,
                Td: <Td key={pageNum} />,
              }}
              fallback={`${
                pair === 1 ? "characteristics" : "relations"
              }:${pair} ${curr}.${pageNum}`}
            />
          </DynamicNamespaces>
        </Box>
      ) : (
        <SimpleGrid columns={2} rows={5} spacing={3} w="full" flex={1}>
          {[].map((x, i) => (
            <Button key={i} onClick={() => {}}>
              {x}
            </Button>
          ))}
        </SimpleGrid>
      )}
      <HStack spacing="0" h={9} w="full">
        <IconButton
          aria-label="To Previous Page"
          icon={<LeftAikon />}
          flex={1 / 9}
          bg="gray.900"
          color="tan"
          borderRadius="none"
          onClick={() => {
            if (pageGrp > 1) setPageGrp(pageGrp - 1);
          }}
        />
        <ButtonGroup flex={7 / 9} spacing="0">
          {[1, 2, 3, 4, 5, 6, 7].map((_, i) => {
            return (
              <Button
                key={i + 1}
                bg="tan"
                flex={1}
                borderRadius="none"
                _hover={{ bg: "orange.100" }}
                onClick={() => setPageNum(i + 1)}
              >
                {i + 1}
              </Button>
            );
          })}
        </ButtonGroup>
        <IconButton
          aria-label="To Next Page"
          icon={<RightAikon />}
          flex={1 / 9}
          bg="gray.900"
          color="tan"
          borderRadius="none"
          onClick={() => {}}
        />
      </HStack>
    </VStack>
  );
};
