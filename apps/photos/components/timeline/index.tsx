import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Info from 'components/info';
import { TimelineItem, timelineItems } from 'data/images';
import Image from 'next/image';
import {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { landscapeQuery, portraitQuery } from 'utils/responsive';

const StyledDivider = styled.div`
  background: repeating-linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 28px,
      rgba(255, 255, 255, 0.1) 28px,
      rgba(255, 255, 255, 0.1) 30px
    ),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0) 28px,
      rgba(255, 255, 255, 0.1) 28px,
      rgba(255, 255, 255, 0.1) 30px
    ),
    black;
`;

const StyledImageContainer = styled.div`
  position: relative;
`;

function NormalSwitcher({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case 'image':
      return (
        <StyledImageContainer
          css={css`
            @media ${landscapeQuery} {
              height: 100vh;
              height: 100dvh;
              width: calc(100vh / var(--image-height) * var(--image-width));
              width: calc(100dvh / var(--image-height) * var(--image-width));
            }
            @media ${portraitQuery} {
              width: 100vw;
              height: calc(100vw / var(--image-width) * var(--image-height));
              max-height: 100vh;
              max-height: 100dvh;
            }
          `}
          style={
            {
              '--image-width': `${item.data.width}`,
              '--image-height': `${item.data.height}`,
            } as Record<string, string>
          }
          draggable="false"
        >
          <Image
            css={css`
              width: 100%;
              height: 100%;
              user-select: none;
              display: block;

              @media ${landscapeQuery} {
                object-fit: cover;
              }
              @media ${portraitQuery} {
                object-fit: contain;
              }
            `}
            src={item.data}
            alt={`图${item.index + 1}`}
            quality={100}
            placeholder="blur"
            draggable="false"
          />
          {item.metadata && <Info metadata={item.metadata} />}
        </StyledImageContainer>
      );
    case 'divider':
      return (
        <StyledDivider
          css={css`
            @media ${landscapeQuery} {
              aspect-ratio: 1 / 12;

              @supports not (aspect-ratio: 1 / 1) {
                width: 8.333vh;
                width: 8.333dvh;
              }
            }
            @media ${portraitQuery} {
              aspect-ratio: 12 / 1;

              @supports not (aspect-ratio: 1 / 1) {
                height: 8.333vw;
              }
            }
          `}
        />
      );
  }
}

function ThumbnailSwitcher({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case 'image':
      return (
        <div
          css={css`
            flex-basis: 0;
            overflow: hidden;

            @media ${landscapeQuery} {
              flex-grow: calc(var(--image-width) / var(--image-height));
            }
            @media ${portraitQuery} {
              flex-grow: calc(
                min(
                  var(--image-height) / var(--image-width),
                  var(--window-height) / var(--window-width)
                )
              );
            }
          `}
          style={
            {
              '--image-width': `${item.data.width}`,
              '--image-height': `${item.data.height}`,
            } as Record<string, string>
          }
          draggable="false"
        >
          <Image
            css={css(`
              height: 100%;
              width: 100%;
              object-fit: cover;
              display: block;
              user-select: none;

              @media ${landscapeQuery} {
                object-position: left 50%;
              }
              @media ${portraitQuery} {
                object-position: center center;
              }
            `)}
            width={128}
            src={item.data}
            alt={`图${item.index + 1}`}
            quality={75}
            draggable="false"
            loading="eager"
          />
        </div>
      );
    case 'divider':
      return (
        <StyledDivider
          css={css`
            flex-basis: 0;
            @media ${landscapeQuery} {
              flex-grow: calc(1 / 12);
            }
            @media ${portraitQuery} {
              flex-grow: calc(1 / 12);
            }
          `}
        />
      );
  }
}

const StyledTimeline = styled.div`
  display: flex;
  align-items: stretch;

  @media ${landscapeQuery} {
    flex-direction: row;
  }
  @media ${portraitQuery} {
    flex-direction: column;
  }
`;

export interface TimelineProps
  extends Omit<ComponentProps<typeof StyledTimeline>, 'children'> {
  items?: TimelineItem[];
  type?: 'normal' | 'thumbnail';
}

export const Timeline = forwardRef(function Timeline(
  { items = timelineItems, type = 'normal', ...rest }: TimelineProps,
  ref: ForwardedRef<ComponentRef<typeof StyledTimeline>>
) {
  const Switcher = { normal: NormalSwitcher, thumbnail: ThumbnailSwitcher }[
    type
  ];
  const [windowWidth, setWindowWidth] = useState(1);
  const [windowHeight, setWindowHeight] = useState(1);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);
  return (
    <StyledTimeline
      {...rest}
      ref={ref}
      onDragStart={(e) => {
        e.preventDefault();
      }}
      style={
        {
          '--window-width': `${windowWidth}`,
          '--window-height': `${windowHeight}`,
        } as Record<string, string>
      }
    >
      {items.map((item) => (
        <Switcher
          item={item}
          key={item.index}
        />
      ))}
    </StyledTimeline>
  );
});
