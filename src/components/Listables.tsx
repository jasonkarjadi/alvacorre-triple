import { Button } from "@chakra-ui/button";
import { Grid } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC, SetStateAction, useState } from "react";

interface ListablesProps {
  stringArr: string[] | undefined;
  setPgdTblData: (value: SetStateAction<string[][][] | undefined>) => void;
  setContent: (value: SetStateAction<string | undefined>) => void;
}

export const Listables: FC<ListablesProps> = ({
  stringArr,
  setPgdTblData,
  setContent,
}) => {
  const [maxRows, setMaxRows] = useState(Math.floor((innerHeight - 200) / 33));
  const { t } = useTranslation();

  return (
    <Grid
      h="full"
      gap={3}
      templateColumns="repeat(2, 1fr)"
      templateRows="repeat(5, 1fr)"
    >
      {stringArr?.map((x) => (
        <Button
          key={x}
          h="full"
          whiteSpace="normal"
          bg="tan"
          _hover={{
            textDecor: "underline 2px",
            border: "solid",
          }}
          onClick={async () => {
            const tblData: string[][] = (await import(`../data/${x}`)).default;
            const pagedTableData: string[][][] = [];
            const maxPageNum = Math.ceil(tblData.length / maxRows);
            for (let i = 0; i < maxPageNum; i++) {
              const n = i * maxRows;
              pagedTableData.push(tblData.slice(n, n + maxRows));
            }
            setPgdTblData(pagedTableData);
            setContent(x);
          }}
        >
          {t(`${x}:title`)}
        </Button>
      ))}
    </Grid>
  );
};
