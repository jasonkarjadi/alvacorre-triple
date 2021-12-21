import { IconButton } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { GetStaticProps } from "next";
import DynamicNamespaces from "next-translate/DynamicNamespaces";
import useTranslation from "next-translate/useTranslation";
import {
  FC,
  JSXElementConstructor,
  ReactElement,
  SetStateAction,
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
import { CrossAikon } from "../components/Aikon";
import { Canvas } from "../components/Canvas";
import { ContentWrap } from "../components/ContentWrap";
import { Listable } from "../components/Listable";
import { Listables } from "../components/Listables";
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
  const [pair, setPair] = useState<XMesh>();
  const [content, setContent] = useState<string>();
  const [ns, setNs] = useState<string[]>();
  const [tableData, setTableData] = useState<string[][]>();

  const setRay = useCallback(() => {
    rayRef.current.setFromCamera(mouseRef.current, camRef.current);
    const hit = rayRef.current.intersectObjects(earthRef.current)[0];
    if (hit) {
      const hitGrp = hit.object.parent! as Group;
      const removePair = () => {
        pair?.material.color.sub(diffRef.current);
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
            setPair(rel);
            rel.material.color.add(diffRef.current);
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
    keyicon: ReactElement<any, JSXElementConstructor<any>>;
    isLeft: boolean;
    nsArray: string[] | undefined;
    exFunc?: () => void;
  }

  const AikonBaten: FC<AikonBatenProps> = ({
    keystring,
    keyicon,
    isLeft,
    nsArray,
    exFunc,
  }) => {
    const { t } = useTranslation("globe");
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
            setNs(undefined);
          } else {
            setContent(keystring);
            if (exFunc) {
              exFunc();
              return;
            }
            console.log("setNs executed");
            setNs(nsArray);
          }
        }}
      />
    );
  };

  const findRel = (a: string, b: string) =>
    rels.find((x) => x.A === a && x.B === b);

  return (
    <Box h="full" w="full" ref={wrapRef} pos="relative">
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
              <></>
            ) : content === "listables" ? (
              <Listables
                setContent={setContent}
                ns={ns}
                setTableData={setTableData}
              />
            ) : (
              <Listable content={content} tableData={tableData} />
            )}
          </DynamicNamespaces>
        </ContentWrap>
      )}
      {curr && (
        <>
          <AikonBaten
            keystring="overview"
            keyicon={<></>}
            isLeft={true}
            nsArray={[
              !pair
                ? `ctrys/${curr.name}`
                : `rels/${
                    findRel(curr.name, pair.name)
                      ? `${curr.name} ${pair.name}`
                      : `${pair.name} ${curr.name}`
                  }`,
            ]}
          />
          <Box
            pos="absolute"
            bottom="12px"
            left={innerWidth / 2}
            transform="translateX(-50%)"
            zIndex="1"
            color="white"
          >
            {curr.name}
            {pair && (
              <>
                <br />
                {pair.name}
              </>
            )}
          </Box>
          <AikonBaten
            keystring="listables"
            keyicon={<></>}
            isLeft={false}
            nsArray={(!pair
              ? data?.find((x) => x.NAME === curr.name)
              : findRel(curr.name, pair.name) || findRel(pair.name, curr.name)
            )?.LISTABLES.map((x) => `listables/${x}`)}
            exFunc={tableData && (() => setTableData(undefined))}
          />
        </>
      )}
    </Box>
  );
  // const findRel = (a: string, b: string) =>
  //   rels.find((x) => x.A === a && x.B === b);
};

export const getStaticProps: GetStaticProps = () => {
  return { props: { rels } };
};

export default GlobePage;
