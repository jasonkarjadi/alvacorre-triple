import {
  Box,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
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
import { useRouter } from "next/dist/client/router";
import {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  AikonBtn,
  FilterAikon,
  GrammarAikon,
  HrzBar,
  LexiconAikon,
  LocalerAikon,
} from "../components/";
import {
  atmFragmentShader,
  atmVertexShader,
  fragmentShader,
  vertexShader,
} from "../shaders";

interface Point {
  iso: string;
  coords: { x: number; y: number; z: number };
}
interface Content {
  langName: string;
  family: string;
  type: {
    form: string;
    wordOrder: string;
  };
}
interface IndexProps {
  clickables: Point[];
  content: Content[];
}

const Index: FC<IndexProps> = ({ clickables, content }) => {
  const [isLocale, setIsLocale] = useBoolean(true),
    [isGrammar, setIsGrammar] = useBoolean(),
    { isOpen, onOpen, onClose } = useDisclosure(),
    { t } = useTranslation("common");
  const [itemA, setItemA] = useState("");
  const [itemB, setItemB] = useState("");
  const router = useRouter();
  // consider tidying constants later

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
      console.log("rendered");
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
      camRef.current.position.setZ(18);
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

      clickables.map(({ iso, coords: { x, y, z } }) => {
        const dot = new Mesh(new SphereGeometry(0.2));
        const radCoords = (num: number) => num * radRef.current;
        dot.position.set(radCoords(x), radCoords(y), radCoords(z));
        dot.name = iso;
        groupRef.current.add(dot);
        ptRef.current.push(dot);
      });
    });
  const ptRef = useRef<Mesh[]>([]);

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
      if (isLocale) {
        // router.push("/", undefined, { locale: intersects[0].object.name });
        setIsLocale.off;
      } else {
        if (!itemA) {
          setItemA(intersects[0].object.name);
        } else if (intersects[0].object.name !== itemA) {
          if (intersects[0].object.name !== itemB) {
            setItemB(intersects[0].object.name);
          }
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
    setResize();
    oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    return () => {
      cancelAnimationFrame(requestRef.current);
      removeEventListener("resize", () => setResize);
    };
  }, []);
  useEffect(() => {
    if (!itemA && itemB) {
      setItemA(itemB);
      setItemB("");
    }
  }, [itemA]);

  const MotionBox = chakra(motion.div);
  interface CardProps {
    item: [string, Dispatch<SetStateAction<string>>];
  }
  const MotionLangCard: FC<CardProps> = ({ item }) => {
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
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, i) => {
          if (Math.abs(i.offset.x) > 100) {
            item[1]("");
          }
        }}
      >
        <Heading fontSize="16px">{t(`${item[0]}`)}</Heading>
        <Text
          fontSize="10px"
          children={`${t(`${filterer(item[0]).family}`)} ${t(
            `${filterer(item[0]).type.wordOrder}`
          )} ${t(`${filterer(item[0]).type.form}`)}`}
        />
      </MotionBox>
    );
  };

  const CardBox: FC<CardProps> = (props) => {
    return (
      <Box h={16} border="gray dashed 1px" flex={1}>
        {props.item[0] && (
          <AnimatePresence>
            <MotionLangCard {...props} />
          </AnimatePresence>
        )}
      </Box>
    );
  };

  const CardAMemo = useMemo(
    () => <CardBox item={[itemA, setItemA]} />,
    [itemA]
  );
  const CardBMemo = useMemo(
    () => <CardBox item={[itemB, setItemB]} />,
    [itemB]
  );

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
        <AikonBtn
          onClick={setIsLocale.toggle}
          icon={<LocalerAikon />}
          flex={1}
        />
        <AikonBtn
          onClick={openGrammarDrawer}
          icon={<GrammarAikon />}
          flex={1}
          isDisabled={!itemA}
        />
        <AikonBtn
          onClick={openLexiconDrawer}
          icon={<LexiconAikon />}
          flex={1}
          isDisabled={!itemA}
        />
        <AikonBtn
          onClick={() => {}}
          icon={<FilterAikon />}
          flex={1}
          isDisabled={true}
        />
      </HrzBar>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent opacity="0.9" h="full">
          <DrawerHeader p={3}>
            {isGrammar ? "Grammatical Categories" : "Strata & Word Classes"}
          </DrawerHeader>
          <DrawerCloseButton border="black 2px solid" />
          <DrawerBody p={3}></DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const clickables = [
    {
      iso: "id",
      coords: {
        x: 0.9140165430070886,
        y: -0.013775448070460912,
        z: -0.4054429628687974,
      },
    },
    {
      iso: "jp",
      coords: {
        x: 0.5372766576225415,
        y: 0.5906732692963204,
        z: -0.6020289711573246,
      },
    },
    {
      iso: "en",
      coords: {
        x: -0.034051759463686306,
        y: 0.822919263139182,
        z: 0.5671369887706965,
      },
    },
  ];
  const content = [
    {
      langName: "en",
      family: "ine",
      type: {
        form: "analyt",
        wordOrder: "SVO",
      },
    },
    {
      langName: "jp",
      family: "jpx",
      type: {
        form: "synthe",
        wordOrder: "SOV",
      },
    },
    {
      langName: "id",
      family: "map",
      type: {
        form: "synthe",
        wordOrder: "SVO",
      },
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

// add locale globe feature
// add UI indicating dots are clickable
// add highlight on clicked dot
// add curved lines indicating correlations feature
// add UI indicating LangCard swipable
// solidify content for each language
// add common.json for each locale
// fix camera zoom or globe size
// fix whole screen select
// fix itemB to itemA animation
