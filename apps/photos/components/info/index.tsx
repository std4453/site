import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Metadata } from 'components/timeline/types';

const StyledInfoMode = styled.div`
  position: absolute;
  top: 0.625rem;
  left: 0.625rem;

  border-radius: 0.1875rem;
  width: 1.25rem;
  height: 1.25rem;

  background: black;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0.25;
  &&:hover {
    opacity: 0.35;
  }

  transition: opacity 120ms ease;

  cursor: pointer;
`;

function InfoMode() {
  return (
    <StyledInfoMode>
      <svg
        css={css(`
          width: 0.75rem;
          height: 0.75rem;
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
    </StyledInfoMode>
  );
}

export interface InfoProps {
  metadata?: Metadata;
}

export default function Info({ metadata }: InfoProps) {
  return <InfoMode />;
}
