import { Box, BoxProps, IconButton, IconButtonProps } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";
import { CrossAikon } from "./Aikon";

const MotionBox = motion<BoxProps>(Box);
const MotionIconButton = motion<IconButtonProps>(IconButton);
interface SlideProps {
  useBoolean: [
    boolean,
    {
      on: () => void;
      off: () => void;
      toggle: () => void;
    }
  ];
}
export const Slide: FC<SlideProps> = ({ useBoolean }) => {
  const content = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };
  return (
    <AnimatePresence>
      {useBoolean[0] && (
        <MotionBox
          pos="absolute"
          top="0"
          left="0"
          h="full"
          w="full"
          bg="white"
          variants={{
            visible: { height: "100%" },
            hidden: { height: 0 },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <MotionIconButton
            aria-label="close"
            icon={<CrossAikon />}
            onClick={useBoolean[1].off}
            variants={content}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        </MotionBox>
      )}
    </AnimatePresence>
  );
};
