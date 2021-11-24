import { Box } from "@chakra-ui/layout";
import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface CanvasProps {
  rect: DOMRect;
  camera: PerspectiveCamera;
  mouse: Vector2;
  scene: Scene;
  setRay: () => void;
}

export const Canvas: FC<CanvasProps> = ({
  rect,
  camera,
  mouse,
  scene,
  setRay,
}) => {
  const reqRef = useRef(0);
  const rendRef = useRef<WebGLRenderer>();
  const ctrlRef = useRef<OrbitControls>();
  const onCanvasLoad = useCallback(
    (canvas: HTMLCanvasElement & HTMLDivElement) => {
      if (!canvas) return;
      rendRef.current = new WebGLRenderer({ canvas, antialias: false });
      ctrlRef.current = new OrbitControls(camera, canvas);
      camera.position.set(0, 0, 200);
      Object.assign(ctrlRef.current, {
        enableDamping: true,
        enableRotate: true,
        rotateSpeed: 0.5,
        enablePan: false,
        enableZoom: true,
        minDistance: 50 * 1.1,
        maxDistance: camera.far - 50,
      });
    },
    [camera]
  );
  const setMouseXY = useCallback(
    (e: MouseEvent) => {
      const { width, height, left, top } = rect;
      mouse.set(
        ((e.clientX - left) / width) * 2 - 1,
        -((e.clientY - top) / height) * 2 + 1
      );
    },
    [rect, mouse]
  );

  useEffect(() => {
    const { width, height } = rect;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    rendRef.current?.setSize(width, height);
    rendRef.current?.setPixelRatio(devicePixelRatio);
  }, [rect, camera]);

  useEffect(() => {
    const tick = () => {
      ctrlRef.current?.update();
      rendRef.current?.render(scene, camera);
      reqRef.current = requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(reqRef.current);
    };
  }, [scene, camera]);

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
