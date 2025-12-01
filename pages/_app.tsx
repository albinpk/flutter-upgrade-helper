import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>
          Flutter Upgrade Helper — Upgrade Flutter Projects with Confidence
        </title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
