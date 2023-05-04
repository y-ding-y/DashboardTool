const config = {
  403: {
    img: require('@/assets/img/exception.403.svg'),
    title: '403',
    desc: '抱歉，你無權訪問該頁面。',
    desc_cn: '抱歉，你无权访问该页面。',
    desc_us: "Sorry, you don't have access to this page.",
  },
  404: {
    img: require('@/assets/img/exception.404.svg'),
    title: '404',
    desc: '抱歉，你訪問的頁面不存在或仍在開發中。',
    desc_cn: '抱歉，你访问的页面不存在或仍在开发中。',
    desc_us:
      'Sorry, the page you visited does not exist or is still under development.',
  },
  500: {
    img: require('@/assets/img/exception.500.svg'),
    title: '500',
    desc: '抱歉，伺服器出錯了。',
    desc_cn: '抱歉，服务器出错了。',
    desc_us: 'Sorry, there is something wrong with the server.',
  },
}

export default config
