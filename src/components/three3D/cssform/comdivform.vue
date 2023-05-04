<template>
    <div class="vform" :key="keyid">
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="缩放">
                <a-slider v-model:value="temp_style.transformrate" :min="-1" :max="2" :step="0.1"
                    @change="handle_change" />
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'divform',
        props: {
            divstyle: {
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
                    return this.divstyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'divform', { style: this.temp_style, key: this.keyid })
            },
        },
        emits: ['divform'],
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