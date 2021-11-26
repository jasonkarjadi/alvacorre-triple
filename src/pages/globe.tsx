import { ButtonGroup, IconButton } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
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
import { CrossAikon, MenuAikon, UndoAikon } from "../components/Aikon";
import { Canvas } from "../components/Canvas";
import { InfoWindow } from "../components/InfoWindow";
import { Localer } from "../components/Localer";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import { Ctrys, Pnts, Rels } from "../types";
import { genCurve } from "../utils/genCurve";
import { genLineGeom } from "../utils/genGeom";
import { geoPolyTrnglt } from "../utils/geoPolyTrnglt";

type CtryMesh = Mesh<BufferGeometry, MeshBasicMaterial>;

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
  const nsRef = useRef("globe");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [data, setData] = useState<Ctrys>();
  const [curr, setCurr] = useState<Group>();
  const [pair, setPair] = useState<string | number>(0);
  const { t } = useTranslation("globe");

  const getColour = useCallback(
    (x: Group) => (x.children as CtryMesh[])[0].material.color,
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

  const handleOff = useCallback(
    (hitGrp: Group) => {
      getColour(hitGrp).sub(diffRef.current);
      if (relsRef.current[0]) sceneRef.current.remove(...relsRef.current);
      relsRef.current = [];
      setCurr(undefined);
    },
    [getColour]
  );

  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const hit = rayRef.current.intersectObjects(earthRef.current)[0];
    if (hit) {
      const hitGrp = hit.object.parent! as Group;
      if (!curr) {
        handleOn(hitGrp); // from zero to one and many
      } else if (curr.name === hitGrp.name) {
        handleOff(hitGrp); // from one and many to zero
      } else {
        const rel = relsRef.current.filter((x) => x.name === hitGrp.name)[0];
        if (rel) {
          setPair(rel.name); // open slide of rel
        }
      }
    }
  }, [curr, handleOn, handleOff]);

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
      <Localer ns={nsRef.current} placement="bottom" />
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
        {curr && pair ? <InfoWindow curr={curr.name} pair={pair} /> : undefined}
      </Box>
      {curr && (
        <ButtonGroup
          pos="absolute"
          bottom={3}
          left={innerWidth / 2}
          zIndex="1"
          h={9}
          w={(innerWidth - 24) / 4}
          isAttached
        >
          <IconButton
            aria-label="Exit Back"
            icon={pair ? <UndoAikon /> : <CrossAikon />}
            flex={1}
            bg="gray.900"
            color="tan"
            borderTopLeftRadius="none"
            borderBottomLeftRadius="xl"
            onClick={() => {
              if (!pair) {
                handleOff(curr);
              } else {
                setPair(0);
              }
            }}
          />
          <Menu placement="top" isLazy>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
              icon={<MenuAikon />}
              flex={1}
              bg="gray.900"
              color="tan"
              borderTopRightRadius="none"
              borderBottomRightRadius="xl"
            />
            <MenuList userSelect="none">
              <MenuItem onClick={() => setPair(1)}>
                {t("characteristics")}
              </MenuItem>
              <MenuItem onClick={() => setPair(2)}>{t("listables")}</MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { points, relations } };
};

export default GlobePage;
