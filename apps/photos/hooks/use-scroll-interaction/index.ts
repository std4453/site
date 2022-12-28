import { useMemoizedFn } from 'ahooks';
import { useControlledScroll } from 'hooks/use-controlled-scroll';
import { useEffect } from 'react';
import { isTouchpad, normalizeWheel } from 'utils/scroll';

export function useScrollInteraction() {
  const scroll = useControlledScroll();

  const handleWheel = useMemoizedFn((e: WheelEvent) => {
    if (isTouchpad(e)) {
      return;
    }

    // 一次滚动 1/3 屏幕（一次滚动的 deltaY 约为 120px）
    const speedFactor = window.innerWidth / 3 / 120;
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
