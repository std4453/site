import { css, Global } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import Logo from 'components/logo';
import { Timeline } from 'components/timeline';
import Beian from 'components/备案';
import { timelineItems } from 'data/images';
import { useControlledScroll } from 'hooks/use-controlled-scroll';
import { useEffect } from 'react';
import { normalizeWheel } from 'utils/scroll';

function useScroll() {
  const scroll = useControlledScroll();

  const handleWheel = useMemoizedFn((e: WheelEvent) => {
    // 按宽度比例滚动
    // 计算方法：一次滚动的 deltaY 约为 120px，我们希望大约能滚动过半张图，这里用元素数量近似

    const speedFactor =
      document.documentElement.scrollWidth / timelineItems.length / 2 / 120;
    const { pixelY: deltaY } = normalizeWheel(e);
    // 降低最大滚动速度
    const clampedDeltaY =
      Math.abs(deltaY) > 120 ? (deltaY / Math.abs(deltaY)) * 120 : deltaY;

    scroll.scrollBy(clampedDeltaY * speedFactor, 0);

    // 因为是passive所以不需要preventDefault
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  });
}

export function Index() {
  useScroll();

  return (
    <div>
      <Global
        styles={css(`
          body {
            overflow-y: hidden;
            overflow-x: auto;
            background: black;
          }
          ::-webkit-scrollbar {
            display: none;
          }
        `)}
      />
      <Timeline
        css={css(`
          position: absolute;
          left: 0;
          top: 0;
          height: 100vh;
        `)}
        items={timelineItems}
      />
      <Logo />
      <Beian />
    </div>
  );
}

export default Index;
