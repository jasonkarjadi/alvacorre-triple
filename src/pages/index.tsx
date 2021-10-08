import {
  Box,
  BoxProps,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Text,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  Group,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  FilterAikon,
  GrammarAikon,
  HrzBar,
  LexiconAikon,
  LocalerAikon,
  SettingsAikon,
  StudyAikon,
  VSBStack,
} from "../components/";
import {
  atmFragmentShader,
  atmVertexShader,
  fragmentShader,
  vertexShader,
} from "../shaders";

interface Point {
  name: string;
  coords: { x: number; y: number; z: number };
}
interface Content {
  langName: string;
  family: string;
  type: {
    form: string;
    wordOrder: string;
  };
  script: string[];
}
interface IndexProps {
  clickables: Point[];
  content: Content[];
}

const Index: FC<IndexProps> = ({ clickables, content }) => {
  const [isLocale, setIsLocale] = useBoolean(false),
    [isGrammar, setIsGrammar] = useBoolean(),
    { isOpen, onOpen, onClose } = useDisclosure(),
    { t } = useTranslation("common");

  const requestRef = useRef(0),
    rendRef = useRef<WebGLRenderer>(),
    camRef = useRef(new PerspectiveCamera(50, 2, 1, 100)),
    ctrlRef = useRef<OrbitControls>(),
    radRef = useRef(5),
    globeRef = useRef<Mesh>(),
    atmRef = useRef(
      new Mesh(
        new SphereGeometry(radRef.current * 1.05, 50, 50),
        new ShaderMaterial({
          vertexShader: atmVertexShader,
          fragmentShader: atmFragmentShader,
          blending: AdditiveBlending,
          side: BackSide,
        })
      )
    ),
    groupRef = useRef(new Group()),
    sceneRef = useRef(new Scene()),
    mouseRef = useRef(new Vector2()),
    rayRef = useRef(new Raycaster()),
    onCanvasLoaded = useRef((canvas: HTMLCanvasElement & HTMLDivElement) => {
      rendRef.current = new WebGLRenderer({ canvas, antialias: true });
      ctrlRef.current = new OrbitControls(camRef.current, canvas);
      globeRef.current = new Mesh(
        new SphereGeometry(radRef.current, 50, 50),
        new ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            globeTexture: {
              value: new TextureLoader().load("/globe.jpg"),
            },
          },
        })
      );

      rendRef.current.setPixelRatio(devicePixelRatio);
      camRef.current.position.setZ(22);
      Object.assign(ctrlRef.current, {
        enableDamping: true,
        rotateSpeed: 0.5,
        autoRotate: true,
        autoRotateSpeed: 0.2,
        enablePan: false,
        enableZoom: false,
      });
      globeRef.current.rotateY(-Math.PI / 2);
      sceneRef.current.add(
        groupRef.current.add(globeRef.current),
        atmRef.current
      );
      setResize();

      clickables.map(({ name, coords: { x, y, z } }) => {
        const dot = new Mesh(new SphereGeometry(0.2));
        const radCoords = (num: number) => num * radRef.current;
        dot.position.set(radCoords(x), radCoords(y), radCoords(z));
        dot.name = name;
        groupRef.current.add(dot);
        ptRef.current.push(dot);
      });
    });
  const ptRef = useRef<Mesh[]>([]);
  const [itemA, setItemA] = useState("");
  const [itemB, setItemB] = useState("");

  const setResize = () => {
      camRef.current.aspect = innerWidth / innerHeight;
      camRef.current.updateProjectionMatrix();
      rendRef.current!.setSize(innerWidth, innerHeight);
    },
    setMouseVector = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / innerHeight) * 2 + 1;
    },
    tick = () => {
      rayRef.current.setFromCamera(mouseRef.current, camRef.current);
      if (rayRef.current.intersectObject(globeRef.current!).length > 0) {
        ctrlRef.current!.autoRotate = false;
      } else {
        ctrlRef.current!.autoRotate = true;
      }
      ctrlRef.current!.update();
      rendRef.current!.render(sceneRef.current, camRef.current);
      requestAnimationFrame(tick);
    };
  const setPointRaycaster = () => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const intersects = rayRef.current.intersectObjects(ptRef.current);
    if (intersects.length > 0) {
      console.log("hooplah");
      if (!itemA) {
        setItemA(intersects[0].object.name);
      } else if (intersects[0].object.name !== itemA) {
        if (!itemB) {
          setItemB(intersects[0].object.name);
        } else if (intersects[0].object.name !== itemB) {
          setItemB(intersects[0].object.name);
        }
      }
    }
  };
  const filterer = (target: string) =>
    content.filter(({ langName }) => langName === target)[0];
  const openGrammarDrawer = () => {
    onOpen();
    setIsGrammar.on();
  };
  const openLexiconDrawer = () => {
    onOpen();
    setIsGrammar.off();
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    addEventListener("resize", () => setResize());
    oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    return () => {
      cancelAnimationFrame(requestRef.current);
      removeEventListener("resize", () => setResize);
    };
  }, []);

  const MotionBox = motion<BoxProps>(Box);
  interface LangProps {
    item: string;
  }
  const MotionLangCard: FC<LangProps> = ({ item }) => {
    useEffect(() => {
      console.log("render");
    }, []);
    return (
      <MotionBox
        p={3}
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        h={16}
        flex={1}
        bg="gray.900"
        color="white"
        variants={{ visible: { x: 0 }, hidden: { x: innerWidth } }}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <Heading fontSize="16px">{t(`${filterer(item).langName}`)}</Heading>
        <Text
          fontSize="10px"
          children={`${t(`${filterer(item).family}`)} ${t(
            `${filterer(item).type.wordOrder}`
          )}`}
        />
      </MotionBox>
    );
  };

  const CardBox: FC<LangProps> = ({ item }) => {
    return (
      <Box h={16} border="gray dashed 1px" flex={1}>
        {item && (
          <AnimatePresence initial={true}>
            <MotionLangCard item={item} />
          </AnimatePresence>
        )}
      </Box>
    );
  };

  const CardAMemo = useMemo(() => <CardBox item={itemA} />, [itemA]);
  const CardBMemo = useMemo(() => <CardBox item={itemB} />, [itemB]);

  return (
    <>
      <HrzBar isTop={true}>
        {CardAMemo}
        {CardBMemo}
      </HrzBar>
      <Box
        as="canvas"
        ref={onCanvasLoaded.current}
        onMouseMove={setMouseVector}
        onMouseDown={setPointRaycaster}
      />
      <HrzBar isTop={false}>
        <VSBStack
          btnArr={[
            { onClick: openGrammarDrawer, icon: <GrammarAikon /> },
            { onClick: openLexiconDrawer, icon: <LexiconAikon /> },
          ]}
          mainAikon={<StudyAikon />}
          isDisabled={!itemA}
        />
        <Center
          h={16}
          flex={1}
          userSelect="none"
          bg="gray.100"
          borderRadius="base"
        >
          {isLocale ? "Select a Locale" : "Select a Language"}
        </Center>
        <VSBStack
          btnArr={[
            { onClick: () => {}, icon: <FilterAikon /> },
            { onClick: setIsLocale.toggle, icon: <LocalerAikon /> },
          ]}
          mainAikon={<SettingsAikon />}
        />
      </HrzBar>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
        <DrawerOverlay />
        <DrawerContent opacity="0.9">
          <DrawerHeader>
            {isGrammar ? "Grammatical Categories" : "Stratum & Word Class"}
          </DrawerHeader>
          <DrawerBody>{isGrammar ? "grammar" : "lexicon"}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const clickables = [
    {
      name: "ina",
      coords: {
        x: 0.9140165430070886,
        y: -0.013775448070460912,
        z: -0.4054429628687974,
      },
    },
    {
      name: "jpn",
      coords: {
        x: 0.5372766576225415,
        y: 0.5906732692963204,
        z: -0.6020289711573246,
      },
    },
    {
      name: "eng",
      coords: {
        x: -0.034051759463686306,
        y: 0.822919263139182,
        z: 0.5671369887706965,
      },
    },
  ];
  const content = [
    {
      langName: "eng",
      family: "gem",
      type: {
        form: "analyt",
        wordOrder: "SVO",
      },
      script: ["latin"],
    },
    {
      langName: "jpn",
      family: "jpx",
      type: {
        form: "synthe",
        wordOrder: "SOV",
      },
      script: ["han", "kana"],
    },
    {
      langName: "ina",
      family: "map",
      type: {
        form: "synthe",
        wordOrder: "SVO",
      },
      script: ["latin"],
    },
  ];

  return {
    props: {
      clickables,
      content,
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  };
};

export default Index;
