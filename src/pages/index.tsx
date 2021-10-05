import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useBoolean,
  useDisclosure,
  Heading,
  Text,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FC, MouseEvent, useEffect, useRef, useState } from "react";
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

interface IndexProps {
  clickables: Point[];
  content: {
    langName: string;
    family: string;
    type: {
      form: string;
      wordOrder: string;
    };
  }[];
}

const Index: FC<IndexProps> = ({ clickables, content }) => {
  const [isLocale, setIsLocale] = useBoolean(true),
    [selected, setSelected] = useState(["", ""]),
    [radius, _] = useState(5);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isGrammar, setIsGrammar] = useBoolean();
  const { t } = useTranslation("common");
  const filterer = (target: string) =>
    content.filter(({ langName }) => langName === target)[0];
  const itemOne = filterer(selected[0]);
  const itemTwo = filterer(selected[1]);

  const requestRef = useRef(0),
    rendRef = useRef<WebGLRenderer>(),
    camRef = useRef(new PerspectiveCamera(50, 2, 1, 100)),
    ctrlRef = useRef<OrbitControls>(),
    globeRef = useRef<Mesh>(),
    atmRef = useRef(
      new Mesh(
        new SphereGeometry(radius * 1.05, 50, 50),
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
        new SphereGeometry(radius, 50, 50),
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
      setResize();

      clickables.map(({ name, coords: { x, y, z } }) => {
        const dot = new Mesh(new SphereGeometry(0.2));
        dot.position.set(radius * x, radius * y, radius * z);
        dot.name = name;
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
      if (!selected[0]) {
        setSelected([intersects[0].object.name, selected[1]]);
      } else if (intersects[0].object.name !== selected[0]) {
        if (!selected[1]) {
          setSelected([selected[0], intersects[0].object.name]);
        } else if (intersects[0].object.name !== selected[1]) {
          setSelected([selected[0], intersects[0].object.name]);
        }
      }
    }
  };
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
    return () => {
      cancelAnimationFrame(requestRef.current);
      removeEventListener("resize", () => setResize);
    };
  }, []);

  return (
    <>
      <HrzBar isTop={true}>
        <Box h={14} border="gray dashed 1px" flex={1}>
          {selected[0] && (
            <Box bg="gray" color="white">
              <Heading>{t(`langName.${itemOne.langName}`)}</Heading>
              <Text>
                {t(`langName.${itemOne.family}`)}
                {t(`type.form.${itemOne.type.form}`)}
              </Text>
            </Box>
          )}
        </Box>
        <Box h={14} border="gray dashed 1px" flex={1}>
          {selected[1] && (
            <Box>
              <Heading>{t(`langName.${itemTwo.langName}`)}</Heading>
              <Text>
                {t(`langName.${itemOne.family}`)}
                {t(`type.form.${itemOne.type.form}`)}
              </Text>
            </Box>
          )}
        </Box>
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
          isDisabled={!selected.join("")}
        />
        <Center bg="gray" h={14} flex={1} userSelect="none">
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
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          {isGrammar ? (
            <DrawerBody>grammar modal</DrawerBody>
          ) : (
            <DrawerBody>lexicon modal</DrawerBody>
          )}
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
    },
    {
      langName: "jpn",
      family: "jpx",
      type: {
        form: "synthe",
        wordOrder: "SOV",
      },
    },
    {
      langName: "ina",
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
