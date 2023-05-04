<template>
    <div>
        <a-tabs tab-position="top">
            <a-tab-pane key="11" tab="Public Data">
                <a-tabs tab-position="left" v-model:value="actived" @change="change_tab">
                    <a-tab-pane v-for="(item, index) in tablist" :key="index" :tab="item.name">

                        <my-table ref="table" :tableData="item.tabledata" :size="'small'" :columns="item.column"
                            :scroll="scroll">
                            <template v-for="(col, index) in item.column" v-slot:[col.key]="{text,index}"
                                :key="col.key + '-' + index">
                                <span v-if="col.key=='no'">{{index+1}}</span>
                                <a-tooltip v-else :title="text">
                                    <div
                                        style="text-overflow: ellipsis;  overflow: hidden; white-space: nowrap; word-break: keep-all; ">
                                        {{ text }}
                                    </div>
                                </a-tooltip>
                            </template>

                        </my-table>


                    </a-tab-pane>
                </a-tabs>
            </a-tab-pane>

            <a-tab-pane key="12" tab="Form">
                <v-form title="Public Data" :form-items="formItems" @submit="submit" :rules="rules" :form="form">
                </v-form>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
    import { merge } from '@/utils/util' // saveToExcel
    import VForm from '@/components/page/drawform'
    import { mapState } from 'vuex'

    import { defineAsyncComponent } from 'vue'
    const i18n = require('./i18n')
    const rules = {
        id: [{ required: true, message: 'Cannot be empty', trigger: 'blur' }],
        dataparam: [{ required: true, message: 'Cannot be empty', trigger: 'blur' }],
    }

    const form = {
        id: '',
        dataparam: "{'name':'',datasource:'','api':{'':'','':''}}",
    }

    export default {
        i18n: merge(require('@/i18n'), i18n),
        components: {
            VForm,
            MyTable: defineAsyncComponent(() => import('@/components/table/index.vue'))
        },
        props: {
            ss: {
                type: Object,
                default: () => ({}),
            },
            keyid: { type: Number, default: 0 },
            tabs: { type: Array, default: () => [] },
        },

        data() {
            return {
                i18n,
                rules,
                form,
                loadcount: 0,
                //  tablist: [],
                actived: 0,

                datatype: 'phpapi',
                dataname: '公共数据',
                dataapi: '',
                dataparam: "{'name':'',datasource:'','api':{'':'','':''}}",
            }
        },
        computed: {
            tablist() {
                return this.$store.getters['tdpublic/commondata']
            },
            ...mapState('setting', ['lang', 'pageMinHeight']),
            loading() {
                return this.loadcount > 0
            },
            scroll() {
                return { x: 50, y: this.pageMinHeight - 180 }
            },
            formItems() {
                var arr = [
                    { key: 'id', type: 'select', paraKey: 'PARA.528' },
                    { key: 'dataparam', type: 'textarea' },
                ]
                return arr
            },
            drawerheight() {
                return this.pageMinHeight - 30
            },
        },
        watch: {},
        created() { },
        mounted() { },
        methods: {
            submit(value) {
                // let paras = eval("(" + value.dataparam + ")")
                value.prop = 'updateef2para'
                value.note = value.dataparam
                this.$funAxios.reqPost('APIDATE', value).then((res) => {
                    if (res.data > 0) {
                        this.$message.success('Upload Success')
                        // this.$funAxios.reqPost(paras.api, paras.params).then(res => {
                        // })
                    }
                })
            },
            change_tab(e) {
                this.datatype = this.tablist[e].datatype
                this.dataapi = this.tablist[e].dataapi
                this.dataname = this.tablist[e].dataname
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

    .cancel,
    .cancel:hover,
    .cancel:visited {
        background-color: @primary-2;
        color: white;
    }
</style>