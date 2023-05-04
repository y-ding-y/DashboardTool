// 自定义配置，参考 ./default/setting.config.js，需要自定义的属性在这里配置即可
module.exports = {
  lang: process.env.VUE_APP_LANG,
  theme: {
    color: '#d74b00',
    mode: 'dark',
  },
  multiPage: false,
  asyncRoutes: true, //異步加載路由, true:開啟, false:不開啟
  systemName: process.env.VUE_APP_NAME, //系统名称
  systemVersion: process.env.VUE_APP_VERSION, //系统版本
  copyright: '2021 GTK CPD', //copyright
  animate: {
    disabled: true,
    name: 'lightSpeed',
    direction: 'left',
  },
  footerLinks: [],
  langs: [
    {
      key: 'cn',
      name: '简体中文',
      short: 'sc',
      alias: '简体',
    },
    {
      key: 'tw',
      name: '繁體中文',
      short: 'tc',
      alias: '繁體',
    },
    {
      key: 'us',
      name: 'English',
      short: 'en',
      alias: 'En',
    },
  ],
}
