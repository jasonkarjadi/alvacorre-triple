import { Button } from "@chakra-ui/button";
import { Box, Heading, Text, Grid, Divider } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/react";
import setLanguage from "next-translate/setLanguage";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

interface TitleTagProps {
  titleTag: [string, string];
}

const TitleTag: FC<TitleTagProps> = ({ titleTag }) => {
  return (
    <>
      <Heading as="h1" fontSize="lg">
        {titleTag[0].toUpperCase()}
      </Heading>
      <Text fontSize="x-small" fontWeight="bold" lineHeight="none">
        {titleTag[1].toUpperCase()}
      </Text>
    </>
  );
};

interface LocalerAitemProps {
  locale: string;
}

export const LocalerAitem: FC<LocalerAitemProps> = ({ locale }) => {
  const [titleTag, setTitleTag] = useState<[string, string]>(["", ""]);
  useEffect(() => {
    (async () => {
      const getT = (await import("next-translate/getT")).default;
      const t = await getT(locale, "navbar");
      setTitleTag([t("title"), t("tagline")]);
    })();
  }, [locale]);
  return <TitleTag titleTag={titleTag} />;
};

export const Localer: FC = () => {
  const { locales } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t, lang } = useTranslation("navbar");
  return (
    <>
      <Button pos="relative" variant="link" color="gray.900" onClick={onOpen}>
        <Box as="span">
          <TitleTag titleTag={[t("title"), t("tagline")]} />
        </Box>
        <Box as="span" fontSize="x-small" pos="absolute" top="0" right="-3">
          {lang.toUpperCase()}
        </Box>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent bg="tan">
          <ModalHeader p={3} textAlign="center">
            <TitleTag titleTag={[t("title"), t("tagline")]} />
          </ModalHeader>
          <Divider style={{ border: "solid 1px black" }} />
          <ModalBody p={0}>
            <Grid templateColumns="repeat(2, 1fr)" autoRows="1fr">
              {locales
                ?.filter((l) => l !== lang)
                .map((l) => (
                  <Button
                    key={l}
                    variant="link"
                    borderRadius="none"
                    color="gray.900"
                    outline="solid 1px"
                    py={3}
                    onClick={async () => await setLanguage(`${l}`)}
                  >
                    <Box as="span">
                      <LocalerAitem locale={l} />
                    </Box>
                  </Button>
                ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
