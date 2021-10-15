import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        overflow: "hidden",
        bg: "gray",
      },
    },
  },
});

export default theme;
