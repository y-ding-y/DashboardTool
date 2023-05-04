<template>
    <div class="vform" :key="keyid">
        <div v-if="temp_style.length > 0" style=" width: 100%;  padding: 5px;  background-color: rgb(255, 228, 192);
        margin-bottom: 5px; box-shadow: inset 0px 0px 5px rgb(209, 118, 0); ">
            <a-tag v-for="(item, index) in temp_style" :key="item.actiontype + '-' + index" closable
                @close="delete_actions(index)" @click="handle_exitaction(item, index)" color="cyan" style="margin: 2px">
                {{ item.actiontype }}
            </a-tag>
        </div>

        <a-button type="primary" style="width: 100%" @click="handle_addaction">
            <plus-outlined />
            添加交互
        </a-button>

        <a-form v-show="isaddaction" ref="actionForm" :model="form" layout="horizontal" :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }">
            <a-form-item label="类型" name="actiontype">
                <a-select style="width: 100%" v-model:value="form.actiontype">
                    <a-select-option v-for="(item, index) in actiontypelist" :key="'actiontype' + index"
                        :value="item.value">
                        {{ item.title }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="组件" name="actionobj">
                <a-select v-model:value="form.actionobj" style="width: 100%;" mode="multiple" :maxTagCount="5"
                    allowClear>
                    <a-select-option v-for="(item,index) in divslist" :key="'actionobj'+index"
                        :value="item.name+item.keyid"> {{item.name}}-{{item.keyid}}
                    </a-select-option>
                </a-select>

                <!-- <a-tree-select :field-names="fieldNames" v-model:value="form.actionobj" show-search style="width: 100%"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
                    tree-default-expand-all :tree-data="divslist" multiple>
                </a-tree-select> -->
            </a-form-item>
            <a-form-item label="Json" name="actionstyle" v-if="[ 'click_style', 'click_phpapi', 'click_topage',
            'click_changebg', 'dblclick_topage',  ].includes(form.actiontype) ">
                <a-textarea v-model:value="form.actionstyle" :rows="5"></a-textarea>
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 8, offset: 8 }">
                <a-button-group>
                    <a-button type="link" :class="'success'" @click="handle_saveaction">
                        保存
                    </a-button>
                    <a-button :class="'cancel'" @click="handle_cancelaction">
                        取消
                    </a-button>
                </a-button-group>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'actionform',
        props: {
            action_style: {
                type: Array,
                default: () => [],
            },
            keyid: { type: Number, default: 0 },
            actiondivs: { type: Array, default: () => [] },
        },
        components: {
            //VFontcss
        },
        data() {
            return {
                actiontypelist: [
                    {
                        key: '1',
                        value: 'click_none',
                        title: '鼠标点击消失',
                    },
                    {
                        key: '2',
                        value: 'click_block',
                        title: '鼠标点击显示',
                    },
                    {
                        key: '3',
                        value: 'model_click',
                        title: '点击模型',
                    },
                    {
                        key: '4',
                        value: 'model_unclick',
                        title: '无点击模型',
                    },
                    {
                        key: '5',
                        value: 'click_style',
                        title: '点击样式',
                    },
                    {
                        key: '6',
                        value: 'click_return_name',
                        title: '点击返回名字',
                    },
                    {
                        key: '7',
                        value: 'click_phpapi',
                        title: 'API查询',
                    },
                    {
                        key: '8',
                        value: 'chose_model',
                        title: '选择模型',
                    },
                    {
                        key: '81',
                        value: 'chose_model_label',
                        title: '模型標籤',
                    },
                    {
                        key: '9',
                        value: 'click_return_binddata',
                        title: '点击返回绑定数据',
                    },
                    {
                        key: '10',
                        value: 'dblclick_topage',
                        title: '双击跳转页面',
                    },
                    {
                        key: '11',
                        value: 'click_changebg',
                        title: '切换屏幕',
                    },
                    {
                        key: '12',
                        value: 'click_handle_search',
                        title: '组件刷新',
                    },
                    {
                        key: '13',
                        value: 'click_search',
                        title: '点击查询',
                    },
                    {
                        key: '14',
                        value: 'click_fullscreen',
                        title: '点击全屏',
                    },
                    {
                        key: '15',
                        value: 'click_outfullscreen',
                        title: '退出全屏',
                    },
                    {
                        key: '16',
                        value: 'table_click_search',
                        title: '点击表格->search div',
                    },
                ],
                isaddaction: false,
                savetype: 'add',
                form: {
                    actiontype: '',
                    actionobj: [],
                    actionstyle: '',
                },

                savei: 0,
                fieldNames: { children: 'children', label: 'title', value: 'key' },
                treeExpandedKeys: [],
                value: undefined,
            }
        },
        created() { },
        computed: {
            divslist() {
                let res = []
                res = this.actiondivs.map((e) => {
                    e.title = e.name + '-' + e.keyid
                    e.key = e.name + e.keyid

                    if (e.name == 'comdiv') {
                        e.children.map((m) => {
                            m.title = m.name + '-' + m.keyid
                            m.key = m.name + m.keyid
                        })
                    }
                    return e
                })
                return res
            },
            temp_style: {
                get: function () {
                    return this.action_style
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'actionform', { style: this.temp_style, key: this.keyid })
            },

            handle_addaction() {
                this.isaddaction = true
                this.savetype = 'add'
                this.$refs.actionForm.resetFields()
            },
            delete_actions(i) {
                this.temp_style.splice(i, 1)
                $emit(this, 'actionform', { style: this.temp_style, key: this.keyid })
                this.handle_cancelaction()
            },
            handle_exitaction(e, i) {
                this.isaddaction = true
                this.savetype = 'update'
                this.savei = i
                this.$nextTick(() => {
                    this.form = { ...e }
                })
            },
            handle_saveaction() {
                this.isaddaction = false
                if (this.savetype == 'add') {
                    if (this.temp_style == undefined) {
                        this.temp_style = []
                    }
                    this.temp_style.push({ ...this.form })
                } else if (this.savetype == 'update') {
                    this.temp_style.splice(this.savei, 1, { ...this.form })
                }
                $emit(this, 'actionform', { style: this.temp_style, key: this.keyid })
            },
            handle_cancelaction() {
                this.isaddaction = false
                this.$refs.actionForm.resetFields()
            },
        },
        emits: ['actionform'],
    }
</script>

<style lang="less" scoped>
    .paneltop {
        background-color: rgb(240, 255, 205);
    }

    .success,
    .success:hover,
    .success:visited {
        background-color: @success-color;
        color: white;
    }

    .cancel,
    .cancel:hover,
    .cancel:visited {
        background-color: rgb(255, 0, 0);
        color: white;
    }

    .reset,
    .reset:hover,
    .reset:visited {
        background-color: rgb(255, 174, 0);
        color: white;
    }

    .vform :deep(.ant-form-item) {
        margin-bottom: 5px;
    }
</style>