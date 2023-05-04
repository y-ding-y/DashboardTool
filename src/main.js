import * as Vue from 'vue'
import App from './App1.vue'
import { initRouter } from './router'

import './theme/index.less'
import Antd, { Modal } from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue';

import store from './store'
import 'animate.css/source/animate.css'
import VueI18nPlugin from '@/plugins/i18n-extend.js'
import AuthorityPlugin from '@/plugins/authority-plugin'
import { message } from 'ant-design-vue';
import { initI18n } from '@/utils/i18n'
//import fullscreen from 'vue-fullscreen' 
import bootstrap from '@/bootstrap'

import 'vue-photo-preview/dist/skin.css'

import localforage from 'localforage'
import infiniteScroll from 'vue-infinite-scroll'
import 'video.js/dist/video-js.css'

import funaxios from "@/plugins/funaxios";
import * as echarts from 'echarts'
import * as ecSimpleTransform from 'echarts-simple-transform';
// import VueSocketIO from 'vue-socket.io'
// import SocketIO from 'socket.io-client'
import './utils/element'
import './assets/iconfont'

require('es6-promise').polyfill()

const i18n = initI18n('cn', 'tw', 'us')

const app = Vue.createApp(App);
app.config.globalProperties.routerAppend = (path, pathToAppend) => {
    return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
app.config.globalProperties.$message = message
const router = initRouter(store.state.setting.asyncRoutes)
bootstrap({
    router,
    store,
    i18n,
    message: app.config.globalProperties.$message,
})

echarts.registerTransform(ecSimpleTransform.aggregate);
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$localForage = localforage
app.config.globalProperties.$Modal = Modal
app
    .use(store)
    .use(router)
    .use(i18n)
    .use(funaxios)
    .use(Antd)
    .use(AuthorityPlugin)
    // .use(VideoPlayer)
    .use(infiniteScroll)
    .use(scroll)
    .use(VueI18nPlugin)

router.isReady().then(() => app.mount('#app'))

const icons = Icons;
for (const i in icons) {
    app.component(i, icons[i])
}



// console.log(typeof(VueDND))
// window.$vueApp.use(awednd)
// window.$vueApp.use(Antd) 
// window.$vueApp.use(Plugins)
// window.$vueApp.use(fullscreen) 
// window.$vueApp.use(VideoPlayer)
// window.$vueApp.use(infiniteScroll)
// window.$vueApp.use(scroll) 
//     window.$vueApp = Vue.createApp(App)
//window.$vueApp.mount('#app')
