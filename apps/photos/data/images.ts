import { StaticImageData } from 'next/image';
import image1 from 'public/images/20170103-IMG_0050.jpg';
import image2 from 'public/images/20170103-IMG_0063.jpg';
import image3 from 'public/images/20190702-IMG_0472.jpg';
import image4 from 'public/images/20190702-IMG_0475.jpg';
import image5 from 'public/images/20190702-IMG_0495.jpg';
import image6 from 'public/images/20190720-IMG_0841.jpg';
import image7 from 'public/images/20190802-IMG_0889.jpg';
import image8 from 'public/images/20191002-IMG_1036.jpg';
import image9 from 'public/images/20191002-IMG_1105.jpg';
import image10 from 'public/images/20191003-IMG_1123.jpg';
import image11 from 'public/images/20191003-IMG_1133.jpg';
import image12 from 'public/images/20191003-IMG_1156.jpg';
import image13 from 'public/images/20191003-IMG_1187.jpg';
import image14 from 'public/images/20191004-IMG_1225.jpg';
import image15 from 'public/images/20191004-IMG_1261.jpg';
import image16 from 'public/images/20191130-IMG_1427.jpg';
import image17 from 'public/images/20201004-IMG_2036.jpg';
import image18 from 'public/images/20210324-IMG_2077.jpg';
import image19 from 'public/images/20221130-IMG_2520.jpg';
import image20 from 'public/images/20221201-IMG_2528.jpg';
import image21 from 'public/images/20221201-IMG_2564.jpg';
import image22 from 'public/images/20221225-IMG_2660.jpg';
import image23 from 'public/images/20221225-IMG_2665.jpg';

export interface Metadata {
  device?: string;
  lens?: string;
  iso?: number;
  f?: number;
  fStop?: number;
  shutter?: string;

  subject?: string;
  time?: string;

  comment?: string;
}

export interface ImageItem {
  type: 'image';
  metadata?: Metadata;
  data: StaticImageData;
}

export interface DividerItem {
  type: 'divider';
}

export type TimelineItem = {
  index: number;
} & (ImageItem | DividerItem);

export const EOS_800D = 'Canon EOS 800D';
export const EF50_F1_8 = 'EF50mm ƒ1.8 STM';

export const timelineItems: TimelineItem[] = (
  [
    { type: 'image', data: image1 },
    {
      type: 'image',
      metadata: {
        device: EOS_800D,
        lens: EF50_F1_8,
        iso: 100,
        f: 50,
        fStop: 16,
        shutter: '0″3',

        subject: '杭州 浙江大学 蓝田二舍',
        time: '2018/01/13 13:01',

        comment: '蓝天澄澈，工业感的楼梯，线条清晰的建筑，有光也有影',
      },
      data: image2,
    },
    { type: 'image', data: image3 },
    { type: 'image', data: image4 },
    { type: 'divider' },
    { type: 'image', data: image5 },
    { type: 'image', data: image6 },
    { type: 'image', data: image7 },
    { type: 'image', data: image8 },
    { type: 'image', data: image9 },
    { type: 'image', data: image10 },
    { type: 'image', data: image11 },
    { type: 'image', data: image12 },
    { type: 'image', data: image13 },
    { type: 'image', data: image14 },
    { type: 'image', data: image15 },
    { type: 'image', data: image16 },
    { type: 'image', data: image17 },
    { type: 'image', data: image18 },
    { type: 'image', data: image19 },
    { type: 'image', data: image20 },
    { type: 'image', data: image21 },
    { type: 'image', data: image22 },
    { type: 'image', data: image23 },
  ] as (ImageItem | DividerItem)[]
).map((item, index) => ({
  index,
  ...item,
}));
