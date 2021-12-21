import { Button } from "@chakra-ui/button";
import { Grid } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC, SetStateAction } from "react";

interface ListablesProps {
  setContent: (value: SetStateAction<string | undefined>) => void;
  ns: string[] | undefined;
  setTableData: (value: SetStateAction<string[][] | undefined>) => void;
}

export const Listables: FC<ListablesProps> = ({
  setContent,
  ns,
  setTableData,
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
          onClick={async () => {
            setTableData((await import(`../data/${x}`)).default);
            setContent(x);
          }}
        >
          {t(`${x}:title`)}
        </Button>
      ))}
    </Grid>
  );
};
