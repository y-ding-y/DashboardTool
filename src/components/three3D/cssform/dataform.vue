<template>
    <div class="vform">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="绑定数据">
                <a-switch default-checked @change="handle_change" v-model:checked="temp_style.datebind" />
            </a-form-item>
            <a-form-item label="定时刷新">
                <a-switch default-checked @change="handle_change" v-model:checked="temp_style.refreshdata" />
            </a-form-item>
            <a-form-item v-if="temp_style.refreshdata" label="间隔/min">
                <a-input @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                    v-model:value="temp_style.refreshdatatime"></a-input>
            </a-form-item>

            <a-form-item v-if="['chartline', 'piechart', 'piechart3D'].includes(name)" label="Transform">
                <a-switch default-checked @change="handle_change" v-model:checked="temp_style.transform" />
            </a-form-item>

            <a-form-item v-if="  ['chartline', 'piechart', 'piechart3D'].includes(name) && temp_style.transform "
                label="Transform">
                <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                    v-model:value="temp_style.transformjson"></a-textarea>
            </a-form-item>
            <a-form-item label="数据类型">
                <a-select v-model:value="temp_style.datetype" @change="handle_change">
                    <a-select-option v-for="(item, index) in datatype" :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="数据来源">
                <a-select v-model:value="temp_style.datesource" @change="handle_change" allowClear>
                    <a-select-option v-for="(item, index) in datasource" :value="item.value">
                        {{ item.name }}
                    </a-select-option>
                </a-select>

                <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                    v-model:value="temp_style[temp_style.datesource]" :rows="5">
                </a-textarea>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'dataform',
        props: {
            datastyle: {
                type: Object,
                default: () => ({}),
            },
            keyid: { type: Number, default: 0 },
            name: { type: String, default: '' },
        },
        components: {
            //VFontcss
        },
        data() {
            return {
                datatype: ['string', 'number', 'array'],
                datasource: [
                    { value: 'phpapi', name: 'php api' },
                    { value: 'publicdata', name: '公共数据' },
                    { value: 'joincomponent', name: '关联其他组件' },
                    { value: 'text', name: '本地txt' },
                    { value: 'phpsocket', name: 'PHP Socket' },
                    { value: 'excel', name: '本地excel' },
                    { value: 'vuestore', name: ' Vue Store' },
                ],
            }
        },
        watch: {},
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.datastyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'dataform', { style: this.temp_style, key: this.keyid })
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
            hande_pushkeyenter() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
        },
        emits: ['dataform'],
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
        background-color: @primary-2;
        color: white;
    }

    .vform :deep(.ant-form-item) {
        margin-bottom: 5px;
    }
</style>