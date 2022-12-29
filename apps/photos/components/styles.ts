import { css } from '@emotion/react';
import { landscapeQuery, portraitQuery } from 'utils/responsive';

export const thumbnailScrollbarCSS = css`
  position: fixed;
  z-index: 5;

  @media ${landscapeQuery} {
    left: 0.25rem;
    bottom: 0;
    height: 3.25rem;
    width: calc(100vw - 24rem - 0.5rem);

    & #handle {
      height: 0.375rem;
      transition-property: width, height;
    }

    &:hover #handle,
    &[data-dragging='true'] #handle {
      height: 3rem;
    }

    & #offset {
      width: 100%;
      bottom: 0.25rem;
    }

    & #timeline {
      left: 0;
      bottom: 0;
      height: 3rem;
      width: calc(100vw - 24rem - 0.5rem);
    }

    & #container2 {
      left: 0;
      bottom: 0.25rem;
      height: 3rem;
      width: calc(100vw - 24rem - 0.5rem);
    }
  }

  @media ${portraitQuery} {
    bottom: 0.25rem;
    right: 0;
    width: 2.5rem;
    height: calc(100vh - 2.5rem - 0.5rem);

    & #handle {
      width: 0.375rem;
      transition-property: height, width;
    }

    &:hover #handle,
    &[data-dragging='true'] #handle {
      width: 2.25rem;
    }

    & #offset {
      height: 100%;
      right: 0.25rem;
    }

    & #timeline {
      right: 0;
      top: 0;
      width: 2.25rem;
      height: calc(100vh - 2.5rem - 0.5rem);
    }

    & #container2 {
      right: 0.25rem;
      top: 0;
      width: 2.25rem;
      height: calc(100vh - 2.5rem - 0.5rem);
    }
  }

  & #container2 {
    border-radius: 0.1875rem;
    overflow: hidden;

    opacity: 0;
    transition-property: opacity, transform;
    transition-delay: 130ms, 100ms;
    transition-duration: 250ms, 220ms;
    transition-timing-function: linear, ease-in;
  }

  &:hover #container2,
  &[data-dragging='true'] #container2 {
    opacity: 1;
    transition-delay: 0ms, 0ms;
    transition-duration: 100ms, 140ms;
    transition-timing-function: linear, ease-out;
  }

  &:hover #timeline,
  &[data-dragging='true'] #timeline {
    opacity: 1;
    transition-delay: 0ms;
    transition-duration: 100ms;
    transition-timing-function: ease-out;
  }

  &:hover #handle,
  &[data-dragging='true'] #handle {
    transition-delay: 0ms, 0ms;
    transition-duration: 200ms, 100ms;
    transition-timing-function: ease, ease;
  }

  cursor: pointer;

  @media (pointer: coerse) or (pointer: none) {
    display: none;
  }

  & #offset {
    position: absolute;
    will-change: transform;
  }

  & #handle {
    border-radius: 0.1875rem;
    overflow: hidden;
    position: relative;

    cursor: move;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    transition-duration: 200ms, 330ms;
    transition-delay: 0ms, 130ms;
    transition-timing-function: ease, ease-out;

    background: rgba(80, 80, 80, 0.35);
  }

  & #timeline {
    position: absolute;

    display: flex;
    pointer-events: none;

    will-change: transform, opacity;

    opacity: 0;
    transition-property: opacity;
    transition-delay: 130ms;
    transition-duration: 250ms;
    transition-timing-function: linear;
  }

  & #container2 {
    position: absolute;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.18);
  }

  & #timeline2 {
    opacity: 0.18;
    width: 100%;
    height: 100%;
  }
`;
