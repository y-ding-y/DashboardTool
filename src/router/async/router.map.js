// 视图组件
const view = {
    tabs: () => import('@/layouts/tabs'),
    blank: () => import('@/layouts/BlankView'),
    page: () => import('@/layouts/PageView'),
    nav: () => import('@/layouts/NavView'),
}

// 路由组件注册
const routerMap = {
    home: {
        authority: '*',
        path: 'home',
        component: () => import('@/pages/home/index.vue')
    },
    exp401: {
        authority: '*',
        name: 'exp401',
        path: '401',
        component: () => import('@/pages/exception/401')
    },
    exp403: {
        authority: '*',
        name: 'exp403',
        path: '403',
        component: () => import('@/pages/exception/403')
    },
    exp404: {
        name: 'exp404',
        path: '404',
        component: () => import('@/pages/exception/404')
    },
    exp500: {
        name: 'exp500',
        path: '500',
        component: () => import('@/pages/exception/500')
    },
    demo: {
        name: '演示页',
        renderMenu: false,
        component: () => import('@/pages/demo')
    },


    // root: {
    //     path: '/',
    //     name: 'login',
    //     redirect: '/login',
    //     component: view.tabs
    // },
    blankView: {
        name: '空白視圖',
        component: view.blank
    },
    pageView: {
        name: '頁面視圖',
        component: view.page
    },
    navView: {
        name: '導航視圖',
        component: view.nav
    },
    exception: {
        name: '异常页',
        icon: 'warning',
        component: view.blank
    },
    frame: {
        component: () => import('@/pages/frame')
    },
    threeEdit: {
        component: () => import('@/pages/kanban/threeD/splitetable2.vue') //
    },
    threeindex: {
        component: () => import('@/pages/kanban/threeD/threeindex.vue')
    },

   

}
export default routerMap