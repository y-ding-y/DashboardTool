import routerMap from '@/router/async/router.map'
import { mergeI18nFromRoutes } from '@/utils/i18n'
import * as VueRouter from 'vue-router'
import deepMerge from 'deepmerge'
import basicOptions from '@/router/async/config.async'

import { createRouter, createWebHistory } from "vue-router";

//应用配置
let appOptions = {
    router: undefined,
    i18n: undefined,
    store: undefined,
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
    const { router, store, i18n } = options
    appOptions.router = router
    appOptions.store = store
    appOptions.i18n = i18n
}

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfig, routerMap) {
    let routes = []
    routesConfig.forEach((item) => {
        // 获取注册在 routerMap 中的 router，初始化 routeCfg
        let router = undefined,
            routeCfg = {}
        if (typeof item === 'string' && routerMap[item]) {
            router = routerMap[item]
            routeCfg = {
                path: router.path || item,
                router: item,
            }
        } else if (typeof item === 'object') {
            router = routerMap[item.router]
            routeCfg = item
        }
        // 从 router 和 routeCfg 解析路由
        if (!router) {
            console.warn(
                `can't find register for router ${routeCfg.router}, please register it in advance.`
            )
        } else {
            const route = {
                //name: routeCfg.name || router.name,
                name: routeCfg.routename || router.name,
                path: (routeCfg.path || router.path || routeCfg.router),
                name_cn: routeCfg.name_cn,
                name_us: routeCfg.name_us,
                name_tw: routeCfg.name,
                component: router.component,
                redirect: routeCfg.redirect || router.redirect,
                display: routeCfg.display,
                props: routeCfg.props || router.props,
                meta: {
                    authority: routeCfg.authority || router.authority || '*',
                    icon: routeCfg.icon || router.icon,
                    page: routeCfg.page || router.page,
                    display: routeCfg.display,
                    id: routeCfg.id || -1,
                },
            }

            if (routeCfg.invisible || router.invisible) {
                route.meta.invisible = true
            }

            if (routeCfg.children && routeCfg.children.length > 0) {
                route.children = parseRoutes(routeCfg.children, routerMap)
            }
            routes.push(route)
        }
    })
    return routes
}

/**
 * 加载路由
 * @param routesConfig {RouteConfig[]} 路由配置
 */
function loadRoutes(routesConfig) {
    //兼容 0.6.1 以下版本
    /*************** 兼容 version < v0.6.1 *****************/
    if (arguments.length > 0) {
        const arg0 = arguments[0]
        if (arg0.router || arg0.i18n || arg0.store) {
            routesConfig = arguments[1]
            console.error(
                'the usage of signature loadRoutes({router, store, i18n}, routesConfig) is out of date, please use the new signature: loadRoutes(routesConfig).'
            )
            console.error(
                '方法签名 loadRoutes({router, store, i18n}, routesConfig) 的用法已过时, 请使用新的方法签名 loadRoutes(routesConfig)。'
            )
        }
    }
    /*************** 兼容 version < v0.6.1 *****************/

    // 应用配置
    const { router, store, i18n } = appOptions

    // 如果 routesConfig 有值，则更新到本地，否则从本地获取
    if (routesConfig) {
        store.commit('account/setRoutesConfig', routesConfig)
    } else {
        routesConfig = store.getters['account/routesConfig']
    }
    // 如果开启了异步路由，则加载异步路由配置
    const asyncRoutes = store.state.setting.asyncRoutes
    if (asyncRoutes) {
        // router.removeRoute("404");
        // const temp = router.resolve('404') 
        if (routesConfig && routesConfig.length > 0) {
            const routes = parseRoutes(routesConfig, routerMap)
            
            const finalRoutes = mergeRoutes(basicOptions.routes, routes)
            formatRoutes(finalRoutes)
            router.options = {
                ...router.options,
                routes: finalRoutes,
            }

            // router.resolve = createRouter({
            //     ...router.options,
            //     // routes: []
            //     // routes:  finalRoutes,
            // }).href

            finalRoutes.forEach((route, i) => {
                router.addRoute(route);
                // if (i == 1) {
                //     route.children.length = 3
                //     console.log(route.children)
                // }
                // router.replace(router.currentRoute.value.fullPath)
            });

            router.addRoute({
                path: "/:pathMatch(.*)",
                name: "404",
                meta: { pAuthorities: [] },
                component: () => import('@/pages/exception/404'),
            });

            // router.addRoute(finalRoutes)
        }
    }
    // 提取路由国际化数据
    mergeI18nFromRoutes(i18n, router.options.routes)
    // 初始化Admin后台菜单数据
    const rootRoute = router.options.routes.find((item) => item.path === '/')
    const menuRoutes = rootRoute && rootRoute.children
    if (menuRoutes) {
        store.commit('setting/setMenuData', menuRoutes)
    }
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
    const routesMap = {}
    target.forEach((item) => {
        return routesMap[item.path] = item
    })
    source.forEach((item) => {
        return routesMap[item.path] = item
    })
    return Object.values(routesMap)
}

/**
 * 深度合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes(target, source) {
    // 映射路由数组
    const mapRoutes = (routes) => {
        const routesMap = {}
        routes.forEach((item) => {
            routesMap[item.path] = {
                ...item,
                children: item.children ? mapRoutes(item.children) : undefined,
            }
        })
        return routesMap
    }
    const tarMap = mapRoutes(target)
    const srcMap = mapRoutes(source)

    // 合并路由
    const merge = deepMerge(tarMap, srcMap)

    // 转换为 routes 数组
    const parseRoutesMap = (routesMap) => {
        return Object.values(routesMap).map((item) => {
            if (item.children) {
                item.children = parseRoutesMap(item.children)
            } else {
                delete item.children
            }
            return item
        })
    }
    return parseRoutesMap(merge)
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
    routes.forEach((route) => {
        const { path } = route
        if (!path.startsWith('/') && path !== '*') {
            route.path = '/' + path
        }
    })
    formatAuthority(routes)
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = []) {
    routes.forEach((route) => {
        const meta = route.meta
        const defaultAuthority = pAuthorities[pAuthorities.length - 1] || {
            permission: '*',
        }
        if (meta) {
            let authority = {}
            if (!meta.authority) {
                authority = defaultAuthority
            } else if (typeof meta.authority === 'string') {
                authority.permission = meta.authority
            } else if (typeof meta.authority === 'object') {
                authority = meta.authority
                const { role } = authority
                if (typeof role === 'string') {
                    authority.role = [role]
                }
                if (!authority.permission && !authority.role) {
                    authority = defaultAuthority
                }
            }
            meta.authority = authority
        } else {
            const authority = defaultAuthority
            route.meta = {
                authority,
            }
        }
        route.meta.pAuthorities = pAuthorities
        if (route.children) {
            formatAuthority(route.children, [...pAuthorities, route.meta.authority])
        }

    })
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
    const keys = path
        .split('/')
        .filter((item) => !item.startsWith(':') && item != '')
    keys.push('name')
    return keys.join('.')
}

function getRoutesMatch(fullPath) {
    const {
        store: { getters },
    } = appOptions
    const lang = getters['setting/lang']
    return getters['setting/menuList']
        .filter((e) => fullPath.startsWith(e.url))
        .map((e) => {
            return {
                name: e['name_' + lang] || e.name,
                url: e.url,
            }
        })
}
/**
 * 从路由 fullPath 解析 name
 * @param path
 * @returns {*}
 */
function getFullPathName(fullPath) {
    const matchs = getRoutesMatch(fullPath)
    const matchName = matchs.reduce(
        (begin, current, index) =>
            begin.concat(
                (index === 0 ? '' : index === 1 ? ' | ' : ' - ') + current.name
            ),
        ''
    )
    return matchName
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {

    //   debugger;
    const { beforeEach, afterEach } = guards
    const { router } = options

    beforeEach.forEach((guard) => {
        if (guard && typeof guard === 'function') {
            router.beforeEach((to, from, next) => {
                guard(to, from, next, options)
            })
        }
    })
    afterEach.forEach((guard) => {
        if (guard && typeof guard === 'function') {
            router.afterEach((to, from) => guard(to, from, options))
        }
    })
}

export {
    parseRoutes,
    loadRoutes,
    formatAuthority,
    getI18nKey,
    getRoutesMatch,
    getFullPathName,
    loadGuards,
    deepMergeRoutes,
    formatRoutes,
    setAppOptions,
}
