/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-empty-function */

import * as React from 'react';

import { styleRoot, styleChild, styles } from './styles.css';
import { Interaction, Point } from '../types';
import { isTouch } from '../utils';
import { AnimateOptions, ScaleToOptions, Props, DefaultProps } from './types';

const classnames = (base: string, other?: string): string =>
  other ? `${base} ${other}` : base;

const { abs, max, min, sqrt } = Math;

const isSsr = typeof window === 'undefined';

const isMac = isSsr ? false : /(Mac)/i.test(navigator.platform);

const isDragInteraction = (i: Interaction | null): boolean => i === 'drag';

const isZoomInteraction = (i: Interaction | null): boolean => i === 'zoom';

const isZoomGesture = (wheelEvent: WheelEvent) => isMac && wheelEvent.ctrlKey;

const cancelEvent = (event: any): void => {
  event.stopPropagation();
  event.preventDefault();
};

const getDistance = (a: Point, b: Point): number => {
  const x = a.x - b.x;
  const y = a.y - b.y;

  return sqrt(x * x + y * y);
};

const calculateScale = (
  startTouches: Array<Point>,
  endTouches: Array<Point>
): number => {
  const startDistance = getDistance(startTouches[0], startTouches[1]);
  const endDistance = getDistance(endTouches[0], endTouches[1]);

  return endDistance / startDistance;
};

const isCloseTo = (value: number, expected: number) =>
  value > expected - 0.01 && value < expected + 0.01;

const swing = (p: number): number => -Math.cos(p * Math.PI) / 2 + 0.5;

const getPointByPageCoordinates = (touch: Touch): Point => ({
  x: touch.pageX,
  y: touch.pageY,
});

const getPageCoordinatesByTouches = (touches: TouchList): Array<Point> =>
  Array.from(touches).map(getPointByPageCoordinates);

const sum = (a: number, b: number): number => a + b;

const getVectorAvg = (vectors: Array<Point>): Point => ({
  x: vectors.map(({ x }) => x).reduce(sum, 0) / vectors.length,
  y: vectors.map(({ y }) => y).reduce(sum, 0) / vectors.length,
});

const clamp = (min: number, max: number, value: number): number =>
  value < min ? min : value > max ? max : value;

const shouldInterceptWheel = (event: WheelEvent): boolean =>
  !(event.ctrlKey || event.metaKey);

const getElementSize = (
  element?: HTMLElement | null
): { width: number; height: number } => {
  if (element) {
    const { offsetWidth, offsetHeight } = element;

    // Any DOMElement
    if (offsetWidth && offsetHeight) {
      return { width: offsetWidth, height: offsetHeight };
    }

    // Svg support
    const style = getComputedStyle(element);
    const width = parseFloat(style.width);
    const height = parseFloat(style.height);

    if (height && width) {
      return { width, height };
    }
  }

  return { width: 0, height: 0 };
};

const calculateVelocity = (startPoint: Point, endPoint: Point): Point => ({
  x: endPoint.x - startPoint.x,
  y: endPoint.y - startPoint.y,
});

const comparePoints = (p1: Point, p2: Point) => p1.x === p2.x && p1.y === p2.y;

const noup = () => {};

const zeroPoint = { x: 0, y: 0 };

class PinchZoom extends React.Component<Props> {
  static defaultProps: DefaultProps = {
    animationDuration: 250,
    draggableUnZoomed: true,
    enabled: true,
    inertia: true,
    inertiaFriction: 0.96,
    horizontalPadding: 0,
    isTouch,
    lockDragAxis: false,
    maxZoom: 5,
    minZoom: 0.5,
    onDoubleTap: noup,
    onDragEnd: noup,
    onDragStart: noup,
    onDragUpdate: noup,
    onZoomEnd: noup,
    onZoomStart: noup,
    onZoomUpdate: noup,
    setOffsetsOnce: false,
    shouldInterceptWheel,
    shouldCancelHandledTouchEndEvents: false,
    tapZoomFactor: 1,
    verticalPadding: 0,
    wheelScaleFactor: 1500,
    zoomOutFactor: 1.3,
    doubleTapZoomOutOnMaxScale: false,
    containerProps: {},
    _document: isSsr ? null : window.document,

    contentWidth: 0,
    contentHeight: 0,
    focusArea: [0, 0, 0, 0],
    initialZoomMode: 'fill',
  };

  private _velocity: Point | null;
  private _prevDragMovePoint: Point | null = null;
  private _containerObserver: any | null = null;
  private _fingers: number = 0;
  private _firstMove: boolean = true;
  private _hasInteraction: boolean;
  private _inAnimation: boolean;
  private _initialOffset: Point = { ...zeroPoint };
  private _interaction: Interaction | null = null;
  private _isDoubleTap: boolean = false;
  private _isOffsetsSet: boolean = false;
  private _lastDragPosition: Point | null = null;
  private _lastScale: number = 1;
  private _lastTouchStart: number = 0;
  private _lastZoomCenter: Point | null = null;
  private _listenMouseMove: boolean = false;
  private _nthZoom: number = 0;
  private _offset: Point = { ...zeroPoint };
  private _startOffset: Point = { ...zeroPoint };
  private _startTouches: Array<Point> | null = null;
  private _updatePlaned: boolean = false;
  private _wheelTimeOut: NodeJS.Timeout | null = null;
  private _zoomFactor: number = 1;
  private _initialZoomFactor: number = 1;
  private _draggingPoint: Point = { ...zeroPoint };
  // It help reduce behavior difference between touch and mouse events
  private _ignoreNextClick: boolean = false;
  private _containerRef: {
    readonly current: HTMLDivElement;
  } = React.createRef<HTMLDivElement>();

  private _handleClick = (clickEvent: Event) => {
    if (this._ignoreNextClick) {
      this._ignoreNextClick = false;

      clickEvent.stopPropagation();
    }
  };

  private _handleDragStart(event: TouchEvent) {
    this._ignoreNextClick = true;

    this.props.onDragStart();

    this._stopAnimation();
    this._resetInertia();
    this._lastDragPosition = null;
    this._hasInteraction = true;
    this._draggingPoint = this._offset;
    this._handleDrag(event);
  }

  private _handleDrag(event: TouchEvent) {
    const touch: Point = this._getOffsetByFirstTouch(event);
    if (this._enoughToDrag()) {
      this._drag(touch, this._lastDragPosition);
    } else {
      this._virtualDrag(touch, this._lastDragPosition);
    }
    this._offset = this._sanitizeOffset(this._offset);
    this._lastDragPosition = touch;
  }

  private _resetInertia() {
    this._velocity = null;
    this._prevDragMovePoint = null;
  }

  private _realizeInertia() {
    const { inertiaFriction, inertia } = this.props;

    if (!inertia || !this._velocity) {
      return;
    }

    let { x, y } = this._velocity;

    if (x || y) {
      this._stopAnimation();
      this._resetInertia();

      const renderFrame = (_a: number, delta: DOMHighResTimeStamp) => {
        // ??????????????????????????????????????????????????????
        const actualFriction =
          1 - (1 - inertiaFriction) * ((delta / 1000) * 144);
        x *= actualFriction;
        y *= actualFriction;

        if (!x && !y) {
          return this._stopAnimation();
        }

        const prevOffset = { ...this._offset };

        this._addOffset({ x, y });
        this._offset = this._sanitizeOffset(this._offset);

        if (comparePoints(prevOffset, this._offset)) {
          return this._stopAnimation();
        }

        this._update({ isAnimation: true });
      };

      this._animate(renderFrame, {
        duration: 9999,
        timeFn(x) {
          return x;
        },
      });
    }
  }

  private _collectInertia({ touches }: TouchEvent) {
    if (!this.props.inertia) {
      return;
    }

    const currentCoordinates = getPageCoordinatesByTouches(touches)[0];
    const prevPoint = this._prevDragMovePoint;

    if (prevPoint) {
      this._velocity = calculateVelocity(currentCoordinates, prevPoint);
    }

    this._prevDragMovePoint = currentCoordinates;
  }

  private _handleDragEnd() {
    this.props.onDragEnd();
    this._end();
    this._realizeInertia();
  }

  private _handleZoomStart() {
    this.props.onZoomStart();
    this._stopAnimation();
    this._lastScale = 1;
    this._nthZoom = 0;
    this._lastZoomCenter = null;
    this._hasInteraction = true;
  }

  private _handleZoom(event: TouchEvent, newScale: number) {
    const touchCenter = getVectorAvg(this._getOffsetTouches(event));
    const scale = newScale / this._lastScale;

    this._lastScale = newScale;

    // The first touch events are thrown away since they are not precise
    this._nthZoom += 1;

    if (this._nthZoom > 3) {
      this._scale(scale, touchCenter);
      this._drag(touchCenter, this._lastZoomCenter);
    }

    this._lastZoomCenter = touchCenter;
  }

  private _handleZoomEnd() {
    this.props.onZoomEnd();
    this._end();
  }

  private _handleDoubleTap(event: TouchEvent) {
    if (this._hasInteraction || this.props.tapZoomFactor === 0) {
      return;
    }

    const needZoomOut =
      this.props.doubleTapZoomOutOnMaxScale &&
      this._zoomFactor === this.props.maxZoom;

    this.props.onDoubleTap();

    this._ignoreNextClick = true;

    const zoomFactor = this._zoomFactor + this.props.tapZoomFactor;
    const startZoomFactor = this._zoomFactor;
    const updateProgress = (progress: number) => {
      this._scaleTo(
        startZoomFactor + progress * (zoomFactor - startZoomFactor),
        center
      );
    };
    let center = this._getOffsetByFirstTouch(event);

    this._isDoubleTap = true;

    if (startZoomFactor > zoomFactor) {
      center = this._getCurrentZoomCenter();
    }

    needZoomOut ? this._zoomOutAnimation() : this._animate(updateProgress);
  }

  private _computeInitialOffset() {
    const rect = this._getContainerRect();
    const { width, height } = this._getChildSize();
    const x = (width * this._getInitialZoomFactor() - rect.width) / 2;
    const y = (height * this._getInitialZoomFactor() - rect.height) / 2;

    this._initialOffset = { x, y };
  }

  private _resetOffset() {
    this._offset = { ...this._initialOffset };
  }

  private _setupOffsets() {
    if (this.props.setOffsetsOnce && this._isOffsetsSet) {
      return;
    }

    this._isOffsetsSet = true;

    this._computeInitialOffset();
    this._resetOffset();
  }

  private _sanitizeOffset(offset: Point, zoomFactor = this._zoomFactor) {
    const rect = this._getContainerRect();
    const { width, height } = this._getChildSize();
    const elWidth =
      width * this._getInitialZoomFactor() * Math.max(1, zoomFactor);
    const elHeight =
      height * this._getInitialZoomFactor() * Math.max(1, zoomFactor);
    const maxX = elWidth - rect.width + this.props.horizontalPadding;
    const maxY = elHeight - rect.height + this.props.verticalPadding;
    const maxOffsetX = max(maxX, 0);
    const maxOffsetY = max(maxY, 0);
    const minOffsetX = min(maxX, 0) - this.props.horizontalPadding;
    const minOffsetY = min(maxY, 0) - this.props.verticalPadding;

    return {
      x: clamp(minOffsetX, maxOffsetX, offset.x),
      y: clamp(minOffsetY, maxOffsetY, offset.y),
    };
  }

  alignCenter(options: ScaleToOptions) {
    const { x, y, scale, animated, duration } = {
      duration: 250,
      animated: true,
      ...options,
    };

    const startZoomFactor = this._zoomFactor;
    const startOffset = { ...this._offset };
    const rect = this._getContainerRect();
    const containerCenter = { x: rect.width / 2, y: rect.height / 2 };

    this._zoomFactor = 1;
    this._offset = { x: -(containerCenter.x - x), y: -(containerCenter.y - y) };

    this._scaleTo(scale, containerCenter);
    this._stopAnimation();

    if (!animated) {
      return this._update();
    }

    const diffZoomFactor = this._zoomFactor - startZoomFactor;
    const diffOffset = {
      x: this._offset.x - startOffset.x,
      y: this._offset.y - startOffset.y,
    };

    this._zoomFactor = startZoomFactor;
    this._offset = { ...startOffset };

    const updateFrame = (progress: number) => {
      const x = startOffset.x + diffOffset.x * progress;
      const y = startOffset.y + diffOffset.y * progress;

      this._zoomFactor = startZoomFactor + diffZoomFactor * progress;
      this._offset = this._sanitizeOffset({ x, y });
      this._update();
    };

    this._animate(updateFrame, {
      callback: () => this._sanitize(),
      duration,
    });
  }

  scaleTo(options: ScaleToOptions) {
    const { x, y, scale, animated, duration } = {
      duration: 250,
      animated: true,
      ...options,
    };

    const startZoomFactor = this._zoomFactor;
    const startOffset = { ...this._offset };

    this._zoomFactor = 1;
    this._offset = { x: 0, y: 0 };

    this._scaleTo(scale, { x, y });
    this._stopAnimation();

    if (!animated) {
      return this._update();
    }

    const diffZoomFactor = this._zoomFactor - startZoomFactor;
    const diffOffset = {
      x: this._offset.x - startOffset.x,
      y: this._offset.y - startOffset.y,
    };

    this._zoomFactor = startZoomFactor;
    this._offset = { ...startOffset };

    const updateFrame = (progress: number) => {
      const x = startOffset.x + diffOffset.x * progress;
      const y = startOffset.y + diffOffset.y * progress;

      this._zoomFactor = startZoomFactor + diffZoomFactor * progress;
      this._offset = { x, y };

      this._update();
    };

    this._animate(updateFrame, { callback: () => this._sanitize(), duration });
  }

  private _scaleTo(zoomFactor: number, center: Point) {
    this._scale(zoomFactor / this._zoomFactor, center);
  }

  private _scale(scale: number, center: Point) {
    scale = this._scaleZoomFactor(scale);

    this._addOffset({
      x: (scale - 1) * (center.x + this._offset.x),
      y: (scale - 1) * (center.y + this._offset.y),
    });

    this.props.onZoomUpdate();
  }

  private _scaleZoomFactor(scale: number) {
    const originalZoomFactor = this._zoomFactor;
    this._zoomFactor *= scale;
    this._zoomFactor = clamp(
      this.props.minZoom,
      this.props.maxZoom,
      this._zoomFactor
    );
    return this._zoomFactor / originalZoomFactor;
  }

  private _canDrag() {
    return this.props.draggableUnZoomed || !isCloseTo(this._zoomFactor, 1);
  }

  private _drag(center: Point, lastCenter: Point | null) {
    if (lastCenter) {
      const y = -(center.y - lastCenter.y);
      const x = -(center.x - lastCenter.x);

      if (!this.props.lockDragAxis) {
        this._addOffset({
          x,
          y,
        });
      } else {
        // lock scroll to position that was changed the most
        if (abs(x) > abs(y)) {
          this._addOffset({
            x,
            y: 0,
          });
        } else {
          this._addOffset({
            y,
            x: 0,
          });
        }
      }

      this.props.onDragUpdate();
    }
  }

  private _virtualDrag(center: Point, lastCenter: Point | null) {
    if (lastCenter) {
      const y = -(center.y - lastCenter.y);
      const x = -(center.x - lastCenter.x);

      this._draggingPoint = {
        x: x + this._draggingPoint.x,
        y: y + this._draggingPoint.y,
      };
    }
  }

  private _addOffset(offset: Point) {
    const { x, y } = this._offset;

    this._offset = {
      x: x + offset.x,
      y: y + offset.y,
    };
  }

  private _sanitize() {
    if (this._isInsaneOffset()) {
      this._sanitizeOffsetAnimation();
    }
  }

  private _isInsaneOffset() {
    const offset = this._offset;
    const sanitizedOffset = this._sanitizeOffset(offset);

    return (
      this._zoomFactor < 1 ||
      sanitizedOffset.x !== offset.x ||
      sanitizedOffset.y !== offset.y
    );
  }

  private _sanitizeOffsetAnimation() {
    const startZoomFactor = this._zoomFactor;
    const zoomFactor = Math.max(this._zoomFactor, 1);

    const size = this._getChildSize();
    const targetOffset = this._sanitizeOffset(this._offset, zoomFactor);
    const targetCenter = this._getCurrentZoomCenter(targetOffset, zoomFactor);
    const startCenter = this._getCurrentZoomCenter();

    const updateProgress = (progress: number) => {
      const scaleFactor =
        startZoomFactor + progress * (zoomFactor - startZoomFactor);

      const centerX =
        startCenter.x + progress * (targetCenter.x - startCenter.x);
      const centerY =
        startCenter.y + progress * (targetCenter.y - startCenter.y);

      this._scaleZoomFactor(scaleFactor / this._zoomFactor);
      this._offset = {
        x:
          centerX -
          (size.width * this._getInitialZoomFactor() * scaleFactor) / 2,
        y:
          centerY -
          (size.height * this._getInitialZoomFactor() * scaleFactor) / 2,
      };
      this._update({ isAnimation: true });
    };

    this._animate(updateProgress);
  }

  /**
   * ??????????????????????????????????????? _sanitizeOffsetAnimation ????????????????????????????????????
   * ?????????
   */
  private _zoomOutAnimation() {
    if (this._zoomFactor === 1) {
      return;
    }

    const size = this._getChildSize();
    const startZoomFactor = this._zoomFactor;
    const zoomFactor = 1;
    const startCenter = this._getCurrentZoomCenter();
    const targetOffset = this._sanitizeOffset(this._offset, zoomFactor);
    const targetCenter = this._getCurrentZoomCenter(targetOffset, zoomFactor);

    const updateProgress = (progress: number) => {
      const scaleFactor =
        startZoomFactor + progress * (zoomFactor - startZoomFactor);

      const centerX =
        startCenter.x + progress * (targetCenter.x - startCenter.x);
      const centerY =
        startCenter.y + progress * (targetCenter.y - startCenter.y);

      this._scaleZoomFactor(scaleFactor / this._zoomFactor);
      this._offset = {
        x:
          centerX -
          (size.width * this._getInitialZoomFactor() * scaleFactor) / 2,
        y:
          centerY -
          (size.height * this._getInitialZoomFactor() * scaleFactor) / 2,
      };
      this._update({ isAnimation: true });
    };

    this._animate(updateProgress);
  }

  private _getInitialZoomFactor() {
    return this._initialZoomFactor;
  }

  private _getCurrentZoomCenter(
    { x, y }: Point = this._offset,
    zoomFactor = this._zoomFactor
  ) {
    const size = this._getChildSize();

    return {
      x: x + (size.width * this._getInitialZoomFactor() * zoomFactor) / 2,
      y: y + (size.height * this._getInitialZoomFactor() * zoomFactor) / 2,
    };
  }

  private _getOffsetByFirstTouch(event: TouchEvent): Point {
    return this._getOffsetTouches(event)[0];
  }

  private _getOffsetTouches(event: TouchEvent): Array<Point> {
    const { _document } = this.props;
    const _html = _document.documentElement;
    const _body = _document.body;
    const { top, left } = this._getContainerRect();
    const scrollTop = _html.scrollTop || _body.scrollTop;
    const scrollLeft = _html.scrollLeft || _body.scrollLeft;
    const posTop = top + scrollTop;
    const posLeft = left + scrollLeft;

    return getPageCoordinatesByTouches(event.touches).map(({ x, y }) => ({
      x: x - posLeft,
      y: y - posTop,
    }));
  }

  private _animate(
    frameFn: (a: number, delta: DOMHighResTimeStamp) => void,
    options?: AnimateOptions
  ) {
    const startTime = performance.now();
    const { timeFn, callback, duration } = {
      timeFn: swing,
      callback: () => {},
      duration: this.props.animationDuration,
      ...options,
    };
    let lastTime = startTime;
    const renderFrame = (time: DOMHighResTimeStamp) => {
      if (!this._inAnimation) {
        return;
      }

      const frameTime = time - startTime;
      const delta = time - lastTime;
      let progress = frameTime / duration;

      if (frameTime >= duration) {
        frameFn(1, delta);
        this._stopAnimation();
        callback();
        this._update();
      } else {
        progress = timeFn(progress);
        frameFn(progress, delta);
        this._update({ isAnimation: true });
        requestAnimationFrame(renderFrame);
      }

      lastTime = time;
    };
    this._inAnimation = true;

    requestAnimationFrame(renderFrame);
  }

  private _stopAnimation() {
    this._inAnimation = false;
  }

  private _end() {
    this._hasInteraction = false;
    this._sanitize();
    this._update();
  }

  private _getContainerRect(): ClientRect {
    const { current: div } = this._containerRef;

    const rect = div.getBoundingClientRect();
    // getBoundingClientRect?????????transform????????????scrollWidth???scrollHeight??????
    // https://stackoverflow.com/questions/23392926/ignore-transitions-when-measuring-an-elements-dimensions
    rect.width = div.parentElement.scrollWidth;
    rect.height = div.parentElement.scrollHeight;
    return rect;
  }

  private _getChildSize(): { width: number; height: number } {
    if (this.props.contentWidth > 0 && this.props.contentHeight > 0) {
      return {
        width: this.props.contentWidth,
        height: this.props.contentHeight,
      };
    }

    const { current: div } = this._containerRef;

    return getElementSize(div?.firstElementChild as HTMLElement | null);
  }

  /**
   * ?????????????????????w0/h0?????????????????????x1/y1/w1/h1????????????????????????w2/h2?????????????????????????????????????????????????????????????????????
   * ??????????????????????????????xf/yf/wf/hf????????????????????????????????????????????????????????????
   */
  private _computeFocus({
    w0,
    h0,
    x1,
    y1,
    w1,
    h1,
    w2,
    h2,
  }: {
    w0: number;
    h0: number;
    x1: number;
    y1: number;
    w1: number;
    h1: number;
    w2: number;
    h2: number;
  }): {
    xf: number;
    yf: number;
    wf: number;
    hf: number;
  } {
    const wh1 = w1;
    const wv1 = (w2 * h1) / h2;
    const wh0 = w0;
    const wv0 = (w2 * h0) / h2;

    const wf = Math.min(Math.max(wh1, wv1), Math.min(wh0, wv0));
    const hf = (wf / w2) * h2;
    const xf = clamp(0, w0 - wf, x1 + (w1 - wf) / 2);
    const yf = clamp(0, h0 - hf, y1 + (h1 - hf) / 2);

    return { xf, yf, wf, hf };
  }

  private _updateInitialZoomFactor() {
    const rect = this._getContainerRect();
    const size = this._getChildSize();
    const xZoomFactor = rect.width / size.width;
    const yZoomFactor = rect.height / size.height;

    this._initialZoomFactor =
      this.props.initialZoomMode === 'fill'
        ? min(xZoomFactor, yZoomFactor)
        : max(xZoomFactor, yZoomFactor);
  }

  private _updateFocus() {
    const rect = this._getContainerRect();
    const size = this._getChildSize();

    const { xf, yf, wf } = this._computeFocus({
      w0: size.width,
      h0: size.height,
      x1: this.props.focusArea[0],
      y1: this.props.focusArea[1],
      w1: this.props.focusArea[2] - this.props.focusArea[0],
      h1: this.props.focusArea[3] - this.props.focusArea[1],
      w2: rect.width,
      h2: rect.height,
    });

    const xZoomFactor = rect.width / size.width;
    const yZoomFactor = rect.height / size.height;
    this._initialZoomFactor =
      this.props.initialZoomMode === 'fill'
        ? min(xZoomFactor, yZoomFactor)
        : max(xZoomFactor, yZoomFactor);
    this._zoomFactor = rect.width / wf / this._initialZoomFactor;
    const x = (size.width * this._getInitialZoomFactor() - rect.width) / 2;
    const y = (size.height * this._getInitialZoomFactor() - rect.height) / 2;
    this._initialOffset = {
      x,
      y,
    };
    this._offset = {
      x: xf * this._zoomFactor * this._initialZoomFactor,
      y: yf * this._zoomFactor * this._initialZoomFactor,
    };

    this._isOffsetsSet = true;
  }

  private _onResize = () => {
    if (this._containerRef?.current) {
      this._updateFocus();
      // this._updateInitialZoomFactor();
      // this._setupOffsets();
      this._update();
    }
  };

  private _bindEvents() {
    const { current: div } = this._containerRef;

    if (window.ResizeObserver) {
      this._containerObserver = new ResizeObserver(this._onResize);
      this._containerObserver.observe(div);
    } else {
      window.addEventListener('resize', this._onResize);
    }

    this._handlers.forEach(([eventName, fn, target]) => {
      (target || div).addEventListener(eventName, fn, true);
    });

    // Array.from(div.querySelectorAll('img')).forEach((img) =>
    //   img.addEventListener('load', this._onResize)
    // );

    this._onResize();
  }

  private _unSubscribe() {
    const { current: div } = this._containerRef;

    if (this._containerObserver) {
      this._containerObserver.disconnect();
      this._containerObserver = null;
    }

    window.removeEventListener('resize', this._onResize);

    this._handlers.forEach(([eventName, fn, target]) => {
      (target || div).removeEventListener(eventName, fn, true);
    });

    // Array.from(div.querySelectorAll('img')).forEach((img) =>
    //   img.removeEventListener('load', this._onResize)
    // );
  }

  private _update(options?: { isAnimation: boolean }) {
    if (this._updatePlaned) {
      return;
    }

    const updateFrame = () => {
      const scale = this._getInitialZoomFactor() * this._zoomFactor;
      const x = -this._offset.x / scale;
      const y = -this._offset.y / scale;

      this.props.onUpdate({ scale, x, y });
    };

    if (options?.isAnimation) {
      return updateFrame();
    }

    this._updatePlaned = true;

    requestAnimationFrame(() => {
      this._updatePlaned = false;

      updateFrame();
    });
  }

  private _handlerIfEnable(fn: (...a: any) => void) {
    return (...args: Array<any>) => {
      if (this.props.enabled) {
        fn(...args);
      }
    };
  }

  private _setInteraction(
    newInteraction: Interaction | null,
    event: TouchEvent
  ) {
    const interaction = this._interaction;

    if (interaction !== newInteraction) {
      if (interaction) {
        if (isZoomInteraction(interaction)) {
          this._handleZoomEnd();
        } else if (isDragInteraction(interaction)) {
          this._handleDragEnd();
        }
      }

      if (!interaction) {
        if (isZoomInteraction(newInteraction)) {
          this._handleZoomStart();
        } else if (isDragInteraction(newInteraction)) {
          this._handleDragStart(event);
        }
      }
    }

    this._interaction = newInteraction;
  }

  private _distanceBetweenNumbers(a: number, b: number) {
    return a > b ? a - b : b - a;
  }

  private _enoughToDrag() {
    if (
      this._distanceBetweenNumbers(this._startOffset.x, this._draggingPoint.x) >
        5 ||
      this._distanceBetweenNumbers(this._startOffset.y, this._draggingPoint.y) >
        5
    )
      return true;
    return false;
  }

  private _updateInteraction(event: TouchEvent) {
    const fingers = this._fingers;

    if (fingers === 2) {
      return this._setInteraction('zoom', event);
    }

    if (fingers === 1 && this._canDrag()) {
      return this._setInteraction('drag', event);
    }

    this._setInteraction(null, event);
  }

  private _detectDoubleTap(event: TouchEvent) {
    const time = new Date().getTime();

    if (this._fingers > 1) {
      this._lastTouchStart = 0;
    }

    if (time - this._lastTouchStart < 300) {
      cancelEvent(event);

      this._handleDoubleTap(event);

      if (isZoomInteraction(this._interaction)) {
        this._handleZoomEnd();
      } else if (isDragInteraction(this._interaction)) {
        this._handleDragEnd();
      }
    } else {
      this._isDoubleTap = false;
    }

    if (this._fingers === 1) {
      this._lastTouchStart = time;
    }
  }

  private _handlerOnTouchEnd = this._handlerIfEnable(
    (touchEndEvent: TouchEvent) => {
      this._fingers = 0;

      if (
        this.props.shouldCancelHandledTouchEndEvents &&
        (isZoomInteraction(this._interaction) ||
          (isDragInteraction(this._interaction) &&
            (this._startOffset.x !== this._offset.x ||
              this._startOffset.y !== this._offset.y)))
      ) {
        cancelEvent(touchEndEvent);
      }

      if (isDragInteraction(this._interaction) && !this._enoughToDrag()) {
        this._handleClick(touchEndEvent);
      }

      this._updateInteraction(touchEndEvent);
    }
  );

  private _handlerOnTouchStart = this._handlerIfEnable(
    (touchStartEvent: TouchEvent) => {
      this._firstMove = true;
      this._fingers = touchStartEvent.touches.length;
      this._detectDoubleTap(touchStartEvent);
    }
  );

  private _handlerOnTouchMove = this._handlerIfEnable(
    (touchMoveEvent: TouchEvent) => {
      if (this._isDoubleTap) {
        return;
      }

      this._collectInertia(touchMoveEvent);

      if (this._firstMove) {
        this._updateInteraction(touchMoveEvent);

        if (this._interaction) {
          cancelEvent(touchMoveEvent);
        }

        this._startOffset = { ...this._offset };
        this._startTouches = getPageCoordinatesByTouches(
          touchMoveEvent.touches
        );
      } else {
        if (isZoomInteraction(this._interaction)) {
          if (
            this._startTouches &&
            this._startTouches.length === 2 &&
            touchMoveEvent.touches.length === 2
          ) {
            this._handleZoom(
              touchMoveEvent,
              calculateScale(
                this._startTouches,
                getPageCoordinatesByTouches(touchMoveEvent.touches)
              )
            );
          }
        } else if (isDragInteraction(this._interaction)) {
          this._handleDrag(touchMoveEvent);
        }
        if (this._interaction) {
          cancelEvent(touchMoveEvent);
          this._update();
        }
      }

      this._firstMove = false;
    }
  );

  simulate(fn: (e: TouchEvent) => void): (a: MouseEvent) => void {
    return (mouseEvent) => {
      const { pageX, pageY, type } = mouseEvent;
      const isEnd = type === 'mouseup';
      const isStart = type === 'mousedown';
      if (isStart) {
        mouseEvent.preventDefault();

        this._listenMouseMove = true;
      }

      if (this._listenMouseMove) {
        // @ts-expect-error Taken from upstream
        mouseEvent.touches = isEnd ? [] : [{ pageX, pageY }];

        fn(
          // @ts-expect-error Taken from upstream
          mouseEvent
        );
      }

      if (isEnd) {
        this._listenMouseMove = false;
      }
    };
  }

  private _handlerWheel = (wheelEvent: WheelEvent) => {
    if (this.props.shouldInterceptWheel(wheelEvent)) {
      return;
    }

    cancelEvent(wheelEvent);

    const { pageX, pageY, deltaY, deltaMode } = wheelEvent;

    let scaleDelta = 1;

    if (isZoomGesture(wheelEvent) || deltaMode === 1) {
      scaleDelta = 15;
    }

    const likeTouchEvent: TouchEvent = {
      touches: [
        // @ts-expect-error Taken from upstream
        { pageX, pageY },
      ],
    };
    const center = this._getOffsetByFirstTouch(likeTouchEvent);
    const dScale = deltaY * scaleDelta;

    this._stopAnimation();
    this._scaleTo(
      this._zoomFactor - dScale / this.props.wheelScaleFactor,
      center
    );
    this._update();

    clearTimeout(this._wheelTimeOut);
    this._wheelTimeOut = setTimeout(() => this._sanitize(), 100);
  };

  // @ts-expect-error Taken from upstream
  private _handlers: Array<[string, () => void, Document | undefined]> =
    this.props.isTouch()
      ? [
          ['touchstart', this._handlerOnTouchStart],
          ['touchend', this._handlerOnTouchEnd],
          ['touchmove', this._handlerOnTouchMove],
        ]
      : [
          [
            'mousemove',
            this.simulate(this._handlerOnTouchMove),
            this.props._document,
          ],
          [
            'mouseup',
            this.simulate(this._handlerOnTouchEnd),
            this.props._document,
          ],
          ['mousedown', this.simulate(this._handlerOnTouchStart)],
          ['click', this._handleClick],
          ['wheel', this._handlerWheel],
        ];

  componentDidMount() {
    this._bindEvents();
    this._update();
  }

  componentWillUnmount() {
    this._stopAnimation();
    this._unSubscribe();
  }

  render() {
    const { children, containerProps } = this.props;
    const child = React.Children.only(children);
    const props = containerProps || {};

    return (
      <>
        <style>{styles}</style>
        <div
          {...props}
          ref={this._containerRef}
          className={classnames(styleRoot, props.className)}
        >
          {React.cloneElement(child, {
            className: classnames(styleChild, child.props.className),
          })}
        </div>
      </>
    );
  }
}

export default PinchZoom;
