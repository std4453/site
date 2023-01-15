import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { landscapeQuery, portraitQuery } from 'utils/responsive';

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;

  width: 3.5rem;
  height: 3.5rem;
  background: #ffffff;
  box-sizing: border-box;

  @media ${landscapeQuery} {
    --right-padding: calc(0.5 * env(safe-area-inset-right));
    right: var(--right-padding);
  }
  @media ${portraitQuery} {
    --top-padding: env(safe-area-inset-top);
    top: var(--top-padding);
  }

  z-index: 5;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Logo() {
  return (
    <StyledContainer>
      <svg
        css={css(`
          width: 2rem;
          height: 2rem;
        `)}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M11.9999 21.8632C17.4472 21.8632 21.8632 17.4472 21.8632 11.9999C21.8632 6.55259 17.4472 2.13666 11.9999 2.13666C6.55259 2.13666 2.13666 6.55259 2.13666 11.9999C2.13666 17.4472 6.55259 21.8632 11.9999 21.8632Z"
            fill="#FF8902"
          />
          <path
            d="M19.4061 14.9496V18.5006H16.9519V21.8632H13.4003V18.5006H6.50791L3.17077 18.4556C2.95922 18.4526 2.81518 18.2402 2.89024 18.0422L4.06295 14.9496L8.92215 2.13681L12.2765 2.18263C12.4799 2.18559 12.6186 2.38975 12.5465 2.57945L7.85455 14.9496H13.4005V2.18855H16.9521V14.9496H19.4062H19.4061Z"
            fill="black"
          />
        </g>
      </svg>
    </StyledContainer>
  );
}
