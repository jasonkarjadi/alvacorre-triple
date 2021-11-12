import { Box } from "@chakra-ui/react";
import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import {
  Group,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface GlobeProps {
  rect: DOMRect;
  ctrys: Group[];
  // setBool: { on: () => void; off: () => void; toggle: () => void };
  // contents?: {
  //   iso: string;
  //   imports: string[];
  //   family: string;
  //   form: string;
  //   wordOrder: string;
  // }[];
}

export const Globe: FC<GlobeProps> = ({ rect, ctrys }) => {
  const reqRef = useRef(0);
  const rendRef = useRef<WebGLRenderer>();
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const ctrlRef = useRef<OrbitControls>();
  const sceneRef = useRef(new Scene());
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const onCanvasLoad = useCallback(
    (canvas: HTMLCanvasElement & HTMLDivElement) => {
      if (!canvas) return;
      rendRef.current = new WebGLRenderer({ canvas, antialias: false });
      ctrlRef.current = new OrbitControls(camRef.current, canvas);
      camRef.current.position.set(0, 0, 200);
      Object.assign(ctrlRef.current, {
        enableDamping: true,
        autoRotate: true,
        autoRotateSpeed: 0.2,
        enableRotate: true,
        rotateSpeed: 0.5,
        enablePan: false,
        enableZoom: true,
        minDistance: 50 * 2,
        maxDistance: camRef.current.position.z * 2,
      });
    },
    []
  );
  const setMouseXY = useCallback(
    (e: MouseEvent) => {
      const { width, height, left, top } = rect;
      mouseRef.current.set(
        ((e.clientX - left) / width) * 2 - 1,
        -((e.clientY - top) / height) * 2 + 1
      );
    },
    [rect]
  );
  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const intersects = rayRef.current.intersectObjects(
      ctrys.map((c) => c.children[0])
    )[0];
    if (intersects) {
      console.log(intersects.object.name);
      // [].map((x: any) => genCurve(x.start, x.end, 50));
    }
  }, [ctrys]);

  useEffect(() => {
    const { width, height } = rect;
    camRef.current.aspect = width / height;
    camRef.current.updateProjectionMatrix();
    rendRef.current?.setSize(width, height);
    rendRef.current?.setPixelRatio(devicePixelRatio);
  }, [rect]);

  useEffect(() => {
    const tick = () => {
      ctrlRef.current?.update();
      rendRef.current?.render(sceneRef.current, camRef.current);
      reqRef.current = requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(reqRef.current);
    };
  }, []);

  useEffect(() => {
    sceneRef.current.add(...ctrys);
  }, [ctrys]);

  return (
    <Box
      as="canvas"
      ref={onCanvasLoad}
      onMouseMove={setMouseXY}
      onMouseDown={setRay}
      userSelect="none"
      borderRadius="xl"
    />
  );
};
