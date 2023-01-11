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

    console.log(
      '觉得不错？你可以为我点个 star: https://github.com/std4453/site'
    );
    console.log('如果你发现了任何 bug，请务必提个 issue 告诉我！');
    console.log(
      '顺带一提，这个网站支持手机、平板、PC，横竖都能用，也许有更多隐藏功能等你发现？'
    );
    console.log('Made with ❤️️ by std4453 (me@std4453.com)');
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
        <meta name="description" content="一个前端开发者的摄影作品展示。" />
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

        <meta property="og:title" content="摄影 - std4453" />
        <meta
          property="og:description"
          content="一个前端开发者的摄影作品展示。"
        />
        <meta property="og:url" content="https://photos.std4453.com/" />
        <meta property="og:type" content="website"></meta>
        <meta property="og:locale" content="zh_CN" />
        <meta
          property="og:image"
          content="https://photos.std4453.com/og-image.png"
        />
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
