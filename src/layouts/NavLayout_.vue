<template>
    <div class="page-layout">
        <page-nav ref="pageHeader" v-on:fullscreen="toggleScreen"
            :style="`margin-top: ${multiPage ? 0 : -24}px;margin-bottom:24px;`" />
        <div :class="['page-content', layout, pageWidth]" ref="page">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import PageNav from '@/components/page/nav/PageNav'
    import { mapState, mapMutations } from 'vuex'

    export default {
        name: 'NavLayout',
        components: { PageNav },
        props: [],
        data() {
            return {
                page: {},
                pageHeaderHeight: 0,
                isFullscreen: false,
            }
        },
        computed: {
            ...mapState('setting', [
                'layout',
                'multiPage',
                'pageMinHeight',
                'pageWidth',
                'fixedHeader',
                'fixedTabs',
            ]),
            marginCorrect() {
                return this.multiPage ? 24 : 0
            },
        },
        watch: {},
        created() {
            this.addListener()
        },
        beforeUnmount() {
            this.removeListener()
        },
        methods: {
            ...mapMutations('setting', ['correctPageMinHeight']),

            toggleScreen() {
                if (this.isFullScreen) {
                    this.outFullScreen()
                } else {
                    this.inFullScreen()
                }
            },
            inFullScreen() {
                const el = this.$refs.page
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
                this.$refs.page.classList.remove('beauty-scroll')
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
                    this.isFullScreen = !this.isFullScreen
                }
            },
        },
    }
</script>

<style lang="less">
    .page-header {
        margin: 0 -24px 0;
    }

    .link {
        line-height: 24px;

        a {
            font-size: 14px;
            margin-right: 32px;

            i {
                font-size: 22px;
                margin-right: 8px;
            }
        }
    }

    .page-content {
        position: relative;
        padding: 0 0;

        &.side {}

        &.head.fixed {
            margin: 0 auto;
            max-width: 1400px;
        }
    }
</style>