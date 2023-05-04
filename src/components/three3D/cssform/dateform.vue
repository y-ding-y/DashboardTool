<template>
    <div class="vform">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="日期时间">
                <a-select v-model:value="temp_style.datetimetype" @change="handle_change">
                    <a-select-option v-for="(item, index) in datetimetype" :key="'datetime' + index"
                        :value="item.value">
                        {{ item.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'dateform',
        props: {
            datestyle: {
                type: Object,
                default: () => ({}),
            },
            keyid: { type: Number, default: 0 },
        },
        components: {
            //VFontcss
        },
        watch: {},
        data() {
            return {
                datetimetype: [
                    { label: '年月日时分秒', value: 'Y-m-d H:i:s' },
                    { label: '年月日', value: 'Y-m-d' },
                    { label: '年月日', value: 'H:i:s' },
                ],
            }
        },
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.datestyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'dateform', { style: this.temp_style, key: this.keyid })
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
        emits: ['dateform'],
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