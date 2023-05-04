<template>
    <div :class="isMainPage && 'page'" :style="isMainPage && { minHeight: pageMinHeight + 'px' }">
        <a-spin :spinning="loading">
            <div v-if="istitile" :class="['main-header', size]">
                <div class="title" :style="lang == 'us' ? '' : 'letter-spacing: 0.5vh;'">
                    <template v-if="title">{{ title }}</template>
                    <slot v-else-if="$slots.title" name="title"></slot>
                    <template v-else>{{ routeTitle }} </template>
                </div>
            </div>
            <div class="form">
                <slot name="form"></slot>
                <ef-form-area v-if="formItems" :i18n="i18n" :loading="loading" :items="formItems" ref="formref"
                    @handle_enter="handle_enter" @checkmethod="checkmethod" @filechange="filechange" :rules="rules"
                    :form="form" :openSubmit="openSubmit" @submit="onSubmit" @change="onChange" />
            </div>
            <slot />
        </a-spin>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
    import { mapState, mapGetters } from 'vuex'
    import { getRoutesMatch } from '@/utils/routerUtil'
    import FormArea from './FormArea'
    import { saveToXls, saveToImage } from '@/utils/util'

    export default {
        name: 'MainHeader',
        i18n: {
            messages: {
                cn: {
                    refresh: '刷新',
                    exportData: '导出数据',
                    exportImage: '导出图片',
                    fullscreen: '全屏',
                    warn: '对不起，您的浏览器不支持全屏模式',
                },
                tw: {
                    refresh: '刷新',
                    exportData: '導出數據',
                    exportImage: '导出圖片',
                    fullscreen: '全屏',
                    warn: '對不起，您的瀏覽器不支持全屏模式',
                },
                us: {
                    refresh: 'Refresh',
                    exportData: 'Export data',
                    exportImage: 'Export image',
                    fullscreen: 'Full screen',
                    warn: 'Sorry, your browser does not support full screen mode',
                },
            },
        },
        components: { EfFormArea: FormArea },
        props: {
            loading: Boolean,
            isMainPage: { type: Boolean, default: false },
            size: String,
            title: String,
            minHeight: Number,
            mainPageId: String,
            dataTableId: null,
            imageDomId: null,
            formItems: Array,
            rules: Object,
            form: Object,
            openSubmit: Boolean,
            i18n: null,
            ikey: Number,
            istitile: { type: Boolean, default: true },
        },
        data() {
            return {
                id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
                fullScreen: false,
                conditions: {},
                sSize: this.size || 'middle',
                i: 0,
            }
        },
        computed: {
            ...mapState('setting', [
                'layout',
                'showPageTitle',
                'pageWidth',
                'pageMinHeight',
            ]),
            ...mapGetters('setting', ['lang']),

            routeTitle() {
                const routes = getRoutesMatch(this.$route.fullPath)
                const route = routes && routes.pop()
                return route && route.name
            },
        },
        created() {
            this.addListener()
        },
        beforeUnmount() {
            this.removeListener()
        },
        watch: {
            sSize: function (newVal) {
                $emit(this, 'resize', newVal)
            },
        },
        methods: {
            reset() {
                this.$refs.formref.reset()
            },
            clearForm() {
                this.$refs.formref.clearForm()
            },
            onSubmit(formValues, formOptions) {
                $emit(this, 'submit', formValues, formOptions)
            },
            onChange(formValues, formOptions) {
                $emit(this, 'change', formValues, formOptions)
            },
            handle_enter(e) {
                $emit(this, 'handle_enter', e)
            },
            checkmethod(e) {
                $emit(this, 'checkmethod', e)
            },
            filechange(e) {
                $emit(this, 'filechange', e)
            },
            onExportData() {
                $emit(this, 'exportData')
                this.dataTableId && saveToXls(this.dataTableId)
            },
            onExportImage() {
                $emit(this, 'exportImage')
                this.imageDomId && saveToImage(this.imageDomId)
            },
            onRefresh() {
                $emit(this, 'refresh', this.conditions)
            },
            toggleScreen() {
                if (this.fullScreen) {
                    this.outFullScreen()
                } else {
                    this.inFullScreen()
                }
            },
            inFullScreen() {
                const el = document.getElementById(this.$props.mainPageId) //this.$props.page || this.$refs.main
                el.classList.add('beauty-scroll')
                if (el.requestFullscreen) {
                    el.requestFullscreen()
                    return true
                } else if (el.webkitRequestFullScreen) {
                    el.webkitRequestFullScreen()
                    return true
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen()
                    return true
                } else if (el.msRequestFullscreen) {
                    el.msRequestFullscreen()
                    return true
                }
                this.$message.warn(this.$t('warn'))
                el.classList.remove('beauty-scroll')
                return false
            },
            outFullScreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
                this.$refs.main.classList.remove('beauty-scroll')
            },
            addListener() {
                document.addEventListener('fullscreenchange', this.fullScreenListener)
                document.addEventListener(
                    'webkitfullscreenchange',
                    this.fullScreenListener
                )
                document.addEventListener('mozfullscreenchange', this.fullScreenListener)
                document.addEventListener('msfullscreenchange', this.fullScreenListener)
            },
            removeListener() {
                document.removeEventListener('fullscreenchange', this.fullScreenListener)
                document.removeEventListener(
                    'webkitfullscreenchange',
                    this.fullScreenListener
                )
                document.removeEventListener(
                    'mozfullscreenchange',
                    this.fullScreenListener
                )
                document.removeEventListener(
                    'msfullscreenchange',
                    this.fullScreenListener
                )
            },
            fullScreenListener(e) {
                if (e.target.id === this.id) {
                    this.fullScreen = !this.fullScreen
                }
            },
        },
        emits: [
            'resize',
            'submit',
            'change',
            'handle_enter',
            'checkmethod',
            'filechange',
            'refresh',
            'exportData',
            'exportImage'],
    }
</script>

<style lang="less" scoped>
    .page {
        padding: 24px;
        border-radius: 4px;
        background-color: @base-bg-color;
    }

    .main-header {
        display: flex;
        border-radius: 4px;
        transition: all 0.3s;
        margin: 0 0 12px 12px;

        &.middle {
            padding: 12px 16px;
        }

        &.small {
            padding: 8px 12px;
            border: 1px solid @border-color;
            border-bottom: 0;

            .title {
                font-size: 16px;
            }
        }

        .title {
            transition: all 0.3s;
            margin-top: 4px;
            font-size: 18px;
            color: @title-color;
            font-weight: 700;
        }
    }
</style>