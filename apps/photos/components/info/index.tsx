import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemoizedFn } from 'ahooks';
import { Metadata } from 'components/timeline/types';
import { ComponentProps, useEffect, useState } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { touchQuery } from 'utils/responsive';

const appearAnimation = keyframes`
  from {
    transform: translateY(-0.5rem);
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const disappearAnimation = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    opacity: 0;
  }
  to {
    transform: translateY(-0.5rem);
    opacity: 0;
  }
`;

const StyledInfoBlock = styled.div<{
  index: number;
  expanded: boolean;
  firstExpanded: boolean;
}>`
  opacity: 0;

  background: rgba(0, 0, 0, 0.35);
  animation: ${(props) =>
      !props.firstExpanded
        ? 'none'
        : props.expanded
        ? appearAnimation
        : disappearAnimation}
    ${(props) =>
      props.expanded ? props.index * 20 + 200 : props.index * 20 + 200}ms
    ${(props) => (props.expanded ? props.index * 20 : (2 - props.index) * 30)}ms
    ${(props) => (props.expanded ? 'ease-out' : 'ease-in')} both;

  font-weight: 500;
  color: white;
  padding: 0.5rem 0.875rem;
  border-radius: 0.25rem;

  white-space: pre-wrap;
  max-width: 15.75rem;

  font-size: 0.875rem;
  line-height: 1.25rem;

  pointer-events: ${(props) => (props.expanded ? 'auto' : 'none')};
`;

const StyledBlockContainer = styled.div<{
  expanded: boolean;
}>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;

  @media ${touchQuery} {
    display: none;
  }

  pointer-events: none;
`;

const StyledInfoMode = styled.div<{
  expanded: boolean;
}>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;

  border-radius: 0.25rem;
  width: 1.75rem;
  height: 1.75rem;

  overflow: hidden;

  opacity: ${(props) => (props.expanded ? 0 : 1)};
  transition: ${(props) =>
    props.expanded ? 'opacity 150ms ease-in' : 'opacity 260ms 130ms ease-in'};

  cursor: pointer;

  pointer-events: ${(props) => (props.expanded ? 'none' : 'auto')};

  @media ${touchQuery} {
    display: none;
  }
`;

const StyledInfoInner = styled.div`
  width: 100%;
  height: 100%;
  background: black;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0.25;
  transition: opacity 80ms ease;

  &:hover {
    opacity: 0.35;
  }
`;

function InfoMode({ ...rest }: ComponentProps<typeof StyledInfoMode>) {
  return (
    <StyledInfoMode {...rest}>
      <StyledInfoInner>
        <svg
          css={css(`
          width: 1rem;
          height: 1rem;
        `)}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.05469 1.37891C5.05469 1.13932 5.13802 0.93099 5.30469 0.753906C5.47656 0.576823 5.69271 0.488281 5.95312 0.488281C6.19792 0.488281 6.40885 0.574219 6.58594 0.746094C6.76302 0.917969 6.85156 1.12891 6.85156 1.37891C6.85156 1.62891 6.76302 1.84245 6.58594 2.01953C6.40885 2.19141 6.19792 2.27734 5.95312 2.27734C5.70312 2.27734 5.48958 2.1888 5.3125 2.01172C5.14062 1.83464 5.05469 1.6237 5.05469 1.37891ZM5.26562 10.1914V5.26953H4.08594V3.94922H6.75V10.1914H7.91406V11.5117H4.08594V10.1914H5.26562Z"
            fill="white"
          />
        </svg>
      </StyledInfoInner>
    </StyledInfoMode>
  );
}

export interface InfoProps {
  metadata?: Metadata;
}

function getBlocks(metadata: Metadata) {
  return [
    [
      metadata.device,
      metadata.lens,
      [
        metadata.iso ? `ISO${metadata.iso}` : '',
        metadata.f ? `${metadata.f}mm` : '',
        metadata.fStop ? `ƒ${metadata.fStop}` : '',
        metadata.shutter,
      ]
        .filter(Boolean)
        .join(' '),
    ]
      .filter(Boolean)
      .join('\n'),
    [metadata.subject, metadata.time].filter(Boolean).join('\n'),
    metadata.comment,
  ].filter((i): i is string => Boolean(i));
}

export default function Info({ metadata }: InfoProps) {
  const [expanded, setExpandedInternal] = useState(false);
  const [firstExpanded, setFirstExpanded] = useState(false);
  const setExpanded = useMemoizedFn((expanded: boolean) => {
    if (!firstExpanded && expanded) {
      setFirstExpanded(true);
    }
    setExpandedInternal(expanded);
  });

  useEffect(() => {
    if (expanded) {
      const timeout = setTimeout(() => {
        setExpanded(false);
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [expanded, setExpanded]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setExpanded(false);
      }}
    >
      <div>
        <InfoMode
          expanded={expanded}
          onClick={() => {
            setExpanded(true);
          }}
        />
        <StyledBlockContainer expanded={expanded}>
          {getBlocks(metadata).map((content, index) => (
            <StyledInfoBlock
              key={index}
              index={index}
              expanded={expanded}
              firstExpanded={firstExpanded}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {content}
            </StyledInfoBlock>
          ))}
        </StyledBlockContainer>
      </div>
    </ClickAwayListener>
  );
}
