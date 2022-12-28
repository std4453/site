import { css, Global } from '@emotion/react';
import Logo from 'components/logo';
import { ThumbnailScrollbar } from 'components/thumbnail-scrollbar';
import { Timeline } from 'components/timeline';
import Beian from 'components/备案';
import { timelineItems } from 'data/images';
import { useControlledScroll } from 'hooks/use-controlled-scroll';
import { useScrollInteraction } from 'hooks/use-scroll-interaction';

export function Index() {
  const scroll = useControlledScroll();

  useScrollInteraction(scroll);

  return (
    <div>
      <Global
        styles={css`
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
            background: black;
            overscroll-behavior-y: none;
            /* disable y-axis overscroll */
            touch-action: pan-x;
            /* firefox specific */
            scrollbar-width: none;
          }
          ::-webkit-scrollbar {
            display: none;
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
      <ThumbnailScrollbar scroll={scroll} />
    </div>
  );
}

export default Index;
