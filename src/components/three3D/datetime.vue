<template>
    <div :class="' combtn animated ' + animated" :style="[styleSet,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>
        {{ maincontent }}
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

        data() {
            return {
                isshow: true,
                result: null,
                animated: this.ss.inanimate,
                refreshData: null,
                maincontent: '',
                click_style: {}
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
        },
        created() {
            this.refreshData = setInterval(() => {
                //
                this.maincontent = new Date().format(this.ss.datetimetype)
                //console.log(new Date().format('Y-m-d H:i:s'))
            }, 1000)

            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        beforeUnmount() {
            clearInterval(this.refreshData)
            this.refreshData = null
        },
        computed: {
            styleSet: function () {
                var style = {
                    // border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    top: this.ss.top + 'px',
                    left: this.ss.left + 'px',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                    fontSize: this.ss.fontSize + 'px',
                    lineHeight: this.ss.height + 'px',
                    zIndex: this.ss.zindex,
                    color: this.ss.color,
                    textAlign: this.ss.textAlign,
                    letterSpacing: this.ss.spacing + 'px',
                    fontWeight: this.ss.fontweight,
                    textDecoration: this.ss.decoration,
                    fontStyle: this.ss.fontstyle,
                    //transform:this.ss.transform
                }
                return style
            },
            styleclick() {
                return {
                    border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                }
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

    .loadingOne {
        width: 80px;
        margin: 0 auto;
    }

    .loadingOne span {
        display: inline-block;
        width: 8px;
        height: 100%;
        border-radius: 4px;
        background: lightgreen;
        -webkit-animation: load 1s ease infinite;
        animation: load 1s ease infinite;
    }

    @-webkit-keyframes load {

        0%,
        100% {
            height: 20px;
            background: lightgreen;
        }

        50% {
            height: 30px;
            margin: -15px 0;
            background: lightblue;
        }
    }

    .loadingOne span:nth-child(2) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
    }

    .loadingOne span:nth-child(3) {
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
    }

    .loadingOne span:nth-child(4) {
        -webkit-animation-delay: 0.6s;
        animation-delay: 0.6s;
    }

    .loadingOne span:nth-child(5) {
        -webkit-animation-delay: 0.8s;
        animation-delay: 0.8s;
    }
</style>