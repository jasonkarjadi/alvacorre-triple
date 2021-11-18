import { useCallback, useEffect, useRef } from "react";
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
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import countries from "../data/ne_110m_admin_0_countries";
import { genCurve } from "./genCurve";
import { genLineGeom, genMeshGeom } from "./genGeom";

export const useGlobe = () => {
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const sceneRef = useRef(new Scene());
  const earthRef = useRef<Group[]>([]);
  const relsRef = useRef<Mesh[]>([]);

  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const hit = rayRef.current.intersectObjects(earthRef.current)[0];
    if (hit) {
      const pntsFilter = (n: string) => points.filter((p) => n === p.NAME)[0];
      const pntA = pntsFilter(hit.object.parent!.name);
      const isX = (n: string) => n === hit.object.parent!.name;
      const filRels = relations.filter(({ A, B }) => isX(A) || isX(B));
      if (relsRef.current[0]) sceneRef.current.remove(...relsRef.current);
      if (filRels[0]) {
        const filEnds = filRels.map(({ A, B }) => (isX(A) ? B : A));
        const lines = filEnds.map((D) => genCurve(pntA, pntsFilter(D), 50));
        relsRef.current = lines;
      }
      sceneRef.current.add(...relsRef.current);
    }
  }, []);
  // change area/line color of selected

  useEffect(() => {
    (() => {
      // const res = await fetch(
      //   "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson"
      // );
      // const data: FeatColl = await res.json();
      const ctryMeshGroups = countries.map(({ properties, geometry }) => {
        const isPoly = geometry.type === "Polygon";
        const polys = isPoly ? [geometry.coordinates] : geometry.coordinates;
        const meshGroup = new Group();
        polys.map((c) =>
          meshGroup.add(
            new Mesh(
              genMeshGeom(c, 50, 1),
              new MeshBasicMaterial({ color: 0x171923 })
            )
          )
        );
        const lineGroup = new Group();
        polys.map((c) =>
          lineGroup.add(
            new LineSegments(
              genLineGeom(c, 50, 1),
              new LineBasicMaterial({ color: 0xf6ad55 })
            )
          )
        );
        meshGroup.name = properties.NAME;
        sceneRef.current.add(meshGroup, lineGroup);
        return meshGroup;
      });
      earthRef.current = ctryMeshGroups;
    })();
  }, []);

  return {
    camera: camRef.current,
    mouse: mouseRef.current,
    scene: sceneRef.current,
    setRay,
  };
};
