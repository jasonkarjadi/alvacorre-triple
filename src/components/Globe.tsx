import { Box } from "@chakra-ui/react";
import { FC, MouseEvent, useEffect, useRef } from "react";
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
  atmFragmentShader,
  atmVertexShader,
  fragmentShader,
  vertexShader,
} from "../shaders";

interface GlobeProps {
  clickables: {
    iso: string;
    coords: { x: number; y: number; z: number };
  }[];
}

export const Globe: FC<GlobeProps> = ({ clickables }) => {
  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    addEventListener("resize", () => setResize());
    setResize();
    return () => {
      cancelAnimationFrame(requestRef.current);
      removeEventListener("resize", () => setResize);
    };
  }, []);

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
      if (!canvas) return;
      rendRef.current = new WebGLRenderer({ canvas, antialias: false });
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

      camRef.current.position.setZ(16);
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
        const dot = new Mesh(new SphereGeometry(0.1));
        const radCoords = (num: number) => num * radRef.current;
        dot.position.set(radCoords(x), radCoords(y), radCoords(z));
        dot.name = iso;
        groupRef.current.add(dot);
        ptRef.current.push(dot);
      });
    });
  const ptRef = useRef<Mesh[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const setResize = () => {
      const rect = wrapRef.current!.getBoundingClientRect();
      camRef.current.aspect = rect.width / rect.height;
      camRef.current.updateProjectionMatrix();
      rendRef.current!.setSize(rect.width, rect.height);
      rendRef.current!.setPixelRatio(devicePixelRatio);
    },
    setMouseVector = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / innerHeight) * 2 + 1;
    },
    tick = () => {
      ctrlRef.current!.update();
      rendRef.current!.render(sceneRef.current, camRef.current);
      requestAnimationFrame(tick);
    };
  const setPointRaycaster = () => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const intersects = rayRef.current.intersectObjects(ptRef.current);
    if (intersects.length > 0) {
    }
  };

  return (
    <Box flex={1} w="full" ref={wrapRef}>
      <Box
        as="canvas"
        ref={onCanvasLoaded.current}
        onMouseMove={setMouseVector}
        onMouseDown={setPointRaycaster}
        borderRadius="base"
      />
    </Box>
  );
};
