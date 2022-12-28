import { css, Global } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import { Timeline } from 'components/timeline';
import { timelineItems } from 'data/images';
import { ControlledScroll } from 'hooks/use-controlled-scroll';
import { useScrollBar } from 'hooks/use-scrollbar';
import { useScrollbarDrag } from 'hooks/use-scrollbar-drag';
import { MouseEvent, useRef } from 'react';

export function ThumbnailScrollbar({ scroll }: { scroll: ControlledScroll }) {
  const containerRef = useRef<HTMLDivElement>();
  const scrollbarLeftRef = useRef<HTMLDivElement>();
  const scrollbarWidthRef = useRef<HTMLDivElement>();
  const timelineRef = useRef<HTMLDivElement>();

  const setLeft = useMemoizedFn((percentage: number) => {
    if (!scrollbarLeftRef.current || !timelineRef.current) {
      return;
    }
    scrollbarLeftRef.current.style.transform = `translateX(${percentage}%)`;
    timelineRef.current.style.transform = `translateX(-${percentage}%)`;
  });
  const setWidth = useMemoizedFn((percentage: number) => {
    if (!scrollbarWidthRef.current) {
      return;
    }
    scrollbarWidthRef.current.style.width = `${percentage}%`;
  });
  useScrollBar({ setLeft, setWidth });

  const { handleDragStart, dragging } = useScrollbarDrag({
    scroll,
    containerRef,
    setLeft,
  });
  const handleMouseDown = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
    handleDragStart(e.nativeEvent);
  });

  const handleClick = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) {
      return;
    }
    const { left, width } = containerRef.current.getBoundingClientRect();
    const ratio = (e.clientX - left) / width;
    const minRatio = scroll.scrollX / scroll.scrollWidth;
    const maxRatio = (scroll.scrollX + window.innerWidth) / scroll.scrollWidth;
    if (ratio < minRatio) {
      scroll.scrollBy(-window.innerWidth, 0);
    }
    if (ratio > maxRatio) {
      scroll.scrollBy(window.innerWidth, 0);
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
        css={css`
          position: fixed;
          left: 0.25rem;
          bottom: 0;
          height: 2.25rem;
          width: calc(100vw - 24rem - 0.5rem);
          z-index: 5;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0.25rem;
            width: 100%;
            height: 2rem;
            background: rgba(0, 0, 0, 0.35);
            border-radius: 0.1875rem;

            pointer-events: none;

            transform-origin: bottom left;
            opacity: 0;
            transform: scaleY(0.85);
            transition-property: opacity, transform;
            transition-delay: 130ms, 100ms;
            transition-duration: 250ms, 220ms;
            transition-timing-function: linear, ease-in;
          }

          &:hover::before,
          &[data-dragging='true']::before {
            opacity: 1;
            transform: scaleY(1);
            transition-delay: 0ms, 0ms;
            transition-duration: 100ms, 140ms;
            transition-timing-function: linear, ease-out;
          }

          &:hover #timeline,
          &[data-dragging='true'] #timeline {
            opacity: 1;
            transition-delay: 0ms;
            transition-duration: 100ms;
            transition-timing-function: ease-out;
          }

          &:hover #handle,
          &[data-dragging='true'] #handle {
            height: 2rem;
            transition-delay: 0ms, 0ms;
            transition-duration: 200ms, 100ms;
            transition-timing-function: ease, ease;
          }

          cursor: pointer;
        `}
        data-dragging={dragging ? 'true' : 'false'}
        ref={containerRef}
        onClick={handleClick}
      >
        <div
          css={css`
            position: absolute;
            width: 100%;
            bottom: 0.25rem;
            will-change: transform;
          `}
          ref={scrollbarLeftRef}
        >
          <div
            css={css`
              height: 0.375rem;
              border-radius: 0.1875rem;
              overflow: hidden;
              position: relative;

              cursor: move;
              cursor: grab;

              &:active {
                cursor: grabbing;
              }

              transition-property: width, height;
              transition-duration: 200ms, 330ms;
              transition-delay: 0ms, 130ms;
              transition-timing-function: ease, ease-out;

              background: rgba(0, 0, 0, 0.35);
            `}
            ref={scrollbarWidthRef}
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
              css={css`
                position: absolute;
                left: 0;
                bottom: 0;
                height: 2rem;
                width: calc(100vw - 24rem - 0.5rem);

                display: flex;
                pointer-events: none;

                will-change: transform, opacity;

                opacity: 0;
                transition-property: opacity;
                transition-delay: 130ms;
                transition-duration: 250ms;
                transition-timing-function: linear;
              `}
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
