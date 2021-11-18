import { useBoolean } from "@chakra-ui/hooks";
import { Box } from "@chakra-ui/layout";
import { AnimatePresence } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { Localer } from "../components/Localer";
import { Slide } from "../components/Slide";
import { useGlobe } from "../utils/useGlobe";

const MyGlobe: FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [isCanvas, setIsCanvas] = useBoolean(true);
  const three = useGlobe();

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

export default MyGlobe;
