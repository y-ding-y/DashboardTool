<template>
    <div class="action-columns" ref="tableroot">
        <a-tooltip title="列配置">
            <a-popover v-model:visible="visible" placement="bottomRight" trigger="click"
                :get-popup-container="() => $refs.tableroot">
                <template #title>
                    <div>
                        <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange"
                            class="check-all" />列展示
                        <!-- <a-button @click="resetColumns" style="float: right" type="link" size="small">重置</a-button> -->
                    </div>
                </template>
                <template #content>

                    <div :style="{height: (pageMinHeight-100) +'px',overflowY: 'scroll'}">
                        <a-list style="width: 100%; " size="small" :key="i" v-for="(col, i) in columns">
                            <a-list-item>
                                <a-checkbox v-model:checked="col.visible" @change="(e) => onCheckChange(e, col)" />

                                <template v-if="col.title"> {{ col.title }}: </template>
                                <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title"></slot>
                                <template #actions>

                                    <a-tooltip title="固定在列头" :mouseEnterDelay="0.5"
                                        :get-popup-container="() => $refs.tableroot"> 
                                        <vertical-align-top-outlined :class="['left', { active: col.fixed === 'left' }]"
                                            @click="fixColumn('left', col)" />

                                    </a-tooltip>
                                    <a-tooltip title="固定在列尾" :mouseEnterDelay="0.5">
                                        <vertical-align-bottom-outlined
                                            :class="['right', { active: col.fixed === 'right' }]"
                                            @click="fixColumn('right', col)" />
                                    </a-tooltip>
                                    <a-tooltip title="添加搜索" :mouseEnterDelay="0.5">
                                        <search-outlined :class="{ active: col.searchAble }" @click="setSearch(col)" />
                                    </a-tooltip>
                                </template>
                            </a-list-item>
                        </a-list>
                    </div>

                </template>
                <setting-outlined class="action" />
            </a-popover>
        </a-tooltip>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
    import cloneDeep from 'lodash.clonedeep'
    import { mapState } from 'vuex'

    export default {
        name: 'ActionColumns',
        props: ['columns', 'visibleColumns'],
        data() {
            return {
                visible: false,
                indeterminate: false,
                checkAll: true,
                checkedCounts: this.columns.length,
                backColumns: cloneDeep(this.columns),
                test: false
            }
        },
        watch: {
            checkedCounts(val) {
                this.checkAll = val === this.columns.length
                this.indeterminate = val > 0 && val < this.columns.length
            },
        },
        computed: {
            ...mapState('setting', ['pageMinHeight']),
        },
        created() {
            // $emit(this, 'update:visibleColumns', [...this.columns])
            for (let col of this.columns) {
                if (col.visible === undefined) {
                    col['visible'] = true
                }
                if (!col.visible) {
                    this.checkedCounts -= 1
                }
            }
        },
        methods: {
            onCheckChange(e, col) {
                if (!col.visible) {
                    this.checkedCounts -= 1
                } else {
                    this.checkedCounts += 1
                }

                $emit(this, 'update:visibleColumns', [...this.columns])
            },
            fixColumn(fixed, col) {
                if (fixed !== col.fixed) {
                    col['fixed'] = fixed
                } else {
                    col['fixed'] = undefined
                }
                $emit(this, 'update:visibleColumns', [...this.columns])
            },
            setSearch(col) {
                col['searchAble'] = !col.searchAble
                if (!col.searchAble && col.search) {
                    this.resetSearch(col)
                }
            },
            resetSearch(col) {
                // col.search.value = col.dataType === 'boolean' ? false : undefined
                col.search.value = undefined
                col.search.backup = undefined
            },
            resetColumns() {
                const { columns, backColumns } = this
                let counts = columns.length
                backColumns.forEach((back, index) => {
                    const column = columns[index]
                    column.visible = back.visible === undefined || back.visible
                    if (!column.visible) {
                        counts -= 1
                    }
                    if (back.fixed !== undefined) {
                        column.fixed = back.fixed
                    } else {
                        column['fixed'] = undefined
                    }
                    column['searchAble'] = back.searchAble
                    // column.searchAble = back.searchAble
                    this.resetSearch(column)
                })
                this.checkedCounts = counts
                this.visible = false
                $emit(this, 'reset', this.getConditions(columns))
            },
            onCheckAllChange(e) {
                if (e.target.checked) {
                    this.checkedCounts = this.columns.length
                    this.columns.forEach((col) => (col.visible = true))
                } else {
                    this.checkedCounts = 0
                    this.columns.forEach((col) => (col.visible = false))
                }
            },
            getConditions(columns) {
                const conditions = {}
                columns
                    .filter(
                        (item) =>
                            item.search.value !== undefined &&
                            item.search.value !== '' &&
                            item.search.value !== null
                    )
                    .forEach((col) => {
                        conditions[col.dataIndex] = col.search.value
                    })
                return conditions
            },
        },
        emits: ['update:visibleColumns', 'reset'],
    }
</script>

<style lang="less" scoped>
    .action-columns {
        display: inline-block;

        .check-all {
            margin-right: 8px;
        }

        .left,
        .right {
            transform: rotate(-90deg);
        }

        .active {
            color: @primary-color;
        }

    }
</style>