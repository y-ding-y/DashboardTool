<template>
    <a-layout-header :class="[headerTheme, 'admin-header']">
        <div :class="['admin-header-wide', layout, pageWidth]">
            <router-link v-if="isMobile || layout === 'head'" to="/"
                :class="['logo', isMobile ? null : 'pc', headerTheme]">
                <header-icon />
                <h1 v-if="!isMobile">
                    {{ systemName }}
                </h1>
                <sup>{{ systemVersion }}</sup>
            </router-link>
            <a-divider v-if="isMobile" type="vertical" />

            <component v-if="layout !== 'head'" class="trigger"
                :is="collapsed ? 'menu-unfold-outlined' : 'menu-fold-outlined'" @click="toggleCollapse">
            </component>

            <a-breadcrumb v-if="layout == 'side' && !isMobile" style="display: inline">
                <a-breadcrumb-item :key="index" v-for="(item, index) in routeCrumbs">
                    <!-- <router-link :to="item.url" v-if="routeCrumbs.length - 1 > index">{{ item.name }}
                        </router-link> -->
                    <div v-if="routeCrumbs.length - 1 > index" style="display: inline">
                        {{ item.name }}
                    </div>

                    <span v-else>{{ item.name }}</span>
                </a-breadcrumb-item>
            </a-breadcrumb>

            <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
                <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData"
                    @select="onSelect" />
            </div>

            <div :class="['admin-header-right', headerTheme]">
                <div v-show="false">
                    <header-search class="header-item" @active="(val) => (searchActive = val)" />
                </div>

                <a-tooltip class="header-item" title="帮助文档" placement="bottom">
                    <a href="https://iczer.gitee.io/vue-antd-admin-docs/" target="_blank" v-show="false">
                        <question-circle-outlined />
                    </a>
                </a-tooltip>

                <header-notication class="header-item" v-if="false" />
                <header-notice class="header-item" />
                <header-fullscreen class="header-item" @fullscreen="fullscreen" />
                <header-favor class="header-item" />
                <header-avatar class="header-item" />
                <header-lang class="header-item" />
                <header-site class="header-item" />
            </div>
        </div>
    </a-layout-header>

</template>

<script>
    import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
    import HeaderAvatar from './HeaderAvatar'
    import HeaderFullscreen from './HeaderFullscreen'
    import HeaderFavor from './HeaderFavor'
    import HeaderIcon from './HeaderIcon'
    import HeaderLang from './HeaderLang'
    import HeaderNotice from './HeaderNotice'
    import HeaderNotication from './HeaderNotication'
    import HeaderSearch from './HeaderSearch'
    import HeaderSite from './HeaderSite'
    import IMenu from '@/components/menu/menu'
    import { mapState } from 'vuex'
    import { getRoutesMatch } from '@/utils/routerUtil'

    export default {
        name: 'AdminHeader',
        components: {
            IMenu,
            HeaderAvatar,
            HeaderFullscreen,
            HeaderFavor,
            HeaderIcon,
            HeaderLang,
            HeaderNotice,
            HeaderSearch,
            HeaderSite,
            HeaderNotication,
        },
        props: ['collapsed', 'menuData'],
        data() {
            return {
                searchActive: false,
                visible: false,
                dataset: [],
                series: [],
                loading: false,
            }
        },
        computed: {
            xAxis() {
                return [{ data: this.getNearly7Day(), }]
            },
            ...mapState('setting', [
                'theme',
                'isMobile',
                'layout',
                'systemName',
                'systemVersion',
                'pageWidth',
            ]),
            headerTheme() {
                if (
                    this.layout == 'side' &&
                    this.theme.mode == 'dark' &&
                    !this.isMobile
                ) {
                    return 'light'
                }
                return this.theme.mode
            },
            menuWidth() {
                const { layout, searchActive } = this
                const headWidth = layout === 'head' ? '100% - 188px' : '100%'
                const extraWidth = searchActive ? '600px' : '400px'
                return `calc(${headWidth} - ${extraWidth})`
            },
            routeCrumbs() {
                return getRoutesMatch(this.$route.fullPath)
            },
        },
        methods: {
            toggleCollapse() {
                $emit(this, 'toggleCollapse')
            },
            onSelect(obj) {
                $emit(this, 'menuSelect', obj)
            },
            fullscreen() {
                $emit(this, 'fullscreen')
            },
            handle_visitchart() {
                this.visible = true
                this.series = []
                this.dataset = []
                this.loading = true
                this.$funAxios.reqPost("ROUTE_VISIT", {
                    prop: "visit",
                    route: this.$route.meta.id,
                    select: "count(created_at) AS COUNT,to_char(created_at,'yyyy-mm-dd') as  IDATE",
                    group: "to_char(created_at,'yyyy-mm-dd') ",
                    order: "to_char(created_at,'yyyy-mm-dd')"
                }).then(res => {
                    this.loading = false
                    res.data.map(e => {
                        e.count = Number(e.count)
                        return e
                    })
                    this.dataset.push({ dimensions: ['count', 'idate'], source: res.data })
                    this.series.push({
                        type: "line", connectNulls: true,
                        encode: { x: "idate", y: "count" },
                        name: "訪問量"
                    })
                    this.series.push({
                        type: "bar",
                        encode: { x: "idate", y: "count" },
                        tooltip: { show: false }
                    })
                    this.$refs.charts.setOption()
                })
            },
            getNearly7Day() {
                let days = []
                var date = new Date()
                for (let i = 0; i <= 24 * 6; i += 24) {
                    let dateItem = new Date(date.getTime() - i * 60 * 60 * 1000) //使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
                    let y = dateItem.getFullYear() //获取年份
                    let m = dateItem.getMonth() + 1 //获取月份js月份从0开始，需要+1
                    let d = dateItem.getDate() //获取日期
                    m = this.addDate0(m) //给为单数的月份补零
                    d = this.addDate0(d) //给为单数的日期补零
                    let valueItem = y + '-' + m + '-' + d //组合
                    days.unshift(valueItem) //添加至数组
                }
                return days
            },
            addDate0(time) {
                if (time.toString().length == 1) {
                    time = '0' + time.toString()
                }
                return time
            }

        },
        emits: ['menuSelect', 'toggleCollapse', 'fullscreen'],
    }
</script>

<style lang="less" scoped>
    @import 'index';
</style>