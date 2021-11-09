import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        height: "100%",
        bg: "gray",
      },
      "#__next": {
        height: "100%",
      },
    },
  },
});

export default theme;
