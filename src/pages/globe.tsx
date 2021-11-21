import { IconButton } from "@chakra-ui/button";
import { useBoolean } from "@chakra-ui/hooks";
import { Box, Square } from "@chakra-ui/layout";
import { AnimatePresence } from "framer-motion";
import { GetStaticProps } from "next";
import { FC, useEffect, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { Localer } from "../components/Localer";
import { Slide } from "../components/Slide";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import { ThreeData } from "../types";
import { useGlobe } from "../utils/useGlobe";

interface GlobePageProps {
  data: ThreeData;
}

const GlobePage: FC<GlobePageProps> = ({ data }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [isCanvas, setIsCanvas] = useBoolean(true);
  const [isHit, setIsHit] = useBoolean(false);
  const three = useGlobe(data, setIsHit);

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
      <Localer ns="globe" placement="bottom" />
      <Box flex={1} w="full" ref={wrapRef} pos="relative">
        {rect && <Canvas rect={rect} three={three} />}
        <AnimatePresence>{!isCanvas && <Slide />}</AnimatePresence>
      </Box>
      {isHit && (
        <Square
          as={IconButton}
          aria-label="country or language info"
          onClick={setIsCanvas.toggle}
          pos="absolute"
          bottom={9}
          left={innerWidth / 2 + 6}
          size={16}
          bg={isCanvas ? "black" : "white"}
          border="solid"
        />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { data: { points, relations } } };
};

export default GlobePage;
