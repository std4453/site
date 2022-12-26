import { css } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import Logo from 'components/logo';
import { Timeline } from 'components/timeline';
import Beian from 'components/备案';
import { timelineItems } from 'data/images';
import { useEffect, useLayoutEffect, useRef, WheelEvent } from 'react';

function useScroll() {
  const scrollTargetRef = useRef(
    typeof window !== 'undefined' ? window.scrollX : 0
  );
  const timelineRef = useRef<HTMLDivElement>();
  const timelineWidthRef = useRef(
    timelineRef.current ? timelineRef.current.scrollWidth : 0
  );

  useLayoutEffect(() => {
    if (!timelineRef.current) {
      return;
    }
    timelineWidthRef.current = timelineRef.current.scrollWidth;
  });

  useEffect(() => {
    if (!('window' in global)) {
      return;
    }
    const handleResize = () => {
      scrollTargetRef.current = window.scrollX;
      if (timelineRef.current) {
        timelineWidthRef.current = timelineRef.current.scrollWidth;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleWheel = useMemoizedFn((e: WheelEvent<HTMLDivElement>) => {
    // 按宽度比例滚动
    // 计算方法：一次滚动的 deltaY 约为 120px，我们希望大约能滚动过半张图，这里用元素数量近似
    const speedFactor =
      timelineWidthRef.current / timelineItems.length / 2 / 120;
    scrollTargetRef.current += e.deltaY * speedFactor;

    const scrollMax = timelineWidthRef.current - window.innerWidth;
    if (scrollTargetRef.current < 0) {
      scrollTargetRef.current = 0;
    } else if (scrollTargetRef.current > scrollMax) {
      scrollTargetRef.current = scrollMax;
    }

    window.scrollTo({
      left: scrollTargetRef.current,
      top: 0,
      behavior: 'smooth',
    });

    e.preventDefault();
  });

  return {
    ref: timelineRef,
    onWheel: handleWheel,
  };
}

export function Index() {
  const timelineProps = useScroll();

  return (
    <div>
      <Timeline
        css={css(`
          position: absolute;
          left: 0;
          top: 0;
          height: 100vh;
        `)}
        {...timelineProps}
        items={timelineItems}
      />
      <Logo />
      <Beian />
    </div>
  );
}

export default Index;
