import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
        bg: "tan",
      },
      "#__next": {
        height: "100%",
      },
    },
  },
  fonts: {
    heading: "Georgia, serif",
    body: "Raleway, system-ui, sans-serif",
    mono: "Menlo, monospace",
  },
});

export default theme;
