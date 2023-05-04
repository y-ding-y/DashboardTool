<template>
    <div :class="' combtn animated ' + animated" :style="[styleSet, transformStyle,click_style]"
        v-wheel="{ transform: transform }">
        <div v-if="curcom" :style="[styleclick]"></div>
        <div @mousedown="handle_click(item, index)" v-for="(item, index) in com"
            v-drag="{ style: item.ss,  key: item.key,  name: item.name,  i: index,  transform: transform, }"
            v-styleclick="{  refname: item.name + item.key,   actions: item.ss.actions,  isshow: item.ss.isshow, }">

            <component :ref="item.name + item.key" :ss="item.ss" :is="item.com" :curdiv="curdiv == item.key">
            </component>

        </div>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from './utils/gogocodeTransfer'
    import { defineAsyncComponent, shallowRef, toRaw } from 'vue'

    // import background from '@/components/three3D/background.vue'
    import datetime from '@/components/three3D/datetime.vue'
    import model from '@/components/three3D/model.vue'
    import search from '@/components/three3D/search.vue'
    import texts from '@/components/three3D/texts.vue'
    import vimage from '@/components/three3D/image.vue'
    import elcarousel from '@/components/three3D/elcarousel.vue'
    import solidgaugechart from '@/components/three3D/solidgaugechart.vue'
    import echartsbar from '@/components/three3D/echartsbar.vue'
    import eltable from '@/components/three3D/eltable.vue'

    import showmodel from '@/components/three3D/showmodel.vue'
    import videoplay from '@/components/three3D/videoplay.vue'
    import weather from '@/components/three3D/weather.vue'
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
                    coms: [],
                }),
            },
            curdiv: Number,
            comkey: Number,
            getScale: Object,
            isfull: Boolean,
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
                //maincontent: this.$props.ss.content,
                animated: this.ss.inanimate,

                parentkey: -1,
                transform: 1,

                full_curcom: false,
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
            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        components: {
            eltable, datetime, echartsbar,
            // background, 
            model,
            search,
            texts,
            vimage,
            elcarousel,
            solidgaugechart,

            showmodel,
            videoplay,
            weather
        },
        beforeUnmount() { },
        computed: {
            curcom() {
                let full_curcom = this.full_curcom
                var arr = this.ss.coms.map((e) => {
                    return e.key
                })
                if (this.isfull) {
                    return full_curcom
                } else
                    return (
                        (this.comkey == this.parentkey && arr.includes(this.curdiv)) ||
                        this.comkey == this.curdiv
                    )
            },
            com: {
                get: function () {
                    var res = []
                    this.ss.coms.map((e) => {
                        res.push({ ...e, com: e.comname == "image" ? 'vimage' : e.comname })
                    })
                    return res
                },
                set: function () { },
            },

            styleSet: function () {
                var style = {
                    //border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    top: this.ss.top + 'px',
                    left: this.ss.left + 'px',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                    zIndex: this.ss.zindex,
                    borderRadius: this.ss.borderradius + '%',
                    transform: 'rotate( ' + this.ss.rotate + 'deg)  ' + this.ss.rotateXY,
                }
                if (this.ss.backgroundcolor == null) {
                    style.background =
                        'url(' + this.ss.url + ') no-repeat center / 100% 100%'
                } else {
                    style.background =
                        this.ss.gradient == 'right' || this.ss.gradient == 'top'
                            ? '-webkit-linear-gradient(' +
                            this.ss.gradient +
                            ',rgba(0,0,0,0),' +
                            this.ss.backgroundcolor +
                            ',rgba(0,0,0,0))'
                            : this.ss.backgroundcolor
                }

                if (this.ss.bordershow) {
                    style.width = this.ss.width + this.ss.borderwidth * 2 + 'px'
                    style.height = this.ss.height + this.ss.borderwidth * 2 + 'px'
                    style.borderStyle = 'solid'
                    style.borderWidth = this.ss.borderwidth + 'px'
                    style.borderColor = this.ss.bordercolor
                }
                return style
            },

            transformStyle: {
                get: function () {
                    if (this.ss.bordershow) {
                        return {
                            width: this.ss.width + this.ss.borderwidth * 2 + 'px',
                            height: this.ss.height + this.ss.borderwidth * 2 + 'px',
                            transition: 'transform 0.5s',
                        }
                    } else {
                        return {
                            width: this.ss.width + 'px',
                            height: this.ss.height + 'px',
                            transition: 'transform 0.5s',
                        }
                    }
                },
                set: function () { },
            },
            styleclick: {
                get: function () {
                    var style = {
                        border: this.curcom ? '5px solid orange' : '0px',
                        position: 'absolute',
                        width: this.ss.width + 'px',
                        height: this.ss.height + 'px',
                    }
                    return style
                },
                set: function () { },
            },
        },
        methods: {
            handle_click(e, index) {
                this.parentkey = e.parentkey
                $emit(this, 'divsss', { ...e, index: index })
            },
        },
        directives: {
            drag: {
                // 指令的定义
                beforeMount: function (el, binding, vnode) {
                    let that = binding.instance
                    let oDiv = el // 获取当前元素

                    if (binding.value.name != 'bg') {
                        oDiv.onmousedown = (e) => {
                            if (!that.isfull && that.curbackground == binding.value.maini) {
                                binding.value.currdiv = binding.value.key
                                // 算出鼠标相对元素的位置
                                let disX =
                                    e.clientX / (that.transform * that.getScale.x) - oDiv.children[0].offsetLeft
                                let disY =
                                    e.clientY / (that.transform * that.getScale.x) - oDiv.children[0].offsetTop
                                // if (oDiv.offsetLeft <= 0) {
                                //     oDiv.style.left = 0;
                                // }
                                document.onmousemove = (e) => {
                                    // console.log(sx,that.transform)
                                    // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置

                                    let left = e.clientX / (that.transform * that.getScale.x) - disX
                                    let top = e.clientY / (that.transform * that.getScale.x) - disY
                                    // oDiv.style.left = left + 'px';
                                    // oDiv.style.top = top + 'px';
                                    that.com[binding.value.i].ss.left = left
                                    that.com[binding.value.i].ss.top = top
                                }
                                document.onmouseup = () => {
                                    document.onmousemove = null
                                    document.onmouseup = null
                                }
                            }
                        }
                    }
                },
            },

            wheel: {
                beforeMount: function (el, binding, vnode) {
                    let that = binding.instance
                    let oDiv = el

                    oDiv.onmousewheel = (event) => {
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

                        if (that.curcom || isFull) {
                            that.transform += event.wheelDelta / 12 / 100
                            if (that.transform <= 0.2) {
                                that.transform = 1
                            }
                            oDiv.style.transform = 'scaleY(' + that.transform + ') scaleX(' + that.transform + ') translate(0,0)'
                        }
                    }
                },
            },

            styleclick: function (el, binding, vnode) {
                let oDiv = el
                let that = binding.instance
                let refname = binding.value.refname
                // that.$refs[refname][0].$data.isshow = binding.value.isshow
                let actions = binding.value.actions
                oDiv.onclick = (e) => {
                    if (actions && actions.length > 0) {
                        actions.map((a) => {
                            if (a.actiontype == 'click_block') {
                                a.actionobj.map((b) => {
                                    that.$refs[b][0].$data.isshow = true
                                })
                            } else if (a.actiontype == 'click_none') {
                                a.actionobj.map((b) => {
                                    that.$refs[b][0].$data.isshow = false
                                })
                            } else if (a.actiontype == 'model_click') {
                                a.actionobj.map((b) => {
                                    that.$refs[b][0].$data.clickfun = true
                                })
                            } else if (a.actiontype == 'model_unclick') {
                                a.actionobj.map((b) => {
                                    that.$refs[b][0].$data.clickfun = false
                                })
                            } else if (a.actiontype == 'click_style') {
                                let temp_style = eval('(' + a.actionstyle + ')')
                                a.actionobj.map((b) => {
                                    for (var key in temp_style) {
                                        // that.$refs[b][0].$el.style[key] = temp_style[key]
                                        that.$refs[b][0].click_style[key] = temp_style[key]
                                    }
                                })
                            } else if (a.actiontype == 'click_return_name') {
                                a.actionobj.map((b) => {
                                    that.$refs[b][0].$data.result =
                                        that.$refs[refname][0].onMouseClick(e)[0].userData.name
                                })
                            } else if (a.actiontype == 'click_return_binddata') {
                                a.actionobj.map((b) => {
                                    let paras =
                                        that.$refs[refname][0].onMouseClick(e)[0].userData.binddata
                                    if (paras != undefined && Object.keys(paras).length > 0) {
                                        var table = that.tablist[Number(paras.key)].tabledata
                                        let result = table[Number(paras.row) - 1][paras.colname]
                                        that.$refs[b][0].initThree(result)
                                    } else {
                                        that.$refs[b][0].initThree('')
                                    }
                                })
                            } else if (a.actiontype == 'chose_model') {
                                let model =
                                    that.$refs[refname][0].onMouseClick(e)[0].userData.name
                                if (model != '') {
                                    if (
                                        that.$refs[refname][0].$data.modelselected.includes(model)
                                    ) {
                                        var index = that.$refs[
                                            refname
                                        ][0].$data.modelselected.findIndex(function (item) {
                                            return model == item
                                        })
                                        that.$refs[refname][0].$data.modelselected.splice(index, 1)
                                    } else {
                                        that.$refs[refname][0].$data.modelselected.push(model)
                                    }
                                } else {
                                    that.$refs[refname][0].$data.modelselected = []
                                }
                            } else if (a.actiontype == 'click_changebg') {
                                if (that.checkFull()) {
                                    let temp_style = eval('(' + a.actionstyle + ')')
                                    that.chosedbackground = temp_style.index
                                    that.handle_chosecurbackground()
                                }
                            } else if (a.actiontype == 'click_handle_search') {
                                that.$refs[refname][0].handle_search()
                            } else if (a.actiontype == 'click_search') {
                                if (that.$refs[refname][0].$data.issubmit) {
                                    a.actionobj.map((b) => {
                                        that.$refs[b][0].handle_component_search(
                                            that.$refs[refname][0].form
                                        )
                                    })
                                    that.$refs[refname][0].$data.issubmit = false
                                }
                            } else if (a.actiontype == 'click_fullscreen') {
                                that.fullscreen = !that.fullscreen
                                console.log(that.fullscreen + '--' + that.isfull)
                                if (that.isfull) that.exitFullscreen(that.$refs.fulls)
                                if (that.fullscreen) {
                                    that.temp_node = []
                                    a.actionobj.map((b) => {
                                        that.temp_node.push(that.$refs[b][0].$el.parentNode)
                                        document
                                            .getElementById('test')
                                            .appendChild(that.$refs[b][0].$el)
                                    })
                                } else {
                                    a.actionobj.map((b, index) => {
                                        that.temp_node[index].appendChild(that.$refs[b][0].$el)
                                    })
                                }
                            }
                        })
                    }
                }

                oDiv.ondblclick = () => {
                    if (actions && actions.length > 0) {
                        actions.map((a) => {
                            if (a.actiontype == 'dblclick_topage') {
                                that.$refs[refname][0].$data.toroute = a.actionstyle
                                that.$refs[refname][0].click_interval()
                            }
                        })
                    }
                }
            },
        },
        emits: ['divsss'],
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
</style>