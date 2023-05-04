<template>


    <div  class="page" :style="{ minHeight: pageMinHeight + 'px' }" ref="mainpage">
        <div :class="['main-header', ]">
            <div class="title" :style="lang == 'us' ? '' : 'letter-spacing: 0.5vh;'" v-if="showtitle">

            </div>
            <div class="actions">
                <a-tooltip :title="$t('uploadjson')">
                    <a-upload name="file" :multiple="false" @change="upload_json" :file-list="fileList"
                        :show-upload-list="false" :action="uploadapi" accept=".json">
                        <upload-outlined style="color: rgb(0, 153, 255)" />
                    </a-upload>
                </a-tooltip>
                <a-tooltip :title="$t('downloadjson')">
                    <download-outlined @click="handle_download" style="color: rgb(0, 153, 255)" />
                </a-tooltip>

                <a-tooltip :title="$t('fullscreen')">
                    <fullscreen-outlined @click="fullScreen()" style="color: rgb(0, 153, 255)" />
                </a-tooltip>
            </div>
        </div>


        <div v-if="!showpage" class="loadingpage"
            :style="{ minHeight: pageMinHeight- 140 + 'px' }">
            <div class="spinner">
                <div class=" double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
        </div>

        <div v-if="showpage" class="maincenter" id="maincenter" :style="{ height: pageMinHeight - 140 + 'px' }">
            <!-- class="fullscreen" -->

            <div style="height: 100%" id="fulls" ref="fulls">
                <div id="screen"
                    :style="{width: style.width + 'px',height: style.height + 'px',transform: style.transform,}">
                    <div v-for="(mainitem, mainindex) in dd" :key="mainitem.key"
                        v-show="mainindex > 0 ? mainindex == curbackground : true">
                        <div style="overflow: hidden" @mousedown="sss(item.key)"
                            v-for="(item, index) in dd[mainindex].children"
                            v-drag="{ style: item.ss, key: item.key,  name: item.name, i: index,  maini: mainindex, }"
                            v-styleclick="{   key: item.key,  refname: item.name + item.key, actions: item.ss.actions,  isshow: item.ss.isshow, }">
                            <!-- <component :ref="item.name+item.key" :vwidth="style.width" :vheight="style.height"
                                      v-styleclick="{refname:item.name+item.key,actions:item.ss.actions,isshow:item.ss.isshow}"
                                      :ss="item.ss" :is="item.com">
                                  </component> -->

                            <component v-if="item.name == 'comdiv'" @divsss="divsss" :ref="item.name + item.key"
                                :curdiv="currdiv" :comkey="item.key" :getScale="getScale()" :isfull="true" :ss="item.ss"
                                :is="item.com">
                            </component>


                            <component v-else :ref="item.name + item.key" :vwidth="style.width" :vheight="style.height"
                                :curdiv="currdiv == item.key && mainindex == curbackground" :ss="item.ss"
                                :is="item.com">
                            </component>


                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- <fullscreen v-model:fullscreen="fullscreen">
                    <div id="test"></div>
                </fullscreen> -->

    </div>

</template>

<script>
    import { getRoutesMatch } from '@/utils/routerUtil'
    import { mapState } from 'vuex'
    import axios from 'axios'
    import { defineAsyncComponent, shallowRef, toRaw } from 'vue'

    export default {
        props: {
            dept: { type: String, default: '' },
            deptpublic: { type: String, default: '' },
        },
        i18n: {
            messages: {
                cn: {
                    fullscreen: '全屏',
                    uploadjson: '上传Json',
                    downloadjson: '下载Json',
                },
                tw: {
                    fullscreen: '全屏',
                    uploadjson: '上傳Json',
                    downloadjson: '下载Json',
                },
                us: {
                    fullscreen: 'Full screen',
                    uploadjson: 'Upload Json',
                    downloadjson: 'Download Josn',
                },
            },
        },
        data() {
            return {
                showtitle: true,
                loadcount: 0,
                fileList: [],
                visible: false,
                publicdatavisible: false,
                isbg: 'false',
                isfull: false,
                currdiv: 0,
                dd: [],
                curbackground: 1,
                i: 0,
                //    maincenterw: 400,
                ishuabu: true,
                style: {
                    width: 1920, //window.screen.width,
                    height: 1080, //window.screen.height,
                    transform: 'scaleY(1) scaleX(1) translate(0,0)',
                },
                tablist: [],
                chosedbackground: 0,

                fullscreen: false,
                temp_node: [],
                curchosed: 0,
                title: "",
                intervalarr: [],
                showpage: false,
            }
        },
        beforeUnmount() {
            //  this.$socket.disconnect();
            this.intervalarr.map(e => {
                e.intervalflag = null
                clearInterval(e.intervalflag)
            })
        },

        created() {
            this.setScale()
            //    this.$socket.connect();

            this.$store.dispatch('tdpublic/setPublicdata', this.$props.deptpublic)

            this.$funAxios
                .reqPost('PARA_SET', {
                    paras: [{ key: 'PARA.' + this.$props.deptpublic }],
                })
                .then((res) => {
                    this.tablist = res.data[0].data
                    this.loadcount = this.tablist.length
                    this.intervalarr = []
                    res.data[0].data.map((e, i) => {
                        let temp = eval('(' + e.note + ')')
                        if (e.note != null) {
                            if (temp.intervaltime) {
                                this.intervalarr.push({ ...temp, key: i })
                            }
                            this.$funAxios.reqPost(temp.api, temp.params).then((res2) => {
                                this.loadcount--
                                e.tabledata = res2.data
                                e.column = [
                                    {
                                        dataIndex: 'no',
                                        key: 'no',
                                        title: 'NO',
                                        width: 80,
                                    },
                                ]
                                for (var key in res2.data[0]) {
                                    e.column.push({
                                        dataIndex: key,
                                        key: key,
                                        title: key,
                                        width: 100,
                                    })
                                }
                                this.tablist.splice(i, 1, e)
                                this.$localForage.setItem('3dpublicdata', toRaw(this.tablist))
                            })
                        }

                    })
                })
                .then(() => {
                    if (this.$props.dept) {
                        this.showpage = false
                        this.loadcount = 2
                        setTimeout(() => {
                            this.showpage = true
                            this.$funAxios
                                .reqPost('APIDATE', {
                                    prop: 'getdeptfile',
                                    id: this.$props.dept,
                                })
                                .then((res) => {
                                    this.loadcount--
                                    axios.get(process.env.VUE_APP_API_BASE_URL + '/file/' + res.data[0].note)
                                        .then((result) => {
                                            this.loadcount--
                                            this.dd = result.data.data.map((e) => {
                                                var aaa =
                                                    defineAsyncComponent(() => import('@/components/three3D/' + e.comname + '.vue'))

                                                e.com = aaa
                                                this.i = this.i > e.key ? this.i : e.key
                                                e.children.map((m) => {
                                                    this.i = this.i > m.key ? this.i : m.key
                                                    var temp =
                                                        defineAsyncComponent(() => import('@/components/three3D/' + m.comname + '.vue'))
                                                    m.com = shallowRef(temp)
                                                    return m
                                                })
                                                return e
                                            })
                                        })
                                })
                        }, 2000);

                    }
                })
        },
        mounted() {
            // document.onselectstart = function () { return false; };
            let that = this
            that.setScale()
            window.onresize = () => {
                return (() => {
                    that.isfull = that.checkFull()
                    that.setScale()
                })()
            }
        },
        watch: {
            maincenterh() {
                this.setScale()
            },
            tablist() {
                this.$localForage.setItem('3dpublicdata', toRaw(this.tablist))
            },
            intervalarr: {
                handler(newval, oldval) {
                    if (newval.length != oldval.length) {
                        this.intervalarr.map(e => {
                            e.intervalflag = null
                            e.intervalflag = setInterval(() => {
                                this.$store.dispatch('tdpublic/refreshdata', { key: Number(e.key) })
                            }, e.intervaltime * 1000 * 60);
                        })
                    }
                },
                deep: true

            },
        },
        methods: {
            upload_json(info) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-1)
                this.fileList = fileList
                fileList.map((file) => {
                    if (file.response) {
                        this.handle_selectjson(file.response.id)
                    }
                })
            },
            handle_download() {
                let data = { data: this.dd }
                this.saveJSON(
                    data,
                    '3Dkanban_' + new Date().format('Y-m-d H:i:s') + '.json'
                )
            },
            handle_chosecurbackground() {
                this.curbackground = this.chosedbackground
                this.currdiv = this.dd[this.chosedbackground].key
                this.currdivobj = this.dd[this.chosedbackground]
            },
            saveJSON(data, filename) {
                if (!data) {
                    alert('data is null')
                    return
                }
                if (!filename) {
                    filename = 'json.json'
                }
                if (typeof data === 'object') {
                    data = JSON.stringify(data, undefined, 4)
                }
                var blob = new Blob([data], { type: 'text/json' })
                var e = document.createEvent('MouseEvents')
                var a = document.createElement('a')
                a.download = filename
                a.href = window.URL.createObjectURL(blob)
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
                e.initMouseEvent(
                    'click',
                    true,
                    false,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                )
                a.dispatchEvent(e)
            },
            beforeUpload() {
                return false
            },
            handle_selectjson(e) {
                this.$funAxios
                    .reqPost('APIDATE', {
                        prop: 'deptfile',
                        fileid: e,
                        id: this.$props.dept,
                    })
                    .then((res) => {
                        if (res.data == '1') {
                            this.$message.success('Success')
                        } else {
                            this.$message.error('Error')
                        }
                    })
            },
            sss(e) {
                if (!this.isdivcss) {
                    this.curchosed = e
                }
                this.isdivcss = false
            },
            divsss(e) {
                this.isdivcss = true
                this.curchosed = e.key
            },

            fullScreen() {
                this.isfull = true
                this.currdiv = 0
                this.launchIntoFullscreen(this.$refs.fulls)
            },
            //全屏封装
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
            //退出全屏封装
            exitFullscreen(element) {
                if (element.exitFullscreen) {
                    element.exitFullscreen()
                } else if (element.mozCancelFullScreen) {
                    element.mozCancelFullScreen()
                } else if (element.webkitExitFullscreen) {
                    element.webkitExitFullscreen()
                }
            },
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
            getTimeNow() { //获取此刻时间
                var now = new Date()
                return now.getTime()
            },
            getScale() {
                let w = 0
                let h = 0
                if (this.isfull) {
                    w = window.screen.width / 1920
                    h = window.screen.height / 1080
                } else {
                    h = this.maincenterh / 1080
                    w = this.maincenterw / 1920
                }
                return { x: w, y: h }
            },
            setScale() {
                let scale = this.getScale()
                this.style.transform =
                    'scaleY(' + scale.y + ') scaleX(' + scale.x + ') translate(0,0)'
            },
        },
        computed: {
            routeTitle() {
                const routes = getRoutesMatch(this.$route.fullPath)
                const route = routes && routes.pop()
                return route && route.name
            },
            loading() {
                return this.loadcount > 0
            },
            uploadapi() {
                return process.env.VUE_APP_API_BASE_URL + '/file/upload'
            },
            maincenterh() {
                return this.pageMinHeight - 140
            },
            maincenterw() {
                return (1920 / 1080) * this.maincenterh
            },
            publicdataWidth() {
                return (document.documentElement.clientWidth / 2) * 1
            },
            ...mapState('setting', ['lang', 'pageMinHeight']),
        },
        directives: {
            drag: {
                beforeMount: function (el, binding, vnode) {
                    let that = binding.instance
                    let oDiv = el
                    let sx = window.screen.width / 1920
                    let sy = window.screen.height / 1080

                    if (binding.value.name != 'bg') {
                        oDiv.onmousedown = (e) => {
                            if (
                                binding.value.name == 'comdiv' &&
                                that.isfull &&
                                that.curbackground == binding.value.maini
                            ) {
                                var timeStart, timeEnd, time //申明全局变量
                                timeStart = that.getTimeNow()
                                time = setInterval(function () //setInterval会每100毫秒执行一次
                                {
                                    let wx = window.screen.width / 1920
                                    let wy = window.screen.height / 1080
                                    timeEnd = that.getTimeNow() //也就是每100毫秒获取一次时间
                                    if (timeEnd - timeStart > 1000) {
                                        //如果此时检测到的时间与第一次获取的时间差有1000毫秒
                                        clearInterval(time) //便不再继续重复此函数 （clearInterval取消周期性执行）

                                        that.$refs[binding.value.name + binding.value.key][0].$data.full_curcom = true
                                        // 算出鼠标相对元素的位置
                                        let disX = e.clientX / wx - oDiv.children[0].offsetLeft
                                        let disY = e.clientY / wy - oDiv.children[0].offsetTop

                                        document.onmousemove = (e) => {
                                            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                                            let left = e.clientX / wx - disX
                                            let top = e.clientY / wy - disY
                                            // oDiv.children[0].style.left = left + 'px'
                                            // oDiv.children[0].style.top = top + 'px'
                                            that.dd[that.curbackground].children[binding.value.i].ss.left = left
                                            that.dd[that.curbackground].children[binding.value.i].ss.top = top
                                            // that.$refs[binding.value.name + binding.value.key][0].click_style.left = left + 'px'
                                            // that.$refs[binding.value.name + binding.value.key][0].click_style.top = top + 'px'
                                        }
                                    }
                                }, 100)

                                document.onmouseup = () => {
                                    clearInterval(time)
                                    document.onmousemove = null
                                    document.onmouseup = null
                                    that.$refs[
                                        binding.value.name + binding.value.key
                                    ][0].$data.full_curcom = false
                                }
                            }
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
                    if (
                        actions &&
                        actions.length > 0 &&
                        binding.value.key == that.curchosed
                    ) {
                        actions.map((a) => {

                            if (a.actiontype == 'click_block') {
                                a.actionobj.map((b) => {
                                    if (that.$refs[b]) that.$refs[b][0].$data.isshow = true
                                })
                            } else if (a.actiontype == 'click_none') {
                                a.actionobj.map((b) => {
                                    if (that.$refs[b]) that.$refs[b][0].$data.isshow = false
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
                                    //    console.log(that.$refs[refname][0].onMouseClick(e)[0].name)
                                    // for (var key in temp_style) {
                                    //     that.$refs[b][0].$el.style[key] = temp_style[key]
                                    // }
                                })
                            } else if (a.actiontype == 'click_return_binddata') {
                                a.actionobj.map((b) => {
                                    let paras =
                                        that.$refs[refname][0].onMouseClick(e)[0].userData.binddata
                                    if (paras != undefined && Object.keys(paras).length > 0) {
                                        var table = that.tablist[Number(paras.key)].tabledata
                                        let result = URL.createObjectURL(
                                            table[Number(paras.row) - 1][paras.colname]
                                        )
                                        // that.$refs[b][0].$data.result = result
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
                                let temp_style = eval('(' + a.actionstyle + ')')
                                that.chosedbackground = temp_style.index
                                that.handle_chosecurbackground()
                            } else if (a.actiontype == 'click_handle_search') {
                                that.$refs[refname][0].handle_search()
                            } else if (a.actiontype == 'click_search') {
                                if (that.$refs[refname][0].$data.issubmit) {
                                    a.actionobj.map((b) => {
                                        that.$refs[b][0].handle_component_search(
                                            that.$refs[refname][0].formValues
                                        )
                                    })
                                    that.$refs[refname][0].$data.issubmit = false
                                }
                            }
                            else if (a.actiontype == "chose_model_label") {
                                a.actionobj.map((b) => {
                                    if (!that.$refs[refname][0].$data.ismousemove) {
                                        that.$refs[refname][0].$data.label_element = that.$refs[b][0].$el
                                        that.$refs[refname][0].$data.show_label = true
                                        that.$refs[refname][0].onMouseClick(e)
                                        if (that.$refs[refname][0].$data.outlinePass.selectedObjects.length > 0)
                                            that.$refs[b][0].$data.isshow = true
                                        // that.$refs[refname][0].show_CSS2DObject(that.$refs[b][0].$el)
                                        // console.log("ASd")
                                    }
                                })

                            }
                            else if (a.actiontype == "table_click_search") {
                                var temp_action = that.$refs[refname][0].$data.extraparams
                                if (temp_action.click_changebg) {
                                    let temp_style = temp_action.click_changebg.actionstyle
                                    that.chosedbackground = temp_style.index
                                    that.handle_chosecurbackground()
                                    delete temp_action.click_changebg
                                }

                                if (temp_action.click_search) {
                                    let temp_param = temp_action.click_search
                                    that.$refs[temp_param.refname][0].$data.form[temp_param.key] = temp_action[temp_param.key]
                                    that.$refs[temp_param.refname][0].onSubmit()
                                    that.$refs[temp_param.refname][0].ss.actions.map(t => {
                                        if (t.actiontype == 'click_search') {
                                            that.$refs[temp_param.refname][0].$data.issubmit = true
                                            if (that.$refs[temp_param.refname][0].$data.issubmit) {
                                                t.actionobj.map((b) => {
                                                    that.$refs[b][0].handle_component_search(
                                                        that.$refs[temp_param.refname][0].formValues
                                                    )
                                                })
                                                that.$refs[temp_param.refname][0].$data.issubmit = false
                                            }
                                        }
                                    })
                                    delete temp_action.click_search
                                }
                                if (temp_action.click_style) {
                                    let temp_param = temp_action.click_style
                                    if (temp_param.length > 0) {
                                        temp_param.map(m => {
                                            that.$refs[m][0].ss.actions.map(t => {
                                                if (t.actiontype == 'click_style') {
                                                    let temp_style = eval('(' + t.actionstyle + ')')
                                                    t.actionobj.map((b) => {
                                                        for (var key in temp_style) {
                                                            that.$refs[b][0].click_style[key] = temp_style[key]
                                                        }
                                                    })
                                                }
                                            })
                                        })
                                    }
                                    delete temp_action.click_style
                                }
                            }
                            // else if (a.actiontype == 'click_fullscreen') {
                            //     that.fullscreen = !that.fullscreen
                            //     console.log(that.fullscreen + '--' + that.isfull)
                            //     if (that.isfull) that.exitFullscreen(that.$refs.fulls)
                            //     if (that.fullscreen) {
                            //         that.temp_node = []
                            //         a.actionobj.map((b) => {
                            //             that.temp_node.push(that.$refs[b][0].$el.parentNode)
                            //             document
                            //                 .getElementById('test')
                            //                 .appendChild(that.$refs[b][0].$el)
                            //         })
                            //     } else {
                            //         a.actionobj.map((b, index) => {
                            //             that.temp_node[index].appendChild(that.$refs[b][0].$el)
                            //         })
                            //     }
                            // }
                        })
                    }
                }

                oDiv.ondblclick = () => {
                    if (
                        actions &&
                        actions.length > 0 &&
                        binding.value.key == that.curchosed
                    ) {
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
    }
</script>

<style lang="less" scoped>
    .success,
    .success:hover,
    .success:visited {
        background-color: @success-color;
        color: white;
    }

    *::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        background-color: transparent;
    }

    *::-webkit-scrollbar-track {
        background-color: @primary-3;
    }

    *::-webkit-scrollbar-thumb {
        background-color: @primary-color;
        border-radius: 6px;
    }

    .scrollbarHide::-webkit-scrollbar {
        display: none;
    }

    .scrollbarShow::-webkit-scrollbar {
        display: block;
    }

    .main-header {
        display: flex;
        justify-content: space-between;
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


        .actions {
            margin-top: 4px;
            text-align: right;
            font-size: 17px;
            color: @text-color;

            * {
                margin: 0 4px;

                &:hover {
                    color: @primary-color;
                }
            }
        }
    }

    .page {
        padding: 24px;
        border-radius: 4px;
        background-color: @base-bg-color;
    }

    .loadingpage {
        padding: 24px;
        border-radius: 4px;

    }
</style>

<style lang="less">
    .maincenter {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        /* background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC"); */
    }

    #screen {
        z-index: 100;
        transform-origin: 0 0;
        position: relative;
        /* position: fixed;
        left: 50%;
        top: 50%; */
        transition: 0.3s;
        background-color: rgba(6, 13, 20, 0.484);
    }

    #screen:fullscreen {
        background-color: rgb(4, 31, 22);
        transform: scaleY(0.67) scaleX(0.67) translate(0px, 0px) !important;
    }

    #test {
        z-index: 10;
        transform-origin: 0 0;
        position: relative;
        /* position: fixed;
        left: 50%;
        top: 50%; */
        transition: 0.3s;
        background-color: rgba(127, 255, 212, 0.057);
    }

    #test:fullscreen {
        background-color: rgba(238, 255, 249, 0.203);
        transform: scaleY(0.67) scaleX(0.67) translate(0px, 0px) !important;
    }

    .combtn:hover {
        cursor: pointer;
    }

    .spinner {
        width: 40px;
        height: 40px;
        position: relative;
        margin: 100px auto;
    }

    .double-bounce1,
    .double-bounce2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: @primary-color;
        opacity: 0.4;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
        animation: sk-bounce 2.0s infinite ease-in-out;
    }

    .double-bounce2 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    @-webkit-keyframes sk-bounce {

        0%,
        100% {
            -webkit-transform: scale(0.0)
        }

        50% {
            -webkit-transform: scale(1.0)
        }
    }

    @keyframes sk-bounce {

        0%,
        100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        }

        50% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
        }
    }
</style>