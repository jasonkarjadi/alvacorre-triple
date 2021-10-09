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
