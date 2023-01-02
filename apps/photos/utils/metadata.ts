import { Metadata } from 'components/timeline/types';

export function getMetadataBlocks(metadata: Metadata) {
  return [
    [
      metadata.device,
      metadata.lens,
      [
        metadata.iso ? `ISO${metadata.iso}` : '',
        metadata.f ? `${metadata.f}mm` : '',
        metadata.fStop ? `ƒ${metadata.fStop}` : '',
        metadata.shutter,
      ]
        .filter(Boolean)
        .join(' '),
    ]
      .filter(Boolean)
      .join('\n'),
    [metadata.subject, metadata.time].filter(Boolean).join('\n'),
    metadata.comment,
  ].filter((i): i is string => Boolean(i));
}
