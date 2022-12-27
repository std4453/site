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
          width: ${(100 / item.data.height) * item.data.width}vh;
        `)}
        >
          <Image
            css={css(`
              width: 100%;
              height: 100%;
              object-fit: cover;
              user-select: none;
          `)}
            src={item.data}
            alt={`图${item.index + 1}`}
            quality={100}
            placeholder="blur"
            draggable={false}
          />
          {item.metadata && <Info metadata={item.metadata} />}
        </StyledImageContainer>
      );
    case 'divider':
      return (
        <StyledDivider
          css={css(`
            width: ${item.width ?? 120}px;
          `)}
        />
      );
  }
}

function ThumbnailSwitcher({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case 'image':
      return <Image src={item.data} alt={`图${item.index + 1}`} quality={75} />;
    case 'divider':
      return (
        <StyledDivider
          css={css(`
            width: calc(${item.width ?? 120}px / 100vh * 32px);
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

export const Timeline = forwardRef(function Timeline(
  { items, type = 'normal', ...rest }: TimelineProps,
  ref: ForwardedRef<ComponentRef<typeof StyledTimeline>>
) {
  const Switcher = { normal: NormalSwitcher, thumbnail: ThumbnailSwitcher }[
    type
  ];
  return (
    <StyledTimeline {...rest} ref={ref}>
      {items.map((item) => (
        <Switcher item={item} key={item.index} />
      ))}
    </StyledTimeline>
  );
});
