import { Button, ButtonProps } from "@chakra-ui/button";
import { Heading, SimpleGrid, Text } from "@chakra-ui/layout";
import useTranslation from "next-translate/useTranslation";
import { FC, SetStateAction } from "react";

const TBaten: FC<ButtonProps> = (props) => {
  if (!(props.children as string).includes(":")) {
    return (
      <Button
        {...props}
        justifyContent="flex-start"
        bg="tan"
        _hover={{ bg: "orange.100", textDecor: "underline" }}
        isFullWidth
      />
    );
  }
  return null;
};

interface InfoWindowProps {
  ns: string;
  setNs: (value: SetStateAction<string>) => void;
  pageNum: number;
  setPageNum: (value: SetStateAction<number>) => void;
}

export const InfoWindow: FC<InfoWindowProps> = ({
  ns,
  setNs,
  pageNum,
  setPageNum,
}) => {
  const { t } = useTranslation();

  if (ns.includes("characteristics")) {
    return <>lorem ipsum</>;
  } else if (ns.includes("listables")) {
    return (
      <SimpleGrid h="full" spacing={3} column={2} row={5}>
        <Button></Button>
        <Button></Button>
        <Button></Button>
        <Button></Button>
        <Button></Button>
        <Button></Button>
      </SimpleGrid>
    );
  } else if (ns.includes("relations")) {
    if (pageNum) {
      return (
        <>
          <Heading mb={3} fontSize="md">
            {t(`${ns}:${pageNum}Heading`)}
          </Heading>
          <Text>{t(`${ns}:${pageNum}Text`)}</Text>
        </>
      );
    }
    return (
      <>
        <Heading fontSize="md">{t("globe:history")}</Heading>
        {[...new Array(3).keys()]
          .map((x) => ++x)
          .map((x) => (
            <TBaten key={x} data-key={x} onClick={() => setPageNum(x)}>
              {t(`${ns}:${x}Heading`)}
            </TBaten>
          ))}
        <Heading fontSize="md" mt={3}>
          {t("globe:influences")}
        </Heading>
      </>
    );
  }

  return <p>author code messed up</p>;
};
