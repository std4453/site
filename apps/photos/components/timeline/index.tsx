import { ClassNames, css } from '@emotion/react';
import styled from '@emotion/styled';
import Info from 'components/info';
import { InfoOverlay } from 'components/info-overlay';
import { ImageItem, TimelineItem } from 'components/timeline/types';
import { timelineItems } from 'data/images';
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

const StyledImageContainer = styled.div`
  position: relative;
`;

function NormalImage({ item }: { item: ImageItem }) {
  const [opened, setOpened] = useState(false);

  return (
    <>
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
        onClick={() => {
          if (!opened) {
            setOpened(true);
          }
        }}
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
          alt={item.metadata?.comment ?? ''}
          quality={100}
          placeholder="blur"
          draggable="false"
        />
        {item.metadata && <Info metadata={item.metadata} />}
      </StyledImageContainer>
      <InfoOverlay
        data={item.data}
        metadata={item.metadata}
        opened={opened}
        setOpened={setOpened}
      />
    </>
  );
}

function NormalSwitcher({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case 'image':
      return <NormalImage item={item} />;
    case 'divider':
      return (
        <ClassNames>
          {({ css, cx }) => (
            <div
              css={cx(
                css`
                  flex-shrink: 0;

                  @media ${landscapeQuery} {
                    aspect-ratio: 1 / var(--aspect-ratio);

                    @supports not (aspect-ratio: 1 / 1) {
                      width: calc(100vh / var(--aspect-ratio));
                      width: calc(100dvh / var(--aspect-ratio));
                    }
                  }
                  @media ${portraitQuery} {
                    aspect-ratio: var(--aspect-ratio) / 1;

                    @supports not (aspect-ratio: 1 / 1) {
                      width: calc(100vw / var(--aspect-ratio));
                    }
                  }
                `,
                {
                  [css`
                    @media ${portraitQuery} {
                      display: none;
                    }
                  `]: !(item.portrait ?? true),
                  [css`
                    @media ${landscapeQuery} {
                      display: none;
                    }
                  `]: !(item.landscape ?? true),
                },
                {
                  [css`
                    background: radial-gradient(
                          circle,
                          transparent 15%,
                          black 15%,
                          black 85%,
                          transparent 85%,
                          transparent
                        ) -15px -15px,
                      radial-gradient(
                          circle,
                          transparent 15%,
                          black 15%,
                          black 85%,
                          transparent 85%,
                          transparent
                        )
                        15px 15px,
                      linear-gradient(
                          -45deg,
                          transparent 47%,
                          #045541 47%,
                          #045541 53%,
                          transparent 53%
                        )
                        0 0,
                      linear-gradient(
                          45deg,
                          transparent 47%,
                          #045541 47%,
                          #045541 53%,
                          transparent 53%
                        )
                        0 0;
                    background-color: black;
                    background-size: 60px 60px, 60px 60px, 30px 30px, 30px 30px;
                  `]: item.style === 'cross',
                  [css`
                    background-color: #000000;
                    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23045541' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='23' cy='23' r='3'/%3E%3C/g%3E%3C/svg%3E");
                  `]: item.style === 'dots',
                }
              )}
              style={
                {
                  '--aspect-ratio': `${item.ratio}`,
                } as Record<string, string>
              }
            />
          )}
        </ClassNames>
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
            alt=""
            quality={75}
            draggable="false"
            loading="eager"
          />
        </div>
      );
    case 'divider':
      return (
        <ClassNames>
          {({ css, cx }) => (
            <div
              css={cx(
                css`
                  background: black;
                  flex-basis: 0;
                  flex-grow: calc(1 / var(--aspect-ratio));
                  flex-grow: calc(1 / var(--aspect-ratio));
                `,
                {
                  [css`
                    @media ${portraitQuery} {
                      display: none;
                    }
                  `]: !(item.portrait ?? true),
                  [css`
                    @media ${landscapeQuery} {
                      display: none;
                    }
                  `]: !(item.landscape ?? true),
                }
              )}
              style={
                {
                  '--aspect-ratio': `${item.ratio}`,
                } as Record<string, string>
              }
            />
          )}
        </ClassNames>
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
    function updateWindowSize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
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
      {items.map((item, index) => (
        <Switcher item={item} key={index} />
      ))}
    </StyledTimeline>
  );
});
