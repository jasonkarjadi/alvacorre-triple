import { Box, BoxProps } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { FC } from "react";

const MotionBox = motion<BoxProps>(Box);

export const Slide: FC = ({ children }) => {
  // const shutter = {
  //   visible: { height: "100%" },
  //   hidden: { height: 0 },
  // };
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
      bg="orange.100"
      variants={fade}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {children}
    </MotionBox>
  );
};
