import { IconButton, Square } from "@chakra-ui/react";
import { FC, ReactElement } from "react";

export interface SqrBtnProps {
  onClick: () => void;
  icon: ReactElement;
}

const SqrBtn: FC<SqrBtnProps> = ({ onClick, icon }) => {
  return (
    <Square
      as={IconButton}
      size={14}
      aria-label={icon.type.name}
      onClick={onClick}
      icon={icon}
    />
  );
};

export default SqrBtn;
