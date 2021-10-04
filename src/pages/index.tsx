import { Box, Center, useBoolean } from "@chakra-ui/react";
import { GetStaticProps } from "next";
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
  points: Point[];
}

const Index: FC<IndexProps> = ({ points }) => {
  const [isLocale, setIsLocale] = useBoolean(true),
    [selected, setSelected] = useState(["", ""]),
    [radius, _] = useState(5);

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

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    addEventListener("resize", () => setResize());
    return () => {
      cancelAnimationFrame(requestRef.current);
      removeEventListener("resize", () => setResize);
    };
  }, []);

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

      points.map(({ name, coords: { x, y, z } }) => {
        const dot = new Mesh(new SphereGeometry(0.2));
        dot.position.set(radius * x, radius * y, radius * z);
        dot.name = name;
        groupRef.current.add(dot);
        ptRef.current.push(dot);
      });
    });
  const ptRef = useRef<Mesh[]>([]);

  return (
    <>
      <HrzBar isTop={true}>
        {selected[0] && <Box h={14} border="gray dashed 1px" flex={1}></Box>}
        <Box h={14} border="gray dashed 1px" flex={1}></Box>
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
            { onClick: () => {}, icon: <GrammarAikon /> },
            { onClick: () => {}, icon: <LexiconAikon /> },
          ]}
          mainAikon={<StudyAikon />}
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
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const points = [
    {
      name: "INA",
      coords: {
        x: 0.9140165430070886,
        y: -0.013775448070460912,
        z: -0.4054429628687974,
      },
    },
    {
      name: "JPN",
      coords: {
        x: 0.5372766576225415,
        y: 0.5906732692963204,
        z: -0.6020289711573246,
      },
    },
    {
      name: "ENG",
      coords: {
        x: -0.034051759463686306,
        y: 0.822919263139182,
        z: 0.5671369887706965,
      },
    },
  ];

  return {
    props: {
      points,
    },
  };
};

export default Index;
