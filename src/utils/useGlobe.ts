import { useCallback, useEffect, useRef, useState } from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
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
import { FeatColl, ThreeData } from "../types";
import { genCurve } from "./genCurve";
import { genLineGeom } from "./genGeom";
import { geoPolyTrnglt } from "./geoPolyTrnglt";

type CtryMesh = Mesh<BufferGeometry, MeshBasicMaterial>;
type SetBool = { on: () => void; off: () => void; toggle: () => void };

export const useGlobe = (
  { points, relations }: ThreeData,
  setBool: SetBool
) => {
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const sceneRef = useRef(new Scene());
  const earthRef = useRef<Group[]>([]);
  const prevHitRef = useRef<Group>();
  const relsRef = useRef<Mesh[]>([]);
  const [data, setData] = useState<FeatColl>();

  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const hit = rayRef.current.intersectObjects(earthRef.current)[0];
    if (hit) {
      const hitCtry = hit.object.parent! as Group;
      if (hitCtry.name !== prevHitRef.current?.name) {
        const colourDiff = new Color(0x333333);
        const getColour = (x: Group) =>
          (x.children as CtryMesh[])[0].material.color;
        if (prevHitRef.current) getColour(prevHitRef.current).sub(colourDiff);
        if (relsRef.current[0]) sceneRef.current.remove(...relsRef.current);
        // 0x1c4532 green
        getColour(hitCtry).add(colourDiff);
        prevHitRef.current = hitCtry;
        const pntsFilter = (n: string) => points.filter((p) => n === p.NAME)[0];
        const pntA = pntsFilter(hitCtry.name);
        const isX = (n: string) => n === hitCtry.name;
        const filRels = relations.filter(({ A, B }) => isX(A) || isX(B));
        if (filRels[0]) {
          const filEnds = filRels.map(({ A, B }) => (isX(A) ? B : A));
          const lines = filEnds.map((D) => genCurve(pntA, pntsFilter(D), 50));
          relsRef.current = lines;
          sceneRef.current.add(...relsRef.current);
        }
        setBool.on();
      }
    }
  }, [points, relations, setBool]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
      );
      setData(await res.json());
    })();
  }, []);

  useEffect(() => {
    if (!data) return;
    const meshGrps = data.features.map(({ properties, geometry }) => {
      const isPoly = geometry.type === "Polygon";
      const polys = isPoly ? [geometry.coordinates] : geometry.coordinates;
      const meshMatl = new MeshBasicMaterial({ color: 0x171923 });
      const meshGrp = new Group();
      polys.map((c) => {
        const { verts, inds } = geoPolyTrnglt(c, 50, 1);
        const meshGeom = new BufferGeometry()
          .setIndex(inds)
          .setAttribute("position", new Float32BufferAttribute(verts, 3));
        meshGeom.computeVertexNormals();
        meshGrp.add(new Mesh(meshGeom, meshMatl));
      });
      const lineMatl = new LineBasicMaterial({ color: 0xf6ad55 });
      const lineGrp = new Group();
      polys.map((c) =>
        lineGrp.add(new LineSegments(genLineGeom(c, 50, 1), lineMatl))
      );
      meshGrp.name = properties.NAME;
      sceneRef.current.add(meshGrp, lineGrp);
      return meshGrp;
    });
    earthRef.current = meshGrps;
  }, [data]);

  return {
    camera: camRef.current,
    mouse: mouseRef.current,
    scene: sceneRef.current,
    setRay,
  };
};
