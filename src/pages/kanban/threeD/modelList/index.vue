<template>
    <ef-main :loading="loading" :isMainPage="true" @add="show_weather">
        <v-list @action="handle_action" :videos="models"></v-list>

        <a-drawer :width="dialogwidth" placement="right" :closable="false" :visible="visible" @close="onClose">
            <v-form @filechange="filechange" ref="formchild" title="上传视频" :form-items="formItems" @submit="submit"
                :rules="rules" :form="form">
            </v-form>
        </a-drawer>
    </ef-main>
</template>

<script>
    import EfMain from '@/components/page/main'
    import VList from './list.vue'
    import VForm from '@/components/page/drawform'
    import { moment } from '@/utils/util'
    import { reqPost } from '@/services/base'

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
            }
        },

        components: {
            EfMain,
            VList,
            VForm,
        },
        created() {
            this.handle_search()
        },

        mounted() { },
        methods: {
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

            handle_search() {
                this.groupvisible = false
                this.loadcount = 1
                reqPost('APIDATE', { prop: 'selectmodel' }).then((res) => {
                    this.loadcount--
                    this.models = res.data.map((e) => {
                        return {
                            id: e.id,
                            name: e.name,
                            note: e.note,
                            glbsrc: '/modelapi/uploads/' + e.note,
                            //glbsrc: process.env.VUE_APP_API_WEB_URL + "/uploads/" + e.note
                        }
                    })
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
            loading() {
                return this.loadcount > 0
            },

            dialogwidth() {
                return (document.documentElement.clientWidth / 3) * 2
            },
            modalWidth() {
                return document.documentElement.clientWidth
            },
            modalHeight() {
                return document.documentElement.clientHeight - 200
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
                    {
                        key: 'glbsrc',
                        type: 'glbmodel',
                        title: '預覽',
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