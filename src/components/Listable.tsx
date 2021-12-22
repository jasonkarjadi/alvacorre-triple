import { Table, Tbody, Td, Thead, Tr, Th } from "@chakra-ui/table";
import Trans from "next-translate/Trans";
import { FC } from "react";

interface ListableProps {
  content: string;
  tableData: string[][] | undefined;
}

export const Listable: FC<ListableProps> = ({ content, tableData }) => {
  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Trans
            i18nKey={`${content}:heading`}
            components={{ Th: <Th color="gray.900" /> }}
          />
        </Tr>
      </Thead>
      <Tbody>
        {tableData?.map((x, i) => (
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
