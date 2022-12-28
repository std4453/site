import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { useEffect, useRef } from 'react';

export function useScrollBar({
  setLeft,
  setWidth,
}: {
  setLeft: (percentage: number) => void;
  setWidth: (percentage: number) => void;
}) {
  const scrollLeftRef = useRef(
    typeof window === 'undefined' ? 0 : window.scrollX
  );

  const tick = useMemoizedFn(() => {
    const newScrollLeft = window.scrollX;
    if (newScrollLeft !== scrollLeftRef.current) {
      const leftPercentage =
        (newScrollLeft / document.documentElement.scrollWidth) * 100;
      setLeft(leftPercentage);
      scrollLeftRef.current = newScrollLeft;
    }

    requestAnimationFrame(tick);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    requestAnimationFrame(tick);
  }, [tick]);

  const updateWidth = useMemoizedFn(() => {
    const newScrollLeft = window.scrollX;
    scrollLeftRef.current = newScrollLeft;
    const newScrollWidth = document.documentElement.scrollWidth;
    const leftPercentage = (newScrollLeft / newScrollWidth) * 100;
    const widthPercentage = (window.innerWidth / newScrollWidth) * 100;
    setLeft(leftPercentage);
    setWidth(widthPercentage);
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    updateWidth();
  }, [updateWidth]);

  const { run: updateWidthDebounced } = useDebounceFn(updateWidth, {
    wait: 300,
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.addEventListener('resize', updateWidthDebounced);
    return () => {
      window.removeEventListener('resize', updateWidthDebounced);
    };
  }, [updateWidthDebounced]);
}
