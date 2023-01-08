import { css, Global } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import Logo from 'components/logo';
import Image from 'next/image';
import moon from 'public/images/image_2924-Moon-Dust-Cloud.png';
import { MouseEvent, ReactNode, TouchEvent, useRef } from 'react';
import { fontFamily } from 'utils/fonts';

export interface ErrorPageProps {
  /**
   * 由于-webkit-text-stroke浏览器间不一致，将文字提前转曲，参数内容为转曲后的<svg>元素
   */
  text: ReactNode;
  showAction?: boolean;
  actionHint?: ReactNode;
  actionText?: ReactNode;
  onActionButtonClick?: () => void;
}

export function ErrorPage({
  text,
  showAction = false,
  actionHint = null,
  actionText = null,
  onActionButtonClick,
}: ErrorPageProps) {
  const moonRef = useRef<HTMLDivElement>();
  const imageRef = useRef<HTMLImageElement>();
  const handleMoonMouseDown = useMemoizedFn((e: MouseEvent | TouchEvent) => {
    if (!moonRef.current || !imageRef.current) {
      return;
    }
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = moonRef.current.getBoundingClientRect();
    const cx = (clientX - rect.x) / rect.width;
    const cy = (clientY - rect.y) / rect.height;
    imageRef.current.style.transformOrigin = `${cx * 100}% ${cy * 100}%`;
    imageRef.current.style.transform = 'scale(0.8)';
  });
  const handleMoonMouseUp = useMemoizedFn(() => {
    if (!moonRef.current || !imageRef.current) {
      return;
    }
    imageRef.current.style.transformOrigin = `50% 50%`;
    imageRef.current.style.transform = 'scale(1)';
  });

  return (
    <>
      <Global
        styles={css`
          body {
            background: black;
            font-family: ${fontFamily};
          }
        `}
      />
      <div
        css={css`
          width: 100%;
          height: 100vh;
          height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding-bottom: ${showAction ? '5rem' : '0'};
          position: relative;
        `}
      >
        <div
          css={css`
            width: 23rem;
            height: 12rem;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: center;
          `}
        >
          <div
            css={css`
              position: absolute;
              left: 0;
              right: 0;
              width: 100%;
              height: 100%;

              pointer-events: none;
              user-select: none;

              & svg {
                width: 100%;
                height: 100%;
              }
              & .cls-1 {
                fill: #fff;
              }
            `}
          >
            {text}
          </div>
          <div
            css={css`
              height: 100%;
              aspect-ratio: 1;
              position: relative;

              user-select: none;
              -webkit-tap-highlight-color: transparent;
            `}
            ref={moonRef}
            onTouchStart={handleMoonMouseDown}
            onMouseDown={handleMoonMouseDown}
            onMouseUp={handleMoonMouseUp}
            onTouchEnd={handleMoonMouseUp}
            draggable="false"
          >
            <Image
              css={css`
                width: 100%;
                height: 100%;
                display: block;
                object-fit: contain;
                pointer-events: none;
                transform-origin: center center;
                transition: transform 100ms ease, transform-origin 70ms linear;
              `}
              ref={imageRef}
              src={moon}
              alt={'"Moon" by Gregory H. Revera / CC BY-SA 3.0'}
            />
          </div>
          <div
            css={css`
              position: absolute;
              left: 0;
              right: 0;
              width: 100%;
              height: 100%;

              pointer-events: none;
              user-select: none;

              & svg {
                width: 100%;
                height: 100%;
                opacity: 0.65;
              }
              & .cls-1 {
                fill: none;
                stroke: #fff;
              }
            `}
          >
            {text}
          </div>
          {showAction && (
            <div
              css={css`
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                padding-top: 2.5rem;
                text-align: center;
                font-size: 1rem;
                line-height: 1;
                color: white;
              `}
            >
              {actionHint}
              <button
                css={css`
                  display: inline-block;
                  margin: -0.75rem 0;
                  padding: 0.75rem 0.75rem;
                  border-radius: 0.25rem;

                  cursor: pointer;
                  color: inherit;
                  font-size: inherit;
                  font-family: inherit;
                  line-height: inherit;
                  border: none;

                  background-color: rgba(255, 255, 255, 0.15);
                  &:hover {
                    background-color: rgba(255, 255, 255, 0.25);
                  }
                  &:active {
                    background-color: rgba(255, 255, 255, 0.35);
                  }
                  transition: background-color 80ms ease;
                `}
                onClick={onActionButtonClick}
              >
                {actionText}
              </button>
            </div>
          )}
        </div>
        <div
          css={css`
            position: absolute;
            bottom: 0.5rem;
            right: 0.5rem;
            color: rgba(255, 255, 255, 0.35);
            font-size: 0.75rem;
            line-height: 1;
          `}
        >
          &quot;Moon&quot; by Gregory H. Revera / CC BY-SA 3.0
        </div>
      </div>
      <Logo />
    </>
  );
}
