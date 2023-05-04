<template>
    <div class="vform">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="文本内容">
                <a-input v-model:value="temp_style.content" @change="handle_change" />
            </a-form-item>
            <a-form-item label="字体颜色">
                <el-color-picker size="small" v-model="temp_style.color" color="temp_style.color"
                    @change="handle_change" show-alpha>
                </el-color-picker>
            </a-form-item>
            <a-form-item label="背景颜色">
                <el-color-picker size="small" v-model="temp_style.backgroundcolor" @change="handle_change" show-alpha>
                </el-color-picker>
            </a-form-item>

            <a-form-item label="渐变">
                <a-radio-group button-style="solid" v-model:value="temp_style.gradient" @change="handle_change"
                    size="small">
                    <a-radio-button value="null"> null </a-radio-button>
                    <a-radio-button value="right">
                        <align-right-outlined />
                    </a-radio-button>
                    <a-radio-button value="top">
                        <pause-outlined />
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="字体大小">
                <a-input-number v-model:value="temp_style.fontSize" :min="10" :max="60" @change="handle_change" />
            </a-form-item>
            <a-form-item label="字体间距">
                <a-input-number v-model:value="temp_style.spacing" :min="-30" :max="30" @change="handle_change" />
            </a-form-item>
            <a-form-item label="字体粗细">
                <a-input-number v-model:value="temp_style.fontweight" :min="0" :max="1000" @change="handle_change" />
            </a-form-item>
            <a-form-item label="边框显示">
                <a-switch default-checked @change="handle_change" v-model:checked="temp_style.bordershow" />
            </a-form-item>
            <a-form-item label="边框颜色">
                <el-color-picker size="small" v-model="temp_style.bordercolor" @change="handle_change" show-alpha>
                </el-color-picker>
            </a-form-item>
            <a-form-item label="边框粗细">
                <a-slider v-model:value="temp_style.borderwidth" :min="0" :max="10" @change="handle_change" />
            </a-form-item>
            <a-form-item label="对齐">
                <a-radio-group button-style="solid" v-model:value="temp_style.textAlign" @change="handle_change"
                    size="small">
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
            <a-form-item label="字体划线">
                <a-radio-group button-style="solid" v-model:value="temp_style.decoration" @change="handle_change"
                    size="small">
                    <a-radio-button value="none"> 无 </a-radio-button>
                    <a-radio-button value="overline"> 上划 </a-radio-button>
                    <a-radio-button value="underline"> 下划 </a-radio-button>
                    <a-radio-button value="line-through"> 贯穿
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="字体倾斜">
                <a-radio-group button-style="solid" v-model:value="temp_style.fontstyle" @change="handle_change"
                    size="small">
                    <a-radio-button value="normal"> 正常 </a-radio-button>
                    <a-radio-button value="italic"> 倾斜 </a-radio-button>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'textform',
        props: {
            textstyle: {
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
            return {}
        },
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.textstyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'textform', { style: this.temp_style, key: this.keyid })
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
        emits: ['textform'],
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