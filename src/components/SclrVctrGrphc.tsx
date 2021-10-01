import { Icon } from "@chakra-ui/react";
import { FC } from "react";

interface SclrVctrGrphcProps {
  viewBox: string;
}

const SclrVctrGrphc: FC<SclrVctrGrphcProps> = ({ viewBox, children }) => {
  return (
    <Icon
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      boxSize={10}
      viewBox={viewBox}
    >
      {children}
    </Icon>
  );
};

export default SclrVctrGrphc;
