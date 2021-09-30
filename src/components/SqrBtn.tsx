import { Square, IconButton } from "@chakra-ui/react";
import { ReactElement, JSXElementConstructor, FC } from "react";

interface SqrBtnProps {
  ariaLabel: string;
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
}

const SqrBtn: FC<SqrBtnProps> = ({ ariaLabel, icon }) => {
  return (
    <Square as={IconButton} size={14} aria-label={ariaLabel} icon={icon} />
  );
};

export default SqrBtn;
