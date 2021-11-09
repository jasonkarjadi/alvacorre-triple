import { Box, useBoolean } from "@chakra-ui/react";
import { geoInterpolate } from "d3-geo";
import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import {
  CubicBezierCurve3,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  TubeGeometry,
  Vector2,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Slide } from "./Slide";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { genLineGeom, genMeshGeom } from "../utils/genGeom";
import features from "../ne_110m_admin_0_countries";

interface GlobeProps {
  contents?: {
    iso: string;
    imports: string[];
    family: string;
    form: string;
    wordOrder: string;
  }[];
}

export const Globe: FC<GlobeProps> = () => {
  const [isSlide, setIsSlide] = useBoolean(false);
  const requestRef = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rendRef = useRef<WebGLRenderer>();
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const ctrlRef = useRef<OrbitControls>();
  const radRef = useRef(50);
  const sceneRef = useRef(new Scene());
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const worldRef = useRef(
    features.map(({ geometry }) => {
      const polygons =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;
      const meshGeoms =
        polygons.map((c) => genMeshGeom(c, radRef.current, 1)) || [];
      const countryMesh = new Mesh(
        !meshGeoms.length ? undefined : mergeBufferGeometries(meshGeoms),
        new MeshBasicMaterial({ color: 0x101ab3 })
      );
      const lineGeoms =
        polygons.map((c) => genLineGeom(c, radRef.current, 1)) || [];
      const countryLine = new LineSegments(
        !lineGeoms.length ? undefined : mergeBufferGeometries(lineGeoms),
        new LineBasicMaterial({ color: 0xf78f2e })
      );
      const group = new Group().add(countryMesh, countryLine);
      sceneRef.current.add(group);
      return countryMesh;
    })
  );
  const onCanvasLoaded = useRef(
    (canvas: HTMLCanvasElement & HTMLDivElement) => {
      if (!canvas) return;
      rendRef.current = new WebGLRenderer({ canvas, antialias: false });
      ctrlRef.current = new OrbitControls(camRef.current, canvas);
      camRef.current.position.set(0, 0, 200);
      Object.assign(ctrlRef.current, {
        enableDamping: true,
        rotateSpeed: 0.5,
        autoRotate: true,
        autoRotateSpeed: 0.2,
        enablePan: false,
        minDistance: radRef.current * 2,
        maxDistance: camRef.current.position.z * 2,
      });

      // const start = languages[0].coords;
      // const end = languages[1].coords;
      // const startXYZ = convertLatLng(start.lat, start.lng, radRef.current);
      // const endXYZ = convertLatLng(end.lat, end.lng, radRef.current);

      // const d3Interpolate = geoInterpolate(
      //   [start.lng, start.lat],
      //   [end.lng, end.lat]
      // );
      // const ctrlA = d3Interpolate(0.25);
      // const ctrlB = d3Interpolate(0.75);
      // const arcHeight = startXYZ.distanceTo(endXYZ) * 0.5 + radRef.current;
      // const ctrlXYZA = convertLatLng(ctrlA[1], ctrlA[0], arcHeight);
      // const ctrlXYZB = convertLatLng(ctrlB[1], ctrlB[0], arcHeight);
      // const curve = new CubicBezierCurve3(startXYZ, ctrlXYZA, ctrlXYZB, endXYZ);

      // const points: Vector3[] = [];
      // for (let i = 0; i <= 20; i++) {
      //   const p = new Vector3().lerpVectors(startXYZ, endXYZ, i / 20);
      //   p.multiplyScalar(1 + 0.5 * Math.sin((Math.PI * i) / 20));
      //   points.push(p);
      // }
      // const curve = new CatmullRomCurve3(points);

      // const curveObject = new Line(
      //   new TubeGeometry(curve, 20, 0.01, 8),
      //   new LineBasicMaterial({ color: 0x00ff00 })
      // );
      // sceneRef.current.add(curveObject);
    }
  );

  const setResize = () => {
    const { width, height } = wrapRef.current!.getBoundingClientRect();
    camRef.current.aspect = width / height;
    camRef.current.updateProjectionMatrix();
    rendRef.current!.setSize(width, height);
    rendRef.current!.setPixelRatio(devicePixelRatio);
  }; // useCallback?

  const setMouseVector = (e: MouseEvent) => {
    const { width, height, left, top } =
      wrapRef.current!.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - left) / width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - top) / height) * 2 + 1;
  }; //useCallback?

  const tick = useCallback(() => {
    ctrlRef.current!.update();
    rendRef.current!.render(sceneRef.current, camRef.current);
    requestAnimationFrame(tick);
  }, []);

  const setPointRaycaster = () => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const intersects = rayRef.current.intersectObjects(worldRef.current!);
    if (intersects.length) {
      console.log("hit");
      // setIsSlide.on();
      // const clicked = contents.filter(
      //   ({ iso }) => iso === intersects[0].object.name
      // )[0];
      // clicked.imports;
      // Object.assign(ctrlRef.current, {
      //   target: intersects[0].object.position,
      //   enableRotate: false,
      //   enableZoom: false,
      //   autoRotate: false,
      // });
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    addEventListener("resize", setResize);
    setResize();
    return () => {
      cancelAnimationFrame(requestRef.current);
      removeEventListener("resize", setResize);
    };
  }, [tick]);

  return (
    <Box flex={1} w="full" ref={wrapRef} pos="relative">
      <Slide useBoolean={[isSlide, setIsSlide]} />
      <Box
        as="canvas"
        ref={onCanvasLoaded.current}
        onMouseMove={setMouseVector}
        onMouseDown={setPointRaycaster}
        userSelect="none"
        borderRadius="xl"
      />
    </Box>
  );
};
