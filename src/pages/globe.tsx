import { IconButton } from "@chakra-ui/button";
import { Box, BoxProps, Center, StackProps, VStack } from "@chakra-ui/layout";
import { GetStaticProps } from "next";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ColumnsAikon, CrossAikon, ScrollAikon } from "../components/Aikon";
import { Canvas } from "../components/Canvas";
import { ContentWrap } from "../components/ContentWrap";
import { Listable } from "../components/Listable";
import { Listables } from "../components/Listables";
import { Overview } from "../components/Overview";
import { Penggeser } from "../components/Penggeser";
import rels from "../data/rels";
import { Ctry, Rel } from "../types";
import { genCurve, genLineGeom, geoPolyTrnglt } from "../utils";

type XMesh = Mesh<any, MeshBasicMaterial>;
interface GlobePageProps {
  rels: Rel[];
}

const GlobePage: FC<GlobePageProps> = ({ rels }) => {
  const camRef = useRef(new PerspectiveCamera(50, 2, 1, 1000));
  const mouseRef = useRef(new Vector2());
  const rayRef = useRef(new Raycaster());
  const sceneRef = useRef(new Scene());
  const diffRef = useRef(new Color(0x333333));
  const earthRef = useRef<Group[]>([]);
  const relsRef = useRef<XMesh[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();
  const [data, setData] = useState<Ctry[]>();
  const [curr, setCurr] = useState<Group>();
  const [pair, setPair] = useState<Group>();
  const [content, setContent] = useState<string>();
  const [ns, setNs] = useState<string[]>();
  const [pgdTblData, setPgdTblData] = useState<string[][][]>();
  const [sliderVal, setSliderVal] = useState(0);
  const [maxRows, setMaxRows] = useState(12);
  const { t } = useTranslation("globe");

  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const hit = rayRef.current.intersectObjects(earthRef.current)[0];
    if (hit) {
      const hitGrp = hit.object.parent! as Group;
      const removePair = () => {
        pair && (pair.children[0] as XMesh).material.color.sub(diffRef.current);
        setPair(undefined);
      };
      if (!curr) {
        (hitGrp.children[0] as XMesh).material.color.add(diffRef.current);
        const relArray: XMesh[] = [];
        const isX = (x: string) => x === hitGrp.name;
        const filRels = rels.filter(({ A, B }) => isX(A) || isX(B));
        if (filRels[0]) {
          const ctryFind = (x: string) => data?.find((p) => x === p.NAME);
          const pntA = ctryFind(hitGrp.name);
          const filEnds = filRels.map(({ A, B }) => (isX(A) ? B : A));
          const lines = filEnds.map((D) => genCurve(pntA!, ctryFind(D)!, 50));
          relArray.push(...lines);
          sceneRef.current.add(...lines);
        }
        relsRef.current = relArray;
        setCurr(hitGrp);
      } else if (curr.name === hitGrp.name) {
        (curr.children[0] as XMesh).material.color.sub(diffRef.current);
        if (relsRef.current[0]) sceneRef.current.remove(...relsRef.current);
        relsRef.current = [];
        setCurr(undefined);
        removePair();
      } else {
        const rel = relsRef.current.find((x) => x.name === hitGrp.name);
        if (rel) {
          if (rel.name !== pair?.name) {
            removePair();
            (hitGrp.children[0] as XMesh).material.color.add(diffRef.current);
            setPair(hitGrp);
          } else removePair();
        }
      }
    }
  }, [curr, pair, data, rels]);

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
    const meshGrps = data.map(({ NAME, geometry }) => {
      const polys =
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates;
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
      ); // shorten??
      meshGrp.name = NAME;
      sceneRef.current.add(meshGrp, lineGrp);
      return meshGrp;
    });
    earthRef.current = meshGrps;
  }, [data]);

  interface AikonBatenProps {
    keystring: string;
    keyicon: ReactElement;
    isLeft: boolean;
    nsArray: string[] | undefined;
  }

  const AikonBaten: FC<AikonBatenProps> = ({
    keystring,
    keyicon,
    isLeft,
    nsArray,
  }) => {
    const isKey = content === keystring;
    const mpx = "12px";
    return (
      <IconButton
        w={9}
        h={9}
        pos="absolute"
        bottom={mpx}
        zIndex="3"
        bg="gray.900"
        color="tan"
        aria-label={isKey ? t("close") : t(keystring)}
        icon={isKey ? <CrossAikon /> : keyicon}
        left={isLeft ? mpx : undefined}
        right={isLeft ? undefined : mpx}
        onClick={() => {
          if (isKey) {
            setContent(undefined);
          } else {
            setContent(keystring);
            setNs(nsArray);
          }
        }}
      />
    );
  };

  const SliderDisplay: FC<BoxProps & StackProps> = (props) => {
    return (
      <Box
        pos="absolute"
        bottom="12px"
        left={innerWidth / 2}
        transform="translateX(-50%)"
        zIndex="3"
        h={9}
        px={3}
        borderRadius="md"
        fontWeight="bold"
        {...props}
      />
    );
  };

  return (
    <Box h="full" w="full" ref={wrapRef} pos="relative">
      <Head>
        <title>
          {t("navbar:globe")}
          {t("navbar:|")}
          {t("navbar:title")}
        </title>
      </Head>
      {rect && (
        <Canvas
          rect={rect}
          camera={camRef.current}
          mouse={mouseRef.current}
          scene={sceneRef.current}
          setRay={setRay}
        />
      )}
      {content && (
        <ContentWrap pos="absolute" top="0" left="0" zIndex="2" pb={14}>
          <DynamicNamespaces namespaces={ns} fallback="Loading...">
            {content === "overview" ? (
              <Overview ns={ns} />
            ) : content === "listables" ? (
              <Listables
                stringArr={ns}
                onClick={async (x: string) => {
                  const tblData: string[][] = (await import(`../data/${x}`))
                    .default;
                  const pagedTableData: string[][][] = [];
                  const maxPageNum = Math.ceil(tblData.length / maxRows);
                  for (let i = 0; i < maxPageNum; i++) {
                    const n = i * maxRows;
                    pagedTableData.push(tblData.slice(n, n + maxRows));
                  }
                  setPgdTblData(pagedTableData);
                  setContent(x);
                }}
              />
            ) : (
              <Listable
                content={content}
                pgdTblData={pgdTblData}
                sliderVal={sliderVal}
              />
            )}
          </DynamicNamespaces>
        </ContentWrap>
      )}
      {curr && (
        <>
          <AikonBaten
            keystring="overview"
            keyicon={<ScrollAikon />}
            isLeft={true}
            nsArray={[
              !pair
                ? `ctrys/${curr.name}`
                : `rels/${
                    rels.find(({ A, B }) => A === curr.name && B === pair.name)
                      ? `${curr.name} ${pair.name}`
                      : `${pair.name} ${curr.name}`
                  }`,
            ]}
          />
          {content?.includes("listables/") ? (
            <SliderDisplay
              as={Center}
              bg="gray.900"
              w={innerWidth - 120}
              userSelect="none"
            >
              <Penggeser
                pgdTblData={pgdTblData}
                sliderVal={sliderVal}
                setSliderVal={setSliderVal}
              />
            </SliderDisplay>
          ) : (
            <SliderDisplay
              as={!pair ? Center : VStack}
              spacing={0}
              justifyContent="space-evenly"
              color="orange.100"
              fontSize="x-small"
              lineHeight="none"
              bg={!content ? undefined : "gray.900"}
              w={!content ? undefined : innerWidth - 120}
            >
              <Box as="span">{curr.name.toUpperCase()}</Box>
              {pair && <Box as="span">{pair.name.toUpperCase()}</Box>}
            </SliderDisplay>
          )}
          <AikonBaten
            keystring="listables"
            keyicon={<ColumnsAikon />}
            isLeft={false}
            nsArray={(!pair
              ? data?.find((x) => x.NAME === curr.name)
              : rels.find(
                  ({ A, B }) =>
                    (A === curr.name && B === pair.name) ||
                    (A === pair.name && B === curr.name)
                )
            )?.LISTABLES.map((x) => `listables/${x}`)}
          />
        </>
      )}
    </Box>
  );
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { rels } };
};

export default GlobePage;
