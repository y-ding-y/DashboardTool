import * as Vue from 'vue'
import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
    routes: [
        // {
        //     path: '/login',
        //     name: '登录页',
        //     component: Vue.defineAsyncComponent(() => import('@/pages/login')),
        // },
        {
            path: '*',
            name: '404',
            component: () => import('@/pages/exception/404')
        },
        {
            path: '/403',
            name: '403',
            component: Vue.defineAsyncComponent(
                Vue.defineAsyncComponent(() => import('@/pages/exception/403'))
            ),
        },
        {
            path: '/',
            name: '首页',
            component: TabsView,
            redirect: '/login',
            children: [
                {
                    path: 'gtk',
                    name: 'GTK演示页',
                    meta: {
                        icon: 'file-ppt',
                    },
                    component: Vue.defineAsyncComponent(
                        Vue.defineAsyncComponent(() => import('@/pages/demo'))
                    ),
                },
                {
                    path: 'g3',
                    name: 'G3演示页',
                    meta: {
                        icon: 'file-ppt',
                    },
                    component: Vue.defineAsyncComponent(
                        Vue.defineAsyncComponent(() => import('@/pages/demo'))
                    ),
                },
                {
                    path: 'demo',
                    name: '演示页',
                    meta: {
                        icon: 'file-ppt',
                    },
                    component: Vue.defineAsyncComponent(
                        Vue.defineAsyncComponent(() => import('@/pages/demo'))
                    ),
                },
                {
                    path: 'parent1',
                    name: '父级路由1',
                    meta: {
                        icon: 'dashboard',
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'demo1',
                            name: '演示页面1',
                            component: Vue.defineAsyncComponent(
                                Vue.defineAsyncComponent(() => import('@/pages/demo'))
                            ),
                        },
                    ],
                },
                {
                    path: 'parent2',
                    name: '父级路由2',
                    meta: {
                        icon: 'form',
                    },
                    component: PageView,
                    children: [
                        {
                            path: 'demo2',
                            name: '演示页面2',
                            component: Vue.defineAsyncComponent(
                                Vue.defineAsyncComponent(() => import('@/pages/demo'))
                            ),
                        },
                    ],
                },
                {
                    path: 'exception',
                    name: '异常页',
                    meta: {
                        icon: 'warning',
                    },
                    component: BlankView,
                    children: [
                        {
                            path: '404',
                            name: 'Exp404',
                            component: Vue.defineAsyncComponent(
                                Vue.defineAsyncComponent(() => import('@/pages/exception/404'))
                            ),
                        },
                        {
                            path: '403',
                            name: 'Exp403',
                            component: Vue.defineAsyncComponent(
                                Vue.defineAsyncComponent(() => import('@/pages/exception/403'))
                            ),
                        },
                        {
                            path: '500',
                            name: 'Exp500',
                            component: Vue.defineAsyncComponent(
                                Vue.defineAsyncComponent(() => import('@/pages/exception/500'))
                            ),
                        },
                    ],
                },
                {
                    name: '验权页面',
                    path: 'auth/demo',
                    meta: {
                        icon: 'file-ppt',
                        authority: {
                            permission: 'form',
                            role: 'manager',
                        },
                        component: Vue.defineAsyncComponent(
                            Vue.defineAsyncComponent(() => import('@/pages/demo'))
                        ),
                    },
                },
            ],
        },
    ],
}

export default options
