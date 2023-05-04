<template>
    <div>
        <a-modal :title="modaltitle" :visible="visible" @cancel="handleCancel" :getContainer="getRefsAff"
            :width="listWidth" :footer="null" class="eltable">
            <div v-if="tableData.length == 0" :style="{ height:  '500px' }">
                <a-skeleton active />
            </div>
            <el-table v-else :data="tableData" :height="500" border>
                <el-table-column v-for="(col, index) in columns" :key="index" :prop="col.prop" :label="col.label"
                    :row-key="index">
                    <template v-slot="scope">
                        <div :style="{ color: col.color, fontWeight: col.fontweight }">
                            {{ scope.row[col.prop] }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </a-modal>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from './utils/gogocodeTransfer'
    import { mapState } from 'vuex'

    export default {
        props: {
            modaltitle: { type: String, default: '' },
            visible: { type: Boolean, default: false },
            params: { type: String, default: '{}' },
            extraparams: { type: Object, default: () => ({}) },
        },
        data() {
            return {
                tableData: [],
                columns: [],
                listWidth:
                    document.documentElement.clientWidth * 0.8 > 2000
                        ? 2000
                        : document.documentElement.clientWidth * 0.8,
            }
        },
        computed: {
            ...mapState('setting', ['pageMinHeight']),
        },
        watch: {
            visible() {
                if (this.visible) {
                    this.tableData = []
                    this.columns = []
                    this.handle_search()
                }
            },
        },
        methods: {
            headerclass() {
                return 'header-row'
            },
            getRefsAff() {
                return document.getElementById('fulls')
            },
            handleCancel() {
                $emit(this, 'closemodal')
            },
            handle_search() {
                let temp = eval('(' + this.params + ')')
                for (var key in temp) {
                    if (temp[key] == 'curday') {
                        temp[key] = [
                            new Date().format('Y-m-d') + ' 00:00:00',
                            new Date().format('Y-m-d') + ' 23:59:59',
                        ]
                    }
                    if (temp[key] == 'param') {
                        temp[key] = this.modaltitle
                    }
                }

                this.$funAxios
                    .reqPost(temp.api, { ...temp, ...this.$props.extraparams })
                    .then((res) => {
                        this.tableData = res.data
                        if (res.data.length > 0) {
                            for (var key in res.data[0]) {
                                this.columns.push({
                                    prop: key,
                                    label: key,
                                })
                            }
                        }
                    })
            },
        },
        emits: ['closemodal'],
    }
</script>

<style scoped>
    /* .eltable /deep/ .el-table {
        background-color: rgba(240, 249, 235, 0);
    }

    .eltable /deep/ .el-table tr {
        background-color: rgba(240, 249, 235, 0);
    }

    .eltable /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #4395c139; 
    }

    .eltable /deep/ .el-table .two-row {
        background-color: #d1ffb87e;
        color: rgb(198, 211, 133);
    }

    .eltable /deep/ .el-table .one-row {
        background-color: #ecffb831;
        color: azure;
    }

    .eltable /deep/ .el-table .header-row {
        background-color: #ecffb831;
        color: rgb(255, 234, 8);
    }

    .eltable /deep/ .ant-modal-content {
        background-color: #f0f9eb2a !important;
    }

    .eltable /deep/ .ant-modal-header {
        background-color: #f0f9eb2a !important;
        color: #f0f9eb
    }

    .eltable /deep/ .ant-modal-title {
        color: #f0f9eb
    } */
</style>