import { useBoolean } from "@chakra-ui/hooks";
import { Box } from "@chakra-ui/layout";
import { AnimatePresence } from "framer-motion";
import { GetStaticProps } from "next";
import { FC, useEffect, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { Localer } from "../components/Localer";
import { Slide } from "../components/Slide";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import families from "../data/language_families";
import { ThreeData } from "../types";
import { useGlobe } from "../utils/useGlobe";

interface GlobePageProps {
  data: ThreeData;
}

const GlobePage: FC<GlobePageProps> = ({ data }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [isCanvas, setIsCanvas] = useBoolean(true);
  const three = useGlobe(data);

  useEffect(() => {
    const setResize = () => {
      setRect(undefined);
      setRect(wrapRef.current?.getBoundingClientRect());
    };
    addEventListener("resize", setResize);
    setResize();
    return () => {
      removeEventListener("resize", setResize);
    };
  }, []);

  return (
    <>
      <Box pos="relative">
        <Localer ns="globe" placement="bottom" />
      </Box>
      <Box flex={1} w="full" ref={wrapRef} pos="relative">
        {rect && <Canvas rect={rect} three={three} />}
        <AnimatePresence>
          {!isCanvas && <Slide setBool={setIsCanvas} />}
        </AnimatePresence>
      </Box>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { data: { points, relations, families } } };
};

export default GlobePage;
