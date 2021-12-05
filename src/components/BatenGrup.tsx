import { Button, ButtonGroup, ButtonProps } from "@chakra-ui/button";
import { Box, Center } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Slider, SliderThumb, SliderTrack } from "@chakra-ui/slider";
import useTranslation from "next-translate/useTranslation";
import { FC, SetStateAction } from "react";
import {
  CrossAikon,
  DownloadAikon,
  MenuAikon,
  UndoAikon,
  UploadAikon,
} from "./Aikon";

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
  isInward: boolean;
  setIsInward: { on: () => void; off: () => void; toggle: () => void };
  ns: string;
  setNs: (value: SetStateAction<string>) => void;
  pageNum: number;
  setPageNum: (value: SetStateAction<number>) => void;
}

export const BatenGrup: FC<BatenGrupProps> = ({
  currName,
  handleOff,
  isInward,
  setIsInward,
  ns,
  setNs,
  pageNum,
  setPageNum,
}) => {
  const { t } = useTranslation("globe");
  const BatenSlider: FC = () => {
    if (!ns) {
      return (
        <BaseButton
          leftIcon={isInward ? <DownloadAikon /> : <UploadAikon />}
          onClick={setIsInward.toggle}
        >
          {isInward ? "Inward" : "Outward"}
        </BaseButton>
      );
    } else {
      return (
        <Center flex={5} p={3} bg="gray.900">
          <Slider min={1} max={10} value={pageNum} onChange={setPageNum}>
            <SliderTrack bg="tan" />
            <SliderThumb bg="tan" outline="solid" />
          </Slider>
        </Center>
      );
    }
  };
  if (!currName) {
    return <Box w="full" h={9} borderRadius="xl" bg="gray.900" />;
  } else {
    return (
      <ButtonGroup w="full" h={9} isAttached>
        <BaseButton
          leftIcon={!ns ? <CrossAikon /> : <UndoAikon />}
          onClick={() => (!ns ? handleOff() : setNs(""))}
        >
          {!ns ? "Deselect" : "Globe"}
        </BaseButton>
        <BatenSlider />
        <Menu placement="top" closeOnSelect={false} isLazy>
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
