import { Box } from "@chakra-ui/layout";
import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface CanvasProps {
  rect: DOMRect;
  three: {
    camera: PerspectiveCamera;
    mouse: Vector2;
    scene: Scene;
    setRay: () => void;
  };
  // setBool: { on: () => void; off: () => void; toggle: () => void };
}

export const Canvas: FC<CanvasProps> = ({ rect, three }) => {
  const reqRef = useRef(0);
  const rendRef = useRef<WebGLRenderer>();
  const ctrlRef = useRef<OrbitControls>();
  const onCanvasLoad = useCallback(
    (canvas: HTMLCanvasElement & HTMLDivElement) => {
      if (!canvas) return;
      rendRef.current = new WebGLRenderer({ canvas, antialias: false });
      ctrlRef.current = new OrbitControls(three.camera, canvas);
      three.camera.position.set(0, 0, 200);
      Object.assign(ctrlRef.current, {
        enableDamping: true,
        autoRotate: true,
        autoRotateSpeed: 0.2,
        enableRotate: true,
        rotateSpeed: 0.5,
        enablePan: false,
        enableZoom: true,
        minDistance: 50 * 1.1,
        maxDistance: three.camera.far - 50,
      });
    },
    [three.camera]
  );
  const setMouseXY = useCallback(
    (e: MouseEvent) => {
      const { width, height, left, top } = rect;
      three.mouse.set(
        ((e.clientX - left) / width) * 2 - 1,
        -((e.clientY - top) / height) * 2 + 1
      );
    },
    [rect, three.mouse]
  );

  useEffect(() => {
    const { width, height } = rect;
    three.camera.aspect = width / height;
    three.camera.updateProjectionMatrix();
    rendRef.current?.setSize(width, height);
    rendRef.current?.setPixelRatio(devicePixelRatio);
  }, [rect, three.camera]);

  useEffect(() => {
    const tick = () => {
      ctrlRef.current?.update();
      rendRef.current?.render(three.scene, three.camera);
      reqRef.current = requestAnimationFrame(tick);
    };
    reqRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(reqRef.current);
    };
  }, [three.scene, three.camera]);

  return (
    <Box
      as="canvas"
      ref={onCanvasLoad}
      onMouseMove={setMouseXY}
      onMouseDown={three.setRay}
      userSelect="none"
      borderRadius="xl"
    />
  );
};
