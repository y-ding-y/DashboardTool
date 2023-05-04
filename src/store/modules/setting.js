import config from '@/config'
import { ADMIN } from '@/config/default'
import { formatFullPath } from '@/utils/i18n'
import { filterMenu } from '@/utils/authority-utils'
import { getLocalSetting } from '@/utils/themeUtil'
import { CodeSandboxCircleFilled, CodeSandboxOutlined } from '@ant-design/icons-vue'

const localSetting = getLocalSetting(true)
const reduceMenu = (menus) =>
    menus.reduce((begin, current) => {
        Array.isArray(current)
            ? begin.push(...reduceMenu(current))
            : begin.push({
                url: current.fullPath,
                name_tw: current.name_tw,
                name_cn: current.name_cn,
                name_us: current.name_us,
            }) && current.children
                ? begin.push(...reduceMenu(current.children))
                : null
        return begin
    }, [])
export default {
    namespaced: true,
    state: {
        isMobile: false,
        animates: ADMIN.animates,
        palettes: ADMIN.palettes,
        pageMinHeight: 0,
        menuData: [],
        activatedFirst: undefined,
        ...config,
        ...localSetting,
        site: process.env.VUE_APP_SITE,
        sideMenuWidth: '256px'
    },
    getters: {
        lang(state) {
            const user = JSON.parse(
                localStorage.getItem(process.env.VUE_APP_USER_KEY, '{}')
            )
            if (user) {
                state.lang = (user ? user.lang : null) || process.env.VUE_APP_LANG
            }
            return state.lang
        },
        site(state) {
            return state.site
        },
        sites(state) {
            return state.menuData.map((e) => {
                return {
                    key: e.path.replace('/', ''),
                    name_tw: e.name_tw,
                    name_cn: e.name_cn,
                    name_us: e.name_us,
                }
            })
        },
        menuData(state, getters, rootState) {
            if (state.filterMenu) {
                const { permissions, roles } = rootState.account
                filterMenu(state.menuData, permissions, roles)
            }
            //return state.menuData
            //增加Site選擇功能
            return state.menuData.find((e) => e.path.replace('/', '') === state.site)
                .children
        },
        firstMenu(state) {
            const { menuData } = state
            if (menuData.length > 0 && !menuData[0].fullPath) {
                formatFullPath(menuData)
            }
            //return menuData.map(item => {
            //增加Site選擇功能
            return menuData
                .find((e) => e.path.replace('/', '') === state.site)
                .children.map((item) => {
                    const menuItem = {
                        ...item,
                    }
                    delete menuItem.children
                    return menuItem
                })
        },
        subMenu(state) {
            const { menuData, activatedFirst } = state
            if (!menuData[0].fullPath) {
                formatFullPath(menuData)
            }
            //const current = menuData.find(menu => menu.fullPath === activatedFirst)
            //增加Site選擇功能
            const current = menuData
                .find((e) => e.path.replace('/', '') === state.site)
                .children.find((menu) => menu.fullPath === activatedFirst)
            return current && current.children ? current.children : []
        },
        menuList(state) {
            return reduceMenu(state.menuData)
        },
    },
    mutations: {
        setDevice(state, isMobile) {
            state.isMobile = isMobile
        },
        setTheme(state, theme) {
            state.theme = theme
        },
        setLayout(state, layout) {
            state.layout = layout
        },
        setMultiPage(state, multiPage) {
            state.multiPage = multiPage
        },
        setAnimate(state, animate) {
            state.animate = animate
        },
        setWeekMode(state, weekMode) {
            state.weekMode = weekMode
        },
        setFixedHeader(state, fixedHeader) {
            state.fixedHeader = fixedHeader
        },
        setFixedSideBar(state, fixedSideBar) {
            state.fixedSideBar = fixedSideBar
        },
        setLang(state, lang) {
            state.lang = lang
            const user = JSON.parse(
                localStorage.getItem(process.env.VUE_APP_USER_KEY)
            )
            if (user) {
                user.lang = lang
                localStorage.setItem(process.env.VUE_APP_USER_KEY, JSON.stringify(user))
            }
        },
        setSite(state, site) {
            state.site = site
        },
        setHideSetting(state, hideSetting) {
            state.hideSetting = hideSetting
        },
        correctPageMinHeight(state, minHeight) { 
            state.pageMinHeight += minHeight
        },
        setMenuData(state, menuData) {
            state.menuData = menuData
        },
        setAsyncRoutes(state, asyncRoutes) {
            state.asyncRoutes = asyncRoutes
        },
        setPageWidth(state, pageWidth) {
            state.pageWidth = pageWidth
        },
        setSideMenuWidth(state, sideMenuWidth) {
            state.sideMenuWidth = sideMenuWidth
        },
        setActivatedFirst(state, activatedFirst) {
            state.activatedFirst = activatedFirst
        },
        setFixedTabs(state, fixedTabs) {
            state.fixedTabs = fixedTabs
        },
    },
}
