// https://github.com/facebookarchive/fixed-data-table/blob/3a9bf338b22406169e7261f85ddeda22ddce3b6f/src/vendor_upstream/dom/normalizeWheel.js

// Reasonable defaults
const PIXEL_STEP = 10;
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;

export function normalizeWheel(
  event: WheelEvent & {
    HORIZONTAL_AXIS?: number;
    wheelDelta?: number;
    wheelDeltaY?: number;
    wheelDeltaX?: number;
    axis?: number;
  }
) {
  let sX = 0,
    sY = 0, // spinX, spinY
    pX = 0,
    pY = 0; // pixelX, pixelY

  // Legacy
  if ('detail' in event) {
    sY = event.detail;
  }
  if ('wheelDelta' in event) {
    sY = -event.wheelDelta / 120;
  }
  if ('wheelDeltaY' in event) {
    sY = -event.wheelDeltaY / 120;
  }
  if ('wheelDeltaX' in event) {
    sX = -event.wheelDeltaX / 120;
  }

  // side scrolling on FF with DOMMouseScroll
  if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in event) {
    pY = event.deltaY;
  }
  if ('deltaX' in event) {
    pX = event.deltaX;
  }

  if ((pX || pY) && event.deltaMode) {
    if (event.deltaMode == 1) {
      // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    } else {
      // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) {
    sX = pX < 1 ? -1 : 1;
  }
  if (pY && !sY) {
    sY = pY < 1 ? -1 : 1;
  }

  return { spinX: sX, spinY: sY, pixelX: pX, pixelY: pY };
}

// adapted from https://stackoverflow.com/a/56948026/3871776

// WheelEvent 上没有 wheelDeltaY 这个属性，只能用 any
export function isTouchpad(e: any) {
  return e.wheelDeltaY
    ? Math.abs(e.wheelDeltaY - -3 * e.deltaY) < 3
    : e.deltaMode === 0;
}
