import { Icon } from "@chakra-ui/react";
import { FC } from "react";

interface SetIconProps {
  viewBox: string;
  dataIcon?: string;
}

const SetIcon: FC<SetIconProps> = ({ children, viewBox, dataIcon }) => {
  return (
    <Icon
      aria-hidden="true"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      boxSize={10}
      viewBox={viewBox}
      data-icon={dataIcon}
    >
      {children}
    </Icon>
  );
};

export default SetIcon;
