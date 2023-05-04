<template>
    <div class="page" :style="`min-height: ${pageMinHeight}px`">
        <iframe class="frame" :src="srcUrl" :style="{ height, minHeight }" ref="coreFrame" :key="key">
        </iframe>
        <a-spin class="spin" :spinning="timeout !== 0 && spinning" />
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        name: 'Frame',
        props: {
            src: {
                type: String,
                default: '',
            },
            themeKey: {
                type: String,
                default: 'theme',
            },
            timeout: {
                type: Number,
                default: -1,
            },
        },
        data() {
            return {
                height: '0px',
                spinning: true,
                key: 1,
            }
        },
        computed: {
            ...mapState('setting', ['theme', 'pageMinHeight']),
            srcUrl() {
                const src = this.$props.src
                const key = this.$props.themeKey
                const mode = this.theme.mode
                return (
                    src +
                    (src && key ? (src.includes('?') ? '&' : '?') + key + '=' + mode : '')
                )
            },
            minHeight() {
                return this.pageMinHeight - 5 + 'px'
            },
        },
        methods: {},
        watch: {
            src() {
                this.key += 1
                this.spinning = true
                const timeout = this.$props.timeout
                if (timeout > 0) {
                    setTimeout(() => (this.spinning = false), timeout * 1000)
                }
            },
        },
        created() {
            const _vm = this
            window.addEventListener('message', function (event) {
                var data = event.data
                if (data.cmd === 'returnHeight') {
                    _vm.spinning = false
                    _vm.height = data.height + 48 + 'px'
                }
            })
        },
        mounted() {
            const _vm = this
            const timeout = this.$props.timeout
            this.spinning = true
            if (timeout > 0) {
                setTimeout(() => (_vm.spinning = false), timeout * 1000)
            }
        },
    }
</script>

<style lang="less" scoped>
    @import 'index';
</style>