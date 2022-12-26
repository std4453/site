import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { TimelineItem } from 'data/images';
import Image from 'next/image';
import { ComponentProps, ComponentRef, ForwardedRef, forwardRef } from 'react';

const StyledDivider = styled.div`
  background-color: #000000;
`;

function NormalSwitcher({ item }: { item: TimelineItem }) {
  switch (item.type) {
    case 'image':
      return <Image src={item.data} alt={`图${item.index}`} quality={100} />;
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
      return <Image src={item.data} alt={`图${item.index}`} quality={75} />;
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

  & img {
    width: auto;
    height: 100%;
  }
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
