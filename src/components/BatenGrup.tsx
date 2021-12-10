import { Button, ButtonGroup, ButtonProps } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import useTranslation from "next-translate/useTranslation";
import { FC, SetStateAction } from "react";
import { CrossAikon, MenuAikon, UndoAikon } from "./Aikon";

const BaseButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      flex={1}
      h="full"
      borderRadius="xl"
      bg="gray.900"
      color="tan"
      fontSize="x-small"
      iconSpacing={1}
    />
  );
};

interface BatenGrupProps {
  currName?: string;
  handleOff: () => void;
  ns: string;
  setNs: (value: SetStateAction<string>) => void;
  pageNum: number;
  setPageNum: (value: SetStateAction<number>) => void;
}

export const BatenGrup: FC<BatenGrupProps> = ({
  currName,
  handleOff,
  ns,
  setNs,
  pageNum,
  setPageNum,
}) => {
  const { t } = useTranslation("globe");
  if (!currName) {
    return <Box w="full" h={9} borderRadius="xl" bg="gray.900" />;
  } else {
    return (
      <ButtonGroup w="full" h={9} isAttached>
        <BaseButton
          leftIcon={!ns ? <CrossAikon /> : <UndoAikon />}
          onClick={() =>
            !ns ? handleOff() : !pageNum ? setNs("") : setPageNum(0)
          }
        >
          {!ns ? "Deselect" : "Back"}
        </BaseButton>
        <Menu isLazy>
          <MenuButton as={BaseButton} leftIcon={<MenuAikon />}>
            More
          </MenuButton>
          <MenuList userSelect="none">
            <MenuItem onClick={() => setNs(`characteristics/${currName}`)}>
              {t("characteristics")}
            </MenuItem>
            <MenuItem onClick={() => setNs(`listables/${currName}`)}>
              {t("listables")}
            </MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
    );
  }
};
