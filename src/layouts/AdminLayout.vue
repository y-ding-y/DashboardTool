<template>
    <a-layout :class="['admin-layout', 'beauty-scroll']">
        <drawer v-if="isMobile" v-model:value="drawerOpen">
            <side-menu :theme="theme.mode" :menuData="menuData" :collapsed="false" :collapsible="false"
                @menuSelect="onMenuSelect" />
        </drawer>

        <side-menu :class="[fixedSideBar ? 'fixed-side' : '']" :theme="theme.mode"
            v-else-if="layout === 'side' || layout === 'mix'" :menuData="sideMenuData" :collapsed="collapsed"
            :collapsible="true" />
        <div v-if="fixedSideBar && !isMobile"
            :style="`width: ${sideMenuWidth}; min-width: ${sideMenuWidth};max-width: ${sideMenuWidth};`"
            class="virtual-side"></div>
        <drawer v-if="!hideSetting" v-model:visible="showSetting" placement="right">
            <template v-slot:handler>
                <div class="setting">
                    <close-outlined v-if="showSetting" />
                    <setting-outlined v-else />
                </div>
            </template>
            <setting />
        </drawer>
        <a-layout class="admin-layout-main beauty-scroll">
            <admin-header ref="pageHeader" @fullscreen="fullscreen" :class="[
          {
            'fixed-tabs': fixedTabs,
            'fixed-header': fixedHeader,
            'multi-page': multiPage,
          },
        ]" :style="headerStyle" :menuData="headMenuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse" />

            <a-layout-header :class="[
          'virtual-header',
          {
            'fixed-tabs': fixedTabs,
            'fixed-header': fixedHeader,
            'multi-page': multiPage,
          },
        ]" v-show="fixedHeader"></a-layout-header>

            <a-layout-content class="admin-layout-content" :style="`min-height: ${minHeight - 65}px;`">
                <!-- <fullscreen ref="page" :class="[layout, pageWidth]" @change="fullscreenChange">
                    <div style="position: relative">
                        <slot />
                    </div>
                </fullscreen> -->

                <!--   -->
                <div ref="page" :class="[layout, pageWidth]">
                    <div style="position: relative">
                        <slot />
                    </div>
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>


<script setup>
    import AdminHeader from './header/AdminHeader'
    import Drawer from '../components/tool/Drawer'
    import SideMenu from '../components/menu/SideMenu'
    import Setting from '../components/setting/Setting'

</script>

<script>
    import { mapState, mapMutations, mapGetters } from 'vuex'
    import screenfull from "screenfull";
    export default {
        name: 'AdminLayout',
        // components: { Setting, SideMenu, Drawer, AdminHeader },
        data() {
            return {
                collapsed: false,
                showSetting: false,
                drawerOpen: false,
                //fullscreen
                page: {},
                pageHeaderHeight: 0,
                isFullscreen: false,
            }
        },
        provide() {
            return {
                adminLayout: this,
            }
        },
        watch: {
            $route(val) {
                this.setActivated(val)
                //fullscreen
                this.page = this.$route.meta.page
            },
            layout() {
                this.setActivated(this.$route)
            },
            isMobile(val) {
                if (!val) {
                    this.drawerOpen = false
                }
            },
        },

        computed: {
            ...mapState('setting', [
                'isMobile',
                'theme',
                'layout',
                'multiPage',
                'pageWidth',
                'footerLinks',
                'copyright',
                'fixedHeader',
                'fixedSideBar',
                'fixedTabs',
                'hideSetting',
                'multiPage',
            ]),
            ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData']),
            minHeight() {
                return window.innerHeight - 1
            },
            sideMenuWidth() {
                return this.collapsed ? '80px' : '256px'
            },
            headerStyle() {
                let width =
                    this.fixedHeader && this.layout !== 'head' && !this.isMobile
                        ? `calc(100% - ${this.sideMenuWidth})`
                        : '100%'
                let position = this.fixedHeader ? 'fixed' : 'static'
                return `width: ${width}; position: ${position};`
            },
            headMenuData() {
                const { layout, menuData, firstMenu } = this
                return layout === 'mix' ? firstMenu : menuData
            },
            sideMenuData() {
                const { layout, menuData, subMenu } = this
                return layout === 'mix' ? subMenu : menuData
            },
            //fullscreen
            marginCorrect() {
                return this.multiPage ? 24 : 0
            },
        },
        methods: {
            ...mapMutations('setting', ['correctPageMinHeight', 'setActivatedFirst', 'setSideMenuWidth']),
            toggleCollapse() {
                this.collapsed = !this.collapsed
                this.setSideMenuWidth(this.sideMenuWidth)
            },
            onMenuSelect() {
                this.toggleCollapse()
            },
            setActivated(route) {
                if (this.layout === 'mix') {
                    let matched = route.matched
                    matched = matched.slice(0, matched.length - 1)
                    const { firstMenu } = this
                    for (let menu of firstMenu) {
                        if (matched.findIndex((item) => item.path === menu.fullPath) !== -1) {
                            this.setActivatedFirst(menu.fullPath)
                            break
                        }
                    }
                }
            },
            //===========fullscreen=============
            fullscreen() {
                screenfull.toggle(this.$refs['page']);
            },
            launchIntoFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen()
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen()
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen()
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen()
                }
            },

            fullscreenChange() {
                const h = 329
                this.isFullscreen = !this.isFullscreen
                let correctHeight = this.multiPage ? 48 + h : h
                correctHeight += this.fixedHeader ? 0 : this.fixedTabs ? -64 : 0
                this.correctPageMinHeight(this.isFullscreen ? correctHeight : -1 * correctHeight)
            },
            /**
             * 用于计算页面内容最小高度
             * @param newHeight
             */
            updatePageHeight(
                newHeight = this.$refs.pageHeader.$el.offsetHeight + this.marginCorrect
            ) {
                this.correctPageMinHeight(this.pageHeaderHeight - newHeight)
                this.pageHeaderHeight = newHeight
            },
            //===========fullscreen=============
        },
        created() {
            this.correctPageMinHeight(this.minHeight - 24)
            this.setActivated(this.$route)
            //fullscreen
            this.page = this.$route.meta.page
        },
        beforeUnmount() {
            this.correctPageMinHeight(-this.minHeight + 24)
            //fullscreen
            this.updatePageHeight(0)
        },

        //==========fullscreen=========
        updated() {
            if (!this._inactive) {
                this.updatePageHeight()
            }
        },
        activated() {
            this.updatePageHeight()
        },
        deactivated() {
            this.updatePageHeight(0)
        },
        unmounted() {

        },
        mounted() {
            this.updatePageHeight()
            document.addEventListener('fullscreenchange', () => {
                this.fullscreenChange()
            });

        },
        //==========fullscreen=========
    }
</script>

<style lang="less" scoped>
    .admin-layout {
        .side-menu {
            &.fixed-side {
                position: fixed;
                height: 100vh;
                left: 0;
                top: 0;
            }
        }

        .virtual-side {
            transition: all 0.2s;
        }

        .virtual-header {
            transition: all 0.2s;
            opacity: 0;

            &.fixed-tabs.multi-page:not(.fixed-header) {
                height: 0;
            }
        }

        .admin-layout-main {
            .admin-header {
                top: 0;
                right: 0;
                overflow: hidden;
                transition: all 0.2s;

                &.fixed-tabs.multi-page:not(.fixed-header) {
                    height: 0;
                }
            }
        }

        .admin-layout-content {
            padding: 12px;
            /*overflow-x: hidden;*/
            /*min-height: calc(100vh - 64px - 122px);*/
        }

        .setting {
            background-color: @primary-color;
            color: @base-bg-color;
            border-radius: 5px 0 0 5px;
            line-height: 40px;
            font-size: 22px;
            width: 40px;
            height: 40px;
            box-shadow: -2px 0 8px @shadow-color;
        }
    }
</style>
