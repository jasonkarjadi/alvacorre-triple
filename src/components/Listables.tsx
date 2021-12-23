import { Button } from "@chakra-ui/button";
import { Grid, Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC, SetStateAction } from "react";

interface ListablesProps {
  setContent: (value: SetStateAction<string | undefined>) => void;
  ns: string[] | undefined;
  setPgdTblData: (value: SetStateAction<string[][][] | undefined>) => void;
  maxRows: number;
}

export const Listables: FC<ListablesProps> = ({
  setContent,
  ns,
  setPgdTblData,
  maxRows,
}) => {
  const { t } = useTranslation();
  return (
    <Grid
      h="full"
      gap={3}
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(5, 1fr)"
    >
      {ns?.map((x) => (
        <Button
          key={x}
          h="full"
          bg="tan"
          _hover={{ bg: "orange.100", textDecor: "underline" }}
          onClick={async () => {
            const tblData: string[][] = (await import(`../data/${x}`)).default;
            const pgdTblData: string[][][] = [];
            const maxPageNum = Math.ceil(tblData.length / maxRows);
            for (let i = 0; i < maxPageNum; i++) {
              const n = i * maxRows;
              pgdTblData.push(tblData.slice(n, n + maxRows));
            }
            setPgdTblData(pgdTblData);
            setContent(x);
          }}
        >
          <Text>{t(`${x}:title`)}</Text>
        </Button>
      ))}
    </Grid>
  );
};
