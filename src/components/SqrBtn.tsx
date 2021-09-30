import { Icon, IconButton, Square } from "@chakra-ui/react";
import { FC } from "react";

export interface SqrBtnProps {
  ariaLabel: string;
  viewBox: string;
  pathD: string;
}

const SqrBtn: FC<SqrBtnProps> = ({ ariaLabel, viewBox, pathD }) => {
  return (
    <Square
      as={IconButton}
      size={14}
      aria-label={ariaLabel}
      icon={
        <Icon
          aria-hidden="true"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          boxSize={10}
          viewBox={viewBox}
        >
          <path d={pathD} />
        </Icon>
      }
    />
  );
};

export default SqrBtn;
