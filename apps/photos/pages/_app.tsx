import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import Script from 'next/script';
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
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <title>摄影 - std4453</title>

        <meta name="application-name" content="摄影" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="摄影" />
        <meta name="description" content="std4453的摄影作品" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <link rel="manifest" href="/manifest.json" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-MWG0KKWMQS"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MWG0KKWMQS');
        `}
      </Script>
      <main draggable="false">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
