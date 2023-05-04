<template>
    <div>
        <el-collapse accordion>
            <el-collapse-item title="Table">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="滚动">
                        <a-switch default-checked @change="handle_change" v-model:checked="prop_style.isscroll" />
                    </a-form-item>
                    <a-form-item label="數據>0顯示">
                        <a-switch default-checked @change="handle_change" v-model:checked="prop_style.datalength" />
                    </a-form-item>
                    <a-form-item label="顏色格式化">
                        <a-switch default-checked @change="handle_change" v-model:checked="prop_style.table_expand" />
                    </a-form-item>
                    <a-form-item label="格式化函數">
                        <a-input @change="handle_change" v-model:value="prop_style.expand_method"></a-input>
                    </a-form-item>
                </a-form>
            </el-collapse-item>
            <el-collapse-item title="Header Cell">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="文字颜色">
                        <el-color-picker size="small" v-model="headercell.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="文字大小">
                        <el-slider @change="handle_change" v-model="headercell.fontsize">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="背景颜色">
                        <el-color-picker size="small" v-model="headercell.backgroundcolor" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="行高">
                        <el-slider @change="handle_change" v-model="headercell.height">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <el-slider default-value="12" :max="999" @change="handle_change"
                            v-model="headercell.fontweight">
                        </el-slider>
                    </a-form-item>
                </a-form>
            </el-collapse-item>
            <el-collapse-item title="Row Cell">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="滚动速度">
                        <el-slider :min="0" :max="10" @input="handle_change" v-model="rowcell.speed">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="文字颜色">
                        <el-color-picker size="small" v-model="rowcell.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="文字大小">
                        <el-slider @change="handle_change" v-model="rowcell.fontsize">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="背景颜色">
                        <el-color-picker size="small" v-model="rowcell.backgroundcolor" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="行高">
                        <el-slider @change="handle_change" v-model="rowcell.height">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <el-slider default-value="12" :max="999" @change="handle_change" v-model="rowcell.fontweight">
                        </el-slider>
                    </a-form-item>
                </a-form>
            </el-collapse-item>
        </el-collapse>

        <a-divider>
            Column
            <el-button link size="small" @click="handle_addcolumn">新增Series</el-button>
        </a-divider>
        <el-collapse accordion>
            <el-collapse-item :title="'Column' + (index + 1)" v-for="(item, index) in columns" :key="index + 'item'">
                <template v-slot:title>
                    <i v-if="columns.length > 1" @click="handle_deletecolumn(index)" class="el-icon-remove-outline"></i>
                    &nbsp;&nbsp;&nbsp;Column {{ index + 1 }} -{{ item.label }}
                </template>
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="筛选">
                        <a-switch default-checked @change="handle_change" v-model:checked="item.isfilter" />
                    </a-form-item>
                    <a-form-item label="列名">
                        <a-input @change="handle_change" v-model:value="item.label"></a-input>
                    </a-form-item>
                    <a-form-item label="列宽">
                        <el-slider :min="10" :max="800" @change="handle_change" v-model="item.width">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="字段名">
                        <a-input @change="handle_change" v-model:value="item.prop"></a-input>
                    </a-form-item>
                    <a-form-item label="对齐">
                        <a-radio-group button-style="solid" v-model:value="item.align" @change="handle_change">
                            <a-radio-button value="left">
                                <align-left-outlined />
                            </a-radio-button>
                            <a-radio-button value="center">
                                <align-center-outlined />
                            </a-radio-button>
                            <a-radio-button value="right">
                                <align-right-outlined />
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="item.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <el-slider default-value="12" :max="999" @change="handle_change" v-model="item.fontweight">
                        </el-slider>
                    </a-form-item>
                    <a-form-item label="字体划线">
                        <a-radio-group button-style="solid" v-model:value="item.decoration" @change="handle_change">
                            <a-radio-button value="none"> 无 </a-radio-button>
                            <a-radio-button value="underline"> 下划 </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="字体间距">
                        <a-input-number v-model:value="item.spacing" :min="-30" :max="30" @change="handle_change" />
                    </a-form-item>

                    <a-form-item label="点击事件">
                        <a-switch default-checked @change="handle_change" v-model:checked="item.isevents" />
                        <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                            v-if="item.isevents" v-model:value="item.eventparams">
                        </a-textarea>
                    </a-form-item>

                    <a-form-item label="點擊跳轉">
                        <a-switch default-checked @change="handle_change" v-model:checked="item.istopage" />
                        <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                            v-if="item.istopage" v-model:value="item.topageparams">
                        </a-textarea>
                    </a-form-item>



                    <a-form-item label="组件交互">
                        <a-switch default-checked @change="handle_change" v-model:checked="item.iscomdivclick" />
                        <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                            v-if="item.iscomdivclick" v-model:value="item.comdivclickparams">
                        </a-textarea>
                    </a-form-item>

                    <a-form-item label="关键字段">
                        <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                            v-if="item.isevents || item.istopage || item.iscomdivclick" v-model:value="item.keyparams">
                        </a-textarea>
                    </a-form-item>
                </a-form>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        props: {
            prop_style: {
                type: Object,
                default: () => ({}),
            },
            keyid: { type: Number, default: 0 },
        },
        data() {
            return {
                color: '#e2e2e2',
                activeNames: ['1'],
                coltype: ['tag'],
            }
        },
        created() { },
        computed: {
            columns: {
                get: function () {
                    return this.prop_style.columns
                },
                set: function () { },
            },
            rowcell: {
                get: function () {
                    return this.prop_style.rowcell
                },
                set: function () { },
            },
            headercell: {
                get: function () {
                    return this.prop_style.headercell
                },
                set: function () { },
            },
            total_style() {
                return {
                    isscroll: this.prop_style.isscroll,
                    datalength: this.prop_style.datalength,
                    table_expand: this.prop_style.table_expand,
                    expand_method: this.prop_style.expand_method ?? "",
                    columns: this.columns,
                    rowcell: this.rowcell,
                    headercell: this.headercell,
                }
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'eltable', { style: this.total_style, key: this.keyid })
            },
            handle_addcolumn() {
                var temp = JSON.parse(JSON.stringify(this.columns[0]))
                this.columns.push(temp)
            },
            handle_deletecolumn(e) {
                this.columns.splice(e, 1)
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
        },
        emits: ['eltable'],
    }
</script>

<style lang="less" scoped>
    .paneltop {
        background-color: @primary-6;
    }
</style>