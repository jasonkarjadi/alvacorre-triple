import { Box, BoxProps, IconButton, IconButtonProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { CrossAikon } from "./Aikon";

const MotionBox = motion<BoxProps>(Box);
const MotionIconButton = motion<IconButtonProps>(IconButton);
interface SlideProps {
  setBool: { on: () => void; off: () => void; toggle: () => void };
}
export const Slide: FC<SlideProps> = ({ setBool }) => {
  const shutter = {
    visible: { height: "100%" },
    hidden: { height: 0 },
  };
  const fade = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };
  return (
    <MotionBox
      pos="absolute"
      top="0"
      left="0"
      h="full"
      w="full"
      bg="gray.900"
      variants={fade}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <MotionIconButton
        aria-label="close"
        icon={<CrossAikon />}
        onClick={setBool.off}
        variants={fade}
        initial="hidden"
        animate="visible"
        exit="hidden"
      />
    </MotionBox>
  );
};
