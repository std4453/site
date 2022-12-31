import { Inter, Noto_Sans_SC } from '@next/font/google';
import localFont from '@next/font/local';

export const harmonySansFlorinOnly = localFont({
  src: './HarmonyOS_Sans_Medium-subset.ttf',
  adjustFontFallback: false,
});

export const inter = Inter({
  subsets: ['latin'],
  preload: true,
  display: 'swap',
});
export const notoSansSC = Noto_Sans_SC({
  subsets: ['chinese-simplified', 'latin'],
  weight: '400',
  adjustFontFallback: false,
  display: 'swap',
});

export const fontFamily = `
  ${harmonySansFlorinOnly.style.fontFamily},
  ${inter.style.fontFamily},
  ${notoSansSC.style.fontFamily},
  Noto, 
  sans-serif
`;
