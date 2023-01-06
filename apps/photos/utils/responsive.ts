export const portraitQuery = `(max-aspect-ratio: 1/1)`;

export const landscapeQuery = `(min-aspect-ratio: 1/1)`;

export function isPortrait() {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.innerHeight > window.innerWidth;
}

export const touchQuery = `(pointer: none), (pointer: coarse)`;

export const nonTouchQuery = `(pointer: fine)`;

// 这里主要是为了匹配 CSS @media query，从而确定当前是否为触摸模式，而非检测设备
// 本身是否支持触摸
export function isTouch() {
  if (typeof matchMedia === 'undefined') {
    return false;
  }
  const isFine = matchMedia('(pointer: none)').matches;
  const isCoarse = matchMedia('(pointer: coarse)').matches;
  return isFine || isCoarse;
}
