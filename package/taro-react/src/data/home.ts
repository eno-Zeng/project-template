import type { ArticleItem, BannerItem, NavItem } from '@/types/home';

const imageApi = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';

export const banners: BannerItem[] = [
  {
    id: 1,
    eyebrow: '本周精选 · 慢生活',
    title: '留一处角落，安放日常灵感',
    image: `${imageApi}?prompt=editorial%20lifestyle%20photography%2C%20sunlit%20modern%20reading%20corner%20with%20cream%20armchair%20and%20green%20plants%2C%20warm%20neutral%20palette%2C%20minimalist%20premium%20magazine%20aesthetic%2C%20no%20text&image_size=landscape_16_9`,
  },
  {
    id: 2,
    eyebrow: '效率专题 · 轻盈工作',
    title: '从有序空间，开始专注一天',
    image: `${imageApi}?prompt=modern%20creative%20workspace%20with%20laptop%20ceramic%20coffee%20cup%20and%20notebook%2C%20soft%20daylight%2C%20indigo%20and%20warm%20beige%20palette%2C%20premium%20editorial%20photography%2C%20no%20text&image_size=landscape_16_9`,
  },
  {
    id: 3,
    eyebrow: '周末企划 · 去远方',
    title: '沿着海岸线，收集新的风景',
    image: `${imageApi}?prompt=scenic%20coastal%20road%20at%20sunrise%20with%20soft%20blue%20sky%20and%20warm%20light%2C%20cinematic%20travel%20photography%2C%20tranquil%20premium%20editorial%20composition%2C%20no%20text&image_size=landscape_16_9`,
  },
];

export const navItems: NavItem[] = [
  { id: 1, title: '精选', symbol: '精', color: '#4f46e5', backgroundColor: '#eeeeff' },
  { id: 2, title: '活动', symbol: '活', color: '#b45309', backgroundColor: '#fff4df' },
  { id: 3, title: '攻略', symbol: '略', color: '#047857', backgroundColor: '#e7f7f0' },
  { id: 4, title: '榜单', symbol: '榜', color: '#be3455', backgroundColor: '#ffedf1' },
];

export const articles: ArticleItem[] = [
  { id: 1, category: '生活方式', title: '把日子过成喜欢的样子：从整理书桌开始', summary: '一个清爽的空间，能让注意力重新回到真正重要的事情上。', meta: '6 分钟 · 1.2k 阅读' },
  { id: 2, category: '城市漫游', title: '不设目的地的午后，发现街角的新鲜事', summary: '换一条熟悉的路线，也许会遇见不一样的风景与人。', meta: '4 分钟 · 986 阅读' },
  { id: 3, category: '效率指南', title: '轻盈高效的三个习惯，告别忙碌的低效循环', summary: '从任务分拣到专注时段，让每天的节奏更加清晰。', meta: '8 分钟 · 2.1k 阅读' },
  { id: 4, category: '灵感手记', title: '记录不是负担，而是与自己的想法重逢', summary: '用简单的每日三行，留住那些稍纵即逝的感受。', meta: '5 分钟 · 756 阅读' },
  { id: 5, category: '周末企划', title: '给自己安排一场不需要攻略的短途旅行', summary: '减少计划，保留期待，让周末回归真正的休息。', meta: '7 分钟 · 1.8k 阅读' },
  { id: 6, category: '阅读清单', title: '适合睡前阅读的五本温柔小书', summary: '在安静的夜晚，用短短几页文字卸下一天的疲惫。', meta: '5 分钟 · 1.1k 阅读' },
  { id: 7, category: '居家灵感', title: '一束光、一盆绿植，让小空间也有呼吸感', summary: '不依赖复杂改造，也能让家里多一分自然与松弛。', meta: '6 分钟 · 892 阅读' },
  { id: 8, category: '人物故事', title: '认真对待热爱的人，终会找到自己的节奏', summary: '三位普通创作者，分享他们长期坚持一件小事的方法。', meta: '9 分钟 · 2.4k 阅读' },
  { id: 9, category: '好物观察', title: '真正值得留下的物品，都经得起日常使用', summary: '从材质、功能与陪伴感出发，重新理解消费选择。', meta: '7 分钟 · 1.5k 阅读' },
  { id: 10, category: '每日思考', title: '不必时时向前，也可以停下来看看风景', summary: '休息并非浪费时间，而是重新获得能量的必要过程。', meta: '3 分钟 · 668 阅读' },
];
