<template>

    <div style="overflow: hidden;" :style="{ height:clientheight+'px' }" v-loading="menuload">
        <div style="width: 100%; background-color: rgb(238, 255, 178); display: flex">
            <div style="width: 3%; text-align: center">
                <frown-outlined />
            </div>

            <top-menu @uploadfile="uploadfile" style="width: 97%" :dd="dd" :kanban="kanban" @addnew="handle_new">
            </top-menu>
        </div>
        <div class="top" :style="{ height:'100%',overflow: 'hidden' }">
            <div class="left" style="background-color: rgb(240, 255, 205); width: 3%; z-index: 2;text-align: center;">
                <el-tooltip content="打开画布" placement="left">
                    <svg class="menuicon" aria-hidden="true" @click.once="huabu" v-show="publicloading">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                    <!-- <a-button type="link" icon="file" @click.once="huabu" :disabled="publicloading"></a-button> -->
                </el-tooltip>

                <el-tooltip content="开启全屏" placement="left">
                    <svg class="menuicon" aria-hidden="true" @click="fullScreen()" :disabled="!ishuabu">
                        <use xlink:href="#icon-quanping-"></use>
                    </svg>
                </el-tooltip>

                <a-popover placement="rightTop" trigger="click" v-model:visible="uivisible">
                    <template #content>
                        <div style="display: flex; width: 450px; flex-wrap: wrap">
                            <div class="settingbtns" v-for="item in btns" :key="item.key"
                                @click="handle_add({ ...item })"
                                :style="{  backgroundColor: item.btnbackgroundcolor ?? '#d5f2ff',  margin: '5px',
                  padding: '5px 0', display: 'flex',  flexDirection: 'column',  justifyContent: 'space-around', width: '80px',  textAlign: 'center', }">
                                <svg class="icon" aria-hidden="true">
                                    <use :xlink:href="item.iconname"></use>
                                </svg>
                                {{ item.btnname }}
                            </div>
                        </div>
                    </template>
                    <el-tooltip content="新增UI" placement="left">
                        <svg class="menuicon" aria-hidden="true" @click="handle_choseui">
                            <use xlink:href="#icon-fenlei"></use>
                        </svg>
                    </el-tooltip>
                </a-popover>
                <a-divider class="dividerclass"></a-divider>
                <el-tooltip content="UI概览" placement="left">
                    <svg class="menuicon" aria-hidden="true" @click="handle_showall">
                        <use xlink:href="#icon-ziliao"></use>
                    </svg>
                </el-tooltip>

                <el-tooltip content="公共数据" placement="left">
                    <svg class="menuicon" aria-hidden="true" @click="handle_publicdata">
                        <use xlink:href="#icon-biji"></use>
                    </svg>
                </el-tooltip>
                <a-upload name="file" :multiple="false" action="#" @change="handle_selectjson" :file-list="fileList"
                    :before-upload="beforeUpload" style="text-align: center">
                    <el-tooltip content="选择Json" placement="left">
                        <svg class="menuicon" aria-hidden="true">
                            <use xlink:href="#icon-shangchuan"></use>
                        </svg>
                    </el-tooltip>
                </a-upload>

                <el-tooltip content="下载json" placement="left">
                    <svg class="menuicon" aria-hidden="true" @click="handle_savejson">
                        <use xlink:href="#icon-xiazai"></use>
                    </svg>
                </el-tooltip>
            </div>

            <div class="maincenter" id="maincenter" style="z-index: 1">
                <div v-if="ishuabu" style="width: 100%; height: 100%" id="fulls" ref="fulls"
                    :style="{  height: maincenterh + 'px',  backgroundColor: 'rgba(0,0,0,0.4)',}">
                    <div v-if="ishuabu" id="screen"
                        :style="{  width: style.width + 'px',  height: style.height + 'px', transform: style.transform, }">
                        <div v-for="(mainitem, mainindex) in dd"
                            v-show="mainindex > 0 ? mainindex == curbackground : true">

                            <div style="overflow: hidden" @mousedown="sss(item.key)" :id="item.name + item.key"
                                v-for="(item, index) in mainitem.children"
                                v-styleclick="{key: item.key,refname: item.name + item.key,actions: item.ss.actions,isshow: item.ss.isshow,}"
                                v-drag="{ style: item.ss,key: item.key,name: item.name, i: index,maini: mainindex, }">

                                <component v-if="item.name == 'comdiv'" @divsss="divsss" :ref="item.name + item.key"
                                    :curdiv="currdiv" :comkey="item.key" :getScale="getScale()" :isfull="isfull"
                                    :ss="item.ss" :is="item.com">
                                </component>

                                <component v-else :ref="item.name + item.key" :vwidth="style.width"
                                    :vheight="style.height" :curdiv="currdiv == item.key && mainindex == curbackground"
                                    :ss="item.ss" :is="item.com">
                                </component>

                            </div>
                        </div>
                    </div>
                </div>

                <!-- <fullscreen v-model:fullscreen="fullscreen">
                    <div id="test"></div>
                </fullscreen> -->

                <div style="display: flex" v-if="ishuabu">
                    <a-radio-group v-model:value="chosedbackground" button-style="solid"
                        @change="handle_chosecurbackground">
                        <a-radio-button v-for="(item, i) in dd" :label="i" :value="i" :key="item.key">
                            屏幕{{ i }}
                        </a-radio-button>
                    </a-radio-group>
                </div>
            </div>
            <div
                style="  background-color: rgb(240, 255, 205); padding: 2px;  overflow-y: scroll; width: 22%;  z-index: 2; ">
                <v-css v-if="currdiv > 0" :ss="currdivobj.ss" :keyid="currdiv" @vcss="handle_vcss"
                    :actiondivs="treeData[curbackground].children" :name="currdivobj.name">
                </v-css>
            </div>
        </div>

        <a-drawer :mask="false" :width="dialogwidth" title="DIV LSIT" placement="left" :visible="visible"
            @close="onClose">
            <div :style="{  width: '100%',  height: drawerheight + 'px',   overflowY: 'scroll',  }">
                <a-tree @select="onSelect" :tree-data="treeData" show-icon default-expand-all auto-expand-parent
                    :field-names="fieldNames">
                    <template v-slot:icon="record">
                        <svg v-if="record.iconname.slice(0, 1) == '#'" class="icon" aria-hidden="true">
                            <use :xlink:href="record.iconname"></use>
                        </svg>
                        <component v-else :is="record.iconname+'-outlined'"></component>
                    </template>
                    <template v-slot:title="record">
                        {{ record.name }}--{{ record.keyid }}
                        <a-popconfirm title="Are you sure delete ?" ok-text="Yes" cancel-text="No"
                            @confirm="delete_div(record.index)">
                            <a-button type="link" size="small">
                                <delete-outlined />
                            </a-button>
                        </a-popconfirm>
                    </template>
                </a-tree>
            </div>
        </a-drawer>

        <a-drawer :closable="false" :width="publicdataWidth" title="Public Data" placement="right"
            :visible="publicdatavisible" @close="onClosePublicdata">
            <v-publicdata :tabs="tablist"></v-publicdata>
        </a-drawer>
    </div>

</template>


<script>
    import { mapState } from 'vuex'
    import settings from './kanbansetting.json'
    import VCss from '@/components/three3D/cssform'
    import VPublicdata from '@/components/three3D/publicdata.vue'
    import topMenu from './topmenu'
    import axios from 'axios'
    import { defineAsyncComponent, shallowRef, toRaw } from 'vue'
    import screenfull from "screenfull";

    // import background from '@/components/three3D/background.vue'
    // import datetime from '@/components/three3D/datetime.vue'
    // import model from '@/components/three3D/model.vue'
    // import search from '@/components/three3D/search.vue'
    // import texts from '@/components/three3D/texts.vue'
    // import vimage from '@/components/three3D/image.vue'
    // import elcarousel from '@/components/three3D/elcarousel.vue'
    // import solidgaugechart from '@/components/three3D/solidgaugechart.vue'
    // import echartsbar from '@/components/three3D/echartsbar.vue'
    // import eltable from '@/components/three3D/eltable.vue'

    // import showmodel from '@/components/three3D/showmodel.vue'
    // import videoplay from '@/components/three3D/videoplay.vue'
    // import weather from '@/components/three3D/weather.vue'

    import { deepcopy } from '@/utils/util'
    import VCanvas from '@/components/three3D/model.vue'
    import bus from '@/components/three3D/bus.js'

    //  import io from 'socket.io-client'

    export default {
        data() {
            return {
                imgsrc: process.env.VUE_APP_API_WEB_URL + '/storage/eee.jpeg',
                imgsrc1: process.env.VUE_APP_API_WEB_URL + '/modelapi/eee.jpeg',
                fileList: [],
                huabui: 0,
                visible: false,
                publicdatavisible: false,
                isbg: 'false',
                isfull: false,
                currdiv: 0,
                currdivobj: {},
                iscurbg: true,
                isdivcss: false,
                as: {
                    left: 0,
                    width: 100,
                    height: 100,
                    url: '',
                    backgroundColor: '',
                    zindex: 500,
                    content: '',
                    fontSize: 20,
                    actions: [],
                    modelstyle: [],
                    datebind: false,
                    refreshdatatime: 5,
                    datesource: 'phpapi',
                    isshow: true,
                },
                dd: [],
                curbackground: 1,
                i: 0,
                maincenterh: 400,
                ishuabu: false,
                style: {
                    width: 1920, //window.screen.width,
                    height: 1080, //window.screen.height,
                    transform: 'scaleY(1) scaleX(1) translate(0,0)',
                },
                fieldNames: {
                    title: 'name',
                },
                settings,
                tablist: [],
                loadcount: -1,
                uivisible: false,
                chosedbackground: 1,
                menuload: false,
                fullscreen: false,

                temp_node: [],
                curchosed: 0,

                kanban: '',

                intervalarr: []
            }
        },

        components: {
            VCss, //, VCanvas,
            VPublicdata,
            topMenu,
            // background,
            // datetime,
            // model,
            // search,
            // texts,
            // vimage,
            // elcarousel,
            // solidgaugechart,
            // echartsbar,
            // eltable,

            // showmodel,
            // videoplay,
            // weather
        },
        beforeUnmount() {
            //  this.$socket.disconnect();
            this.intervalarr.map(e => {
                e.intervalflag = null
                clearInterval(e.intervalflag)
            })
        },
        created() {
            //   this.$socket.connect();
            this.$store.dispatch('tdpublic/setPublicdata', 528)

            this.$funAxios
                .reqPost('PARA_SET', { paras: [{ key: 'PARA.528' }] })
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
        },
        watch: {
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
        mounted() {
            // document.onselectstart = function () { return false; };
            let that = this
            that.setScale()
            /*窗口改变事件*/
            window.onresize = () => {
                return (() => {
                    that.isfull = that.checkFull()
                    that.setScale()
                })()
            }
        },
        methods: {
            handle_new(e) {
                this.kanban = e.kanban
                this.dd = []
                this.i = 0

                this.ishuabu = true
                this.maincenterh =
                    (1080 / 1920) * document.getElementById('maincenter').clientWidth
                this.setScale()

                var aaa =
                    defineAsyncComponent(() => import('@/components/three3D/background.vue'))
                this.i++
                var keys = this.i
                this.dd.push({
                    comname: 'background',
                    iconname: 'appstore',
                    com: aaa,
                    ss: { ...this.as },
                    key: keys,
                    name: 'background',
                    children: [],
                })
                this.curbackground = 0
            },
            uploadfile(e) {
                this.menuload = e.loading
                if (e.fileid) {
                    this.kanban = e.kanban
                    this.menuload = true
                    axios
                        .get(process.env.VUE_APP_API_BASE_URL + '/file/' + e.fileid)
                        .then((result) => {
                            this.data_to_dd(result.data.data)
                        })
                } else if (e.indexeddb) {
                    this.kanban = e.kanban
                    this.menuload = true
                    this.data_to_dd(e.indexeddb)
                }
            },

            data_to_dd(para) {
                this.dd = para.map((e) => {
                    var aaa = defineAsyncComponent(() => import('@/components/three3D/' + e.comname + '.vue'))
                    e.com = aaa
                    this.i = this.i > e.key ? this.i : e.key
                    e.children.map((m) => {
                        if (m.comname == 'comdiv' && m.ss.coms.length > 0) {
                            m.ss.coms.map((c) => {
                                this.i = this.i > c.key ? this.i : c.key
                            })
                        }
                        else
                            this.i = this.i > m.key ? this.i : m.key
                        var temp =
                            defineAsyncComponent(() => import('@/components/three3D/' + m.comname + '.vue'))
                        m.com = shallowRef(temp)

                        m.ss = { ...m.ss }
                        return m
                    })
                    return e
                })
                this.ishuabu = true
                this.maincenterh =
                    (1080 / 1920) * document.getElementById('maincenter').clientWidth
                this.setScale()
                this.menuload = false
            },
            beforeUpload() {
                return false
            },
            handle_selectjson(info) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-1)
                this.fileList = fileList
                const reader = new FileReader()
                reader.readAsText(info.file)
                reader.onload = () => {
                    this.dd = JSON.parse(reader.result).data.map((e) => {
                        var aaa = defineAsyncComponent(() => import('@/components/three3D/' + e.comname + '.vue'))
                        e.com = aaa
                        this.i = this.i > e.key ? this.i : e.key
                        e.children.map((m) => {
                            this.i = this.i > m.key ? this.i : m.key
                            var temp =
                                defineAsyncComponent(() => import('@/components/three3D/' + m.comname + '.vue'))
                            m.com = shallowRef(temp)
                            m.ss = { ...m.ss }
                            return m
                        })
                        return e
                    })
                }
            },
            handle_savejson() {
                let data = { data: this.dd }
                this.saveJSON(
                    data,
                    '3Dkanban_' + new Date().format('Y-m-d H:i:s') + '.json'
                )
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

            handle_publicdata() {
                this.publicdatavisible = true
            },
            delete_div(e) {
                this.currdiv = 0
                let arr = e.split('-')

                if (arr.length == 2) {
                    this.dd.splice(arr[1], 1)
                } else if (arr.length == 3) {
                    this.dd[this.curbackground].children.splice(arr[2], 1)
                } else if (arr.length == 4) {
                    this.dd[this.curbackground].children[arr[2]].ss.coms.splice(arr[3], 1)
                }
            },
            handle_chosecurbackground() {
                this.curbackground = this.chosedbackground
                this.currdiv = this.dd[this.chosedbackground].key
                this.currdivobj = this.dd[this.chosedbackground]
            },
            onSelect(selectedKeys, info) {
                if (info.selected) {
                    let arr = selectedKeys[0].split('-')
                    this.curbackground = arr[1]
                    if (arr.length == 2) {
                        this.currdiv = this.dd[arr[1]].key
                        this.currdivobj = this.dd[arr[1]]
                    } else if (arr.length == 3) {
                        this.currdiv = this.dd[arr[1]].children[arr[2]].key
                        this.currdivobj = this.dd[arr[1]].children[arr[2]]
                    } else if (arr.length == 4) {
                        this.currdiv = this.dd[arr[1]].children[arr[2]].ss.coms[arr[3]].key
                        this.currdivobj = this.dd[arr[1]].children[arr[2]].ss.coms[arr[3]]
                    }
                }
            },
            onClose() {
                this.visible = false
            },
            onClosePublicdata() {
                this.publicdatavisible = false
            },
            handle_showall() {
                this.visible = true
            },

            huabu() {
                this.ishuabu = true
                this.maincenterh =
                    (1080 / 1920) * document.getElementById('maincenter').clientWidth
                this.setScale()
                if (this.dd.length == 0) {
                    var aaa = defineAsyncComponent(() => import('@/components/three3D/background.vue'))
                    this.i++
                    var keys = this.i
                    this.dd.push({
                        comname: 'background',
                        iconname: 'appstore',
                        com: aaa,
                        ss: { ...this.as },
                        key: keys,
                        name: 'background',
                        children: [],
                    })

                    this.curbackground = 0
                }
            },

            sss(e) {
                if (!this.checkFull()) {
                    //this.curbackground = maini

                    var i = 0
                    this.iscurbg = false
                    this.dd[this.curbackground].children.some((a, index) => {
                        if (a.key == e) {
                            i = index
                            this.iscurbg = true
                            return true
                        }
                    })
                    if (this.dd[this.curbackground].children.length > 0) {
                        if (!this.isdivcss) {
                            this.currdiv = e
                            this.currdivobj = this.dd[this.curbackground].children[i]
                        }
                        //  this.isdivcss = false
                    }
                }
                if (!this.isdivcss) {
                    this.curchosed = e
                }
                this.isdivcss = false
            },
            divsss(e) {
                this.isdivcss = true
                if (!this.checkFull()) {
                    //this.curbackground = maini
                    this.currdiv = e.key
                    var i = 0
                    this.iscurbg = false
                    this.dd[this.curbackground].children.some((a, index) => {
                        if (a.key == e.parentkey) {
                            i = index
                            this.iscurbg = true
                            return true
                        }
                    })
                    if (this.dd[this.curbackground].children.length > 0 && this.iscurbg) {
                        this.currdivobj = this.dd[this.curbackground].children[i].ss.coms[e.index]
                    }
                }

                this.curchosed = e.key
            },
            handle_vcss(e) {
                this.dd[this.curbackground].children.some((a, i) => {
                    if (a.name == 'comdiv') {
                        this.dd[this.curbackground].children[i].ss.coms.some((c) => {
                            if (c.key == e.key) {
                                c.ss = { ...e.style }
                                return true
                            }
                        })
                    } else {
                        if (a.key == e.key) {
                            a.ss = { ...e.style }
                            return true
                        }
                    }
                })
            },
            handle_add(e) {
                this.as.actions = []
                var aaa = defineAsyncComponent(() => import('@/components/three3D/' + e.comname + '.vue'))
                this.i++
                var keys = this.i
                if (e.key == 'background') {
                    this.dd.push({
                        comname: e.comname,
                        iconname: e.iconname,
                        com: shallowRef(aaa),
                        ss: { ...this.as, ...e.expandpara },
                        key: keys,
                        name: e.name,
                        children: [],
                    })
                    this.curbackground = this.dd.length - 1
                } else {
                    var obj = {
                        comname: e.comname,
                        iconname: e.iconname,
                        ss: { ...this.as, ...e.expandpara },
                        key: keys,
                        name: e.name,
                    }

                    if (this.currdivobj.comname == 'comdiv' && this.iscurbg) {
                        obj.parentkey = this.currdiv
                        this.currdivobj.ss.coms.push(obj)
                        this.currdiv = keys
                        this.currdivobj = obj
                        this.isdivcss = true
                    } else {
                        obj.com = shallowRef(aaa)
                        this.dd[this.curbackground].children.push(obj)
                        this.currdiv = keys
                        this.currdivobj = obj
                    }
                }
                this.uivisible = false
            },
            handle_choseui() {
                this.uivisible = true
            },
            fullScreen() {
                this.isfull = true
                this.currdiv = 0
                this.currdivobj = {}
                // var full = document.getElementById('fulls')
                // console.log(this.$refs.fulls)
                screenfull.toggle(this.$refs.fulls)
                // this.launchIntoFullscreen()
            },
            getTimeNow() { //获取此刻时间
                var now = new Date()
                return now.getTime()
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
            // 退出全屏封装
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

            getScale() {
                let w = 0
                let h = 0
                if (this.isfull) {
                    w = window.screen.width / 1920
                    h = window.screen.height / 1080
                } else {
                    w = document.getElementById('maincenter').clientWidth / 1920
                    h = this.maincenterh / 1080
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
            btns() {
                return { ...this.settings.btns }
            },
            publicloading() {
                return this.loadcount == 0
            },
            loading() {
                return this.dd.length > 0
            },
            treeData() {
                var res = []
                this.dd.map((e, i) => {
                    if (e.name == 'background') {
                        res.push({
                            index: 0 + '-' + i,
                            name: e.name,
                            key: 0 + '-' + i,
                            keyid: e.key,
                            iconname: e.iconname,
                            scopedSlots: {
                                icon: 'icon',
                                title: 'title',
                            },
                            children: e.children.map((m, index) => {
                                if (m.comname == 'comdiv') {
                                    return {
                                        // title: e.name,
                                        index: 0 + '-' + i + '-' + index,
                                        name: m.name,
                                        key: 0 + '-' + i + '-' + index,
                                        keyid: m.key,
                                        iconname: m.iconname == '' ? 'ellipsis' : m.iconname,
                                        scopedSlots: {
                                            icon: 'icon',
                                            title: 'title',
                                        },
                                        children: m.ss.coms.map((c, cindex) => {
                                            return {
                                                index: 0 + '-' + i + '-' + index + '-' + cindex,
                                                name: c.name,
                                                key: 0 + '-' + i + '-' + index + '-' + cindex,
                                                keyid: c.key,
                                                iconname: c.iconname == '' ? 'ellipsis' : c.iconname,
                                                scopedSlots: {
                                                    icon: 'icon',
                                                    title: 'title',
                                                },
                                            }
                                        }),
                                    }
                                } else {
                                    return {
                                        // title: e.name,
                                        index: 0 + '-' + i + '-' + index,
                                        name: m.name,
                                        key: 0 + '-' + i + '-' + index,
                                        keyid: m.key,
                                        iconname: m.iconname == '' ? 'ellipsis' : m.iconname,
                                        scopedSlots: {
                                            icon: 'icon',
                                            title: 'title',
                                        },
                                    }
                                }
                            }),
                        })
                    }
                })
                return res
            },
            drawerheight() {
                return this.pageMinHeight - 20
            },
            maxheight() {
                return window.screen.height
            },
            clientheight() {
                return document.documentElement.clientHeight-10
            },
            maxwidth() {
                return window.screen.width
            },
            dialogwidth() {
                return (document.documentElement.clientWidth / 5) * 1
            },
            publicdataWidth() {
                return (document.documentElement.clientWidth / 2) * 1
            },
            modalHeight() {
                return document.documentElement.clientHeight - 200
            },
            ...mapState('setting', ['lang', 'pageMinHeight']),
            scroll() {
                return { x: 1100, y: (this.pageMinHeight - 200) / 2 }
            },
        },
        directives: {
            drag: {
                // 指令的定义
                beforeMount: function (el, binding, vnode) {
                    let that = binding.instance
                    let oDiv = el // 获取当前元素
                    //let ratio = that.getRatio()

                    var cw = document.getElementById('maincenter').clientWidth
                    var temp1 = (1080 / 1920) * cw

                    let sx = cw / 1920
                    let sy = temp1 / 1080

                    if (binding.value.name != 'bg') {
                        oDiv.onmousedown = (e) => {
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
                            if (binding.value.key == that.currdiv) {
                                //binding.value.name != 'comdiv'
                                if (!isFull && that.curbackground == binding.value.maini) {
                                    binding.value.currdiv = binding.value.key
                                    // 算出鼠标相对元素的位置
                                    let disX = e.clientX / sx - oDiv.children[0].offsetLeft
                                    let disY = e.clientY / sy - oDiv.children[0].offsetTop
                                    // if (oDiv.offsetLeft <= 0) {
                                    //     oDiv.style.left = 0;
                                    // }
                                    document.onmousemove = (e) => {
                                        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                                        let left = e.clientX / sx - disX
                                        let top = e.clientY / sy - disY
                                        // oDiv.style.left = left + 'px';
                                        // oDiv.style.top = top + 'px';
                                        that.dd[that.curbackground].children[binding.value.i].ss.left = left
                                        that.dd[that.curbackground].children[binding.value.i].ss.top = top
                                    }
                                    document.onmouseup = () => {
                                        document.onmousemove = null
                                        document.onmouseup = null
                                    }
                                }
                            } else {
                                if (
                                    binding.value.name == 'comdiv' &&
                                    isFull &&
                                    that.curbackground == binding.value.maini
                                ) {
                                    let wx = window.screen.width / 1920
                                    let wy = window.screen.height / 1080

                                    var timeStart, timeEnd, time //申明全局变量
                                    timeStart = that.getTimeNow()
                                    time = setInterval(function () //setInterval会每100毫秒执行一次
                                    {
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

                                    document.onmouseout = () => {
                                        clearInterval(time)
                                    }

                                    document.onmouseup = () => {
                                        clearInterval(time)
                                        document.onmousemove = null
                                        document.onmouseup = null

                                        that.$refs[binding.value.name + binding.value.key][0].full_curcom = false
                                    }
                                }
                            }
                        }
                    }
                },
            },
            styleclick: {
                beforeMount: function (el, binding, vnode) {
                    let oDiv = el
                    let that = binding.instance
                    let refname = binding.value.refname
                    // that.$refs[refname][0].$data.isshow = binding.value.isshow
                    let actions = binding.value.actions
                    oDiv.onclick = (e) => {
                        if (actions && actions.length > 0 && binding.value.key == that.curchosed) {
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
                                            //that.$refs[b][0].$el.style[key] = temp_style[key] 
                                            that.$refs[b][0].click_style[key] = temp_style[key]
                                        }
                                    })
                                    // console.log(that.$refs['eltable112'][0].$el.style.zIndex)
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
                                    let model = that.$refs[refname][0].onMouseClick(e)[0].userData.name
                                    if (model != '') {
                                        if (
                                            that.$refs[refname][0].$data.modelselected.includes(model)
                                        ) {
                                            var index = that.$refs[refname][0].$data.modelselected.findIndex(function (item) {
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
                                                that.$refs[refname][0].formValues
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
                                            document.getElementById('test').appendChild(that.$refs[b][0].$el)
                                        })
                                    } else {
                                        a.actionobj.map((b, index) => {
                                            that.temp_node[index].appendChild(that.$refs[b][0].$el)
                                        })
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
                            })
                        }
                    }

                    oDiv.ondblclick = () => {
                        if (actions && actions.length > 0 && binding.value.key == that.curchosed) {
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

    .btncolor,
    .btncolor:hover,
    .btncolor:visited {
        background-color: antiquewhite;
        color: rgb(0, 0, 0);
    }

    *::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        background-color: transparent;
    }

    *::-webkit-scrollbar-track {
        background-color: rgb(255, 187, 174);
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(255, 98, 66);
        border-radius: 6px;
    }

    .scrollbarHide::-webkit-scrollbar {
        display: none;
    }

    .scrollbarShow::-webkit-scrollbar {
        display: block;
    }
</style>

<style>
    .top {
        display: flex;
        background-color: rgb(255, 255, 255);
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .left button {
        margin: 5px;
    }

    .maincenter {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 75%;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
    }

    #screen {
        z-index: 100;
        transform-origin: 0 0;
        position: relative;
        /* position: fixed;
        left: 50%;
        top: 50%; */
        transition: 0.3s;
        background-color: rgba(127, 255, 212, 0.057);
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

    .test {
        color: #ffd3ac;
    }

    .dividerclass {
        background-color: rgb(255, 129, 83);
        margin: 5px 0;
    }

    .icon {
        margin: auto;
        width: 1.5em;
        height: 1.5em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    .settingbtns:hover {
        cursor: pointer;
        color: #81e2ff;
    }

    .menuicon {
        margin: 0 auto;
        margin-top: 5px;
        width: 2em;
        height: 2em;
    }

    .menuicon:hover {
        cursor: pointer;
    }
</style>