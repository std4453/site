import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Metadata } from 'components/timeline/types';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { getMetadataBlocks } from 'utils/metadata';
import { landscapeQuery, nonTouchQuery, portraitQuery } from 'utils/responsive';

const StyledOverlay = styled.div<{
  opened: boolean;
}>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  z-index: 2;
  background-color: rgba(0, 0, 0, 0.25);

  pointer-events: none;
  user-select: none;

  opacity: ${(props) => (props.opened ? 1 : 0)};
  transition: opacity
    ${(props) => (props.opened ? '60ms linear' : '40ms 80ms linear')};
`;

const StyledRoot = styled.div<{
  opened: boolean;
}>`
  position: fixed;

  @media ${portraitQuery} {
    left: 0;
    bottom: -1px;
    width: 100vw;
    height: calc(100vh + 2px);
    height: calc(100lvh + 2px);
  }
  @media ${landscapeQuery} {
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    height: 100lvh;
  }

  z-index: 3;

  user-select: none;
  pointer-events: ${(props) => (props.opened ? 'auto' : 'none')};

  @media ${nonTouchQuery} {
    display: none;
  }

  background: black;

  opacity: ${(props) => (props.opened ? 1 : 0)};
  @media ${portraitQuery} {
    transform-origin: top center;
    transform: ${(props) =>
      props.opened ? 'scale(1) translateY(0)' : 'scaleY(0.95) translateY(3vh)'};
  }
  @media ${landscapeQuery} {
    transform-origin: center right;
    transform: ${(props) =>
      props.opened ? 'scale(1) translateX(0)' : 'scaleX(0.98) translateX(2vw)'};
  }
  transition-property: transform, opacity;
  transition-timing-function: ${(props) =>
      props.opened ? 'ease-out' : 'ease-in'},
    ${(props) => (props.opened ? 'linear' : 'ease-in')};
  transition-duration: 120ms, ${(props) => (props.opened ? '60ms' : '80ms')};
  transition-delay: 0ms, ${(props) => (props.opened ? '0ms' : '40ms')};
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
    transform: ${(props) => (props.opened ? 'scaleX(1)' : 'scaleX(0.98)')};
  }
  transition-property: transform;
  transition-timing-function: ${(props) =>
    props.opened ? 'ease-out' : 'ease-in'};
  transition-duration: 120ms;
`;

const StyledImageContainer = styled.div`
  position: relative;
  flex-grow: 1;

  overflow: auto;
`;

const StyledInfoContainer = styled.div`
  @media ${landscapeQuery} {
    width: 16rem;
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
    padding: 1rem 1.5rem 1.5rem 1rem;
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

  opened,
  setOpened,
}: {
  metadata: Metadata;
  data: StaticImageData;

  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  const [imageMounted, setImageMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (opened) {
      setImageLoaded(false);
      const timeout = setTimeout(() => {
        setImageMounted(true);
      }, 120);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setImageLoaded(false);
      const timeout = setTimeout(() => {
        setImageMounted(false);
      }, 120);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [opened]);

  return (
    <>
      <StyledOverlay opened={opened} />
      <StyledRoot
        opened={opened}
        onClick={(e) => {
          setOpened(false);
          e.stopPropagation();
        }}
      >
        <StyledInner opened={opened}>
          <StyledImageContainer
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              css={css`
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: ${imageLoaded ? 0 : 1};
                transition: opacity 100ms linear;
              `}
              src={data.blurDataURL}
              width={data.blurWidth}
              height={data.blurHeight}
              alt=""
            />
            {imageMounted && (
              <Image
                css={css`
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                `}
                src={data}
                alt={metadata.comment ?? ''}
                unoptimized
                loading="eager"
                onLoadingComplete={() => {
                  setImageLoaded(true);
                }}
              />
            )}
          </StyledImageContainer>
          <StyledInfoContainer>
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
  );
}
