<template>
    <div class="standard-table">
        <div class="alert">
            <a-alert type="info" :show-icon="true" v-if="selectedRows">
                <template v-slot:message>
                    <div class="message">
                        已选择&nbsp;<a>{{ selectedRows.length }}</a>&nbsp;项 <a class="clear" @click="onClear">清空</a>
                        <template v-for="(item, index) in needTotalList">
                            <div v-if="item.needTotal">
                                {{ item.title }}总计&nbsp;
                                <a>{{
                                    item.customRender ? item.customRender(item.total) : item.total
                                    }}</a>
                            </div>
                        </template>
                    </div>
                </template>
            </a-alert>
        </div>
        <a-table :bordered="bordered" :loading="loading" :columns="columns" :dataSource="dataSource" :rowKey="rowKey"
            :pagination="pagination" :expandedRowKeys="expandedRowKeys" :expandedRowRender="expandedRowRender"
            @change="onChange" :rowSelection="
        selectedRows
          ? { selectedRowKeys: selectedRowKeys, onChange: updateSelect }
          : undefined
      ">
            <template :slot="slot" v-for="slot in Object.keys($scopedSlots).filter(
          (key) => key !== 'expandedRowRender'
        )" v-slot="text, record, index">
                <slot v-bind="{ text, record, index }" :name="slot"></slot>
            </template>
            <template :slot="slot" v-for="slot in Object.keys($slots)">
                <slot :name="slot"></slot>
            </template>
            <template :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
                v-slot="record, index, indent, expanded">
                <slot v-bind="{ record, index, indent, expanded }"
                    :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"></slot>
            </template>
        </a-table>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
    export default {
        name: 'StandardTable',
        props: {
            bordered: Boolean,
            loading: [Boolean, Object],
            columns: Array,
            dataSource: Array,
            rowKey: {
                type: [String, Function],
                default: 'key',
            },
            pagination: {
                type: [Object, Boolean],
                default: true,
            },
            selectedRows: Array,
            expandedRowKeys: Array,
            expandedRowRender: Function,
        },
        data() {
            return {
                needTotalList: [],
            }
        },
        methods: {
            updateSelect(selectedRowKeys, selectedRows) {
                $emit(this, 'update:selectedRows', selectedRows)
                $emit(this, 'selectedRowChange', selectedRowKeys, selectedRows)
            },
            initTotalList(columns) {
                const totalList = columns
                    .filter((item) => item.needTotal)
                    .map((item) => {
                        return {
                            ...item,
                            total: 0,
                        }
                    })
                return totalList
            },
            onClear() {
                this.updateSelect([], [])
                $emit(this, 'clear')
            },
            onChange(pagination, filters, sorter, { currentDataSource }) {
                $emit(this, 'change', pagination, filters, sorter, { currentDataSource })
            },
        },
        created() {
            this.needTotalList = this.initTotalList(this.columns)
        },
        watch: {
            selectedRows(selectedRows) {
                this.needTotalList = this.needTotalList.map((item) => {
                    return {
                        ...item,
                        total: selectedRows.reduce((sum, val) => {
                            return sum + val[item.dataIndex]
                        }, 0),
                    }
                })
            },
        },
        computed: {
            selectedRowKeys() {
                return this.selectedRows.map((record) => {
                    return typeof this.rowKey === 'function'
                        ? this.rowKey(record)
                        : record[this.rowKey]
                })
            },
        },
        emits: ['update:selectedRows', 'selectedRowChange', 'change', 'clear'],
    }
</script>

<style lang="less" scoped>
    .standard-table {
        .alert {
            margin-bottom: 16px;

            .message {
                a {
                    font-weight: 600;
                }
            }

            .clear {
                float: right;
            }
        }
    }
</style>