<template>
    <div class="vform">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="图片">
                <a-upload :multiple="false" action="#" @change="chose_image" :file-list="fileList"
                    :before-upload="beforeUpload">
                    <a-button type="primary">
                        <upload-outlined /> 选择图片
                    </a-button>
                </a-upload>
            </a-form-item>
            <a-form-item label="旋转">
                <a-slider v-model:value="temp_style.rotate" @change="handle_change" :min="0" :max="360" />
            </a-form-item>
            <a-form-item label="翻转">
                <a-radio-group button-style="solid" v-model:value="temp_style.rotateXY" @change="handle_change"
                    size="small">
                    <a-radio-button value=""> NULL </a-radio-button>
                    <a-radio-button value="rotateX(180deg)"> X </a-radio-button>
                    <a-radio-button value="rotateY(180deg)"> Y </a-radio-button>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'iamgeform',
        props: {
            imagestyle: {
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
                fileList: [],
            }
        },
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.imagestyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'imageform', { style: this.temp_style, key: this.keyid })
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
            beforeUpload() {
                return false
            },
            chose_image(info) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-1)
                this.fileList = fileList
                const reader = new FileReader()
                reader.readAsDataURL(info.file)
                reader.onload = () => {
                    this.temp_style.url = reader.result
                    this.handle_change()
                }
            },
        },
        emits: ['imageform'],
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