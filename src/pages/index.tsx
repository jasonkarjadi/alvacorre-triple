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
import { HrzBar, VrtBtnStack } from "../components/";
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
        <VrtBtnStack
          MainBtn={{
            ariaLabel: "",
            viewBox: "",
            pathD:
              "M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z",
          }}
          BtnArr={[
            {
              ariaLabel: "grammar",
              viewBox: "0 0 640 512",
              pathD:
                "M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z",
            },
            {
              ariaLabel: "lexicon",
              viewBox: "0 0 640 512",
              pathD:
                "M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z",
            },
          ]}
        />
        <Center bg="gray" h={14} flex={1}>
          {isLocaleMode ? "Select a Locale" : "Select a Language"}
        </Center>
        <VrtBtnStack
          MainBtn={{
            ariaLabel: "",
            viewBox: "",
            pathD:
              "M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z",
          }}
          BtnArr={[
            {
              ariaLabel: "localer",
              viewBox: "0 0 512 512",
              pathD:
                "M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z",
            },
            {
              ariaLabel: "filter",
              viewBox: "0 0 512 512",
              pathD:
                "M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z",
            },
          ]}
        />
      </HrzBar>
    </>
  );
};

export default Index;
