import { css, Global } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import {
  StyledBg,
  StyledBgTimeline,
  StyledContainer,
  StyledHandle,
  StyledOffset,
  StyledOverlay,
  StyledTimeline,
} from './styles';
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
      scroll.scrollTo(target, 0, { automaticDuration: true });
    } else {
      const { top, height } = containerRef.current.getBoundingClientRect();
      const target =
        ((e.clientY - top) / height) * scroll.scrollHeight -
        window.innerHeight / 2;
      scroll.scrollTo(0, target, { automaticDuration: true });
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
      <StyledContainer
        data-dragging={dragging ? 'true' : 'false'}
        ref={containerRef}
        onClick={handleClick}
      >
        <StyledOverlay />
        <StyledBg>
          <StyledBgTimeline type="thumbnail" />
        </StyledBg>
        <StyledOffset ref={scrollbarOffsetRef}>
          <StyledHandle
            ref={scrollbarLengthRef}
            onMouseDown={handleMouseDown}
            draggable="false"
            onDragStart={(e) => {
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <StyledTimeline type="thumbnail" ref={timelineRef} />
          </StyledHandle>
        </StyledOffset>
      </StyledContainer>
    </>
  );
}
