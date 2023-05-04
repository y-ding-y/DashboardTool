import { hasAuthority } from '@/utils/authority-utils'
import { loginIgnore } from '@/router/index'
import { checkAuthorization } from '@/utils/request'
import NProgress from 'nprogress'
import { loadRoutes } from '@/utils/routerUtil'
import axios from 'axios'

NProgress.configure({
    showSpinner: false,
})
var itime = null
/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart = (to, from, next) => {
    clearInterval(itime)
    itime = null
    if (!NProgress.isStarted()) {
        NProgress.start()
    }
    next()
}

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const loginGuard = (to, from, next, options) => {
    const {
        message,
        store,
        i18n: { messages },
    } = options
    const locale = store.getters['setting/lang']
    const { loginWarning } = "tw"
    let routeFlag = false;
    if (!loginIgnore.includes(to) && !checkAuthorization()) {
        message.warning(loginWarning)
        next({
            path: '/login',
        })
    } else {

        next()

    }
}

/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const authorityGuard = (to, from, next, options) => {
    const {
        message,
        store,
        i18n: { messages },
    } = options
    const locale = store.getters['setting/lang']
    const { authorityWarning } = "tw"
    const permissions = store.getters['account/permissions']
    const roles = store.getters['account/roles']
    if (!hasAuthority(to, permissions, roles)) {
        /**
         * message.warning(`对不起，您无权访问页面: ${to.fullPath}，请联系管理员`)
         */
        message.warning(authorityWarning.replace('{path}', to.fullPath))
        next({
            path: '/403',
        })
        /**
         * NProgress.done()
         */
    } else {
        next()
    }
}

/**
 * 混合导航模式下一级菜单跳转重定向
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const redirectGuard = (to, from, next, options) => {
    const { store } = options
    const getFirstChild = (routes) => {
        const route = routes[0]
        if (!route.children || route.children.length === 0) {
            return route
        }
        return getFirstChild(route.children)
    }
    if (store.state.setting.layout === 'mix') {
        const firstMenu = store.getters['setting/firstMenu']
        if (firstMenu.find((item) => item.fullPath === to.fullPath)) {
            store.commit('setting/setActivatedFirst', to.fullPath)
            const subMenu = store.getters['setting/subMenu']
            if (subMenu.length > 0) {
                const redirect = getFirstChild(subMenu)
                return next({
                    path: redirect.fullPath,
                })
            }
        }
    }
    next()
}

/**
 * 切換site
 * @param to
 * @param from
 * @param next
 * @param options
 * @returns {*}
 */
const siteGuard = (to, from, next, options) => {

    const { store } = options
    const paths = to.fullPath.split('/')
    const site = paths.length > 1 ? paths[1] : ''
    const sites = store.getters['setting/sites'].map((e) => e.key)
    if (sites.includes(site)) {
        store.commit('setting/setSite', site)
    }
    next()
}

/**
 * 进度条结束
 * @param to
 * @param form
 * @param options
 */
const progressDone = (to, from, options) => {
    // itime = setInterval(() => {
    //     if (to.meta.id != -1) {
    //         // clearInterval(itime)
    //         // itime = null
    //         // console.log("As")
    //         axios.post(process.env.VUE_APP_API_BASE_URL + '/route/visit', { prop: 'visit|insert', route: to.meta.id })
    //             .then(res => {
    //                 clearInterval(itime)
    //                 itime = null
    //             })
    //     }

    //     else {
    //         clearInterval(itime)
    //         itime = null
    //     }
    // }, 10000);
    if (to.meta.id != -1) {
        axios.post(process.env.VUE_APP_API_BASE_URL + '/route/visit', { prop: 'visit|insert', route: to.meta.id })
            .then(res => {
                clearInterval(itime)
                itime = null
            })
    }
    NProgress.done()
}

export default {
    beforeEach: [
        progressStart,
        loginGuard,
        authorityGuard,
        redirectGuard,
        siteGuard,
    ],
    afterEach: [progressDone],
}
