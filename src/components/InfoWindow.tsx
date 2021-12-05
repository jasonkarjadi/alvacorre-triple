import { Button } from "@chakra-ui/button";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
import Trans from "next-translate/Trans";
import { FC } from "react";

interface InfoWindowProps {
  ns: string;
  pageNum: number;
}

export const InfoWindow: FC<InfoWindowProps> = ({ ns, pageNum }) => {
  if (true) {
    return (
      <Box pos="absolute" top="0" left="0" h="full" w="full" bg="orange.100">
        <DynamicNamespaces namespaces={[ns]} fallback="Loading...">
          <Trans
            i18nKey={`${ns}:${pageNum}`}
            components={{
              Heading: <Heading />,
              Text: <Text />,
              Table: <Table />,
              Thead: <Thead />,
              Tbody: <Tbody />,
              Tr: <Tr />,
              Th: <Th />,
              Td: <Td />,
            }}
          />
        </DynamicNamespaces>
      </Box>
    );
  } else {
    return (
      <SimpleGrid columns={2} rows={5} spacing={3} w="full" flex={1}>
        {[].map((x, i) => (
          <Button key={i} onClick={() => {}}>
            {x}
          </Button>
        ))}
      </SimpleGrid>
    );
  }
};
