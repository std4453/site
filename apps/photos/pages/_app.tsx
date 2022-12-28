import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <title>摄影</title>
      </Head>
      <main className="app" draggable="false">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
