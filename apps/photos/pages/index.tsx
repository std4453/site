import { css, Global } from '@emotion/react';
import Beian from 'components/beian';
import Logo from 'components/logo';
import { ThumbnailScrollbar } from 'components/thumbnail-scrollbar';
import { Timeline } from 'components/timeline';
import { timelineItems } from 'data/images';
import { useControlledScroll } from 'hooks/use-controlled-scroll';
import { useScrollInteraction } from 'hooks/use-scroll-interaction';
import { useMediaQuery } from 'react-responsive';
import { fontFamily } from 'utils/fonts';
import { landscapeQuery, portraitQuery } from 'utils/responsive';

export function Index() {
  const isPortrait = useMediaQuery({
    query: portraitQuery,
  });
  const orientation = isPortrait ? 'portrait' : 'landscape';

  const scroll = useControlledScroll();
  useScrollInteraction({ scroll, orientation, isTouch: false });

  return (
    <div>
      <Global
        styles={css`
          html {
            font-family: ${fontFamily};
          }

          body {
            background: black;
          }

          @media ${landscapeQuery} {
            html {
              scroll-behavior: auto;
              overscroll-behavior-y: none;
              overflow-y: hidden;
              /* firefox specific */
              scrollbar-width: none;
            }
            body {
              overflow-y: hidden;
              overflow-x: auto;
              overscroll-behavior-y: none;
              /* disable y-axis overscroll */
              touch-action: pan-x;
              /* firefox specific */
              scrollbar-width: none;
            }
            ::-webkit-scrollbar {
              display: none;
            }
          }
          @media ${portraitQuery} {
            html {
              scroll-behavior: auto;
              overscroll-behavior-x: none;
              overflow-x: hidden;
              /* firefox specific */
              scrollbar-width: none;
            }
            body {
              overflow-x: hidden;
              overflow-y: auto;
              overscroll-behavior-x: none;
              /* disable y-axis overscroll */
              touch-action: pan-y;
              /* firefox specific */
              scrollbar-width: none;
            }
            ::-webkit-scrollbar {
              display: none;
            }
          }
        `}
      />
      <Timeline
        css={css`
          position: absolute;
          left: 0;
          top: 0;
          height: 100vh;
          height: 100dvh;
          /* firefox specific */
          scrollbar-width: none;
        `}
        items={timelineItems}
      />
      <Logo />
      <Beian />
      <ThumbnailScrollbar scroll={scroll} orientation={orientation} />
    </div>
  );
}

export default Index;
