import { FC } from "react";
import { Localer } from "../components/Localer";

const IndexPage: FC = () => {
  return (
    <>
      {/* <Image flex={1} alt="main visual" /> */}
      <div style={{ flex: "1" }} />
      <Localer ns="home" placement="top" />
    </>
  );
};

export default IndexPage;
