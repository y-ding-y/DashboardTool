<template>
    <div>
        <!-- 字体大小 -->
        <a-input @change="handle_change" v-model:value="fontsize" style="width: 60px">
            <template v-slot:suffix>
                <a-icon type="font-size" />
            </template>
        </a-input>

        <!-- 字体颜色 -->
        <a-input @change="handle_change" style="width: 65px">
            <template v-slot:suffix>
                <el-color-picker size="small" v-model:value="fontcolor" @change="handle_change" show-alpha>
                </el-color-picker>
            </template>
            <!-- <template v-slot:suffix>
                <a-icon type="font-colors" />
            </template> -->
        </a-input>

        <!-- 字体粗细 -->
        <a-input @change="handle_change" v-model:value="fontweight" style="width: 65px">
            <template v-slot:suffix>
                <a-icon type="bold" />
            </template>
        </a-input>

        <!-- 边框粗细 -->
        <a-input @change="handle_change" v-model:value="borderwidth" style="width: 65px">
            <template v-slot:suffix>
                <a-icon type="radius-setting" />
            </template>
        </a-input>

        <!-- 边框颜色 -->
        <a-input @change="handle_change" style="width: 65px">
            <template v-slot:suffix>
                <el-color-picker size="small" v-model:value="bordercolor" @change="handle_change" show-alpha>
                </el-color-picker>
            </template>
            <!-- <template v-slot:suffix>
                <a-icon type="highlight" />
            </template> -->
        </a-input>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from './utils/gogocodeTransfer'
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
                fontsize: 20,
                fontfamily: 9,
                fontweight: 500,
                fontcolor: '#fff',
                borderwidth: 1,
                bordercolor: '#000',
            }
        },
        created() { },
        computed: {},
        methods: {
            handle_change() {
                console.log(this.$data)
                $emit(this, 'fontcss', {
                    fontsize: this.fontsize,
                    fontweight: this.fontweight,
                    fontcolor: this.fontcolor,
                    bordercolor: this.bordercolor,
                    borderwidth: this.borderwidth,
                })
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
        },
        emits: ['fontcss'],
    }
</script>