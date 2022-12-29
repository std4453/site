import { css, Global } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import { thumbnailScrollbarCSS } from 'components/styles';
import { Timeline } from 'components/timeline';
import { timelineItems } from 'data/images';
import { ControlledScroll } from 'hooks/use-controlled-scroll';
import { useScrollBar } from 'hooks/use-scrollbar';
import { useScrollbarDrag } from 'hooks/use-scrollbar-drag';
import { MouseEvent, useRef } from 'react';

export function ThumbnailScrollbar({
  scroll,
  orientation,
}: {
  scroll: ControlledScroll;
  orientation: 'landscape' | 'portrait';
}) {
  const containerRef = useRef<HTMLDivElement>();
  const scrollbarOffsetRef = useRef<HTMLDivElement>();
  const scrollbarLengthRef = useRef<HTMLDivElement>();
  const timelineRef = useRef<HTMLDivElement>();

  const setOffset = useMemoizedFn((percentage: number) => {
    if (!scrollbarOffsetRef.current || !timelineRef.current) {
      return;
    }
    scrollbarOffsetRef.current.style.transform = `${
      orientation === 'landscape' ? 'translateX' : 'translateY'
    }(${percentage}%)`;
    timelineRef.current.style.transform = `${
      orientation === 'landscape' ? 'translateX' : 'translateY'
    }(-${percentage}%)`;
  });
  const setLength = useMemoizedFn((percentage: number) => {
    if (!scrollbarLengthRef.current) {
      return;
    }
    if (orientation === 'landscape') {
      scrollbarLengthRef.current.style.width = `${percentage}%`;
      scrollbarLengthRef.current.style.height = '';
    } else {
      scrollbarLengthRef.current.style.height = `${percentage}%`;
      scrollbarLengthRef.current.style.width = '';
    }
  });
  useScrollBar({ setOffset, setLength, orientation });

  const { handleDragStart, dragging } = useScrollbarDrag({
    scroll,
    containerRef,
    setOffset: setOffset,
    orientation,
  });
  const handleMouseDown = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
    handleDragStart(e.nativeEvent);
  });

  const handleClick = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) {
      return;
    }
    if (orientation === 'landscape') {
      const { left, width } = containerRef.current.getBoundingClientRect();
      const target =
        ((e.clientX - left) / width) * scroll.scrollWidth -
        window.innerWidth / 2;
      scroll.scrollTo(target, 0);
    } else {
      const { top, height } = containerRef.current.getBoundingClientRect();
      const target =
        ((e.clientY - top) / height) * scroll.scrollHeight -
        window.innerHeight / 2;
      scroll.scrollTo(0, target);
    }
  });

  return (
    <>
      {dragging && (
        <Global
          styles={css`
            html {
              cursor: move;
              cursor: grabbing;
            }
          `}
        />
      )}
      <div
        css={thumbnailScrollbarCSS}
        data-dragging={dragging ? 'true' : 'false'}
        ref={containerRef}
        onClick={handleClick}
      >
        <div id="container2">
          <Timeline type="thumbnail" items={timelineItems} id="timeline2" />
        </div>
        <div id="offset" ref={scrollbarOffsetRef}>
          <div
            ref={scrollbarLengthRef}
            onMouseDown={handleMouseDown}
            id="handle"
            draggable="false"
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Timeline
              type="thumbnail"
              items={timelineItems}
              ref={timelineRef}
              id="timeline"
            />
          </div>
        </div>
      </div>
    </>
  );
}
