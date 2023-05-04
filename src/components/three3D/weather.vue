<template>
    <div :class="' combtn animated ' + animated" :style="[styleSet,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>
        <transition>
            <div style="position: absolute; left: 10px; top: 10px">
                <div id="he-plugin-standard"></div>
            </div>
        </transition>
    </div>
</template>

<script>
    //  import merge from 'deepmerge'
    export default {
        props: {
            ss: {
                type: Object,
                default: () => ({
                    left: 10,
                    top: 10,
                    width: 100,
                    height: 100,
                    fontSize: 20,
                }),
            },
            curdiv: { type: Boolean, default: false },
        },
        sockets: {
            // welcom: function (data) {
            //     console.log("welcome data 数据返回 = >", data);
            // },
        },
        data() {
            return {
                isshow: true,
                result: null,
                click_style: {},
                temp_nodejsemit: '',
                //maincontent: this.$props.ss.content,
                animated: this.ss.inanimate,
                refreshData: null,

                temp_paras: {},
            }
        },
        watch: {
            isshow(vnew, vold) {
                if (this.isshow) {
                    this.animated = this.ss.inanimate
                } else if (vnew != vold && !this.isshow) {
                    this.animated = this.ss.outanimate
                }
            },
            weatherconfig() {
                window.WIDGET = {
                    CONFIG: this.weatherconfig,
                }
                    ; (function (d) {
                        var c = d.createElement('link')
                        c.rel = 'stylesheet'
                        c.href = '/weather/he-standard.css'
                        var s = d.createElement('script')
                        s.src = '/weather/he-standard.js'
                        var sn = d.getElementsByTagName('script')[0]
                        sn.parentNode.insertBefore(c, sn)
                        sn.parentNode.insertBefore(s, sn)
                    })(document)
            },
        },
        created() {
            window.WIDGET = {
                CONFIG: this.weatherconfig,
            }
                ; (function (d) {
                    var c = d.createElement('link')
                    c.rel = 'stylesheet'
                    c.href = '/weather/he-standard.css'
                    var s = d.createElement('script')
                    s.src = '/weather/he-standard.js'
                    var sn = d.getElementsByTagName('script')[0]
                    sn.parentNode.insertBefore(c, sn)
                    sn.parentNode.insertBefore(s, sn)
                })(document)

            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        beforeUnmount() { },
        computed: {
            weatherconfig() {
                var config = {}
                if (['1', '2'].includes(this.ss.weatherlayout)) {
                    config = {
                        layout: this.ss.weatherlayout,
                        width: this.ss.width - 20,
                        height: this.ss.height - 20,
                        background: '1',
                        dataColor: 'FFFFFF',
                        language: 'zh',
                        key: '3418f28424f8492d86e9ab79644cd3a4',
                    }
                } else {
                    config = {
                        modules: '01234',
                        background: '1',
                        tmpColor: 'FFFFFF',
                        tmpSize: '16',
                        cityColor: 'FFFFFF',
                        citySize: '16',
                        aqiColor: 'FFFFFF',
                        aqiSize: '16',
                        weatherIconSize: '24',
                        alertIconSize: '18',
                        padding: '10px 10px 10px 10px',
                        shadow: '0',
                        language: 'zh',
                        fixed: 'false',
                        vertical: 'top',
                        horizontal: 'left',
                        key: '7b209c83105e4bd4bc92b57ea081ab94',
                    }
                }
                return config
            },
            styleSet: function () {
                var style = {
                    //  border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    top: this.ss.top + 'px',
                    left: this.ss.left + 'px',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                    fontSize: this.ss.fontSize + 'px',
                    // lineHeight: this.ss.height + "px",
                    zIndex: this.ss.zindex,
                    //background:this.ss.gradient '-webkit-linear-gradient(right,rgba(0,0,0,0),'+this.ss.backgroundcolor+',rgba(0,0,0,0))'
                }

                return style
            },
            styleclick() {
                var style = {
                    border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                }
                return style
            },
        },
        methods: {},
    }
</script>

<style scoped>
    .title {
        width: 100%;
        text-align: center;
        margin: 60px 0;
        font-size: 18px;
        color: #999;
    }

    .weatchercss {
        position: absolute;
        top: 43px;
        right: 0;
        z-index: 999;
    }
</style>