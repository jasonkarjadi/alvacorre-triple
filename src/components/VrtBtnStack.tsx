import { VStack } from "@chakra-ui/react";
import { FC } from "react";
import { SqrBtn, SqrBtnProps } from ".";

interface VrtBtnStackProps {
  BtnArr: SqrBtnProps[];
}

const VrtBtnStack: FC<VrtBtnStackProps> = ({ BtnArr }) => {
  return (
    <VStack>
      {BtnArr.map((Btn, i) => (
        <SqrBtn key={i} onClick={Btn.onClick} icon={Btn.icon} />
      ))}
    </VStack>
  );
};

export default VrtBtnStack;
