<template>
    <div class="topmenu">
        <div>
            <a-dropdown>
                <a style="font-weight: 700" class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                    新建
                    <plus-outlined />
                </a>
                <template v-slot:overlay>
                    <a-menu>
                        <a-menu-item v-for="(item, index) in jsonlist" :key="index" style="width: 100px"
                            @click="handle_new(item)">
                            {{ item.name }}
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>

            <a-divider type="vertical" />

            <a-dropdown>
                <a style="font-weight: 700" class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                    打开Json
                    <folder-open-outlined />
                </a>
                <template v-slot:overlay>
                    <a-menu>
                        <a-sub-menu :title="item.name" v-for="(item, index) in jsonlist" :key="index"
                            style="width: 100px">
                            <div style="max-height: 500px;overflow-y:scroll ">
                                <a-menu-item v-for="(m, i) in item.children" :key="index + '-' + i">
                                    <template v-if="m.action == 'add'">
                                        <a-upload :action="fileapi + '/file/upload?use_type=kanbanTool'"
                                            @change="handleChange($event, m, index)" accept=".json"
                                            :fileList="fileList">
                                            <a-button type="primary" size="small">{{
                                                m.name
                                                }}</a-button>
                                        </a-upload>
                                    </template>
                                    <template v-else>
                                        <div style="display: flex; justify-content: space-between">
                                            <a-tag v-if="m.type == 'development'" color="cyan">dev</a-tag>
                                            <a-tag v-else-if="m.type == 'production'" color="orange">prod</a-tag>
                                            <div @click="handle_chose(m)">{{ m.name }}</div>
                                            <a-button size="small" type="link" @click="handle_delete(m, index, i)">
                                                <delete-outlined />
                                            </a-button>
                                        </div>
                                    </template>
                                </a-menu-item>
                            </div>

                        </a-sub-menu>
                    </a-menu>
                </template>
            </a-dropdown>

            <a-divider type="vertical" />

            <a-dropdown>
                <a style="font-weight: 700" class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                    打开Indexed DB
                    <database-outlined />
                </a>
                <template v-slot:overlay>
                    <a-menu>
                        <a-menu-item v-for="(item, index) in indexeddb" :key="index" @click="chose_indexeddb(item)">
                            {{ item.title }}
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>

            <a-divider type="vertical" />

            <a-dropdown>
                <a style="font-weight: 700" class="ant-dropdown-link" @click="(e) => e.preventDefault()">
                    保存至...
                    <save-outlined />
                </a>
                <template v-slot:overlay>
                    <a-menu>
                        <a-menu-item key="0" @click="save_db" :disabled="kanban == ''">
                            服务器
                        </a-menu-item>
                        <a-menu-item key="1" @click="save_download" :disabled="kanban == ''">
                            本地下载
                        </a-menu-item>
                        <a-menu-item key="2" @click="save_indexedDB" :disabled="kanban == ''">
                            Indexed DB
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>

        <div style="margin-right: 20px">
            <a-tag v-if="sourcetype != ''" color="#1dffc3">
                <span style="font-weight: 700">文件来源： {{ sourcetype }}</span>
            </a-tag>
            <a-tag v-if="kanbanname != ''" color="#4eff1d">
                <span style="font-weight: 700">看板ID： {{ kanbanname }}</span>
            </a-tag>
            <a-tag v-if="filename != ''" color="#ffc31d">
                <span style="font-weight: 700">文件名： {{ filename }}</span>
            </a-tag>
        </div>
    </div>
</template>

<script>
    import { toRaw, isProxy } from 'vue'
    import { $on, $off, $once, $emit } from './utils/gogocodeTransfer'
    export default {
        props: {
            dd: { type: Array, default: () => [] },
            kanban: { type: String, default: '' },
        },
        data() {
            return {
                jsonlist: [],
                fileList: [],
                kanbanname: '',
                indexeddb: [],
                sourcetype: '',
                filename: '',
            }
        },
        mounted() {
            let that = this

            document.addEventListener(
                'keydown',
                function (e) {
                    if (
                        e.keyCode == 83 &&
                        (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
                    ) {
                        e.preventDefault()
                        that.save_indexedDB()
                    }
                },
                false
            )
        },
        created() {

            $emit(this, 'uploadfile', { loading: true })
            this.$funAxios
                .reqPost('KAN_BAN', { prop: 'PARA', pid: '502' })
                .then((res) => {
                    this.jsonlist = []
                    if (res.data.length > 0) {
                        this.$funAxios
                            .reqPost('KAN_BAN', { prop: 'ENTRANCE', order: 'date desc' })
                            .then((res2) => {
                                this.jsonlist = res.data.map((e) => {
                                    e.children = [{ action: 'add', name: '上传Json', kanban: e.id }]
                                    res2.data.map((m) => {
                                        if (e.id == m.kanban) {
                                            m.name = m.filename
                                            e.children.push(m)
                                        }
                                    })
                                    return e
                                })
                                $emit(this, 'uploadfile', { loading: false })
                            })
                    } else {
                        this.jsonlist = [{ name: '暂无部门' }]
                    }
                })

            let filedata = Array(this.$localForage.keys())
            Promise.all(filedata).then((value) => {
                if (value[0] != null) {
                    if (value[0].length > 0) {
                        value[0].map((e) => {
                            if (e.split('_')[0] == '3D' && e.split('_')[1] == 'Json') {
                                this.indexeddb.push({
                                    name: e,
                                    key: e.split('_')[2],
                                    title: e.split('_')[3],
                                })
                            }
                        })
                    }
                }
            })
        },
        computed: {
            fileapi() {
                return process.env.VUE_APP_API_BASE_URL
            },
            type() {
                return process.env.NODE_ENV
            },
        },
        methods: {
            handleChange(info, e, index) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-1)
                this.fileList = fileList
                fileList = fileList.map((file) => {
                    if (file.response) {
                        $emit(this, 'uploadfile', { loading: true })
                        this.$funAxios
                            .reqPost('KAN_BAN', {
                                prop: 'ENTRANCE|insert',
                                kanban: e.kanban,
                                type: this.type,
                                file_id: file.response.id,
                            })
                            .then((res) => {
                                $emit(this, 'uploadfile', {
                                    loading: false,
                                    fileid: file.response.id,
                                    kanban: e.kanban,
                                })
                                var temp = {
                                    fileid: file.response.id,
                                    filename: file.response.name,
                                    id: res.data,
                                    kanban: e.kanban,
                                    name: file.response.name,
                                    type: this.type,
                                    kanbanname: this.kanbanname,
                                }
                                this.jsonlist[index].children.splice(1, 0, temp)
                                fileList = []
                                this.fileList = fileList
                            })
                    }
                })
            },

            handle_new(e) {
                $emit(this, 'addnew', { kanban: e.id })
                this.kanbanname = e.name
                this.sourcetype = 'New Json'
                this.filename = '<未保存>'
            },

            handle_chose(e) {
                if (e.action != 'add') {
                    $emit(this, 'uploadfile', {
                        loading: false,
                        fileid: e.fileid,
                        kanban: e.kanban,
                    })
                    this.kanbanname = e.kanbanname
                    this.sourcetype = 'Json'
                    this.filename = e.name
                }
            },

            handle_delete(e, index, i) {
                $emit(this, 'uploadfile', { loading: true })
                this.$funAxios
                    .reqPost('KAN_BAN', { prop: 'ENTRANCE|delete', id: e.id })
                    .then((res) => {
                        if (res.data > 0) {
                            this.jsonlist[index].children.splice(i, 1)
                            $emit(this, 'uploadfile', { loading: false })
                        } else this.$message.error('Delete Error')
                    })
            },

            data_to_jsonblob(e) {
                //转成json文件
                let data = { data: e }
                if (!data) {
                    this.$message.warning('data is null')
                    return
                }
                if (typeof data === 'object') {
                    data = JSON.stringify(data, undefined, 4)
                }
                var blob = new Blob([data], { type: 'text/json' })
                return blob
            },

            save_db() {
                //生成json。上传，返回fileid，新增数据库
                var blob = this.data_to_jsonblob(this.$props.dd)
                const files = new window.File(
                    [blob],
                    this.kanbanname + '_' + new Date().format('Y-m-d H:i:s') + '.json',
                    { type: 'json' }
                )
                this.filename =
                    this.kanbanname + '_' + new Date().format('Y-m-d H:i:s') + '.json'
                let formData = new FormData()
                formData.append('file', files)
                formData.append('use_type', 'kanbantool')
                $emit(this, 'uploadfile', { loading: true })
                this.$funAxios.reqPost('FILE_UPLOAD', formData).then((res) => {
                    if (Number(res.data) > 0) {
                        this.$funAxios
                            .reqPost('KAN_BAN', {
                                prop: 'ENTRANCE|insert',
                                kanban: this.kanban,
                                type: this.type,
                                file_id: res.id,
                            })
                            .then((result) => {
                                if (result.data > 0) {
                                    $emit(this, 'uploadfile', {
                                        loading: false,
                                        fileid: res.id,
                                        kanban: this.kanban,
                                    })
                                    var index = this.jsonlist.findIndex((e) => e.id === this.kanban)
                                    var temp = {
                                        fileid: res.id,
                                        filename: res.name,
                                        id: result.data,
                                        kanban: this.kanban,
                                        name: res.name,
                                        type: this.type,
                                        kanbanname: this.kanbanname,
                                    }
                                    this.jsonlist[index].children.splice(1, 0, temp)
                                } else
                                    this.$message.error('Insert Error')
                            })
                    } else {
                        this.$message.error('Upload Error')
                    }
                })
            },

            save_download() {
                var blob = this.data_to_jsonblob(this.$props.dd)
                var e = document.createEvent('MouseEvents')
                var a = document.createElement('a')
                a.download =
                    this.kanbanname + '_' + new Date().format('Y-m-d H:i:s') + '.json'
                this.filename =
                    this.kanbanname + '_' + new Date().format('Y-m-d H:i:s') + '.json'
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

            save_indexedDB() {
                var temp = []
                console.log(JSON.parse(JSON.stringify(this.$props.dd, undefined, 4)))
                if (this.kanbanname != '') {
                    var dd = toRaw(this.$props.dd)
                    this.$localForage
                        .setItem('3D_Json_' + this.kanban + '_' + this.kanbanname, JSON.parse(JSON.stringify(this.$props.dd, undefined, 4)))
                        .then(() => {
                            this.$message.success('保存成功')
                            this.filename = this.kanbanname
                        })
                    // dd.map((e) => {
                    //     temp.push({
                    //         comname: e.comname,
                    //         ss: { ...e.ss, actions: toRaw(e.ss.actions), modelstyle: toRaw(e.ss.modelstyle) },
                    //         key: e.key,
                    //         name: e.name,
                    //         iconname: e.iconname,
                    //         children: e.children.map((m) => { 
                    //             if (m.name != 'comdiv')
                    //                 return {
                    //                     comname: m.comname,
                    //                     ss: { ...m.ss, actions: toRaw(m.ss.actions), modelstyle: toRaw(m.ss.modelstyle) },
                    //                     key: m.key,
                    //                     name: m.name,
                    //                     iconname: m.iconname,
                    //                 }
                    //             else {  
                    //                 return {
                    //                     comname: m.comname,
                    //                     ss: {
                    //                         ...m.ss, actions: toRaw(m.ss.actions), modelstyle: toRaw(m.ss.modelstyle),
                    //                         coms: toRaw(m.ss.coms.map(d => {
                    //                             console.log(isProxy(d.ss.actions), d.ss.actions)
                    //                             return {
                    //                                 comname: d.comname,
                    //                                 ss: { ...d.ss, actions: toRaw(d.ss.actions), modelstyle: toRaw(d.ss.modelstyle) },
                    //                                 key: d.key,
                    //                                 name: d.name,
                    //                                 iconname: d.iconname,
                    //                             }
                    //                         }))
                    //                     },
                    //                     key: m.key,
                    //                     name: m.name,
                    //                     iconname: m.iconname,
                    //                 }

                    //             }
                    //         }),
                    //     })

                    // })
                    // console.log(temp)
                    // this.$localForage
                    //     .setItem('3D_Json_' + this.kanban + '_' + this.kanbanname, toRaw(temp))
                    //     .then(() => {
                    //         this.$message.success('保存成功')
                    //         this.filename = this.kanbanname
                    //     })
                } else {
                    this.$message.success('选择一个看板')
                }
            },



            chose_indexeddb(e) {
                let filedata = Array(this.$localForage.getItem(e.name))
                this.kanbanname = e.name.split('_')[3]
                $emit(this, 'uploadfile', { loading: true })
                Promise.all(filedata).then((value) => {
                    if (value[0] != null) {
                        if (value[0].length > 0) {
                            this.sourcetype = 'Indexed DB'
                            this.filename = e.title
                            $emit(this, 'uploadfile', {
                                loading: false,
                                indexeddb: value[0],
                                kanban: e.key,
                            })
                            // this.dd = value[0].map(e => {
                            //     var aaa = () => import('@/components/three3D/' + e.comname + '.vue')
                            //     e.com = aaa
                            //     this.i = this.i > e.key ? this.i : e.key
                            //     e.children.map(m => {
                            //         if (m.comname == 'comdiv' && m.ss.coms.length > 0) {
                            //             m.ss.coms.map(c => {
                            //                 this.i = this.i > c.key ? this.i : c.key
                            //             })
                            //         }
                            //         else
                            //             this.i = this.i > m.key ? this.i : m.key
                            //         var temp = () => import('@/components/three3D/' + m.comname + '.vue')
                            //         m.com = temp
                            //         m.ss = { ...m.ss }
                            //         return m
                            //     })
                            //     return e;
                            // })
                        }
                    }
                })
            },
        },
        emits: ['uploadfile', 'addnew'],
    }
</script>

<style scoped>
    .topmenu {
        display: flex;
        justify-content: space-between;
    }

    .topmenu :deep(.ant-divider) {
        background: rgb(51, 255, 0);
    }

    .topmenu :deep(.ant-dropdown-link) {
        color: #00d11f;
    }
</style>