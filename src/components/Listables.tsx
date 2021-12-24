import { Button } from "@chakra-ui/button";
import { Grid } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";

interface ListablesProps {
  stringArr: string[] | undefined;
  onClick: (value: string) => void;
}

export const Listables: FC<ListablesProps> = ({ stringArr, onClick }) => {
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
          onClick={() => onClick(x)}
        >
          {t(`${x}:title`)}
        </Button>
      ))}
    </Grid>
  );
};
