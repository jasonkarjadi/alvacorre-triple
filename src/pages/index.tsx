import {
  Box,
  chakra,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AikonBtn,
  FilterAikon,
  Globe,
  GrammarAikon,
  HrzBar,
  LexiconAikon,
  LocalerAikon,
} from "../components";

interface Point {
  iso: string;
  coords: { x: number; y: number; z: number };
}
interface Content {
  langName: string;
  family: string;
  type: {
    form: string;
    wordOrder: string;
  };
}
interface HubProps {
  clickables: Point[];
  content: Content[];
}

const Hub: FC<HubProps> = ({ clickables, content }) => {
  const [itemA, setItemA] = useState(""),
    [itemB, setItemB] = useState(""),
    [isLocaleMode, setIsLocaleMode] = useState(false),
    [isGrammar, setIsGrammar] = useState(true),
    { isOpen, onOpen, onClose } = useDisclosure(),
    { t } = useTranslation("common");

  const filterer = (target: string) =>
    content.filter(({ langName }) => langName === target)[0];
  const openDrawer = (GL: boolean) => {
      onOpen();
      setIsGrammar(GL);
    },
    openGrammar = () => openDrawer(true),
    openLexicon = () => openDrawer(false);
  const toggleLocaleMode = () => setIsLocaleMode(!isLocaleMode);

  useEffect(() => {
    if (!itemA && itemB) {
      setItemA(itemB);
      setItemB("");
    }
  }, [itemA]);

  const MotionBox = chakra(motion.div);
  interface CardProps {
    state: [string, Dispatch<SetStateAction<string>>];
  }
  const CardBox: FC<CardProps> = ({ state }) => {
    return (
      <Box h={16} border="gray dashed 1px" flex={1}>
        {state[0] && (
          <AnimatePresence>
            <MotionBox
              p={3}
              display="flex"
              flexDir="column"
              justifyContent="space-between"
              h={16}
              flex={1}
              bg="gray.900"
              color="white"
              variants={{ visible: { x: 0 }, hidden: { x: innerWidth } }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, i) => {
                if (Math.abs(i.offset.x) > 100) {
                  state[1]("");
                }
              }}
            >
              <Heading fontSize="16px">{t(`${state[0]}`)}</Heading>
              <Text
                fontSize="10px"
                children={`${t(`${filterer(state[0]).family}`)} ${t(
                  `${filterer(state[0]).type.wordOrder}`
                )} ${t(`${filterer(state[0]).type.form}`)}`}
              />
            </MotionBox>
          </AnimatePresence>
        )}
      </Box>
    );
  };

  const CardAMemo = useMemo(
    () => <CardBox state={[itemA, setItemA]} />,
    [itemA]
  );
  const CardBMemo = useMemo(
    () => <CardBox state={[itemB, setItemB]} />,
    [itemB]
  );

  return (
    <>
      <HrzBar isTop={true}>
        {CardAMemo}
        {CardBMemo}
      </HrzBar>
      <Globe
        clickables={clickables}
        isLocaleMode={isLocaleMode}
        stateA={[itemA, setItemA]}
        stateB={[itemB, setItemB]}
      />
      <HrzBar isTop={false}>
        <AikonBtn onClick={toggleLocaleMode} icon={<LocalerAikon />} flex={1} />
        <AikonBtn
          onClick={openGrammar}
          icon={<GrammarAikon />}
          flex={1}
          isDisabled={!itemA}
        />
        <AikonBtn
          onClick={openLexicon}
          icon={<LexiconAikon />}
          flex={1}
          isDisabled={!itemA}
        />
        <AikonBtn
          onClick={() => {}}
          icon={<FilterAikon />}
          flex={1}
          isDisabled={true}
        />
      </HrzBar>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent opacity="0.9" h="full">
          <DrawerHeader p={3}>
            {isGrammar ? t("grammarHead") : t("lexiconHead")}
          </DrawerHeader>
          <DrawerCloseButton border="black 2px solid" />
          <DrawerBody p={3} display="flex">
            <Box flex={1} marginRight={3}>
              {isGrammar
                ? ""
                : [
                    "Noun",
                    "Verb",
                    "Adjective",
                    "Adverb",
                    "Pronoun",
                    "Preposition",
                    "Conjunction",
                    "Interjection",
                    "Determiner",
                  ].map((value, i) => <Text key={i} children={value} />)}
            </Box>
            <Box flex={1}>
              {isGrammar
                ? ""
                : [
                    "動詞",
                    "形容詞",
                    "形容動詞",
                    "名詞",
                    "代名詞",
                    "副詞",
                    "接続詞",
                    "感動詞",
                    "連体詞",
                    "助詞",
                    "助数詞",
                    "助動詞",
                  ].map((value, i) => <Text key={i} children={value} />)}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const clickables = [
    {
      iso: "id",
      coords: {
        x: 0.9140165430070886,
        y: -0.013775448070460912,
        z: -0.4054429628687974,
      },
    },
    {
      iso: "jp",
      coords: {
        x: 0.5372766576225415,
        y: 0.5906732692963204,
        z: -0.6020289711573246,
      },
    },
    {
      iso: "en",
      coords: {
        x: -0.034051759463686306,
        y: 0.822919263139182,
        z: 0.5671369887706965,
      },
    },
  ];
  const content = [
    {
      langName: "en",
      family: "ine",
      type: {
        form: "analyt",
        wordOrder: "SVO",
      },
    },
    {
      langName: "jp",
      family: "jpx",
      type: {
        form: "synthe",
        wordOrder: "SOV",
      },
    },
    {
      langName: "id",
      family: "map",
      type: {
        form: "synthe",
        wordOrder: "SVO",
      },
    },
  ];

  return {
    props: {
      clickables,
      content,
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  };
};

export default Hub;

// add locale globe feature
// add UI indicating dots are clickable
// add highlight on clicked dot
// add curved lines indicating correlations feature
// add UI indicating LangCard swipable
// solidify content for each language
// add common.json for each locale
// fix camera zoom or globe size
// fix whole screen select
// fix itemB to itemA animation
