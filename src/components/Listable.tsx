import { Table, Tbody, Td, Thead, Tr, Th } from "@chakra-ui/table";
import Trans from "next-translate/Trans";
import { FC } from "react";

interface ListableProps {
  content: string;
  tableData: string[][] | undefined;
}

export const Listable: FC<ListableProps> = ({ content, tableData }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Trans i18nKey={`${content}:heading`} components={{ Th: <Th /> }} />
        </Tr>
      </Thead>
      <Tbody>
        {tableData?.map((x) => (
          <Tr key={x.toString()}>
            {x.map((y) => (
              <Td key={y}>{y}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
