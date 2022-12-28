import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Info from 'components/info';
import { TimelineItem } from 'data/images';
import Image from 'next/image';
import { ComponentProps, ComponentRef, ForwardedRef, forwardRef } from 'react';

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
          css={css(`
            height: 100vh;
            height: 100dvh;
            width: ${(100 / item.data.height) * item.data.width}vh;
            width: ${(100 / item.data.height) * item.data.width}dvh;
          `)}
          draggable="false"
        >
          <Image
            css={css(`
              width: 100%;
              height: 100%;
              object-fit: cover;
              user-select: none;
              display: block;
            `)}
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
          css={css(`
            aspect-ratio: 1 / 12;

            @supports not (aspect-ratio: 1 / 1) {
              width: 8.333vh;
              width: 8.333dvh;
            }
          `)}
        />
      );
  }
}

function ThumbnailSwitcher({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case 'image':
      return (
        <div
          css={css(`
            height: 100%;
            flex-basis: 0;
            flex-grow: ${getTimelineItemWidth(item)};
            overflow: hidden;
          `)}
          draggable="false"
        >
          <Image
            css={css(`
              height: 100%;
              width: 100%;
              object-fit: cover;
              object-position: left 50%;
              display: block;
              user-select: none;
            `)}
            width={128}
            src={item.data}
            alt={`图${item.index + 1}`}
            quality={75}
            draggable="false"
          />
        </div>
      );
    case 'divider':
      return (
        <StyledDivider
          css={css(`
            flex-basis: 0;
            flex-grow: ${getTimelineItemWidth(item)};
          `)}
        />
      );
  }
}

const StyledTimeline = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;

export interface TimelineProps
  extends Omit<ComponentProps<typeof StyledTimeline>, 'children'> {
  items: TimelineItem[];
  type?: 'normal' | 'thumbnail';
}

function getTimelineItemWidth(item: TimelineItem) {
  switch (item.type) {
    case 'divider':
      return 1 / 12;
    case 'image':
      return item.data.width / item.data.height;
  }
}

export const Timeline = forwardRef(function Timeline(
  { items, type = 'normal', ...rest }: TimelineProps,
  ref: ForwardedRef<ComponentRef<typeof StyledTimeline>>
) {
  const Switcher = { normal: NormalSwitcher, thumbnail: ThumbnailSwitcher }[
    type
  ];
  return (
    <StyledTimeline
      {...rest}
      ref={ref}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      {items.map((item) => (
        <Switcher item={item} key={item.index} />
      ))}
    </StyledTimeline>
  );
});
