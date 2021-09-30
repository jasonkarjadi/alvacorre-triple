import { VStack } from "@chakra-ui/react";
import { FC } from "react";
import { SqrBtn, SqrBtnProps } from "./";

interface VrtBtnStackProps {
  MainBtn: SqrBtnProps;
  BtnArr: SqrBtnProps[];
}

const VrtBtnStack: FC<VrtBtnStackProps> = ({
  BtnArr,
  MainBtn: { ariaLabel, viewBox, pathD },
}) => {
  return (
    <VStack>
      {BtnArr.map((Btn) => (
        <SqrBtn
          key={Btn.ariaLabel}
          ariaLabel={Btn.ariaLabel}
          viewBox={Btn.viewBox}
          pathD={Btn.pathD}
        />
      ))}
      <SqrBtn ariaLabel={ariaLabel} viewBox={viewBox} pathD={pathD} />
    </VStack>
  );
};

export default VrtBtnStack;
