<template>
    <div>
        <a-table bordered :columns="columns" :components="components" :data-source="data" :key="key">
            <template v-slot:action>
                <a href="javascript:;">Delete</a>
            </template>
        </a-table>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueDraggableResizable from 'vue-draggable-resizable';
    import Sortable from 'sortablejs'
    Vue.component('vue-draggable-resizable', VueDraggableResizable);
    let columns = [
        {
            title: 'Date1',
            dataIndex: 'date',
            width: 200,
            filters: []
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: 100,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: 100,
        },
        {
            title: 'Note',
            dataIndex: 'note',
            width: 100,
        },
        {
            title: 'Action',
            key: 'action',
            scopedSlots: { customRender: 'action' },
        },
    ];
    const data = [
        {
            key: 0,
            date: '2018-02-11',
            amount: 120,
            type: 'income',
            note: 'transfer',
        },
        {
            key: 1,
            date: '2018-03-11',
            amount: 243,
            type: 'income',
            note: 'transfer',
        },
        {
            key: 2,
            date: '2018-04-11',
            amount: 98,
            type: 'income',
            note: 'transfer',
        },
    ];
 
    const draggingMap = {};
    columns.forEach(col => {
        draggingMap[col.key] = col.width;
    });
    const draggingState = Vue.observable(draggingMap);
    // 
    const ResizeableTitle = (h, props, children) => {
        let thDom = null;
        const { key, ...restProps } = props;
        const col = columns.find(col => {
            const k = col.dataIndex || col.key;
            return k === key;
        });
        if (!col.width) {
            return h('th', {
                ...restProps
            }, [
                children
            ])
        }
        const onDrag = x => {
            draggingState[key] = 0;
            col.width = Math.max(x, 1);
        };
        const onDragstop = () => {
            draggingState[key] = thDom.getBoundingClientRect().width;
        };
        return (
            h('th', {
                ...restProps,
                attrs: {
                    width: col.width,
                },
                'v-ant-ref': r => (thDom = r),
                class: 'resize-table-th'
            }, [
                children,
                h('vue-draggable-resizable', {
                    class: 'table-draggable-handle',
                    on: {
                        dragging: onDrag,
                        dragstop: onDragstop
                    },
                    key: col.key,
                    props: {
                        w: 10,
                        x: draggingState[key] || col.width,
                        z: 1000,
                        axis: 'x',
                        resizable: false,
                    }
                })
            ])
        );
    };
    export default {
        name: 'App',
        data() {
            this.components = {
                header: {
                    cell: ResizeableTitle,
                },
            };
            return {
                data,
                columns,
                key: 0
            };
        },
        mounted() {
            this.columnsDrop()
            this.getFilterOptions()
        },
        methods: {
            getFilterOptions() {
                this.columns[0].filters = [{
                    text: 'Joe',
                    value: 'Joe',
                },
                {
                    text: 'Jim',
                    value: 'Jim',
                },]
            },
            // 列拖拽的初始化~~~~
            columnsDrop() {
                const wrapperTr = document.querySelector('.ant-table-thead tr')
                this.sortable = Sortable.create(wrapperTr, {
                    animation: 180,
                    delay: 0,
                    handle: '.ant-table-header-column', //~~可进行拖拽对应的类名~~~~~~
                    onEnd: evt => {
                        const oldItem = this.columns[evt.oldIndex]
                        this.columns.splice(evt.oldIndex, 1)
                        this.columns.splice(evt.newIndex, 0, oldItem)
                        console.log(this.columns)
                        /**
                        此处是因为在拖拽后，内容排序正常，表头错乱的问题 ---强制进行了重新渲染
                        **/
                        this.key += 1;
                        this.$nextTick(() => {
                            this.columnsDrop();
                        });
                    }
                })
            }
        }
    };
</script>
<style lang="less">
    .resize-table-th {
        position: relative;

        .table-draggable-handle {
            height: 100% !important;
            bottom: 0;
            left: auto !important;
            right: -5px;
            cursor: col-resize;
            touch-action: none;
            position: absolute;
            top: 0px;
            z-index: 1;
            user-select: auto;
            width: 10px;
            transform: none !important;
        }
    }
</style>