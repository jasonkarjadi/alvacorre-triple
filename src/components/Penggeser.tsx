import {
  Slider,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { FC, SetStateAction } from "react";

interface PenggeserProps {
  pgdTblData: string[][][] | undefined;
  sliderVal: number;
  setSliderVal: (value: SetStateAction<number>) => void;
}

export const Penggeser: FC<PenggeserProps> = ({
  pgdTblData,
  sliderVal,
  setSliderVal,
}) => {
  return (
    <Slider
      min={0}
      max={pgdTblData && pgdTblData.length - 1}
      value={sliderVal}
      onChange={(v) => setSliderVal(v)}
    >
      <SliderMark
        value={sliderVal}
        color="tan"
        fontWeight="bold"
        bg="gray.900"
        borderRadius="md"
        w={6}
        textAlign="center"
        ml={-3}
        mt={-7}
      >
        {sliderVal + 1}
      </SliderMark>
      <SliderTrack bg="tan" />
      <SliderThumb bg="tan" outline="solid" outlineColor="gray.900" />
    </Slider>
  );
};
