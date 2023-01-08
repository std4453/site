import { css, Global } from '@emotion/react';
import Logo from 'components/logo';
import Image from 'next/image';
import moon from 'public/images/image_2924-Moon-Dust-Cloud.png';
import { ReactNode } from 'react';
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
          `}
        >
          <div
            css={css`
              position: absolute;
              left: 0;
              right: 0;
              width: 100%;
              height: 100%;

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
              position: absolute;
              top: 0;
              height: 100%;
              left: 50%;
              transform: translateX(-50%);
              aspect-ratio: 1;
            `}
          >
            <Image
              css={css`
                width: 100%;
                height: 100%;
                display: block;
                object-fit: contain;
              `}
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
