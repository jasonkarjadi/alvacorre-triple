import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/dist/shared/lib/router/router";
import { useEffect } from "react";
import theme from "../theme";

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    localStorage.removeItem("chakra-ui-color-mode");
    // oncontextmenu = (e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    // };
  }, []);

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
