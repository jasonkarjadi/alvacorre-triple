import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import Trans from "next-translate/Trans";
import { FC, SetStateAction, useEffect } from "react";

interface ListableProps {
  content: string;
  pgdTblData: string[][][] | undefined;
  sliderVal: number;
  setSliderVal: (value: SetStateAction<number>) => void;
}

export const Listable: FC<ListableProps> = ({
  content,
  pgdTblData,
  sliderVal,
  setSliderVal,
}) => {
  useEffect(() => {
    return () => {
      setSliderVal(0);
    };
  }, [setSliderVal]);
  return (
    <Table size="sm" colorScheme="blackAlpha" style={{ tableLayout: "fixed" }}>
      <Thead>
        <Tr>
          <Trans
            i18nKey={`${content}:heading`}
            components={{
              Th: <Th color="gray.900" textAlign="center" px={0} />,
            }}
          />
        </Tr>
      </Thead>
      <Tbody>
        {pgdTblData &&
          pgdTblData[sliderVal].map((x, i) => (
            <Tr key={i}>
              {x.map((y, i) => (
                <Td key={i} px={3}>
                  {y}
                </Td>
              ))}
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};
