import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
import { plantRenderPara } from '../../utils/gogocodeTransfer'
import * as Vue from 'vue'
/**
 * 该插件可根据菜单配置自动生成 ANTD menu组件
 * menuOptions示例：
 * [
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  },
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  }
 * ]
 *
 * i18n: 国际化配置。系统默认会根据 options route配置的 path 和 name 生成英文以及中文的国际化配置，如需自定义或增加其他语言，配置
 * 此项即可。如：
 * i18n: {
 *   messages: {
 *     CN: {dashboard: {name: '监控中心'}}
 *     HK: {dashboard: {name: '監控中心'}}
 *   }
 * }
 **/
import {Menu} from 'ant-design-vue'
import fastEqual from 'fast-deep-equal'
import { mapState } from 'vuex'
import { getI18nKey } from '@/utils/routerUtil'
import * as antvIcon from '@ant-design/icons-vue';

const { Item, SubMenu, Template } = Menu

export default {
    name: 'IMenu',
    props: {
        options: {
            type: Array,
            required: true,
        },
        theme: {
            type: String,
            required: false,
            default: 'dark',
        },
        mode: {
            type: String,
            required: false,
            default: 'inline',
        },
        collapsed: {
            type: Boolean,
            required: false,
            default: false,
        },
        i18n: Object,
        openKeys: Array,
    },
    data() {
        return {
            selectedKeys: [],
            sOpenKeys: [],
            cachedOpenKeys: [],
        }
    },
    computed: {
        ...mapState('setting', ['lang']),
        menuTheme() {
            return this.theme == 'light' ? this.theme : 'dark'
        },
    },
    created() {
        this.updateMenu()
        if (this.options.length > 0 && !this.options[0].fullPath) {
            this.formatOptions(this.options, '')
        }
        // 自定义国际化配置
        if (this.i18n && this.i18n.messages) {
            const messages = this.i18n.messages
            Object.keys(messages).forEach((key) => {
                this.$i18n.mergeLocaleMessage(key, messages[key])
            })
        }
    },
    watch: {
        options(val) {
            if (val.length > 0 && !val[0].fullPath) {
                this.formatOptions(this.options, '')
            }
        },
        i18n(val) {
            if (val && val.messages) {
                const messages = this.i18n.messages
                Object.keys(messages).forEach((key) => {
                    this.$i18n.mergeLocaleMessage(key, messages[key])
                })
            }
        },
        collapsed(val) {
            if (val) {
                this.cachedOpenKeys = this.sOpenKeys
                this.sOpenKeys = []
            } else {
                this.sOpenKeys = this.cachedOpenKeys
            }
        },
        $route: function () {
            this.updateMenu()
        },
        sOpenKeys(val) {
            $emit(this, 'openChange', val)
            $emit(this, 'update:openKeys', val)
        },
    },
    methods: {
        renderMenuItem: function (h, menu) {
            const lang = this.lang.toLowerCase()
            let tag = 'router-link'
            let config = {
                to: menu.name,
                style: 'overflow:hidden;white-space:normal;text-overflow:clip;',
            }
            if (menu.meta && menu.meta.link) {
                tag = 'a'
                config = {
                    style: 'overflow:hidden;white-space:normal;text-overflow:clip',
                    href: menu.meta.link,
                    target: '_blank',
                }
            }
            return h(
                Item,
                {
                    key: menu.fullPath,
                    onClick: () => {
                        this.$router.push({ name: menu.name })
                    },
                },
                {
                    default: () =>
                        h(tag, config, [
                            menu['name_' + lang] || menu.name ||
                            this.$t(getI18nKey(menu.fullPath)),
                        ]),
                    icon: () => menu.meta.icon != undefined ? h(antvIcon[this.transformStr3(menu.meta.icon)], {
                        style:'display:block'
                    }) : ""
                }

            )
        },
        transformStr3: function (str) {
            if (str.toUpperCase().includes('OUTLINED'))
                return str
            else {
                str = str + "-outlined"
                return str.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase()).replace(/^\S/, s => s.toUpperCase())
            }
        },
        renderSubMenu: function (h, menu) {
            const this_ = this
            let itemArr = []
            menu.children.forEach(function (item) {
                itemArr.push(this_.renderItem(h, item))
            })

            return h(
                SubMenu,
                {
                    key: menu.fullPath,
                    title: menu['name_' + this_.lang.toLowerCase()] ||
                        menu.name ||
                        this.$t(getI18nKey(menu.fullPath)),
                    style: 'overflow:hidden;white-space:normal;text-overflow:clip;',
                },
                {
                    default: () => itemArr,
                    // icon: () => h(antvIcon[menu.meta ? menu.meta.icon : 'none'] ?? antvIcon['MehOutlined'], {},)
                    icon: () => menu.meta.icon != undefined ? h(antvIcon[this_.transformStr3(menu.meta.icon)], {}) : ""
                }
            )
        },
        renderItem: function (h, menu) {
            const meta = menu.meta
            if ((!meta || !meta.invisible) && meta.display) {
                let renderChildren = false
                const children = menu.children
                if (children != undefined) {
                    for (let i = 0; i < children.length; i++) {
                        const childMeta = children[i].meta
                        if (!childMeta || !childMeta.invisible) {
                            renderChildren = true
                            break
                        }
                    }
                }
                return menu.children && renderChildren
                    ? this.renderSubMenu(h, menu)
                    : this.renderMenuItem(h, menu)
            }
        },
        renderMenu: function (h, menuTree) {
            let this_ = this
            let menuArr = []
            menuTree.forEach(function (menu, i) {
                menuArr.push(this_.renderItem(h, menu, '0', i))
            })
            return menuArr
        },
        formatOptions(options, parentPath) {
            options.forEach((route) => {
                let isFullPath = route.path.substring(0, 1) == '/'
                route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path
                if (route.children) {
                    this.formatOptions(route.children, route.fullPath)
                }
            })
        },
        updateMenu() {
            const matchedRoutes = this.$route.matched.filter(
                (item) => item.path !== ''
            )
            this.selectedKeys = this.getSelectedKey(this.$route)
            let openKeys = matchedRoutes.map((item) => item.path)
            openKeys = openKeys.slice(0, openKeys.length - 1)
            if (!fastEqual(openKeys, this.sOpenKeys)) {
                this.collapsed || this.mode === 'horizontal'
                    ? (this.cachedOpenKeys = openKeys)
                    : (this.sOpenKeys = openKeys)
            }
        },
        getSelectedKey(route) {
            return route.matched.map((item) => item.path)
        },
    },
    render() {
        return Vue.h(
            Menu,
            plantRenderPara({
                props: {
                    theme: this.menuTheme,
                    mode: this.$props.mode,
                    selectedKeys: this.selectedKeys,
                    openKeys: this.openKeys ? this.openKeys : this.sOpenKeys,
                },
                on: {
                    'update:openKeys': (val) => {
                        this.sOpenKeys = val
                    },
                    click: (obj) => {
                        obj.selectedKeys = [obj.key]
                        $emit(this, 'select', obj)
                    },
                },
            }),
            () => this.renderMenu(Vue.h, this.options)
        )
    },
    emits: ['openChange', 'update:openKeys', 'select'],
}
