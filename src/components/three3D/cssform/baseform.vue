<template>
    <div class="vform">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="显示">
                <a-switch default-checked @change="handle_change" v-model:checked="temp_style.isshow" />
            </a-form-item>
            <a-form-item label="边框弧度">
                <a-slider @input="handle_change" v-model:value="temp_style.borderradius" />
            </a-form-item>
            <a-form-item label="进入动画">
                <a-select v-model:value="temp_style.inanimate" style="width: 100%" @change="handle_change">
                    <a-select-option value=" " title="文本">无动画</a-select-option>
                    <a-select-option v-for="(item, index) in inanimate" :key="index + 'in'" :value="item.key">
                        {{ item.value }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="退出动画">
                <a-select v-model:value="temp_style.outanimate" style="width: 100%" @change="handle_change">
                    <a-select-option value=" " title="文本">无动画</a-select-option>
                    <a-select-option v-for="(item, index) in outanimate" :key="index + 'out'" :value="item.key">
                        {{ item.value }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="距左">
                <a-slider v-model:value="temp_style.left" @change="handle_change" :min="-500" :max="2000" />
                <a-input-number size="small" v-model:value="temp_style.left" @change="handle_change" :min="-500"
                    :max="2000" />
            </a-form-item>
            <a-form-item label="距顶">
                <a-slider v-model:value="temp_style.top" @change="handle_change" :min="-500" :max="2000" />
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
    // import VFontcss from '@/components/three3D/fontcss'
    const inanimate = [
        { key: 'backInDown', value: 'Back-下' },
        { key: 'backInLeft', value: 'Back-左' },
        { key: 'backInRight', value: 'Back-右' },
        { key: 'backInUp', value: 'Back-上' },
        { key: 'fadeIn', value: '淡入' },
        { key: 'fadeInDown', value: '淡入-下' },
        { key: 'fadeInLeft', value: '淡入-左' },
        { key: 'fadeInRight', value: '淡入-右' },
        { key: 'fadeInUp', value: '淡入-上' },
        { key: 'slideInDown', value: '滑行-下' },
        { key: 'slideInLeft', value: '滑行-左' },
        { key: 'slideInRight', value: '滑行-由' },
        { key: 'slideInUp', value: '滑行-上' },
        { key: 'flipInX', value: '快速翻转-X' },
        { key: 'flipInY', value: '快速翻转-Y' },
    ]

    const outanimate = [
        { key: 'backOutDown', value: 'Back-下' },
        { key: 'backOutLeft', value: 'Back-左' },
        { key: 'backOutRight', value: 'Back-右' },
        { key: 'backOutUp', value: 'Back-上' },
        { key: 'fadeOut', value: '淡出' },
        { key: 'fadeOutDown', value: '淡出-下' },
        { key: 'fadeOutLeft', value: '淡出-左' },
        { key: 'fadeOutRight', value: '淡出-右' },
        { key: 'fadeOutUp', value: '淡出-上' },
        { key: 'slideOutDown', value: '滑行-下' },
        { key: 'slideOutLeft', value: '滑行-左' },
        { key: 'slideOutRight', value: '滑行-由' },
        { key: 'slideOutUp', value: '滑行-上' },
        { key: 'flipOutX', value: '快速翻转-X' },
        { key: 'flipOutY', value: '快速翻转-Y' },
    ]

    export default {
        name: 'baseform',
        props: {
            basestyle: {
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
                inanimate: inanimate,
                outanimate: outanimate,
            }
        },
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.basestyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'baseform', { style: this.temp_style, key: this.keyid })
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
        emits: ['baseform'],
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