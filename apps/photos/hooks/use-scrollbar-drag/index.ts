import { useMemoizedFn } from 'ahooks';
import { ControlledScroll } from 'hooks/use-controlled-scroll';
import { MutableRefObject, useRef, useState } from 'react';

interface DragState {
  startX: number;
  startScrollX: number;
  startRatio: number;
  containerRect: DOMRect;
}

export function useScrollbarDrag({
  scroll,
  containerRef,
  setLeft,
}: {
  scroll: ControlledScroll;
  containerRef: MutableRefObject<HTMLDivElement>;
  setLeft: (percentage: number) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const dragStateRef = useRef<DragState | undefined>(undefined);

  const handleDrag = useMemoizedFn((e: MouseEvent) => {
    if (!dragStateRef.current) {
      return;
    }
    const {
      containerRect: { width },
      startRatio,
      startX,
      startScrollX,
    } = dragStateRef.current;
    const newRatio = startRatio + (e.clientX - startX) / width;
    const maxRatio = scroll.maxScrollX / scroll.scrollWidth;
    const newRatioClamped =
      newRatio < 0 ? 0 : newRatio > maxRatio ? maxRatio : newRatio;
    setLeft(newRatioClamped * 100);

    const newScrollX =
      startScrollX + (newRatioClamped - startRatio) * scroll.scrollWidth;
    window.scrollTo({
      left: newScrollX,
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
    const startRatio = scroll.scrollX / scroll.scrollWidth;
    dragStateRef.current = {
      containerRect,
      startRatio,
      startX: e.clientX,
      startScrollX: scroll.scrollX,
    };
    e.stopImmediatePropagation();
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
    setDragging(true);
  });

  return { handleDragStart, dragging };
}
