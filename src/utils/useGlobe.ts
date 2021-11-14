import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
} from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Ctrys, Pnts, Rels } from "../types";
import { genCurve } from "./genCurve";
import { genLineGeom, genMeshGeom } from "./genGeom";
import { genPoint } from "./genPoint";
import { toXYZ } from "./toXYZ";

export const useGlobe = (countries: Ctrys, points: Pnts, relations: Rels) => {
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const sceneRef = useRef(new Scene());
  const relsRef = useRef<(Mesh | Group)[]>([]);
  const worldMemo = useMemo(() => {
    return countries.map(({ properties, geometry }) => {
      const isPoly = geometry.type === "Polygon";
      const polys = isPoly ? [geometry.coordinates] : geometry.coordinates;
      const meshGeoms = polys.map((c) => genMeshGeom(c, 50, 1));
      const lineGeoms = polys.map((c) => genLineGeom(c, 50, 1));
      const ctryMesh = new Mesh(
        mergeBufferGeometries(meshGeoms),
        new MeshBasicMaterial({ color: 0x171923 })
      );
      const ctryLine = new LineSegments(
        mergeBufferGeometries(lineGeoms),
        new LineBasicMaterial({ color: 0xf6ad55 })
      );
      ctryMesh.name = properties.NAME;
      const ctryGroup = new Group().add(ctryMesh, ctryLine);
      return ctryGroup;
    });
  }, [countries]);
  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const ctryMeshes = worldMemo.map((c) => c.children[0]);
    const xName = rayRef.current.intersectObjects(ctryMeshes)[0]?.object.name;
    if (xName) {
      const pntsFilter = (n: string) => points.filter((p) => n === p.NAME)[0];
      const pntA = pntsFilter(xName);
      const [ax, ay, az] = toXYZ(pntA.LAT, pntA.LNG, 50);
      const isX = (n: string) => n === xName;
      const filRels = relations.filter(({ A, B }) => isX(A) || isX(B));
      if (relsRef.current[0]) sceneRef.current.remove(...relsRef.current);
      relsRef.current = [genPoint(ax, ay, az)];
      if (filRels[0]) {
        const filEnds = filRels.map(({ A, B }) => (isX(A) ? B : A));
        const groups = filEnds.map((D) => genCurve(pntA, pntsFilter(D), 50));
        relsRef.current.push(...groups);
      }
      sceneRef.current.add(...relsRef.current);
    }
  }, [worldMemo, points, relations]);
  // change area/line color of selected

  useEffect(() => {
    sceneRef.current.add(...worldMemo);
  }, [worldMemo]);

  return {
    camera: camRef.current,
    mouse: mouseRef.current,
    scene: sceneRef.current,
    setRay,
  };
};
