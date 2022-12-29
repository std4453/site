import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { useEffect, useRef } from 'react';

export function useScrollBar({
  setOffset,
  setLength,
  orientation,
}: {
  setOffset: (percentage: number) => void;
  setLength: (percentage: number) => void;
  orientation: 'landscape' | 'portrait';
}) {
  const scrollStartRef = useRef(
    typeof window === 'undefined'
      ? 0
      : orientation === 'landscape'
      ? window.scrollX
      : window.scrollY
  );

  const tick = useMemoizedFn(() => {
    const newScrollOffset =
      orientation === 'landscape' ? window.scrollX : window.scrollY;
    if (newScrollOffset !== scrollStartRef.current) {
      const offsetPercentage =
        (newScrollOffset /
          (orientation === 'landscape'
            ? document.documentElement.scrollWidth
            : document.documentElement.scrollHeight)) *
        100;
      setOffset(offsetPercentage);
      scrollStartRef.current = newScrollOffset;
    }

    requestAnimationFrame(tick);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    requestAnimationFrame(tick);
  }, [tick]);

  const updateLength = useMemoizedFn(() => {
    const newScrollOffset =
      orientation === 'landscape' ? window.scrollX : window.scrollY;
    scrollStartRef.current = newScrollOffset;
    const newScrollLength =
      orientation === 'landscape'
        ? document.documentElement.scrollWidth
        : document.documentElement.scrollHeight;
    const offsetPercentage = (newScrollOffset / newScrollLength) * 100;
    const lengthPercentage =
      ((orientation === 'landscape' ? window.innerWidth : window.innerHeight) /
        newScrollLength) *
      100;
    setOffset(offsetPercentage);
    setLength(lengthPercentage);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    updateLength();
  }, [updateLength, orientation]); // 方向变化时也更新

  const { run: updateLengthDebounced } = useDebounceFn(updateLength, {
    wait: 300,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('resize', updateLengthDebounced);
    return () => {
      window.removeEventListener('resize', updateLengthDebounced);
    };
  }, [updateLengthDebounced]);
}
