import { useMemoizedFn } from 'ahooks';
import { ControlledScroll } from 'hooks/use-controlled-scroll';
import { MutableRefObject, useRef, useState } from 'react';

interface DragState {
  startClientOffset: number;
  scrollScrollOffset: number;
  startRatio: number;
  startContainerLength: number;
}

export function useScrollbarDrag({
  scroll,
  containerRef,
  setOffset: setOffset,
  orientation,
}: {
  scroll: ControlledScroll;
  containerRef: MutableRefObject<HTMLDivElement>;
  setOffset: (percentage: number) => void;
  orientation: 'landscape' | 'portrait';
}) {
  const [dragging, setDragging] = useState(false);

  const dragStateRef = useRef<DragState | undefined>(undefined);

  const handleDrag = useMemoizedFn((e: MouseEvent) => {
    if (!dragStateRef.current) {
      return;
    }
    const {
      startContainerLength,
      startRatio,
      startClientOffset,
      scrollScrollOffset,
    } = dragStateRef.current;
    const newRatio =
      startRatio +
      ((orientation === 'landscape' ? e.clientX : e.clientY) -
        startClientOffset) /
        startContainerLength;
    const maxRatio =
      orientation === 'landscape'
        ? scroll.maxScrollX / scroll.scrollWidth
        : scroll.maxScrollY / scroll.scrollHeight;
    const newRatioClamped =
      newRatio < 0 ? 0 : newRatio > maxRatio ? maxRatio : newRatio;
    setOffset(newRatioClamped * 100);

    const newScrollOffset =
      scrollScrollOffset +
      (newRatioClamped - startRatio) *
        (orientation === 'landscape'
          ? scroll.scrollWidth
          : scroll.scrollHeight);
    window.scrollTo({
      [orientation === 'landscape' ? 'left' : 'top']: newScrollOffset,
      behavior: 'auto',
    });
  });
  const handleDragEnd = useMemoizedFn(() => {
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', handleDragEnd);
    setDragging(false);
  });

  const handleDragStart = useMemoizedFn((e: MouseEvent) => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      !containerRef.current
    ) {
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const startRatio =
      orientation === 'landscape'
        ? scroll.scrollX / scroll.scrollWidth
        : scroll.scrollY / scroll.scrollHeight;
    dragStateRef.current = {
      startContainerLength:
        orientation === 'landscape'
          ? containerRect.width
          : containerRect.height,
      startRatio,
      startClientOffset: orientation === 'landscape' ? e.clientX : e.clientY,
      scrollScrollOffset:
        orientation === 'landscape' ? scroll.scrollX : scroll.scrollY,
    };
    e.stopImmediatePropagation();
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
    setDragging(true);
  });

  return { handleDragStart, dragging };
}
