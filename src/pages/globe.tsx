import { Box } from "@chakra-ui/layout";
import { GetStaticProps } from "next";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
import { FC, useCallback, useEffect, useRef, useState } from "react";
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
import { BatenGrup } from "../components/BatenGrup";
import { Canvas } from "../components/Canvas";
import { InfoWindow } from "../components/InfoWindow";
import { Localer } from "../components/Localer";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import { Ctrys, Pnts, Rels } from "../types";
import { genCurve } from "../utils/genCurve";
import { genLineGeom } from "../utils/genGeom";
import { geoPolyTrnglt } from "../utils/geoPolyTrnglt";

interface GlobePageProps {
  points: Pnts;
  relations: Rels;
}

const GlobePage: FC<GlobePageProps> = ({ points, relations }) => {
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const sceneRef = useRef(new Scene());
  const diffRef = useRef(new Color(0x333333));
  const earthRef = useRef<Group[]>([]);
  const relsRef = useRef<Mesh[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [data, setData] = useState<Ctrys>();
  const [curr, setCurr] = useState<Group>();
  const [ns, setNs] = useState("");
  const [pageNum, setPageNum] = useState(0);

  const getColour = useCallback(
    (x: Group) =>
      (x.children as Mesh<BufferGeometry, MeshBasicMaterial>[])[0].material
        .color,
    []
  );

  const handleOn = useCallback(
    (hitGrp: Group) => {
      getColour(hitGrp).add(diffRef.current);
      const rels: Mesh[] = [];
      const isX = (x: string) => x === hitGrp.name;
      const filRels = relations.filter(({ A, B }) => isX(A) || isX(B));
      if (filRels[0]) {
        const pntsFilter = (x: string) => points.filter((p) => x === p.NAME)[0];
        const pntA = pntsFilter(hitGrp.name);
        const filEnds = filRels.map(({ A, B }) => (isX(A) ? B : A));
        const lines = filEnds.map((D) => genCurve(pntA, pntsFilter(D), 50));
        rels.push(...lines);
        sceneRef.current.add(...lines);
      }
      relsRef.current = rels;
      setCurr(hitGrp);
    },
    [points, relations, getColour]
  );

  const handleOff = useCallback(() => {
    getColour(curr!).sub(diffRef.current);
    if (relsRef.current[0]) sceneRef.current.remove(...relsRef.current);
    relsRef.current = [];
    setCurr(undefined);
  }, [curr, getColour]);

  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const hit = rayRef.current.intersectObjects(earthRef.current)[0];
    if (hit) {
      const hitGrp = hit.object.parent! as Group;
      if (!curr) {
        handleOn(hitGrp); // from zero to one and many
      } else if (curr.name === hitGrp.name) {
        handleOff(); // from one and many to zero
      } else {
        const rel = relsRef.current.find((x) => x.name === hitGrp.name);
        if (rel) {
          if (relations.find(({ A, B }) => A === curr.name && B === rel.name)) {
            setNs(`relations/${curr.name} ${rel.name}`);
          } else {
            setNs(`relations/${rel.name} ${curr.name}`);
          } // open slide of rel
        }
      }
    }
  }, [curr, handleOn, handleOff, relations]);

  useEffect(() => {
    const setResize = () => {
      setRect(undefined);
      setRect(wrapRef.current?.getBoundingClientRect());
    };
    addEventListener("resize", setResize);
    setResize();
    (async () => {
      // const res = await fetch(
      //   "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
      // );
      setData((await import("../data/ne_110m_admin_0_countries")).default);
    })();
    return () => {
      removeEventListener("resize", setResize);
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const meshGrps = data.map(({ properties, geometry }) => {
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

  return (
    <>
      <Localer ns="globe" placement="bottom" />
      <Box flex={1} w="full" ref={wrapRef} pos="relative">
        {rect && (
          <Canvas
            rect={rect}
            camera={camRef.current}
            mouse={mouseRef.current}
            scene={sceneRef.current}
            setRay={setRay}
          />
        )}
        {ns && (
          <Box
            pos="absolute"
            top="0"
            left="0"
            h="full"
            w="full"
            bg="orange.100"
          >
            <DynamicNamespaces namespaces={[ns]} fallback="Loading...">
              <InfoWindow
                ns={ns}
                setNs={setNs}
                pageNum={pageNum}
                setPageNum={setPageNum}
              />
            </DynamicNamespaces>
          </Box>
        )}
      </Box>
      <BatenGrup
        currName={curr?.name}
        ns={ns}
        setNs={setNs}
        handleOff={handleOff}
        pageNum={pageNum}
        setPageNum={setPageNum}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { points, relations } };
};

export default GlobePage;
