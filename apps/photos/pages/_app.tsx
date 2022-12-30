import { Inter, Noto_Sans_SC } from '@next/font/google';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

const inter = Inter({
  subsets: ['latin'],
  style: ['normal'],
  weight: ['400', '500'],
});
const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified', 'latin'],
  weight: '400',
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
        <title>摄影</title>
        <style jsx global>{`
          html {
            font-family: ${inter.style.fontFamily}
                ${notoSansSC.style.fontFamily},
              Noto, sans-serif;
          }
        `}</style>
      </Head>
      <main draggable="false">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
