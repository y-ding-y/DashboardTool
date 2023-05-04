<template>
    <div class="vform">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="显示">
                <a-switch default-checked @change="handle_change" v-model:checked="temp_style.isshow" />
            </a-form-item>
            <a-form-item label="边框弧度">
                <el-slider @input="handle_change" v-model="temp_style.borderradius">
                </el-slider>
            </a-form-item>
            <a-form-item label="卡片类型">
                <a-select v-model:value="temp_style.weatherlayout" style="width: 100%" @change="handle_change">
                    <a-select-option value="1" title="标准1">标准1</a-select-option>
                    <a-select-option value="2" title="标准2">标准2</a-select-option>
                    <a-select-option value="3" title="简约1">简约1</a-select-option>
                    <a-select-option value="4" title="简约2">简约2</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="距左">
                <a-input-number v-model:value="temp_style.left" @change="handle_change" :min="1" :max="2000" />
            </a-form-item>
            <a-form-item label="距顶">
                <a-input-number v-model:value="temp_style.top" @change="handle_change" :min="1" :max="2000" />
            </a-form-item>
            <a-form-item label="宽">
                <a-slider v-model:value="temp_style.width" @change="handle_change" :min="1" :max="2000" />
                <a-input-number v-model:value="temp_style.width" @change="handle_change" :min="1" :max="2000" />
            </a-form-item>
            <a-form-item label="高">
                <a-slider v-model:value="temp_style.height" @change="handle_change" :min="1" :max="1100" />
                <a-input-number v-model:value="temp_style.height" @change="handle_change" :min="1" :max="1100" />
            </a-form-item>
            <a-form-item label="z-index">
                <a-slider v-model:value="temp_style.zindex" @change="handle_change" :min="-1000" :max="1000" />
                <a-input-number v-model:value="temp_style.zindex" @change="handle_change" :min="-1000" :max="1000" />
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'baseform',
        props: {
            weatherstyle: {
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
                color: '#e2e2e2',
            }
        },
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.weatherstyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'weatherform', { style: this.temp_style, key: this.keyid })
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
        emits: ['weatherform'],
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