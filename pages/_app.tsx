import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Header from "../components/Header";
import FlexDiv from "../styles/FlexDiv";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FlexDiv column style={{ height: "100%" }}>
      <Head>
        <title>Well of Sound</title>
        <meta name="description" content="Music visualizer." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </FlexDiv>
  );
}

export default MyApp;
