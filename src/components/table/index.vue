<template>
    <div>
        <a-table ref="table" v-if="visibleColumns.length>0" :id="id" class="basebg" :columns="visibleColumns"
            :rowKey="(record) => record.id" :data-source="dataSource" :pagination="pagination" :size="size" bordered
            :scroll="setScroll" :rowClassName="rowClassName" :loading="loading" :customRow="customRow"
            :childrenColumnName="childrenColumnName">
            <template v-if="istitle" #title>
                <slot name="title">Header</slot>
            </template>

            <template v-if="isfooter" #footer>
                <slot name="footer">Footer</slot>
            </template>

            <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
                <slot name="customFilterDropdown" :setSelectedKeys="setSelectedKeys" :selectedKeys="selectedKeys"
                    :confirm="confirm" :clearFilters="clearFilters" :column="column">
                </slot>
            </template>

            <template #customFilterIcon="{ filtered }">
                <slot name="customFilterIcon" :filtered="filtered"></slot>
            </template>

            <template #headerCell="{ title,column }">
                <template v-for="item in columns">

                    <template v-if="(item.children && item.children.length>0)">
                        <template v-for="child_item in item.children">
                            <template v-if="column.key === child_item.key  ">
                                <slot :name="'header_'+child_item.key">
                                    <span v-if="child_item.key=='no'">{{$t('no')}}</span>
                                    <span v-else>{{title || child_item.name}}</span>
                                </slot>
                            </template>
                        </template>
                    </template>

                    <template v-if=" column.key === item.key">
                        <slot :name="'header_'+item.key" :column="column" :title="title">
                            <span v-if="item.key=='no'">{{$t('no')}}</span>
                            <span v-else>{{title || column.name}}</span>
                        </slot>


                    </template>


                </template>
            </template>


            <template #bodyCell="{ column, record,index,text }">
                <template v-for="item in columns">

                    <template v-if="(item.children && item.children.length>0)">
                        <template v-for="child_item in item.children">
                            <template v-if="column.key === child_item.key  ">
                                <slot :name="child_item.key" :column="column" :record="record" :index="index"
                                    :text="text">
                                    <span v-if="child_item.key=='no'">{{index+1}}</span>

                                    <a-tooltip v-else-if="child_item.tooltip" :title="text">
                                        <div
                                            style="text-overflow: ellipsis;overflow: hidden ;white-space: nowrap; word-break: keep-all;">
                                            {{text}}
                                        </div>
                                    </a-tooltip>
                                    <span v-else>{{text}}</span>
                                </slot>
                            </template>
                        </template>
                    </template>


                    <template v-if="column.key === item.key">
                        <slot :name="item.key" :column="column" :record="record" :index="index" :text="text">
                            <span v-if="item.key=='no'">{{index+1}}</span>

                            <a-tooltip v-else-if="item.tooltip" :title="text">
                                <div
                                    style="text-overflow: ellipsis;overflow: hidden ;white-space: nowrap; word-break: keep-all;">
                                    {{text}}
                                </div>
                            </a-tooltip>
                            <span v-else>{{text}}</span>

                        </slot>
                    </template>
                </template>

                <template v-if="column.key=='action'">

                    <!-- 查看，删除，修改 -->
                    <slot v-if="column.actions &&column.actions.includes('add')" name="add">
                        <a-button type="link" size="small" style="color: rgb(0, 255, 0);">
                            <plus-outlined />
                        </a-button>
                    </slot>
                    <!-- @click="Add( record,index)" -->
                    <slot v-if="column.actions &&column.actions.includes('edit')" name="edit">
                        <a-button type="link" size="small" style="color: orange;" @click="Edit( record,index)">
                            <edit-outlined />
                        </a-button>
                    </slot>

                    <slot v-if="column.actions &&column.actions.includes('delete')" name="delete">
                        <a-popconfirm title="Are you sure delete?" ok-text="Yes" cancel-text="No"
                            @confirm="Delete( record,index)">
                            <a-button type="link" size="small" @click="click_delete( record,index)">
                                <delete-outlined />
                            </a-button>
                        </a-popconfirm>
                    </slot>

                    <slot v-if="column.actions &&column.actions.includes('drag')" name="drag">
                        <a-button type="link" size="small" style="color: rgb(0, 140, 255);cursor:move"
                            @mouseenter="drag_mousedown">
                            <drag-outlined />
                        </a-button>
                    </slot>

                    <slot name="action_back" :column="column" :record="record" :index="index" :text="text">{{text}}
                    </slot> <!-- 默認插槽在前，後面新增方法按鈕插槽 -->
                </template>


            </template>
        </a-table>

        <drawer-form :form-loading="formLoading" :visible="visible" @closeDrawer="close" :width="drawerWidth"
            :rule="rule" v-model:form="formSet" :form-item="formItem" @action="action" @checkmethod="checkmethod"
            :drawer-title="drawerTitle ||  $t(actiontype)" @change="handle_change">
        </drawer-form>

    </div>
</template>


<script>
    import { mapState } from 'vuex'
    import { merge } from '@/utils/util'
    import { defineAsyncComponent, defineProps } from 'vue'
    // import drawerForm from './drawerForm2.vue'

    const column = [{ name: 'Name', dataIndex: 'name', key: 'name', },
    { title: 'Address', dataIndex: 'address', key: 'address', },];

    const data = [{ key: '1', name: 'John Brown', address: 'New York No. 1 Lake Park', }];

    export default {
        components: {
            drawerForm: defineAsyncComponent(() => import('./drawerForm.vue')),
        },
        // components: {
        //     drawerForm
        // },
        props: {
            id: String,
            tableData: { type: Array, default: () => (data) },
            columns: { type: Array, default: () => (column) },
            scroll: { type: Object, default: () => null },
            istitle: { type: Boolean, default: false }, //显示页头
            isfooter: { type: Boolean, default: false },//显示页脚
            size: { type: String, default: 'middle' }, //表格尺寸
            drawerWidth: { type: Number, default: 0 }, //抽屉宽度
            drawerTitle: { type: String, default: null },
            form: { type: Object, default: () => ({}) },
            rule: { type: Object, default: () => ({}) },
            formItem: { type: Array, default: () => ([]) },
            openAction: { type: Boolean, default: false },//提交事件
            rowClassName: Function,
            loading: { type: Boolean, default: false },
            pagination: { type: [Boolean, Object], default: false },
            childrenColumnName: { type: String, default: 'children' },
            parentId: { type: String, default: "pid" },
            formLoading: { type: Boolean, default: false, }
        },
        emits: ['add', 'delete', 'edit', 'action', 'update:openAction', 'update:loading', 'checkmethod', 'change', 'customRow_dbclick'],
        i18n: merge(require('@/i18n'), require('./i18n')),
        data() {
            return {
                data, column,
                visible: false,
                actiontype: "add",
                temp_form: {},
                state: {
                    list: [
                        { name: "www.itxst.com", id: 0 },
                        { name: "www.baidu.com", id: 1 },
                        { name: "www.google.com", id: 2 },
                    ],
                },
                sourceindex: -1,
                isdrag: false,
                // keyi: 0
                formSet: { ...this.$props.form },

            };
        },
        created() {


        },
        mounted() {

        },
        computed: {
            actions_drag() {
                return this.columns.filter(item => { return item.actions && item.actions.includes('drag') }).length > 0
            },
            ...mapState('setting', ['pageMinHeight']),
            dataSource() {
                return this.tableData
            },
            setScroll() {
                if (this.$props.scroll == null)
                    return { x: this.column.length * 140 + 840, y: this.pageMinHeight - 200 }
                else
                    return this.$props.scroll
            },
            // formSet: {
            //     get: function () {
            //         if (this.actiontype == 'edit') {
            //             return { ...this.$props.form, ...this.temp_form }
            //         }
            //         else {
            //             return this.$props.form
            //         }
            //     },
            //     set: function () { },
            // },
            visibleColumns() {
                for (let col of this.columns) {
                    if (col.visible === undefined) {
                        col['visible'] = true
                    }
                }
                return this.columns.filter((col) => col.visible)
            },
        },
        watch: {
            form: {
                handler(newval, oldval) {
                    if (this.actiontype == "add")
                        this.formSet = { ...newval }
                    // if (this.actiontype == "edit")
                    //     this.formSet = { ...this.newval, ...this.temp_form }
                },
                deep: true

            },
        },
        methods: {
            Add() {
                this.actiontype = "add"
                this.$nextTick(() => {
                    this.formSet = { ...this.$props.form }
                    this.visible = true
                })
                // this.keyi++
            },
            Edit(record, index) {
                this.actiontype = "edit"
                this.$emit("edit", record)
                // this.keyi++
                this.$nextTick(() => {
                    this.temp_form = { ...record, index: index }
                    this.formSet = { ...this.$props.form, ...this.temp_form }
                    this.visible = true
                })

            },
            click_delete(record, index) {
                this.$emit("delete", { ...record, index: index })
                this.actiontype = "delete"
            },
            Delete(record, index) {
                if (this.$props.openAction) {
                    if (this.form.baseUrl) {
                        this.$emit('update:loading', true)
                        this.$funAxios.reqPost(this.form.baseUrl, this.form).then(result => {
                            this.$message.success("Delete Success")
                            this.$emit('action', { result: result.data, ...record, index: index, actiontype: this.actiontype })
                            this.$emit('update:openAction', false)
                            this.$emit('update:loading', false)
                        })
                            .catch(error => {
                                console.log(error)
                                this.$message.error("Delete Error")
                            })
                    }
                    else
                        this.$message.error("No BaseUrl")
                }
                else {
                    this.$emit("action", { ...record, index: index, actiontype: this.actiontype })
                }
            },
            close(e) {
                this.visible = false
            },
            action(e) {
                this.visible = false
                if (this.$props.openAction) {
                    if (e.baseUrl) {
                        this.$emit('update:loading', true)
                        this.$funAxios.reqPost(e.baseUrl, { ...e }).then(result => {
                            this.$message.success(this.$t(this.actiontype) + " Success")
                            this.$emit('action', { result: result.data, ...e, actiontype: this.actiontype })
                            this.$emit('update:openAction', false)
                            this.$emit('update:loading', false)
                        })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                    else {
                        this.$message.error("No BaseUrl")
                    }
                }
                else {
                    this.$emit("action", { ...e, actiontype: this.actiontype })
                }
            },
            checkmethod(e) {
                this.$emit("checkmethod", e)
            },
            handle_change(e) {
                this.$emit("change", e)
            },
            drag_mousedown(event) {
                this.isdrag = true
            },
            findRoute(tree, id) {
                let item = tree.find((e) => e.id == id) ?? null
                if (!item) {
                    tree.forEach((e) => {
                        if (!item && e.children) {
                            const i = this.findRoute(e.children, id)
                            if (i) {
                                item = i
                                return item
                            }
                        }
                    })
                }
                return item
            },
            customRow(record, index) {
                var actions = {
                    ondblclick: (event) => {
                        this.$emit('customRow_dbclick', { ...record, index: index })
                        // this.onEdit(rec)
                        // this.lineIndex = rec.id
                    },
                }
                if (this.actions_drag)
                    return {
                        ...actions,
                        onMouseenter: (event) => {
                            var ev = event || window.event;
                            ev.target.draggable = true;
                        },
                        // 开始拖拽
                        onDragstart: (event) => {
                            if (this.isdrag) {
                                // 兼容IE
                                var ev = event || window.event;
                                // 阻止冒泡
                                ev.stopPropagation();
                                // 得到源目标数据
                                this.sourceObj = record;
                                this.sourceindex = index
                            }
                        },
                        // 拖动元素经过的元素
                        onDragover: (event) => {
                            if (this.isdrag) {
                                var ev = event || window.event;
                                ev.preventDefault();
                            }
                        },
                        // 鼠标松开
                        onDrop: (event) => {
                            // 兼容IE
                            var ev = event || window.event;
                            // 阻止冒泡
                            ev.stopPropagation();
                            // 得到目标数据
                            if (this.isdrag && index != this.sourceindex) {
                                this.targetObj = record;
                                if (this.childrenColumnName.trim() != '' && this.targetObj[this.parentId]) {
                                    if (this.targetObj[this.parentId] != this.sourceObj[this.parentId]) {
                                        this.$message.warning("Different Parent ID")
                                    }
                                    else {
                                        let item = this.findRoute(this.dataSource, this.targetObj[this.parentId])

                                        var s1 = 0
                                        var s2 = 0
                                        const tempDta = item.children
                                        tempDta.forEach((m, i) => {
                                            if (this.sourceObj.id == m.id) {
                                                s1 = i
                                            }
                                            if (this.targetObj.id == m.id) {
                                                s2 = i
                                            }
                                        });
                                        tempDta.splice(s1, 1)
                                        tempDta.splice(s2, -1, this.sourceObj)


                                        this.$emit('action', { table: tempDta, actiontype: "drag" })
                                        this.sourceindex = -1
                                        this.isdrag = false
                                    }
                                }
                                else {
                                    const tempDta = this.dataSource
                                    tempDta.splice(this.sourceindex, 1)
                                    tempDta.splice(index, -1, this.sourceObj)


                                    this.$emit('action', { table: tempDta, actiontype: "drag" })
                                    this.sourceindex = -1
                                    this.isdrag = false
                                }
                            }
                        },
                    };
                else {
                    return { ...actions }
                }
            }
        }
    }  
</script>


<style scoped>
    .itxst {
        width: 600px;
        display: flex;
    }

    .itxst>div:nth-of-type(1) {
        flex: 1;
    }

    .itxst>div:nth-of-type(2) {
        width: 270px;
        padding-left: 20px;
    }

    .item {
        border: solid 1px #eee;
        padding: 6px 10px;
        text-align: left;
    }

    .item:hover {
        cursor: move;
    }

    .item+.item {
        margin-top: 10px;
    }

    .ghost {
        border: solid 1px rgb(19, 41, 239);
    }

    .chosenClass {
        background-color: #f1f1f1;
    }
</style>