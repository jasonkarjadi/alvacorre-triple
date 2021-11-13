import { Box } from "@chakra-ui/react";
import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import {
  Group,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pnts, Rels } from "../types";
import { genCurve } from "../utils/genCurve";
import { genPoint } from "../utils/genPoint";
import { toXYZ } from "../utils/toXYZ";

interface GlobeProps {
  rect: DOMRect;
  ctrys: Group[];
  pnts: Pnts;
  rels: Rels;
  // setBool: { on: () => void; off: () => void; toggle: () => void };
  // contents?: {
  //   iso: string;
  //   imports: string[];
  //   family: string;
  //   form: string;
  //   wordOrder: string;
  // }[];
}

export const Globe: FC<GlobeProps> = ({ rect, ctrys, pnts, rels }) => {
  const reqRef = useRef(0);
  const rendRef = useRef<WebGLRenderer>();
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const ctrlRef = useRef<OrbitControls>();
  const sceneRef = useRef(new Scene());
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const relsRef = useRef<(Mesh | Group)[]>([]);
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
    const xName = rayRef.current.intersectObjects(
      ctrys.map((c) => c.children[0])
    )[0]?.object.name;
    if (xName) {
      const pntsFilter = (name: string) =>
        pnts.filter(({ NAME }) => NAME === name)[0];
      const pntA = pntsFilter(xName);
      const [ax, ay, az] = toXYZ(pntA.LAT, pntA.LNG, 50);
      const start = genPoint(ax, ay, az);
      const filEnds = rels
        .filter(({ A, B }) => A === xName || B === xName)
        .map(({ A, B }) => (A !== xName ? A : B));
      console.log([xName, ...filEnds]);
      if (relsRef.current.length) sceneRef.current.remove(...relsRef.current);
      relsRef.current = !filEnds.length
        ? [start]
        : [start, ...filEnds.map((D) => genCurve(pntA, pntsFilter(D), 50))];
      sceneRef.current.add(...relsRef.current);
    }
  }, [ctrys, pnts, rels]);

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
