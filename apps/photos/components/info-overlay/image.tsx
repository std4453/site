import { css } from '@emotion/react';
import { useMemoizedFn } from 'ahooks';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import QuickPinchZoom, { make2dTransformValue } from './quick-pinch-zoom';

export function InteractiveImage({
  data,
  alt,
  mounted,
  background,
}: {
  data: StaticImageData;
  alt?: string;
  mounted: boolean;
  background: string;
}) {
  const [imageMounted, setImageMounted] = useState(false);

  useEffect(() => {
    if (mounted) {
      const timeout = setTimeout(() => {
        setImageMounted(true);
      }, 100);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [mounted]);

  const [loaded, setLoaded] = useState(false);

  const imgRef = useRef<HTMLDivElement>();

  const onUpdate = useMemoizedFn(({ x, y, scale }) => {
    if (!imgRef.current) {
      return;
    }

    const value = make2dTransformValue({ x, y, scale });
    imgRef.current.style.transform = value;
  });

  return mounted ? (
    <QuickPinchZoom
      onUpdate={onUpdate}
      containerProps={{
        style: {
          width: '100%',
          height: '100%',
        },
      }}
      initialZoomMode="cover"
      contentWidth={data.width}
      contentHeight={data.height}
      initialScale={1.2}
    >
      <div
        ref={imgRef}
        css={css`
          width: var(--image-width);
          height: var(--image-height);
          background: var(--image-background);
        `}
        style={
          {
            '--image-width': `${data.width}px`,
            '--image-height': `${data.height}px`,
            '--image-background': background,
          } as Record<string, string>
        }
      >
        {imageMounted && (
          <Image
            css={css`
              width: 100%;
              height: 100%;
              object-fit: cover;
              opacity: ${loaded ? 1 : 0};
              transition: opacity 175ms ease-out;
            `}
            src={data}
            alt={alt}
            sizes="150vw"
            loading="eager"
            onLoadingComplete={() => {
              setLoaded(true);
            }}
            quality={100}
          />
        )}
      </div>
    </QuickPinchZoom>
  ) : null;
}
