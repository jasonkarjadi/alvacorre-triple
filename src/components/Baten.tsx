import { IconButton } from "@chakra-ui/react";
import { FC, JSXElementConstructor, ReactElement } from "react";

interface AikonBtnProps {
  onClick: () => void;
  icon: ReactElement<any, JSXElementConstructor<any>>;
  isDisabled?: boolean;
  flex?: number;
}

export const AikonBtn: FC<AikonBtnProps> = (props) => {
  return (
    <IconButton
      h={16}
      minW={16}
      aria-label={props.icon.type.name.toLowerCase().replace("aikon", "")}
      {...props}
    />
  );
};

// interface VSBStackProps {
//   btnArr: SqrBtnProps[];
//   mainAikon: SqrBtnProps["icon"];
//   isDisabled?: boolean;
// }
// export const VSBStack: FC<VSBStackProps> = ({
//   btnArr,
//   mainAikon,
//   isDisabled,
// }) => {
//   const [isOpen, setIsOpen] = useBoolean();

//   return (
//     <VStack spacing={3}>
//       <AnimatePresence initial={false}>
//         {isOpen &&
//           btnArr
//             .map(({ icon, onClick }, i) => (
//               <MotionSqrBtn
//                 key={i}
//                 icon={icon}
//                 onClick={() => {
//                   setIsOpen.off();
//                   onClick();
//                 }}
//                 variants={{
//                   open: { opacity: 1, y: 0, transition: { duration: 0.1 } },
//                   closed: {
//                     opacity: 0,
//                     y: 68 * (i + 1),
//                     transition: { duration: 0.2 },
//                   },
//                 }}
//                 initial="closed"
//                 animate="open"
//                 exit="closed"
//               />
//             ))
//             .reverse()}
//       </AnimatePresence>
//       <MotionSqrBtn
//         onClick={setIsOpen.toggle}
//         icon={isOpen ? <CrossAikon /> : mainAikon}
//         isDisabled={isDisabled}
//       />
//     </VStack>
//   );
// };
