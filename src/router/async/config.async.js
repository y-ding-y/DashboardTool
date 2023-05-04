import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'
import { checkAuthorization } from '@/utils/request'

const isLogin = checkAuthorization()
const view = {
    tabs: () => import('@/layouts/tabs'),
    blank: () => import('@/layouts/BlankView'),
    page: () => import('@/layouts/PageView'),
    nav: () => import('@/layouts/NavView'),
}
// 异步路由配置
const routesConfig = [
    {
        router: 'home',
        path: '/',
        name: 'home',
    },
    {
        path: '/test',
        router:"threeEdit",
    },
    {
        router: 'exp401',
        path: '/401',
        name: '401',
    },

    {
        router: 'exp403',
        path: '/403',
        name: '403',
    },
    {
        router: 'exp500',
        path: '/500',
        name: '500',
    },
]

const options = {
    routes: parseRoutes(routesConfig, routerMap),
}

export default options
