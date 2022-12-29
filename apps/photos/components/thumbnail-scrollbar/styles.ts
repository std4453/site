import styled from '@emotion/styled';
import { Timeline } from 'components/timeline';
import { landscapeQuery, portraitQuery } from 'utils/responsive';

export const StyledContainer = styled.div`
  position: fixed;
  z-index: 5;

  @media ${landscapeQuery} {
    --scrollbar-length: calc(100vw - 24rem - 0.5rem);
    --scrollbar-thickness: 3rem;
    --scrollbar-width: var(--scrollbar-length);
    --scrollbar-height: var(--scrollbar-thickness);

    --handle-height-idle: 0.375rem;
    --handle-height-hover: var(--scrollbar-thickness);

    bottom: 0;
    left: 0;
  }

  @media ${portraitQuery} {
    --scrollbar-length: calc(100vh - 3.5rem - 0.5rem);
    --scrollbar-thickness: 3rem;
    --scrollbar-width: var(--scrollbar-thickness);
    --scrollbar-height: var(--scrollbar-length);

    --handle-width-idle: 0.375rem;
    --handle-width-hover: var(--scrollbar-thickness);

    bottom: 0;
    right: 0;
  }

  width: var(--scrollbar-width);
  height: var(--scrollbar-height);
  border: 0.25rem solid transparent;

  cursor: pointer;

  @media (pointer: coerse) or (pointer: none) {
    display: none;
  }
`;

export const StyledBg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  overflow: hidden;
  border-radius: 0.1875rem;
  background-color: rgba(0, 0, 0, 0.12);

  pointer-events: none;

  opacity: 0;
  transition: opacity 220ms linear 140ms;
  div[data-dragging]:hover &,
  div[data-dragging='true'] & {
    opacity: 1;
    transition: opacity 90ms linear 25ms;
  }
`;

export const StyledBgTimeline = styled(Timeline)`
  opacity: 0.18;
  width: 100%;
  height: 100%;
`;

export const StyledOffset = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  will-change: transform;
`;

export const StyledHandle = styled.div`
  width: var(--handle-width-idle);
  height: var(--handle-height-idle);

  border-radius: 0.1875rem;
  border: none;
  overflow: hidden;
  position: absolute;
  background: rgba(80, 80, 80, 0.35);

  cursor: move;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }

  @media ${landscapeQuery} {
    transition-property: width, height;
    bottom: 0;
    left: 0;
  }
  @media ${portraitQuery} {
    transition-property: height, width;
    right: 0;
    top: 0;
  }
  transition-duration: 200ms, 290ms;
  transition-delay: 0ms, 160ms;
  transition-timing-function: ease, ease-out;
  div[data-dragging]:hover &,
  div[data-dragging='true'] & {
    width: var(--handle-width-hover);
    height: var(--handle-height-hover);
    transition-delay: 0ms, 0ms;
    transition-duration: 200ms, 100ms;
    transition-timing-function: ease, ease;
  }
`;

export const StyledTimeline = styled(Timeline)`
  position: absolute;

  @media ${landscapeQuery} {
    left: 0;
    bottom: 0;
  }
  @media ${portraitQuery} {
    right: 0;
    top: 0;
  }

  width: var(--scrollbar-width);
  height: var(--scrollbar-height);

  pointer-events: none;

  will-change: transform, opacity;

  opacity: 0;
  transition: opacity 250ms 130ms linear;
  div[data-dragging]:hover &,
  div[data-dragging='true'] & {
    opacity: 1;
    transition: opacity 100ms 0ms ease-out;
  }
`;
