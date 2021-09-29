import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
  fragmentShader,
  vertexShader,
} from "./shaders";

interface GlobeProps {
  localeState: {
    isLocaleMode: boolean;
    setIsLocaleMode: Dispatch<SetStateAction<boolean>>;
  };
  itemState1: {
    item1: string | null;
    setItem1: Dispatch<SetStateAction<string | null>>;
  };
  itemState2: {
    item2: string | null;
    setItem2: Dispatch<SetStateAction<string | null>>;
  };
}

const Globe: React.FC<GlobeProps> = ({
  itemState1: { item1, setItem1 },
  itemState2: { item2, setItem2 },
}) => {
  const setResize = (renderer: WebGLRenderer, camera: PerspectiveCamera) => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  const setMouseVector = (e: MouseEvent, mouse: Vector2) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
  };
  const setPointRaycaster = (
    raycaster: Raycaster,
    mouse: Vector2,
    camera: PerspectiveCamera,
    points: Mesh<SphereGeometry, MeshBasicMaterial>[]
  ) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(points);
    if (intersects.length > 0) {
      console.log(intersects[0].object.name);
      if (!item1) {
        setItem1(intersects[0].object.name);
      } else if (!item2) {
        setItem2(intersects[0].object.name);
      } else {
        setItem2(intersects[0].object.name);
      }
    }
  };

  useEffect(() => {
    return () => {
      removeEventListener("resize", () => setResize);
      removeEventListener("mousemove", () => setMouseVector);
      removeEventListener("mousedown", () => setPointRaycaster);
    };
  }, []);

  const onCanvasLoaded = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) {
      return;
    }

    const renderer = new WebGLRenderer({ canvas });
    const camera = new PerspectiveCamera(50, 2, 1, 100);
    const controls = new OrbitControls(camera, canvas);
    renderer.setPixelRatio(devicePixelRatio);
    camera.position.set(0, 0, 18);
    Object.assign(controls, {
      enableDamping: true,
      rotateSpeed: 0.5,
      autoRotate: true,
      autoRotateSpeed: 0.2,
      enablePan: false,
      enableZoom: false,
    });
    setResize(renderer, camera);
    addEventListener("resize", () => setResize(renderer, camera));

    const radius = 5;
    const sphereGeometry = new SphereGeometry(radius, 50, 50);
    const globe = new Mesh(
      sphereGeometry,
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
    const atmosphere = new Mesh(
      sphereGeometry,
      new ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: AdditiveBlending,
        side: BackSide,
      })
    );
    globe.rotation.y = -Math.PI / 2;
    atmosphere.scale.set(1.05, 1.05, 1.05);
    const group = new Group();
    const scene = new Scene();
    group.add(globe);
    scene.add(group, atmosphere);

    const points: Mesh<SphereGeometry, MeshBasicMaterial>[] = [];
    const createPoint = (name: string, x: number, y: number, z: number) => {
      const point = new Mesh(
        new SphereGeometry(0.2, 50, 50),
        new MeshBasicMaterial({
          color: "#ffffff",
        })
      );
      point.position.set(radius * x, radius * y, radius * z);
      point.name = name;
      group.add(point);
      points.push(point);
    };
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

    const mouse = new Vector2();
    const raycaster = new Raycaster();
    addEventListener("mousemove", (e) => setMouseVector(e, mouse));
    addEventListener("mousedown", () =>
      setPointRaycaster(raycaster, mouse, camera, points)
    );

    const tick = () => {
      raycaster.setFromCamera(mouse, camera);
      if (raycaster.intersectObject(globe).length > 0) {
        controls.autoRotate = false;
      } else {
        controls.autoRotate = true;
      }
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();
  };

  return (
    <Box
      as="canvas"
      ref={
        onCanvasLoaded as ((instance: HTMLDivElement | null) => void) &
          ((instance: HTMLCanvasElement | null) => void)
      }
    />
  );
};

export default Globe;

// Points
// const points = [];
// const createPoint = (lat, lng, name) => {
//   const point = new THREE.Mesh(
//     new THREE.SphereGeometry(0.1, 50, 50),
//     new THREE.MeshBasicMaterial({
//       color: "#FF0000",
//     })
//   );
//   // Latitude and Longitude
//   const latitude = (lat / 180) * Math.PI;
//   const longitude = (lng / 180) * Math.PI;
//   // X, Y, X Coordinates
//   const pointX = radius * Math.cos(latitude) * Math.sin(longitude);
//   const pointY = radius * Math.sin(latitude);
//   const pointZ = radius * Math.cos(latitude) * Math.cos(longitude);
//   point.position.set(pointX, pointY, pointZ);
//   point.name = name;
//   group.add(point);
//   points.push(point);
//   // console.log(point);
// };
// createPoint(-0.7893, 113.9213, "INA"); // Indonesia
// createPoint(36.2048, 138.2529, "JPN"); // Japan
// createPoint(55.3781, -3.436, "ENG"); // United Kingdom
