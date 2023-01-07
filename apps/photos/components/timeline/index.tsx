import { ClassNames, css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemoizedFn } from 'ahooks';
import Info from 'components/info';
import { InfoOverlay } from 'components/info-overlay';
import { FocusArea, ImageItem, TimelineItem } from 'components/timeline/types';
import { timelineItems } from 'data/images';
import Image from 'next/image';
import {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isIOS } from 'react-device-detect';
import {
  isPortrait,
  isTouch,
  landscapeQuery,
  portraitQuery,
} from 'utils/responsive';

const StyledImageContainer = styled.div`
  position: relative;
`;

function NormalImage({ item }: { item: ImageItem }) {
  const [opened, setOpenedActual] = useState(false);
  const bodyLockedRef = useRef(false);
  const previousScrollYRef = useRef(0);
  const setOpened = useMemoizedFn((newOpened: boolean) => {
    if (newOpened) {
      if (!opened && isTouch()) {
        // iOS端始终锁定缩放，安卓端可能有问题
        const needLockBodyScroll = isPortrait() && isIOS;
        if (needLockBodyScroll) {
          setTimeout(() => {
            previousScrollYRef.current = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            bodyLockedRef.current = true;
          }, 100);
        }
        setOpenedActual(true);
      }
    } else {
      if (opened) {
        if (bodyLockedRef.current) {
          requestAnimationFrame(() => {
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.height = '';
            window.scrollTo(0, previousScrollYRef.current);
            bodyLockedRef.current = false;
            setOpenedActual(false);
          });
        } else {
          setOpenedActual(false);
        }
      }
    }
  });

  // next/image得到的data.width和data.height有时不同于原图，这里按比例缩放
  const focusArea = useMemo(
    (): FocusArea => [
      (item.focusArea[0] / item.size[0]) * item.data.width,
      (item.focusArea[1] / item.size[1]) * item.data.height,
      (item.focusArea[2] / item.size[0]) * item.data.width,
      (item.focusArea[3] / item.size[1]) * item.data.height,
    ],
    [item]
  );

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

          background: var(--image-color);
        `}
        style={
          {
            '--image-width': `${item.data.width}`,
            '--image-height': `${item.data.height}`,
            '--image-color': item.background,
          } as Record<string, string>
        }
        draggable="false"
        onClick={() => {
          setOpened(true);
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
          quality={90}
          draggable="false"
          sizes="100vw"
        />
        {item.metadata && <Info metadata={item.metadata} />}
      </StyledImageContainer>
      <InfoOverlay
        data={item.data}
        metadata={item.metadata}
        opened={opened}
        setOpened={setOpened}
        background={item.background}
        focusArea={focusArea}
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
              '--image-color': item.background,
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
