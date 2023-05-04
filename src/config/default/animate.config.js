const direct_s = ['left', 'right']
const direct_1 = ['left', 'right', 'down', 'up']
const direct_1_b = ['downBig', 'upBig', 'leftBig', 'rightBig']
const direct_2 = ['topLeft', 'bottomRight', 'topRight', 'bottomLeft']
const direct_3 = ['downLeft', 'upRight', 'downRight', 'upLeft']

// animate.css 配置
const ANIMATE = {
  preset: [
    //预设动画配置
    {
      name: 'back',
      alias: '漸進',
      alias_cn: '渐近',
      alias_us: 'back',
      directions: direct_1,
    },
    {
      name: 'bounce',
      alias: '彈跳',
      alias_cn: '弹跳',
      alias_us: 'bounce',
      directions: direct_1.concat('default'),
    },
    {
      name: 'fade',
      alias: '淡化',
      alias_cn: '淡化',
      alias_us: 'fade',
      directions: direct_1
        .concat(direct_1_b)
        .concat(direct_2)
        .concat('default'),
    },
    {
      name: 'flip',
      alias: '翻轉',
      alias_cn: '翻转',
      alias_us: 'flip',
      directions: ['x', 'y'],
    },
    {
      name: 'lightSpeed',
      alias: '光速',
      alias_cn: '光速',
      alias_us: 'light speed',
      directions: direct_s,
    },
    {
      name: 'rotate',
      alias: '旋轉',
      alias_cn: '旋转',
      alias_us: 'rotate',
      directions: direct_3.concat('default'),
    },
    {
      name: 'roll',
      alias: '翻滾',
      alias_cn: '翻滚',
      alias_us: 'roll',
      directions: ['default'],
    },
    {
      name: 'zoom',
      alias: '縮放',
      alias_cn: '缩放',
      alias_us: 'zoom',
      directions: direct_1.concat('default'),
    },
    {
      name: 'slide',
      alias: '滑動',
      alias_cn: '滑动',
      alias_us: 'slide',
      directions: direct_1,
    },
  ],
}
module.exports = ANIMATE
