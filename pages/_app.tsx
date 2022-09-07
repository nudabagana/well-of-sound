import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "../components/Header";
import FlexDiv from "../styled/FlexDiv";
import { Clrs } from "../styled/consts";
import { GlobalStyle } from "../styled/globals";
import { ThemeProvider } from "styled-components";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FlexDiv
      column
      style={{
        height: "100%",
        minHeight: "700px",
        background: Clrs.Bg,
        color: Clrs.text,
      }}
    >
      <ThemeProvider theme={{ clr: Clrs }}>
        <Head>
          <title>Well of Sound</title>
          <meta name="description" content="Music visualizer." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Component {...pageProps} />
        <GlobalStyle />
      </ThemeProvider>
    </FlexDiv>
  );
}

export default MyApp;
