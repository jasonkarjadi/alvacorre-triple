import { Button, IconButton, IconButtonProps } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerBody,
} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
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
import { Content } from "../components/Content";
import points from "../data/countries_central_coordinates";
import relations from "../data/curves_relations";
import { Ctrys, Pnts, Rels } from "../types";
import { genCurve } from "../utils/genCurve";
import { genLineGeom } from "../utils/genGeom";
import { geoPolyTrnglt } from "../utils/geoPolyTrnglt";

const AikonBaten: FC<IconButtonProps> = (props) => {
  return (
    <IconButton
      {...props}
      w={9}
      h={9}
      pos="absolute"
      bottom="12px"
      bg="gray.900"
      color="tan"
    />
  );
};

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("globe");

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
    setResize();
    addEventListener("resize", setResize);
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
          p={3}
          pb={14}
          zIndex="1"
          bg="orange.100"
        >
          <DynamicNamespaces namespaces={[ns]} fallback="Loading...">
            <Content
              ns={ns}
              setNs={setNs}
              pageNum={pageNum}
              setPageNum={setPageNum}
            />
          </DynamicNamespaces>
        </Box>
      )}
      {curr && (
        <AikonBaten
          aria-label={!ns ? t("deselect") : !pageNum ? t("globe") : t("back")}
          icon={!ns ? <CrossAikon /> : <UndoAikon />}
          left="12px"
          zIndex="2"
          onClick={() =>
            !ns ? handleOff() : !pageNum ? setNs("") : setPageNum(0)
          }
        />
      )}
      {curr && (
        <AikonBaten
          aria-label={"More"}
          icon={<MenuAikon />}
          right="12px"
          zIndex="2"
          onClick={onOpen}
        />
      )}
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody p={0} display="flex">
            <Button
              flex={1}
              borderRadius="none"
              onClick={() => setNs(`characteristics/${curr?.name}`)}
            >
              {t("characteristics")}
            </Button>
            <Button
              flex={1}
              borderRadius="none"
              onClick={() => setNs(`listables/${curr?.name}`)}
            >
              {t("listables")}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { points, relations } };
};

export default GlobePage;
