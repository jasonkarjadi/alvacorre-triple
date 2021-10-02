import { IconButton, Square } from "@chakra-ui/react";
import { FC, JSXElementConstructor, ReactElement } from "react";

export interface SqrBtnProps {
  onClick?: () => void;
  icon: ReactElement<any, JSXElementConstructor<any>>;
}

const SqrBtn: FC<SqrBtnProps> = ({ onClick, icon }) => {
  return (
    <Square
      as={IconButton}
      size={14}
      aria-label={icon.type.name.toLowerCase().replace("svg", "")}
      onClick={onClick}
      icon={icon}
    />
  );
};

export default SqrBtn;
