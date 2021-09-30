import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        overflow: "hidden",
      },
    },
  },
});

export default theme;
