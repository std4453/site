import { css, Global, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { InteractiveImage } from 'components/info-overlay/image';
import Thumbnail, { ThumbnailActions } from 'components/info-overlay/thumbnail';
import { FocusArea, Metadata } from 'components/timeline/types';
import { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getMetadataBlocks } from 'utils/metadata';
import { landscapeQuery, nonTouchQuery, portraitQuery } from 'utils/responsive';

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const StyledOverlay = styled.div<{
  opened: boolean;
}>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  z-index: 2;
  background-color: rgba(0, 0, 0, 0.35);

  pointer-events: none;
  user-select: none;

  animation: ${(props) => (props.opened ? '60ms' : '100ms')} linear
    ${(props) => (props.opened ? '0ms' : '50ms')} both
    ${(props) => (props.opened ? fadeInAnimation : fadeOutAnimation)};

  @media ${nonTouchQuery} {
    display: none;
  }
`;

const rootTransformInAnimationPortrait = keyframes`
  from {
    transform: scaleY(0.95) translateY(3vh);
  }
  to {
    transform: scaleY(1) translateY(0);
  }
`;

const rootTransformOutAnimationPortrait = keyframes`
  from {
    transform: scaleY(1) translateY(0);
  }
  to {
    transform: scaleY(0.95) translateY(3vh);
  }
`;

const rootTransformInAnimationLandscape = keyframes`
  from {
    transform: scaleX(0.98) translateX(2vw);
  }
  to {
    transform: scaleX(1) translateX(0);
  }
`;

const rootTransformOutAnimationLandscape = keyframes`
  from {
    transform: scaleX(1) translateX(0);
  }
  to {
    transform: scaleX(0.98) translateX(2vw);
  }
`;

const StyledRoot = styled.div<{
  opened: boolean;
}>`
  position: fixed;

  @media ${portraitQuery} {
    left: 0;
    top: -1px;
    width: 100vw;
    height: calc(100vh + 2px);
    height: calc(100svh + 2px);

    z-index: 9;
  }
  @media ${landscapeQuery} {
    left: -1px;
    top: 0;
    width: calc(100vw + 2px);
    height: 100vh;
    /* 横屏不能上下滚动，dvh不会连续变化，保持和当前状态一致 */
    height: 100dvh;

    z-index: 3;
  }

  box-sizing: border-box;

  user-select: none;

  @media ${nonTouchQuery} {
    display: none;
    pointer-events: none;
  }

  background: black;

  @media ${portraitQuery} {
    transform-origin: top center;
    animation: ${(props) => (props.opened ? '120ms' : '150ms')}
        ${(props) => (props.opened ? 'ease-out' : 'ease-in')} both
        ${(props) =>
          props.opened
            ? rootTransformInAnimationPortrait
            : rootTransformOutAnimationPortrait},
      ${(props) => (props.opened ? '60ms' : '100ms')} linear
        ${(props) => (props.opened ? '0ms' : '50ms')} both
        ${(props) => (props.opened ? fadeInAnimation : fadeOutAnimation)};
  }
  @media ${landscapeQuery} {
    transform-origin: center right;
    animation: ${(props) => (props.opened ? '120ms' : '150ms')}
        ${(props) => (props.opened ? 'ease-out' : 'ease-in')} both
        ${(props) =>
          props.opened
            ? rootTransformInAnimationLandscape
            : rootTransformOutAnimationLandscape},
      ${(props) => (props.opened ? '60ms' : '100ms')} linear
        ${(props) => (props.opened ? '0ms' : '50ms')} both
        ${(props) => (props.opened ? fadeInAnimation : fadeOutAnimation)};
  }
`;

const innerTransformInAnimationPortrait = keyframes`
  from {
    transform: scaleX(0.98);
  }
  to {
    transform: scaleX(1);
  }
`;

const innerTransformOutAnimationPortrait = keyframes`
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0.98);
  }
`;

const StyledInner = styled.div<{ opened: boolean }>`
  width: 100%;
  height: 100%;

  display: flex;

  @media ${portraitQuery} {
    flex-direction: column;
  }
  @media ${landscapeQuery} {
    flex-direction: row;
  }

  align-items: stretch;

  transform-origin: center center;
  @media ${portraitQuery} {
    animation: ${(props) => (props.opened ? '120ms' : '150ms')}
      ${(props) => (props.opened ? 'ease-out' : 'ease-in')} both
      ${(props) =>
        props.opened
          ? innerTransformInAnimationPortrait
          : innerTransformOutAnimationPortrait};
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  flex-grow: 1;

  overflow: auto;
`;

const StyledInfoContainer = styled.div`
  @media ${landscapeQuery} {
    --right-padding: max(calc(0.5 * env(safe-area-inset-right)), 1.5rem);
    width: calc(14.5rem + var(--right-padding));
  }
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media ${portraitQuery} {
    padding: 1rem 1rem 2rem 1rem;
    justify-content: flex-start;
  }
  @media ${landscapeQuery} {
    padding: 1rem var(--right-padding) 1.5rem 1rem;
    justify-content: flex-end;
  }
  gap: 0.5rem;
`;

const StyledInfoBlock = styled.div`
  color: white;
  text-align: left;
  font-weight: 500;
  letter-spacing: 0.03em;
  font-size: 0.75rem;
  line-height: 1rem;
  max-width: 13.56rem;
`;

export function InfoOverlay({
  metadata,
  data,
  background,
  opened,
  setOpened,
  focusArea,
}: {
  metadata: Metadata;
  data: StaticImageData;
  background: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
  focusArea: FocusArea;
}) {
  const [mounted, setMounted] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (opened) {
      animatingRef.current = true;
      requestAnimationFrame(() => {
        setMounted(true);
      });
      const timeout = setTimeout(() => {
        animatingRef.current = false;
      }, 60);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      const timeout1 = setTimeout(() => {
        setMounted(false);
      }, 180);
      const timeout2 = setTimeout(() => {
        animatingRef.current = false;
      }, 60);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [opened]);

  const imageContainerRef = useRef<HTMLDivElement>();
  const thumbnailRef = useRef<ThumbnailActions>();

  return opened || mounted ? (
    <>
      {opened && (
        <Global
          styles={css`
            html {
              touch-action: none !important;
            }
            body {
              touch-action: none !important;
            }
          `}
        ></Global>
      )}
      <StyledOverlay opened={opened} />
      <StyledRoot
        opened={opened}
        onClick={(e) => {
          if (opened && !animatingRef.current) {
            animatingRef.current = true;
            setOpened(false);
          }
          e.stopPropagation();
        }}
      >
        <StyledInner opened={opened}>
          <StyledImageContainer
            onClick={(e) => {
              e.stopPropagation();
            }}
            ref={imageContainerRef}
          >
            <InteractiveImage
              data={data}
              alt={metadata.comment ?? ''}
              background={background}
              focusArea={focusArea}
              thumbnailRef={thumbnailRef}
              animatingRef={animatingRef}
              opened={opened}
            />
          </StyledImageContainer>
          <StyledInfoContainer>
            <Thumbnail
              contentWidth={data.width}
              contentHeight={data.height}
              ref={thumbnailRef}
              imageRef={imageContainerRef}
            />
            {getMetadataBlocks(metadata).map((content, index) => (
              <StyledInfoBlock key={index}>
                {content.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </StyledInfoBlock>
            ))}
          </StyledInfoContainer>
        </StyledInner>
      </StyledRoot>
    </>
  ) : null;
}
