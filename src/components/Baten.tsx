import { IconButton, Square, useBoolean, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FC, forwardRef, JSXElementConstructor, ReactElement } from "react";
import { CrossAikon } from ".";

interface SqrBtnProps {
  onClick: () => void;
  icon: ReactElement<any, JSXElementConstructor<any>>;
}

const SqrBtn = forwardRef<HTMLDivElement, SqrBtnProps>((props, ref) => {
  return (
    <Square
      as={IconButton}
      size={14}
      aria-label={props.icon.type.name.toLowerCase().replace("aikon", "")}
      ref={ref}
      {...props}
    />
  );
});
export const MotionSqrBtn = motion(SqrBtn);

interface VSBStackProps {
  btnArr: SqrBtnProps[];
  mainAikon: SqrBtnProps["icon"];
}

export const VSBStack: FC<VSBStackProps> = ({ btnArr, mainAikon }) => {
  const [isOpen, setIsOpen] = useBoolean();

  return (
    <VStack spacing={3}>
      <AnimatePresence initial={false}>
        {isOpen &&
          btnArr
            .map((props, i) => (
              <MotionSqrBtn
                key={i}
                {...props}
                variants={{
                  open: { opacity: 1, y: 0, transition: { duration: 0.1 } },
                  closed: {
                    opacity: 0,
                    y: 68 * (i + 1),
                    transition: { duration: 0.2 },
                  },
                }}
                initial="closed"
                animate="open"
                exit="closed"
              />
            ))
            .reverse()}
      </AnimatePresence>
      <MotionSqrBtn
        onClick={setIsOpen.toggle}
        icon={isOpen ? <CrossAikon /> : mainAikon}
      />
    </VStack>
  );
};
