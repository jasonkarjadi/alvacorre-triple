import { Table, Tbody, Td, Thead, Tr, Th } from "@chakra-ui/table";
import Trans from "next-translate/Trans";
import { FC, useEffect, useState } from "react";

interface ListableProps {
  content: string;
  pgdTblData: string[][][] | undefined;
  sliderVal: number;
}

export const Listable: FC<ListableProps> = ({
  content,
  pgdTblData,
  sliderVal,
}) => {
  return (
    <Table size="sm" colorScheme="blackAlpha" style={{ tableLayout: "fixed" }}>
      <Thead>
        <Tr>
          <Trans
            i18nKey={`${content}:heading`}
            components={{
              Th: <Th color="gray.900" textAlign="center" />,
            }}
          />
        </Tr>
      </Thead>
      <Tbody>
        {pgdTblData &&
          pgdTblData[sliderVal].map((x, i) => (
            <Tr key={i}>
              {x.map((y, i) => (
                <Td key={i}>{y}</Td>
              ))}
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};
