import { Box, Center } from "@chakra-ui/react";
import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  Group,
  Mesh,
  MeshBasicMaterial,
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
import { HrzBar, VrtBtnStack, LocalerSVG, FilterSVG } from "../components/";
import {
  atmFragmentShader,
  atmVertexShader,
  fragmentShader,
  vertexShader,
} from "../shaders";

const Index: FC = () => {
  const [isLocaleMode, setIsLocaleMode] = useState(true),
    [selected, setSelected] = useState(["", ""]),
    [radius, _] = useState(5);

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
    globeRef = useRef<Mesh<SphereGeometry, ShaderMaterial>>(),
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

      createPoint(
        "INA",
        0.9140165430070886,
        -0.013775448070460912,
        -0.4054429628687974
      );
      // Indonesia -0.7893, 113.9213
      // 0.9140165430070886, -0.013775448070460912, -0.4054429628687974
      createPoint(
        "JPN",
        0.5372766576225415,
        0.5906732692963204,
        -0.6020289711573246
      );
      // Japan 36.2048, 138.2529
      // 0.5372766576225415, 0.5906732692963204, -0.6020289711573246
      createPoint(
        "ENG",
        -0.034051759463686306,
        0.822919263139182,
        0.5671369887706965
      );
      // United Kingdom 55.3781, -3.436
      // -0.034051759463686306, 0.822919263139182, 0.5671369887706965
    });
  const ptRef = useRef<Mesh<SphereGeometry, MeshBasicMaterial>[]>([]);

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
  const createPoint = (name: string, x: number, y: number, z: number) => {
      const point = new Mesh(
        new SphereGeometry(0.2, 50, 50),
        new MeshBasicMaterial()
      );
      const radCoord = (coord: number) => radius * coord;
      point.position.set(radCoord(x), radCoord(y), radCoord(z));
      point.name = name;
      groupRef.current.add(point);
      ptRef.current.push(point);
    },
    setPointRaycaster = () => {
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
  const toggleIsLocaleMode = () => {
    setIsLocaleMode(!isLocaleMode);
  };

  return (
    <>
      <HrzBar isTop={true}>
        <Box h={14} border="gray dashed 1px" flex={1}></Box>
        <Box h={14} border="gray dashed 1px" flex={1}></Box>
      </HrzBar>
      <Box
        as="canvas"
        ref={onCanvasLoaded.current}
        onMouseMove={setMouseVector}
        onMouseDown={setPointRaycaster}
      />
      <HrzBar isTop={false}>
        <Center bg="gray" h={14} flex={1}>
          {isLocaleMode ? "Select a Locale" : "Select a Language"}
        </Center>
        <VrtBtnStack
          BtnArr={[
            { onClick: toggleIsLocaleMode, icon: <LocalerSVG /> },
            { onClick: () => {}, icon: <FilterSVG /> },
          ]}
        />
      </HrzBar>
    </>
  );
};

export default Index;
