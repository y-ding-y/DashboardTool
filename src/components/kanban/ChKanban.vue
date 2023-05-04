<template>
    <div ref="picHeight" class="pic">
        <div id="main" ref="img" @mousedown="onmousedown" @mouseup="onmouseup" @mousemove="onmousemove"
            @mousewheel="onmousewheel" @DOMMouseScroll="onmousewheel">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        props: {
            img: {
                type: String,
            },
            width: {
                type: String,
            },
            height: {
                type: String,
            },
            left: {
                type: String,
            },
            top: {
                type: String,
            },
        },
        data() {
            return {
                canDrag: false,
                x0: 0,
                y0: 0,
                x1: 0,
                y1: 0,
                moveLeft: 0,
                moveTop: 0,
                lastLeft: -100,
                lastTop: -120,
                count: 8,
            }
        },
        computed: {
            ...mapState('setting', ['pageMinHeight', 'lang']),
        },
        watch: {
            pageMinHeight(newVal) {
                this.$refs.picHeight.style.height = newVal - 100 + 'px'
            },
            img: {
                deep: true,

                handler(newVal) {
                    this.$nextTick(() => {
                        this.$refs.img.style.backgroundImage = newVal
                    })
                },

                immediate: true,
            },
            width: {
                deep: true,

                handler(newVal) {
                    this.$nextTick(() => {
                        this.$refs.img.style.width = newVal
                    })
                },

                immediate: true,
            },
            height: {
                deep: true,

                handler(newVal) {
                    this.$nextTick(() => {
                        this.$refs.img.style.height = newVal
                    })
                },

                immediate: true,
            },
            left: {
                deep: true,

                handler(newVal) {
                    this.$nextTick(() => {
                        this.$refs.img.style.left = newVal
                    })
                },

                immediate: true,
            },
            top: {
                deep: true,

                handler(newVal) {
                    this.$nextTick(() => {
                        this.$refs.img.style.top = newVal
                    })
                },

                immediate: true,
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.picHeight.style.height = this.pageMinHeight - 100 + 'px'
            })
        },
        methods: {
            // 鼠标按住
            onmousedown(e) {
                if (e.button == 0) {
                    this.canDrag = true
                    this.x0 = e.clientX
                    this.y0 = e.clientY
                }
            },
            // 鼠标按住拖动
            onmousemove(e) {
                if (this.canDrag) {
                    this.x1 = e.clientX
                    this.y1 = e.clientY
                    let x = this.x1 - this.x0
                    let y = this.y1 - this.y0
                    this.$refs.img.style.left = this.lastLeft + x + 'px'
                    this.$refs.img.style.top = this.lastTop + y + 'px'
                    this.moveLeft = this.lastLeft + x
                    this.moveTop = this.lastTop + y
                }
            },
            // 鼠标松开
            onmouseup() {
                this.canDrag = false
                this.lastLeft = this.moveLeft
                this.lastTop = this.moveTop
            },
            onmousewheel(e) {
                // 火狐浏览器滚动条缩放
                if (e.detail === -3 || e.detail === 3) {
                    if (e.detail >= 3) {
                        this.count--
                    } else if (e.detail <= -3) {
                        this.count++
                    } // 其他浏览器滚动条缩放
                } else {
                    if (e.wheelDelta >= 120) {
                        this.count++
                    } else if (e.wheelDelta <= -120) {
                        this.count--
                    }
                }
                if (this.count > 20) {
                    this.count = 20
                } else if (this.count < 5) {
                    this.count = 5
                }
                let size = this.count / 10
                this.$refs.img.style.transform = `scale(${size})`
            },
        },
    }
</script>

<style lang="less" scoped>
    .pic {
        position: relative;
        overflow: hidden;
        width: 100%;
        border: 2px solid @gray-6;
        border-radius: 5px 5px 5px 5px;
    }

    #main {
        /*// margin-left: 45px;*/
        position: absolute;
        left: -100px;
        top: -120px;
        width: 1200px;
        height: 620px;
        background-image: none;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: move;
        /*// zoom:100%;*/
        transform: scale(0.6);
        transition: transform 0.8s;
    }
</style>