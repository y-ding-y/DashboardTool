<template>
    <div :class="'animated ' +animated +' user_skills ' +(ss.table.isscroll ? 'showscroll' : 'unshowscroll')"
        :style="[styleSet,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>

        <a-spin :spinning="loading">
            <el-table v-loading="loading" empty-text="暫無數據" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(226, 226, 226, 0.2)" :data="tableData" ref="table"
                :height="ss.height-20" :row-style="rowstyle" :cell-style="table_expand?handle_expand_method:cellstyle"
                :header-row-style="headerrowstyle" :header-cell-style="headercellstyle">
                <template v-for="(col, index) in columns">
                    <el-table-column v-if="col.isfilter" :name="col.prop" :label="col.label" :width="col.width + '%'"
                        :align="col.align" :row-key="index" :filters="filetArr(col.prop)" :filter-method="filterTag">
                        <template v-slot="scope">
                            <a v-if="col.isevents || col.istopage ||col.iscomdivclick"
                                :style="{color: col.color,fontWeight: col.fontweight,textDecoration: col.decoration,  letterSpacing:col.spacing + 'px',}"
                                @click="handle_event(scope.row[col.prop], col.eventparams,scope.row,col.keyparams,col)">
                                {{ scope.row[col.prop] }}
                            </a>
                            <div v-else
                                :style="{color: col.color,fontWeight: col.fontweight,textDecoration: col.decoration,  letterSpacing:col.spacing + 'px',}">
                                {{ scope.row[col.prop] }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column v-else-if="!col.isfilter" :name="col.prop" :label="col.label"
                        :width="col.width + '%'" :align="col.align" :row-key="index">
                        <template v-slot="scope">
                            <a v-if="col.isevents || col.istopage  ||col.iscomdivclick"
                                :style="{color: col.color,fontWeight: col.fontweight,textDecoration: col.decoration,  letterSpacing:col.spacing + 'px',}"
                                @click="handle_event(scope.row[col.prop], col.eventparams,scope.row,col.keyparams,col)">
                                {{ scope.row[col.prop] }}
                            </a>
                            <div v-else
                                :style="{color: col.color,fontWeight: col.fontweight,textDecoration: col.decoration,  letterSpacing:col.spacing + 'px',}">
                                {{ scope.row[col.prop] }}
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <!-- <el-table-column v-for="(col,index) in columns" :key="index" :name="col.prop" :label="col.label"
                  :width="col.width +'%'" :align="col.align" :row-key="index"
                  :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]" :filter-method="filterTag"
                  filter-placement="bottom-end">

                  <template slot-scope="scope">
                      <div :style="{color:col.color,fontWeight:col.fontweight}">
                          {{scope.row[col.prop]}}
                      </div>
                  </template>
              </el-table-column> -->
            </el-table>
        </a-spin>
        <v-modaldetail :modaltitle="modaltitle" :visible="visible" @closemodal="handleCancel" :params="params"
            :extraparams="extraparams">
        </v-modaldetail>
    </div>
</template>


<script>
    // import bus from './bus.js'
    import VModaldetail from './modaldetail.vue'
    import { toRaw } from 'vue'
    import * as expandFun from './eltableExpand.js'
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
                result: [],
                refreshData: null,
                refreshpublic: null,
                scrolltable: null,
                busdata: [],
                animated: this.ss.inanimate,
                websocket: null,
                unshowscroll: 'unshowscroll',
                showscroll: 'showscroll',
                loadcount: 0,
                modaltitle: '',
                params: '{}',
                visible: false,
                i: 0,
                temp_paras: {},
                toroute: null,
                intervalshow: null,
                click_style: {},
                extraparams: {}
            }
        },
        watch: {
            vuecurmodel() {
                if (this.ss.datesource == 'vuestore') {
                    this.handle_vuestore(this.ss.datesource)
                }
            },
            isscroll() {
                if (this.isscroll) {
                    this.tableScroll(this.rowcell.speed)
                } else {
                    this.stoptableScroll()
                }
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
            // datedetail() {
            //     this.handle_search()
            // },
            // datesource() {
            //     this.handle_search()
            // },
            rowcell() {
                if (this.isscroll) {
                    this.tableScroll(this.rowcell.speed)
                }
            },
            result() {
                if (this.result.length > 0 && this.datalength) {
                    this.isshow = true
                }
            },
            datalength() {
                if (this.datalength) {
                    this.intervalshow = setInterval(() => {
                        if (this.result.length > 0)
                            this.isshow = true
                        else
                            this.isshow = false
                    }, Number(this.ss.refreshdatatime) * 1000 * 60)
                }
                else {
                    clearInterval(this.intervalshow)
                    this.intervalshow = null
                }
            },
        },

        components: {
            VModaldetail,
        },
        created() {
            if (this.datebind) {
                this.handle_search()
                if (this.datarefresh) {
                    this.refreshData = setInterval(() => {
                        this.handle_search()
                    }, Number(this.ss.refreshdatatime) * 1000 * 60)
                }
            }
            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        mounted() {
            if (this.isscroll) {
                this.tableScroll(3)
            }

            if (this.datalength) {
                this.intervalshow = setInterval(() => {
                    if (this.result.length > 0)
                        this.isshow = true
                    else
                        this.isshow = false

                }, Number(this.ss.refreshdatatime) * 1000 * 60)
            }
            else {
                clearInterval(this.intervalshow)
                this.intervalshow = null
            }
        },
        beforeUnmount() {
            clearInterval(this.refreshData)
            clearInterval(this.refreshpublic)
            clearInterval(this.scrolltable)
            clearInterval(this.intervalshow)
            this.scrolltable = null
            this.refreshData = null
            this.refreshpublic = null
            this.intervalshow = null
        },
        computed: {
            table_expand() {
                return this.ss.table.table_expand
            },
            expand_method() {
                return this.ss.table.expand_method
            },
            datalength() {
                return this.ss.table.datalength
            },
            loading() {
                return this.loadcount > 0
            },
            vuecurmodel() {
                return this.$store.getters['tdpublic/curmodel']
            },
            isscroll() {
                return this.ss.table.isscroll
            },
            tableData() {
                if (this.isscroll) {
                    return [...this.result, ...this.result]
                } else {
                    return this.result
                }
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
            rowstyle() {
                return {}
            },
            rowcell() {
                return this.ss.table.rowcell
            },
            headercell() {
                return this.ss.table.headercell
            },
            cellstyle() {
                return {
                    backgroundColor: this.rowcell.backgroundcolor,
                    color: this.rowcell.color,
                    fontSize: this.rowcell.fontsize + 'px',
                    border: '0px solid ' + this.rowcell.backgroundcolor,
                    height: this.rowcell.height + 'px',
                    lineHeight: this.rowcell.height + 'px',
                    padding: [0, 0, 0, 0],
                    fontWeight: this.rowcell.fontweight,
                }
            },
            headerrowstyle() {
                return {}
            },
            headercellstyle() {
                return {
                    backgroundColor: this.headercell.backgroundcolor,
                    color: this.headercell.color,
                    fontSize: this.headercell.fontsize + 'px',
                    border: '0px solid ' + this.headercell.backgroundcolor,
                    height: this.headercell.height + 'px',
                    padding: [0, 0, 0, 0],
                    fontWeight: this.headercell.fontweight,
                }
            },
            columns() {
                return this.ss.table.columns
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
            handle_expand_method({ row }) {
                if (this.expand_method != undefined && expandFun[this.expand_method])
                    return expandFun[this.expand_method](row, this.rowcell)
                else
                    return this.cellstyle
            },
            click_interval() {
                if (this.toroute != null) {
                    let temp = eval('(' + this.toroute + ')')
                    window.open(
                        this.$router.resolve({
                            path: temp.path,
                        }).href,
                        temp.type
                    )
                }
            },
            handleCancel() {
                this.visible = false
            },
            handle_event(e, eventparams, row, keyparams, col) {
                if (keyparams != undefined) {
                    var keys = keyparams.split(",")
                    keys.map(m => {
                        this.extraparams[m] = row[m]
                    })
                }

                if (col.isevents) {
                    var params = eventparams == undefined ? '{}' : eventparams
                    this.visible = true
                    this.modaltitle = e
                    this.params = params
                }
                else if (col.istopage) {
                    var temp = col.topageparams == undefined ? '{}' : (eval("(" + col.topageparams + ")"))
                    window.open(
                        this.$router.resolve({
                            path: temp.path,
                            query: { ...this.extraparams }
                        }).href,
                        temp.type
                    )
                }
                else if (col.iscomdivclick) {
                    var clickparams = col.comdivclickparams == undefined ? {} : (eval("(" + col.comdivclickparams + ")"))
                    this.extraparams = { ...this.extraparams, ...clickparams }
                }
            },
            filetArr(prop) {
                var temp = []
                this.tableData.map((e) => {
                    temp.push(e[prop])
                })
                var arr = [...new Set(temp)]

                return arr.map((m) => {
                    return { text: m, value: m }
                })
            },
            filterTag(value, row, column) {
                const property = column['property']
                return row[property] === value
            },
            tableScroll(e) {

                const table = this.$refs.table.$refs
                // 拿到表格中承载数据的div元素
                const divData = table.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
                if (this.scrolltable != null) {
                    clearInterval(this.scrolltable)
                    this.scrolltable = null
                }

                // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
                this.scrolltable = setInterval(() => {
                    // 元素自增距离顶部1像素
                    divData.scrollTop += e
                    // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
                    if (Math.floor(divData.clientHeight + divData.scrollTop) == divData.scrollHeight) {
                        // 重置table距离顶部距离
                        divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
                    }
                }, 100) // 滚动速度
            },
            stoptableScroll() {
                const table = this.$refs.table.$refs
                const divData = table.bodyWrapper.getElementsByClassName('el-scrollbar__wrap')[0]
                if (this.scrolltable != null) {
                    clearInterval(this.scrolltable)
                    this.scrolltable = null
                }
                divData.scrollTop = 0
            },
            handle_search() {
                //let dtype = this.ss.datetype;
                let dsource = this.ss.datesource
                switch (dsource) {
                    case 'phpapi':
                        this.handle_phpapi(dsource)
                        break
                    case 'publicdata':
                        this.handle_publicdata(dsource, this.ss.datetype)
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
                this.temp_paras = { ...temp }
                if (temp.url != '') {
                    this.loadcount = 1
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

            handle_component_search(e) {
                this.loadcount = 1
                if (this.temp_paras.url != '') {
                    this.result = []
                    this.$funAxios
                        .reqPost(this.temp_paras.url, { ...this.temp_paras.params, ...e })
                        .then((res) => {
                            this.loadcount--
                            this.result = res.data
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
                if (temp) {
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
                }

            },

            handle_publicdata(dsource, dtype) {
                let temp = eval('(' + this.ss[dsource] + ')')
                var publicdata = this.$store.getters['tdpublic/commondata']
                if (publicdata.length > 0) {
                    var tempresult = publicdata[Number(temp.key)].tabledata
                    this.result = tempresult
                    if (temp.row != undefined) {
                        this.result = [this.result[temp.row]]
                    }
                }
                if (this.refreshData != null) {
                    this.$store
                        .dispatch('tdpublic/refreshdata', { key: Number(temp.key) })
                        .then(() => {
                            publicdata = this.$store.getters['tdpublic/commondata']
                            var tempresult = this.$store.getters['tdpublic/commondata'][Number(temp.key)].tabledata
                            this.result = tempresult
                            if (temp.row != undefined)
                                this.result = [this.result[temp.row]]

                        })
                } else {
                    //
                }

                // let tempapi = eval("(" + publicdata[Number(temp.key)].note + ")")
                // this.$store.dispatch("tdpublic/refreshdata",
                //     { api: tempapi.api, params: tempapi.params, key: Number(temp.key) }).then(() => {

                //     })

                // let publicdatatab = Array(this.$localForage.getItem('3dpublicdata'))
                // Promise.all(publicdatatab).then(value => {
                //     if (value[0] != null) {
                //         if (value[0].length > 0) {
                //             let temp_public = value[0];
                //             if (dtype == 'string') {
                //                 var table = value[0][Number(temp.key)].tabledata
                //                 this.result = table[Number(temp.row) - 1][temp.colname]
                //             } else if (dtype == "array") {
                //                 //  this.result = value[0][Number(temp.key)].tabledata
                //                 var tempresult = value[0][Number(temp.key)].tabledata
                //                 this.result = [...tempresult, ...tempresult]
                //             }

                //             if (temp.interval) {
                //                 this.refreshpublic = setInterval(() => {
                //                     let tempapi = eval("(" + value[0][Number(temp.key)].note + ")")
                //                     this.$funAxios.reqPost(tempapi.api, tempapi.params).then(res2 => {
                //                         temp_public[Number(temp.key)].tabledata = res2.data
                //                         this.$localForage.setItem('3dpublicdata', temp_public)

                //                         bus.$emit("publicdata", temp_public)

                //                     })
                //                 }, Number(temp.interval) * 1000 * 60);
                //             }
                //             else {
                //                 clearInterval(this.refreshpublic);
                //                 this.refreshpublic = null;
                //             }

                //         }
                //     }
                // })
            },
        },
    }
</script>

<style scoped>
    .showscroll :deep(.el-table--scrollable-y .el-table__body-wrapper) {
        overflow-y: hidden;
    }

    .unshowscroll :deep(.el-table--scrollable-y .el-table__body-wrapper) {
        overflow-y: y;
    }

    .user_skills {
        width: 50%;
        margin: auto;
    }

    .user_skills :deep(.el-table--fit) {
        padding: 20px;
    }

    .user_skills :deep(.el-table, .el-table__expanded-cell) {
        background-color: transparent;
    }

    .user_skills :deep(.el-table tr) {
        background-color: transparent;
    }

    .user_skills :deep(.el-table th) {
        background-color: transparent;
    }

    .user_skills :deep(.el-table--enable-row-transition .el-table__body td, .el-table .cell) {
        background-color: transparent;
    }

    .user_skills :deep(.el-table::before) {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }

    .unshowscroll :deep(.el-scrollbar__view) {
        height: calc(100% - 1.48rem) !important;
        overflow: auto;
    }

    .showscroll :deep(.el-scrollbar__view) {
        height: 100% !important;
    }
</style>