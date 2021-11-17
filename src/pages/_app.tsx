import { ChakraProvider } from "@chakra-ui/provider";
import { AppProps } from "next/app";
import { useEffect } from "react";
import { AppLayout } from "../components/Layout";
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
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ChakraProvider>
  );
};

export default MyApp;
