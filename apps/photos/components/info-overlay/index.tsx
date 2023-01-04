import { css, Global } from '@emotion/react';
import styled from '@emotion/styled';
import { InteractiveImage } from 'components/info-overlay/image';
import { Metadata } from 'components/timeline/types';
import { StaticImageData } from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
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
  background-color: rgba(0, 0, 0, 0.35);

  pointer-events: none;
  user-select: none;

  opacity: ${(props) => (props.opened ? 1 : 0)};
  transition: opacity
    ${(props) => (props.opened ? '60ms linear' : '100ms 50ms linear')};

  @media ${nonTouchQuery} {
    display: none;
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
    height: calc(100lvh + 2px);
  }
  @media ${landscapeQuery} {
    left: -1px;
    top: 0;
    width: calc(100vw + 2px);
    height: 100vh;
    height: 100lvh;
  }

  z-index: 3;

  user-select: none;

  @media ${nonTouchQuery} {
    display: none;
    pointer-events: none;
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
    ${(props) => (props.opened ? 'linear' : 'linear')};
  transition-duration: ${(props) => (props.opened ? '120ms' : '150ms')},
    ${(props) => (props.opened ? '60ms' : '100ms')};
  transition-delay: 0ms, ${(props) => (props.opened ? '0ms' : '50ms')};
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
  transition-duration: ${(props) => (props.opened ? '120ms' : '150ms')};
`;

const StyledImageContainer = styled.div`
  position: relative;
  flex-grow: 1;

  overflow: auto;
`;

const StyledInfoContainer = styled.div`
  @media ${portraitQuery} {
    min-height: 11.125rem;
  }
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
  background,
  opened,
  setOpened,
}: {
  metadata: Metadata;
  data: StaticImageData;
  background: string;
  opened: boolean;
  setOpened: (opened: boolean) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const animatingRef = useRef(false);

  useLayoutEffect(() => {
    if (opened) {
      setTimeout(() => {
        animatingRef.current = true;
        setMounted(true);
      }, 0);
      const timeout = setTimeout(() => {
        animatingRef.current = false;
      }, 60);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      animatingRef.current = true;
      const timeout1 = setTimeout(() => {
        setMounted(false);
      }, 120);
      const timeout2 = setTimeout(() => {
        animatingRef.current = false;
      }, 60);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [opened]);

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
      <StyledOverlay opened={opened && mounted} />
      <StyledRoot
        opened={opened && mounted}
        onClick={(e) => {
          if (opened && !animatingRef.current) {
            setOpened(false);
          }
          e.stopPropagation();
        }}
      >
        <StyledInner opened={opened && mounted}>
          <StyledImageContainer
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <InteractiveImage
              data={data}
              alt={metadata.comment ?? ''}
              mounted={mounted}
              background={background}
            />
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
  ) : null;
}
