<template>
    <ef-main :loading="loading" :isMainPage="true" @adds="show_weather" :adds="true">
        <a-table class="basebg" size="middle" :bordered="true" :columns="columns" :pagination="false" :scroll="scroll"
            :data-source="tableData" rowKey="id">
            <template v-slot:no="txt, rec, index">
                <span> {{ index + 1 }}</span>
            </template>

            <template v-slot:name="txt, rec">
                <a @click="handle_topage(rec)">
                    {{ txt }}
                </a>
            </template>
            <template v-slot:action>
                <a-button type="link" size="small">
                    <a-icon type="search" :class="'success'"></a-icon>
                </a-button>
            </template>
        </a-table>

        <a-drawer :width="dialogwidth" placement="right" :closable="false" :visible="visible" @close="onClose">
            <v-form @filechange="filechange" ref="formchild" title="上传视频" :form-items="formItems" @submit="submit"
                :rules="rules" :form="form">
            </v-form>
        </a-drawer>
    </ef-main>
</template>

<script>
    import EfMain from '@/components/page/main'

    import VForm from '@/components/page/drawform'
    import { moment } from '@/utils/util'
    import { reqPost } from '@/services/base'
    import { mapState } from 'vuex'

    const rules = {
        // name: [{ required: true, message:'Cannot be empty', trigger: 'blur' },],
        // desc: [{ required: true, message:  'Cannot be empty', trigger: 'blur' },],
        // cover: [{ required: true, message: 'Cannot be empty', trigger: 'blur' },],
        // content: [{ required: true, message: 'Cannot be empty', trigger: 'blur' },],
    }

    const form = {
        content: [],
        modelid: '',
        glbsrc: process.env.VUE_APP_API_BASE_URL + '/file/220862',
        modelurl: '',
    }

    export default {
        data() {
            return {
                moment,
                groupvisible: false,
                videoi: 0,

                flag: false,
                visible: false,
                rules,
                form,
                models: [],
                actionstatus: '',
                videoshow: false,

                confirmLoading: false,

                date: new Date(),
                isFullscreen: false,
                groupi: 0,
                loadcount: 0,

                cavi: 0,
                modelid: null,
                title: '',

                tableData: [],
            }
        },

        components: {
            EfMain,
            VForm,
        },
        created() {
            this.loadcount = 1
            this.$funAxios
                .reqPost('KAN_BAN', { prop: 'PARA', pid: '502' })
                .then((res) => {
                    this.loadcount--
                    if (res.data.length > 0) this.tableData = res.data
                })
        },

        mounted() { },
        methods: {
            handle_close() {
                this.visible = false
            },
            show_model(e) {
                this.visible = true
                this.modelid = e.id + '-' + e.name
                this.cavi++
                this.title = e.name
                this.$nextTick(() => {
                    this.initThree(e)
                })
            },
            handle_topage(e) {
                console.log(e)
                window.open(
                    this.$router.resolve({
                        path: 'cpd/3dmanage/threemodel',
                    }).href,
                    '_self'
                )
            },
            filechange(e) {
                let formData = new FormData()
                formData.append('file', e[0].originFileObj)
                this.loadcount = 1
                reqPost('FILE_UPLOAD', formData).then((res) => {
                    this.loadcount--
                    this.form.modelurl = res.url
                    this.form.glbsrc = '/modelapi/uploads/' + res.url
                })
            },

            onClose() {
                this.visible = false
                this.$refs.formchild.clearForm()
            },
            show_weather() {
                this.actionstatus = 'add'
                this.visible = true
            },
            //方法
            submit(value) {
                this.visible = false
                value.prop = 'updateef2para'
                value.note = value.modelurl
                value.id = value.modelid
                reqPost('APIDATE', value).then((res) => {
                    if (res.data > 0) this.$message.success('Upload Success')
                })
            },
            handle_action(e) {
                console.log(e)
            },
        },
        computed: {
            ...mapState('setting', ['lang', 'pageMinHeight']),
            scroll() {
                return { y: this.pageMinHeight - 200 }
            },

            columns() {
                return [
                    { key: 'no', align: 'center', title: '序号', width: 80 },
                    { key: 'name', align: 'left', title: '名称', width: 200 },
                    { key: 'note', align: 'left', title: '路径' },
                    { key: 'action', align: 'left', title: '行为', width: 100 },
                ].map((e) => {
                    e.dataIndex = e.key
                    e.slots = { title: this.$t(e.key) }
                    e.scopedSlots = e.scopedSlots ?? { customRender: e.slot ?? e.key }
                    return e
                })
            },

            loading() {
                return this.loadcount > 0
            },

            dialogwidth() {
                return (document.documentElement.clientWidth / 3) * 2
            },

            formItems() {
                var arr = [
                    {
                        key: 'modelid',
                        type: 'select',
                        paraKey: 'PARA.501',
                        title: 'ModelID',
                    },
                    { key: 'modelurl', type: 'input', disabled: 'disabled', title: '地址' },
                    {
                        key: 'content',
                        type: 'upload',
                        title: '内容',
                        accept: '.glb,.gltf',
                    },
                ]
                return arr
            },
        },
    }
</script>

<style lang="less" scoped>
    .video-player {}

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.8s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }

    .success,
    .success:hover,
    .success:visited {
        background-color: @success-color;
        color: white;
    }

    .divclas {
        overflow-y: scroll;
        height: 200px;
    }
</style>