import { Box } from "@chakra-ui/layout";
import { MenuItem } from "@chakra-ui/menu";
import setLanguage from "next-translate/setLanguage";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { TitleTag } from "./TitleTag";

interface LocalerAitemProps {
  locale: string;
  ns: string;
}

const LocalerAitem: FC<LocalerAitemProps> = ({ locale, ns }) => {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  useEffect(() => {
    (async () => {
      const getT = (await import("next-translate/getT")).default;
      const t = await getT(locale, ns);
      setTitle(t("title"));
      setTagline(t("tagline"));
    })();
  }, [locale, ns]);
  return (
    <MenuItem
      justifyContent="center"
      onClick={async () => await setLanguage(`${locale}`)}
    >
      <Box as="span" textAlign="center">
        <TitleTag title={title} tagline={tagline} main={false} />
      </Box>
    </MenuItem>
  );
};

interface LocalerAitemsProps {
  lang: string;
  ns: string;
}

export const LocalerAitems: FC<LocalerAitemsProps> = ({ lang, ns }) => {
  const { locales } = useRouter();
  const notCurr = locales!.filter((l) => l !== lang);
  return (
    <>
      {notCurr.map((l) => (
        <LocalerAitem key={l} locale={l} ns={ns} />
      ))}
    </>
  );
};
