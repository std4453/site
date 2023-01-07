import { TimelineItem } from 'components/timeline/types';
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
import image15 from 'public/images/20191004-IMG_1261.jpg';
import image16 from 'public/images/20191130-IMG_1427-4.jpg';
import image17 from 'public/images/20201004-IMG_2036.jpg';
import image18 from 'public/images/20210324-IMG_2077.jpg';
import image19 from 'public/images/20221130-IMG_2520.jpg';
import image20 from 'public/images/20221201-IMG_2528.jpg';
import image21 from 'public/images/20221201-IMG_2564.jpg';
import image22 from 'public/images/20221225-IMG_2660.jpg';
import image23 from 'public/images/20221225-IMG_2665.jpg';

export const EOS_800D = 'Canon EOS 800D';
export const EFS18_135 = 'EF-S18-135mm ƒ3.5-5.6 IS STM';
export const EF50_F1_8 = 'EF50mm ƒ1.8 STM';

export const timelineItems: TimelineItem[] = [
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 400,
      f: 69,
      fStop: 8,
      shutter: '1/320s',

      subject: '杭州 紫金港校区 蓝田二舍',
      time: '2017/01/03',

      comment: '太阳还未升起，天光已从建筑之间的缝隙渗出。',
    },
    data: image1,
    background: '#abb5bf',
    size: [4000, 6000],
    focusArea: [182, 868, 3816, 3268],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 200,
      f: 135,
      fStop: 5.6,
      shutter: '1/500s',

      subject: '杭州 紫金港校区 蓝田二舍',
      time: '2017/01/03',

      comment: '蓝天澄澈，工业感的楼梯，线条清晰的建筑，有光也有影。',
    },
    data: image2,
    background: '#5fa6da',
    size: [6000, 4000],
    focusArea: [1014, 302, 5075, 3460],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 1000,
      f: 50,
      fStop: 5,
      shutter: '1/160s',

      subject: '上海 南京东路 世贸广场',
      time: '2019/07/02 17:39',

      comment: '在 ISO1000 下，出色的色彩纯净度。',
    },
    data: image3,
    background: '#babbbb',
    size: [5857, 3905],
    focusArea: [659, 71, 3975, 3330],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 800,
      f: 56,
      fStop: 5,
      shutter: '1/200s',

      subject: '上海 南京东路 第一百货',
      time: '2019/07/02 17:40',

      comment: '耳目一新的旧楼改造，后期希望体现出一种赛博朋克的感觉。',
    },
    data: image4,
    background: '#2d2530',
    size: [3728, 5592],
    focusArea: [233, 663, 3542, 4701],
  },
  { type: 'divider', ratio: 6, portrait: false, style: 'cross' },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 640,
      f: 56,
      fStop: 5,
      shutter: '1/200s',

      subject: '上海 南京东路 上海时装商店',
      time: '2019/07/02 17:48',

      comment: '民国风格建筑，东方的新古典主义，和现代设施的结合。',
    },
    data: image5,
    background: '#8c857f',
    size: [5734, 3823],
    focusArea: [651, 595, 4554, 3635],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 1600,
      f: 132,
      fStop: 5.6,
      shutter: '1/4000s',

      time: '2017/07/20 3:13',

      comment: '虽然画质稀碎，但每人都该体会一次拍月亮的感受。',
    },
    data: image6,
    background: '#000000',
    size: [675, 675],
    focusArea: [73, 79, 601, 607],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 100,
      f: 59,
      fStop: 7.1,
      shutter: '1/160s',

      subject: '杭州 紫金港校区 月牙楼',
      time: '2019/08/02 18:15',

      comment: '蟹老板的眼睛，电波发射中。',
    },
    data: image7,
    background: '#1a86c9',
    size: [6000, 4000],
    focusArea: [736, 764, 5416, 3820],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 6400,
      f: 135,
      fStop: 5.6,
      shutter: '1/80s',

      subject: '杭州 杭州东站',
      time: '2019/10/02 16:55',
    },
    data: image8,
    background: '#696969',
    size: [5959, 3973],
    focusArea: [1435, 655, 4675, 3253],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 640,
      f: 50,
      fStop: 1.8,
      shutter: '1/500s',

      subject: '高铁沿线',
      time: '2019/10/02 17:34',

      comment: '意外地整齐的农田。',
    },
    data: image9,
    background: '#51552c',
    size: [3754, 3754],
    focusArea: [167, 212, 3076, 3121],
  },
  { type: 'divider', ratio: 6, landscape: false, style: 'dots' },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 100,
      f: 50,
      fStop: 1.8,
      shutter: '1/1250s',

      subject: '上海 黄兴公园',
      time: '2019/10/03 16:43',

      comment: '光圈拉满，小痰盂的画质确实好，清晰又细腻。',
    },
    data: image10,
    background: '#624e08',
    size: [5806, 3871],
    focusArea: [847, 619, 4726, 3571],
  },
  { type: 'divider', ratio: 6, portrait: false, style: 'dots' },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 6400,
      f: 135,
      fStop: 5.6,
      shutter: '1/250s',

      subject: '上海 黄兴公园',
      time: '2019/10/03 16:52',

      comment: '你好，罗小黑。',
    },
    data: image11,
    background: '#493828',
    size: [3911, 3911],
    focusArea: [575, 650, 3395, 3464],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 320,
      f: 116,
      fStop: 5.6,
      shutter: '1/500s',

      subject: '上海 黄兴公园',
      time: '2019/10/03 17:06',
    },
    data: image12,
    background: '#dddee0',
    size: [6000, 4000],
    focusArea: [1336, 332, 4680, 2956],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 6400,
      f: 135,
      fStop: 6.3,
      shutter: '1/640s',

      subject: '上海 黄兴公园',
      time: '2019/10/03 17:20',
    },
    data: image13,
    background: '#9b9a98',
    size: [2678, 2678],
    focusArea: [539, 425, 2254, 2144],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 400,
      f: 64,
      fStop: 5,
      shutter: '1/125s',

      subject: '杭州 紫金港校区 小剧场',
      time: '2019/10/04 22:57',

      comment: '纯白的灯珠在金属框架上的反射，可能会让游戏引擎犯难。',
    },
    data: image15,
    background: '#010101',
    size: [5744, 3829],
    focusArea: [1632, 639, 4080, 2981],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 2500,
      f: 35,
      fStop: 4.5,
      shutter: '1/50s',

      subject: '杭州 地铁二号线',
      time: '2019/11/30 13:25',

      comment: '一位颇具日系风格的同学（喜），出于隐私保护打了码。',
    },
    data: image16,
    background: '#7e8985',
    size: [4000, 6000],
    focusArea: [656, 639, 3223, 4113],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 6400,
      f: 135,
      fStop: 13,
      shutter: '1/1000s',

      subject: '杭州 钱塘江',
      time: '2020/10/04 14:37',

      comment: '秋游，潮人观潮。可惜只能远眺，不够震撼。',
    },
    data: image17,
    background: '#9e9da2',
    size: [5571, 3714],
    focusArea: [1099, 1134, 4360, 3098],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 100,
      f: 50,
      fStop: 3.5,
      shutter: '1/60s',

      subject: 'Max Factory 初音未来 初梦Ver.',
      time: '2021/03/22 16:04',

      comment: '那个葱色的女人彻底蓝了。// TODO: 有空重拍一套',
    },
    data: image18,
    background: '#0c0b0e',
    size: [6000, 4000],
    focusArea: [2144, 308, 5384, 3620],
  },
  { type: 'divider', ratio: 6, style: 'cross' },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EFS18_135,
      iso: 25600,
      f: 35,
      fStop: 4.5,
      shutter: '1/500s',

      subject: '杭州 良渚',
      time: '2022/11/30 17:14',

      comment: '大雪中的一抹暖色，噪点太多了点。',
    },
    data: image19,
    background: '#648296',
    size: [6000, 4000],
    focusArea: [1456, 812, 5496, 3860],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 100,
      f: 50,
      fStop: 7.1,
      shutter: '1/125s',

      subject: '杭州 良渚',
      time: '2022/12/1 10:50',
    },
    data: image20,
    background: '#b4b5bb',
    size: [4000, 6000],
    focusArea: [644, 315, 3889, 3855],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 1000,
      f: 50,
      fStop: 3.2,
      shutter: '1/640s',

      subject: '杭州 良渚',
      time: '2022/12/1 13:52',

      comment: '提高快门速度，雪粒仿佛静止了一般，这大约是摄影的魅力所在。',
    },
    data: image21,
    background: '#d3bfb4',
    size: [6000, 4000],
    focusArea: [1000, 948, 4416, 3676],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 100,
      f: 50,
      fStop: 16,
      shutter: '0″3',

      subject: 'Union Creative VOCALOID 初音未来 TRICK or MIKU 万圣节Ver.',
      time: '2022/12/25 17:55',

      comment: '最爱的手办当然要用漂亮的轮廓光点缀。',
    },
    data: image22,
    background: '#dfdfdf',
    size: [6000, 4000],
    focusArea: [1768, 340, 4440, 2700],
  },
  {
    type: 'image',
    metadata: {
      device: EOS_800D,
      lens: EF50_F1_8,
      iso: 100,
      f: 50,
      fStop: 16,
      shutter: '0″3',

      subject: 'GSC 初音未来 RACING MIKU 2013 Rd.4 应援Ver.',
      time: '2022/12/1 18:08',

      comment: '前期不清灰，后期火葬场。希望有一天能拍得比公式更好看。',
    },
    data: image23,
    background: '#dcdcdb',
    size: [4000, 6000],
    focusArea: [692, 411, 3429, 3423],
  },
];
