<template>
    <div :class="'animated ' + animated" :style="[styleSet,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>
        <el-carousel :interval="ss.interval * 1000" v-if="imgsrc == 'upload'">
            <el-carousel-item style="padding: 10px" v-for="(item, index) in ss.files" :key="index">
                <el-image sty :src="icons + '/file/' + item.id + '/' + ss.width + '*' + ss.height"
                    :preview-src-list="[item.path]" :fit="'cover'">
                </el-image>
            </el-carousel-item>
        </el-carousel>
        <el-carousel :interval="ss.interval * 1000" v-else-if="imgsrc == 'folderid'">
            <el-carousel-item style="padding: 10px" v-for="(item, index) in files" :key="index">
                <el-image :src="icons + '/file/' + item.id + '/' + ss.width + '*' + ss.height" :fit="'cover'"
                    @click="handle_img(item)">
                </el-image>
                <br />
            </el-carousel-item>
        </el-carousel>

        <!-- 全屏 -->
        <div class="el-image-viewer__wrapper" style="z-index: 2014" v-show="imgshow">
            <div class="el-image-viewer__mask" @click="handle_closeimg"></div>
            <span class="el-image-viewer__btn el-image-viewer__close" style="background-color: white"
                @click="handle_closeimg">
                <i class="el-icon-close"></i>
            </span>
            <div class="el-image-viewer__canvas">
                <img :src="icons + '/file/' + imgshowsrc" class="el-image-viewer__img" style="
            transform: scale(1) rotate(0deg);
            margin-left: 0px;
            margin-top: 0px;
            max-height: 100%;
            max-width: 100%;
          " />
            </div>
        </div>
    </div>
</template>

<script>
    // import bus from './bus.js'
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
                click_style: {},
                isshow: true,
                result: '',
                refreshData: null,
                refreshpublic: null,
                busdata: [],
                animated: this.ss.inanimate,
                websocket: null,

                loadcount: 0,
                modaltitle: '',
                params: '{}',
                files: [],

                imgshow: false,
                imgshowsrc: '',
            }
        },
        watch: {
            imgsrc() {
                this.handle_getimg()
            },
            isshow(vnew, vold) {
                if (this.isshow) {
                    this.animated = this.ss.inanimate
                } else if (vnew != vold && !this.isshow) {
                    this.animated = this.ss.outanimate
                }
            },
            datebind(vnew, vold) {
                if (this.datebind && vnew != vold) {
                    this.handle_search()
                } else {
                    this.result = []
                }
            },
            datarefresh() {
                if (this.datarefresh) {
                    this.refreshData = setInterval(() => {
                        this.handle_search()
                    }, Number(this.ss.refreshdatatime) * 1000 * 60)
                } else {
                    clearInterval(this.refreshData)
                    this.refreshData = null
                }
            },
            datedetail() {
                this.handle_search()
            },
            datesource() {
                this.handle_search()
            },
        },
        mounted() { },
        components: {},
        created() {
            if (this.datebind) {
                this.handle_search()
                if (this.datarefresh) {
                    this.refreshData = setInterval(() => {
                        this.handle_search()
                    }, Number(this.ss.refreshdatatime) * 1000 * 60)
                }
            }
            this.handle_getimg()
            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        beforeUnmount() {
            clearInterval(this.refreshData)
            clearInterval(this.refreshpublic)
            this.refreshData = null
            this.refreshpublic = null
        },
        computed: {
            imgsrc() {
                return this.ss.imgsrc
            },
            icons() {
                return process.env.VUE_APP_API_WEB_URL
            },
            loading() {
                return this.loadcount > 0
            },
            styleclick() {
                return {
                    border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                }
            },
            styleSet() {
                var style = {
                    position: 'absolute',
                    top: this.ss.top + 'px',
                    left: this.ss.left + 'px',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                    zIndex: this.ss.zindex,
                }
                return style
            },
            datarefresh() {
                return this.ss.refreshdata
            },
            datebind() {
                return this.ss.datebind
            },
            datesource() {
                return this.ss.datesource
            },
            datedetail() {
                return this.ss[this.ss.datesource]
            },
        },
        methods: {
            handle_closeimg() {
                this.imgshow = false
            },
            handle_img(e) {
                this.imgshow = true
                this.imgshowsrc = e.id
            },
            handle_getimg() {
                if (this.imgsrc == 'folderid')
                    this.$funAxios
                        .reqPost('EF_FILE', { prop: 'getfiles', folderid: this.ss.folderid })
                        .then((res) => {
                            this.files = res.data.map((e) => {
                                return {
                                    id: e.id,
                                    path: '/modelapi/uploads/' + e.file_path,
                                }
                            })
                        })
            },
            handle_search() {
                //let dtype = this.ss.datetype;
                let dsource = this.ss.datesource
                switch (dsource) {
                    case 'phpapi':
                        this.handle_phpapi(dsource)
                        break
                    case 'vuestore':
                        this.handle_vuestore(dsource)
                        break
                    default:
                        break
                }
            },

            handle_phpapi(dsource) {
                let temp = eval('(' + this.ss[dsource] + ')')
                if (temp.url != '') {
                    this.$funAxios
                        .reqPost(temp.url, temp.params)
                        .then((res) => {
                            this.result = res.data
                            var temp = res.data
                            this.result = temp
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = []
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },

            handle_vuestore(dsource) {
                this.loadcount = 1
                let temp = eval('(' + this.ss[dsource] + ')')
                for (var key in temp.params) {
                    if (temp.params[key] == 'VUE_STORE_CURMODEL') {
                        temp.params[key] = this.vuecurmodel
                    }
                }
                if (temp.url != '') {
                    this.result = []
                    this.$funAxios
                        .reqPost(temp.url, temp.params)
                        .then((res) => {
                            this.loadcount--
                            this.result = res.data
                            var temp = res.data
                            this.result = temp
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = []
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },
        },
}
</script>