import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <title>摄影</title>
      </Head>
      <main draggable="false">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
