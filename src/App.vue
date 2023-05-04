<template>
    <a-config-provider :locale="locale">
        <router-view v-if="isRouterAlive" :key="$route.fullPath" />
    </a-config-provider>
</template>

<script>
    import { enquireScreen } from './utils/util'
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import themeUtil from '@/utils/themeUtil'
    import { getFullPathName } from '@/utils/routerUtil'
    import axios from 'axios'

    export default {
        name: 'App',
        provide() {
            return {
                reload: this.reload,
            }
        },
        data() {
            return {
                locale: {},
                isRouterAlive: true,
                timer: null,
            }
        },
        created() {
            // console.log(this.menuList)
            //定时器
            var that = this
            this.timer = setInterval(() => {
                axios.get('/timestamp.json', {}).then((res) => {
                    console.log('查询版本')
                    if (localStorage.timestamp == undefined) {
                        localStorage.setItem('timestamp', res.data.timestamp)
                    } else {
                        if (localStorage.timestamp != res.data.timestamp) {
                            localStorage.removeItem('timestamp')
                            that.$Modal.info({
                                title: '检测到版本更新，刷新页面！！',
                                okText: '确定',
                                onOk: () => {
                                    this.$router.go(0)
                                },
                            })
                        }
                    }
                })
            }, 1000 * 60 * 10)

            this.setHtmlTitle(this.lang)
            this.setLanguage(this.lang)
            enquireScreen((isMobile) => this.setDevice(isMobile))
        },
        mounted() {
            this.setWeekModeTheme(this.weekMode)
        },
        beforeUnmount() {
            clearInterval(this.timer)
            this.timer = null
        },
        watch: {
            weekMode(val) {
                this.setWeekModeTheme(val)
            },
            lang(val) {
                this.setLanguage(val)
                this.setHtmlTitle()
            },
            $route() {
                this.setHtmlTitle()
            },
            'theme.mode': function (val) {
                let closeMessage = this.$message.loading(
                    `您选择了主题模式 ${val}, 正在切换...`
                )
                themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
            },
            'theme.color': function (val) {
                let closeMessage = this.$message.loading(
                    `您选择了主题色 ${val}, 正在切换...`
                )
                themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
            },
        },
        computed: {
            key() {
                return this.$route.fullPath
            },
            ...mapState('setting', ['theme', 'weekMode', 'lang', 'menuData']),
            ...mapState('account', ['routesConfig']),
            ...mapGetters('setting', ['menuList']),
        },
        methods: {
            checkFull() {
                //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
                //火狐浏览器
                var isFull =
                    document.mozFullScreen ||
                    document.fullScreen ||
                    //谷歌浏览器及Webkit内核浏览器
                    document.webkitIsFullScreen ||
                    document.webkitRequestFullScreen ||
                    document.mozRequestFullScreen ||
                    document.msFullscreenEnabled
                if (isFull === undefined) {
                    isFull = false
                }
                return isFull
            },
            ...mapMutations('setting', ['setDevice']),
            setWeekModeTheme(weekMode) {
                if (weekMode) {
                    document.body.classList.add('week-mode')
                } else {
                    document.body.classList.remove('week-mode')
                }
            },
            setLanguage(lang) {
                this.$t.locale = "tw"
                this.$i18n.locale = lang
                switch (lang) {
                    case 'cn':
                        this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
                        break
                    case 'us':
                        this.locale = require('ant-design-vue/es/locale-provider/en_US').default
                        break
                    case 'hk':
                    case 'tw':
                    default:
                        this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
                        break
                }


                // this.locale =
                //     require('ant-design-vue/es/locale-provider/zh_TW').default
            },
            setHtmlTitle() {
                const path = this.$route.fullPath
                const name = getFullPathName(path)
                document.title = name
                //process.env.VUE_APP_NAME_ALIAS + (name ? ' | ' + name : '')
            },
            reload() {
                this.isRouterAlive = false
                this.$nextTick(() => {
                    this.isRouterAlive = true
                })
            },

        },
    }
</script>

<style>
    .el-color-picker__empty,
    .el-color-picker__icon {
        top: 0 !important;
        left: 0 !important;
    }
</style>