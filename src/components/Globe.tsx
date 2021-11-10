import { Box } from "@chakra-ui/react";
import { FC, MouseEvent, RefObject, useEffect, useRef } from "react";
import {
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import features from "../ne_110m_admin_0_countries";
import { genGeoms } from "../utils/genGeom";

interface GlobeProps {
  wrapRef: RefObject<HTMLDivElement>;
  setBool: { on: () => void; off: () => void; toggle: () => void };
  // contents?: {
  //   iso: string;
  //   imports: string[];
  //   family: string;
  //   form: string;
  //   wordOrder: string;
  // }[];
}

export const Globe: FC<GlobeProps> = ({ wrapRef, setBool }) => {
  const reqRef = useRef(0);
  const rendRef = useRef<WebGLRenderer>();
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const ctrlRef = useRef<OrbitControls>();
  const radRef = useRef(50);
  const sceneRef = useRef(new Scene());
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const onCanvasLoaded = useRef(
    (canvas: HTMLCanvasElement & HTMLDivElement) => {
      if (!canvas) return;
      rendRef.current = new WebGLRenderer({ canvas, antialias: false });
      ctrlRef.current = new OrbitControls(camRef.current, canvas);
    }
  );
  const worldRef = useRef<Mesh<BufferGeometry, MeshBasicMaterial>[]>([]);

  useEffect(() => {
    const setResize = () => {
      const { width, height } = wrapRef.current!.getBoundingClientRect();
      camRef.current.aspect = width / height;
      camRef.current.updateProjectionMatrix();
      rendRef.current?.setSize(width, height);
      rendRef.current?.setPixelRatio(devicePixelRatio);
    };
    addEventListener("resize", setResize);
    setResize();
    return () => {
      removeEventListener("resize", setResize);
    };
  }, [wrapRef]);

  useEffect(() => {
    const tick = () => {
      ctrlRef.current?.update();
      rendRef.current?.render(sceneRef.current, camRef.current);
      requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    camRef.current.position.set(0, 0, 200);
    Object.assign(ctrlRef.current, {
      enableDamping: true,
      autoRotate: true,
      autoRotateSpeed: 0.2,
      enableRotate: true,
      rotateSpeed: 0.5,
      enablePan: false,
      enableZoom: true,
      minDistance: radRef.current * 2,
      maxDistance: camRef.current.position.z * 2,
    });
    worldRef.current = features.map(({ properties, geometry }) => {
      const polys =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;
      const { meshGeoms, lineGeoms } = genGeoms(polys, radRef.current, 1);
      const ctryMesh = new Mesh(
        meshGeoms[0] && mergeBufferGeometries(meshGeoms),
        new MeshBasicMaterial({ color: 0x101ab3 })
      );
      ctryMesh.name = properties.NAME;
      const ctryLine = new LineSegments(
        lineGeoms[0] && mergeBufferGeometries(lineGeoms),
        new LineBasicMaterial({ color: 0xf78f2e })
      );
      const ctryGroup = new Group().add(ctryMesh, ctryLine);
      sceneRef.current.add(ctryGroup);
      return ctryMesh;
    });
    return () => {
      cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <Box
      as="canvas"
      ref={onCanvasLoaded.current}
      onMouseMove={(e: MouseEvent) => {
        const { width, height, left, top } =
          wrapRef.current!.getBoundingClientRect();
        mouseRef.current.set(
          ((e.clientX - left) / width) * 2 - 1,
          -((e.clientY - top) / height) * 2 + 1
        );
      }}
      onMouseDown={() => {
        rayRef.current.setFromCamera(mouseRef.current, camRef.current);
        const intersects = rayRef.current.intersectObjects(worldRef.current)[0];
        if (intersects) {
          console.log("hit");
          setBool.on();
          // intersects.object.name;
          // [].map((x: any) => genCurve(x.start, x.end, radRef.current));
        }
      }}
      userSelect="none"
      borderRadius="xl"
    />
  );
};
