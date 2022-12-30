import bezier from 'bezier-easing';
import { useMemo } from 'react';

export interface ControlledScroll {
  get scrollX(): number;
  get scrollWidth(): number;
  get maxScrollX(): number;
  get scrollY(): number;
  get scrollHeight(): number;
  get maxScrollY(): number;
  scrollTo(
    x: number,
    y: number,
    options?: {
      automaticDuration?: boolean;
    }
  );
  scrollBy(
    x: number,
    y: number,
    options?: {
      automaticDuration?: boolean;
    }
  );
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
      get scrollWidth() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return document.documentElement.scrollWidth;
      },
      get maxScrollX() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return this.scrollWidth - window.innerWidth;
      },
      get scrollY() {
        if (typeof window === 'undefined') {
          return 0;
        }
        return window.scrollY;
      },
      get scrollHeight() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return document.documentElement.scrollHeight;
      },
      get maxScrollY() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return this.scrollHeight - window.innerHeight;
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

function useScrollSingleDirection(direction: 'scrollX' | 'scrollY'): [
  () => number,
  (
    value: number,
    options?: {
      automaticDuration?: boolean;
    }
  ) => void,
  (
    value: number,
    options?: {
      automaticDuration?: boolean;
    }
  ) => void
] {
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
    function scrollTo(
      value: number,
      {
        automaticDuration = false,
      }: {
        automaticDuration?: boolean;
      } = {}
    ) {
      value = clamp(value, 0, getMaxValue());

      const now = performance.now();
      const currentValue = getValue();

      const transitionDistance = Math.abs(value - currentValue);
      // 根据距离计算动画时长：
      // 1. 缩放不变性：页面整体缩放不改变时长
      // 2. 平均速度一次导数单调递减
      // 3. 距离趋于 0 时，时长也趋于 0
      const baseDistance =
        window[
          {
            scrollX: 'innerWidth',
            scrollY: 'innerHeight',
          }[direction]
        ] * 1.5;
      const computedDuration =
        (automaticDuration
          ? Math.pow(transitionDistance / baseDistance, 1 / 2.5)
          : 1) * duration;

      if (!ongoingTransition) {
        ongoingTransition = {
          startTime: now,
          endTime: now + computedDuration,
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
            endTime: now + computedDuration * reversingShorteningFactor,
            startValue: currentValue,
            endValue: value,
          };
        } else {
          ongoingTransition = {
            startTime: now,
            endTime: now + computedDuration,
            startValue: currentValue,
            endValue: value,
            reversingAdjustedStartValue: currentValue,
            reversingShorteningFactor: 1,
          };
        }
      }
    }

    function scrollBy(
      delta: number,
      options?: {
        automaticDuration?: boolean;
      }
    ) {
      if (!ongoingTransition) {
        scrollTo(getValue() + delta, options);
      } else {
        scrollTo(ongoingTransition.endValue + delta, options);
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
      get scrollWidth() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return document.documentElement.scrollWidth;
      },
      get maxScrollX() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return this.scrollWidth - window.innerWidth;
      },
      get scrollY() {
        return getScrollY();
      },
      get scrollHeight() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return document.documentElement.scrollHeight;
      },
      get maxScrollY() {
        if (typeof document === 'undefined') {
          return 0;
        }
        return this.scrollHeight - window.innerHeight;
      },
      scrollTo(
        x: number,
        y: number,
        options?: {
          automaticDuration?: boolean;
        }
      ) {
        scrollXTo(x, options);
        scrollYTo(y, options);
      },
      scrollBy(
        x: number,
        y: number,
        options?: {
          automaticDuration?: boolean;
        }
      ) {
        scrollXBy(x, options);
        scrollYBy(y, options);
      },
    }),
    [getScrollX, getScrollY, scrollXBy, scrollXTo, scrollYBy, scrollYTo]
  );

  return scroll;
}

export const useControlledScroll = useControlledScrollSimulated;
