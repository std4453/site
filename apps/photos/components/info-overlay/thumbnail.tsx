import { css, keyframes } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import {
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { isPortrait, landscapeQuery, portraitQuery } from 'utils/responsive';

export interface ThumbnailActions {
  update(options: { x: number; y: number; scale: number }): void;
}

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export default forwardRef(function Thumbnail(
  {
    contentWidth,
    contentHeight,
    imageRef,
  }: {
    contentWidth: number;
    contentHeight: number;
    imageRef: MutableRefObject<HTMLDivElement>;
  },
  ref: ForwardedRef<ThumbnailActions>
) {
  const innerRef = useRef<HTMLDivElement>();
  const topLeftLineRef = useRef<HTMLDivElement>();
  const topRightLineRef = useRef<HTMLDivElement>();
  const bottomLeftLineRef = useRef<HTMLDivElement>();
  const bottomRightLineRef = useRef<HTMLDivElement>();
  const leftBorderRef = useRef<HTMLDivElement>();
  const rightBorderRef = useRef<HTMLDivElement>();
  const topBorderRef = useRef<HTMLDivElement>();
  const bottomBorderRef = useRef<HTMLDivElement>();

  const onUpdate = useMemoizedFn(
    ({ x, y, scale }: { x: number; y: number; scale: number }) => {
      if (
        !innerRef.current ||
        !topLeftLineRef.current ||
        !topRightLineRef.current ||
        !bottomLeftLineRef.current ||
        !bottomRightLineRef.current ||
        !leftBorderRef.current ||
        !rightBorderRef.current ||
        !topBorderRef.current ||
        !bottomBorderRef.current
      ) {
        return;
      }
      if (isPortrait() || window.innerHeight < 480) {
        return;
      }

      const left = -x;
      const right = contentWidth - left - width / scale;
      const top = -y;
      const bottom = contentHeight - top - height / scale;

      innerRef.current.style.transform = `translate(${
        (-x / contentWidth) * 100
      }%, ${(-y / contentHeight) * 100}%) scale(${
        width / scale / contentWidth
      }, ${height / scale / contentHeight})`;

      const topLeftLength = Math.sqrt(left * left + top * top);
      const topLeftAngle = Math.atan2(top, left);
      topLeftLineRef.current.style.transform = `rotate(${topLeftAngle}rad) scaleX(${
        0.05 + topLeftLength / contentWidth
      })`;

      const topRightLength = Math.sqrt(right * right + top * top);
      const topRightAngle = Math.atan2(top, right);
      topRightLineRef.current.style.transform = `rotate(${-topRightAngle}rad) scaleX(${
        0.05 + topRightLength / contentWidth
      })`;

      const bottomLeftLength = Math.sqrt(left * left + bottom * bottom);
      const bottomLeftAngle = Math.atan2(bottom, left);
      bottomLeftLineRef.current.style.transform = `rotate(${-bottomLeftAngle}rad) scaleX(${
        0.05 + bottomLeftLength / contentWidth
      })`;

      const bottomRightLength = Math.sqrt(right * right + bottom * bottom);
      const bottomRightAngle = Math.atan2(bottom, right);
      bottomRightLineRef.current.style.transform = `rotate(${bottomRightAngle}rad) scaleX(${
        0.05 + bottomRightLength / contentWidth
      })`;

      leftBorderRef.current.style.transform = `translateY(${
        (top / contentHeight) * 100
      }%) scaleY(${height / scale / contentHeight}) translateX(${
        (left / contentWidth) * 100
      }%)`;
      rightBorderRef.current.style.transform = `translateY(${
        (top / contentHeight) * 100
      }%) scaleY(${height / scale / contentHeight}) translateX(${
        (-right / contentWidth) * 100
      }%)`;
      topBorderRef.current.style.transform = `translateX(${
        (left / contentWidth) * 100
      }%) scaleX(${width / scale / contentWidth}) translateY(${
        (top / contentHeight) * 100
      }%)`;
      bottomBorderRef.current.style.transform = `translateX(${
        (left / contentWidth) * 100
      }%) scaleX(${width / scale / contentWidth}) translateY(${
        (-bottom / contentHeight) * 100
      }%)`;
    }
  );

  useImperativeHandle(ref, () => ({ update: onUpdate }));

  const containerRef = useRef<HTMLDivElement>();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!imageRef.current) {
      return;
    }
    setWidth(imageRef.current.scrollWidth);
    setHeight(imageRef.current.scrollHeight);
  }, [imageRef]);

  return width > 0 && height > 0 ? (
    <div
      css={css`
        @media ${portraitQuery} {
          display: none;
        }
        @media ${landscapeQuery} and (max-height: 480px) {
          display: none;
        }

        flex-grow: 1;
        margin-top: 3.5rem;
        margin-bottom: 0.25rem;

        animation: 150ms linear 80ms both ${fadeInAnimation};

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: stretch;
      `}
      ref={containerRef}
    >
      <div
        css={css`
          aspect-ratio: var(--content-width) / var(--content-height);
          position: relative;

          background: rgba(255, 255, 255, 0.15);

          user-select: none;

          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            border: 1px solid #737373;
            z-index: 10;
            pointer-events: none;
          }

          overflow: hidden;
        `}
        style={
          {
            '--content-width': `${contentWidth}`,
            '--content-height': `${contentHeight}`,
          } as Record<string, string>
        }
      >
        <div
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            transform-origin: top left;
            background: black;
            z-index: 5;
          `}
          ref={innerRef}
          draggable="false"
        />
        <div
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 1px;
            transform-origin: top left;
            background: #737373;
            pointer-events: none;
          `}
          ref={topLeftLineRef}
        />
        <div
          css={css`
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 1px;
            transform-origin: top right;
            background: #737373;
            pointer-events: none;
          `}
          ref={topRightLineRef}
        />
        <div
          css={css`
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            transform-origin: bottom left;
            background: #737373;
            pointer-events: none;
          `}
          ref={bottomLeftLineRef}
        />
        <div
          css={css`
            position: absolute;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            transform-origin: bottom right;
            background: #737373;
            pointer-events: none;
          `}
          ref={bottomRightLineRef}
        />
        <div
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-left: 1px solid #737373;
            box-sizing: border-box;
            z-index: 7;
            transform-origin: top left;
            pointer-events: none;
          `}
          ref={leftBorderRef}
        />
        <div
          css={css`
            position: absolute;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-right: 1px solid #737373;
            box-sizing: border-box;
            z-index: 7;
            transform-origin: top right;
            pointer-events: none;
          `}
          ref={rightBorderRef}
        />
        <div
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-top: 1px solid #737373;
            box-sizing: border-box;
            z-index: 7;
            transform-origin: top left;
            pointer-events: none;
          `}
          ref={topBorderRef}
        />
        <div
          css={css`
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            border-bottom: 1px solid #737373;
            box-sizing: border-box;
            z-index: 7;
            transform-origin: bottom left;
            pointer-events: none;
          `}
          ref={bottomBorderRef}
        />
      </div>
    </div>
  ) : null;
});
