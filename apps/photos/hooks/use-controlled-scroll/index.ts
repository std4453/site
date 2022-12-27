import bezier from 'bezier-easing';
import { useMemo } from 'react';

export interface ControlledScroll {
  get scrollX();
  get scrollY();
  scrollTo(x: number, y: number);
  scrollBy(x: number, y: number);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useControlledScrollNative(): ControlledScroll {
  const scroll = useMemo(
    (): ControlledScroll => ({
      get scrollX() {
        if (typeof window === 'undefined') {
          return 0;
        }
        return window.scrollX;
      },
      get scrollY() {
        if (typeof window === 'undefined') {
          return 0;
        }
        return window.scrollY;
      },
      scrollTo(x: number, y: number) {
        window?.scrollTo(x, y);
      },
      scrollBy(x: number, y: number) {
        window?.scrollBy(x, y);
      },
    }),
    []
  );
  return scroll;
}

// css ease
const easing = bezier(0.25, 0.1, 0.25, 1);
const duration = 280;

interface Transition {
  startTime: DOMHighResTimeStamp;
  endTime: DOMHighResTimeStamp;
  startValue: number;
  endValue: number;
  reversingAdjustedStartValue: number;
  reversingShorteningFactor: number;
}

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

function ease(transition: Transition, ts: DOMHighResTimeStamp) {
  const { startTime, endTime } = transition;
  const t = clamp((ts - startTime) / (endTime - startTime), 0, 1);
  // clamp to [0, 1]
  const tMapped = easing(t);
  return tMapped;
}

function interp(transition: Transition, ts: DOMHighResTimeStamp) {
  const { startValue, endValue } = transition;
  const tMapped = ease(transition, ts);
  return startValue * (1 - tMapped) + endValue * tMapped;
}

function useScrollSingleDirection(
  direction: 'scrollX' | 'scrollY'
): [() => number, (value: number) => void, (value: number) => void] {
  return useMemo(() => {
    function getValue() {
      return typeof window === 'undefined' ? 0 : window[direction];
    }
    function setValue(value: number) {
      if (typeof window === 'undefined') {
        return;
      }
      window.scrollTo({
        [{
          scrollX: 'left',
          scrollY: 'top',
        }[direction]]: value,
        behavior: 'auto',
      });
    }

    let ongoingTransition: Transition | undefined;

    function tick(ts: DOMHighResTimeStamp) {
      if (!ongoingTransition) {
        return;
      }

      setValue(interp(ongoingTransition, ts));

      if (ts >= ongoingTransition.endTime) {
        ongoingTransition = undefined;
      } else {
        requestAnimationFrame(tick);
      }
    }

    function getMaxValue() {
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        // 防止SSR报错
        return 10000;
      }
      return (
        document.documentElement[
          {
            scrollX: 'scrollWidth',
            scrollY: 'scrollHeight',
          }[direction]
        ] -
        window[
          {
            scrollX: 'innerWidth',
            scrollY: 'innerHeight',
          }[direction]
        ]
      );
    }

    // implementation of CSS transition on scroll values as specified by
    // https://www.w3.org/TR/css-transitions-1/#starting
    function scrollTo(value: number) {
      value = clamp(value, 0, getMaxValue());

      const now = performance.now();
      const currentValue = getValue();
      if (!ongoingTransition) {
        ongoingTransition = {
          startTime: now,
          endTime: now + duration,
          startValue: currentValue,
          endValue: value,
          reversingAdjustedStartValue: currentValue,
          reversingShorteningFactor: 1,
        };
        requestAnimationFrame(tick);
      } else if (ongoingTransition.endValue !== value) {
        if (currentValue === value) {
          ongoingTransition = undefined;
        } else if (ongoingTransition.reversingAdjustedStartValue === value) {
          const oldTransition = ongoingTransition;
          const reversingShorteningFactor = clamp(
            Math.abs(
              ease(oldTransition, now) *
                oldTransition.reversingShorteningFactor +
                (1 - oldTransition.reversingShorteningFactor)
            ),
            0,
            1
          );
          ongoingTransition = {
            reversingAdjustedStartValue: oldTransition.endTime,
            reversingShorteningFactor,
            startTime: now,
            endTime: now + duration * reversingShorteningFactor,
            startValue: currentValue,
            endValue: value,
          };
        } else {
          ongoingTransition = {
            startTime: now,
            endTime: now + duration,
            startValue: currentValue,
            endValue: value,
            reversingAdjustedStartValue: currentValue,
            reversingShorteningFactor: 1,
          };
        }
      }
    }

    function scrollBy(delta: number) {
      if (!ongoingTransition) {
        scrollTo(getValue() + delta);
      } else {
        scrollTo(ongoingTransition.endValue + delta);
      }
    }

    return [getValue, scrollTo, scrollBy];
  }, [direction]);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useControlledScrollSimulated(): ControlledScroll {
  const [getScrollX, scrollXTo, scrollXBy] =
    useScrollSingleDirection('scrollX');
  const [getScrollY, scrollYTo, scrollYBy] =
    useScrollSingleDirection('scrollY');

  const scroll = useMemo(
    (): ControlledScroll => ({
      get scrollX() {
        return getScrollX();
      },
      get scrollY() {
        return getScrollY();
      },
      scrollTo(x: number, y: number) {
        scrollXTo(x);
        scrollYTo(y);
      },
      scrollBy(x: number, y: number) {
        scrollXBy(x);
        scrollYBy(y);
      },
    }),
    [getScrollX, getScrollY, scrollXBy, scrollXTo, scrollYBy, scrollYTo]
  );

  return scroll;
}

export const useControlledScroll = useControlledScrollSimulated;
