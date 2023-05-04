<template>
    <div class="vform">
        <div v-if="temp_style.length > 0"
            style=" width: 100%; padding: 5px; background-color: rgb(255, 228, 192); margin-bottom: 5px;  box-shadow: inset 0px 0px 5px rgb(209, 118, 0); ">
            <a-tag v-for="(item, index) in temp_style" :key="item.key + '-' + index" closable
                @close="delete_actions(index)" @click="handle_exitaction(item, index)" color="cyan" style="margin: 2px">
                Key: {{ item.key }}-- Title: {{ item.title }}
            </a-tag>
        </div>

        <a-button type="primary" style="width: 100%" @click="handle_addaction">
            <plus-outlined />
            添加交互
        </a-button>

        <a-form v-show="isaddaction" ref="actionForm" :model="form" layout="horizontal" :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }">
            <a-form-item label="Key" name="key">
                <a-input v-model:value="form.key"></a-input>
            </a-form-item>

            <a-form-item label="Type" name="type">
                <a-select v-model:value="form.type" style="width: 100%" @change="handle_change">
                    <a-select-option v-for="(item, index) in typelist" :key="index + 'item'" :value="item">
                        {{ item }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Title" name="title">
                <a-input v-model:value="form.title"></a-input>
            </a-form-item>

            <a-form-item label="ParaKey" name="paraKey">
                <a-input v-model:value="form.paraKey"></a-input>
            </a-form-item>

            <a-form-item label="默認值" name="defaultvalue">
                <a-input v-model:value="form.defaultvalue"></a-input>
            </a-form-item>

            <a-form-item label="Format" name="format" v-if="form.type == 'range'">
                <a-input v-model:value="form.format"></a-input>
            </a-form-item>

            <a-form-item label="mode" name="mode" v-if="form.type == 'select'">
                <a-input v-model:value="form.mode"></a-input>
            </a-form-item>

            <a-form-item label="style" name="style">
                <a-textarea v-model:value="form.style" :rows="5"></a-textarea>
            </a-form-item>

            <a-form-item label="Disabled" name="disabled">
                <a-switch @change="handle_change" v-model:checked="form.disabled" />
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
        name: 'searchform',
        props: {
            searchstyle: {
                type: Array,
                default: () => [],
            },
            keyid: { type: Number, default: 0 },
        },
        components: {
            //VFontcss
        },
        watch: {},
        data() {
            return {
                typelist: ['input', 'select', 'range', 'radio', 'textarea', 'date'],
                isaddaction: false,
                savetype: '',
                savei: 0,
                form: {
                    key: '',
                    type: 'input',
                    disabled: false,
                    title: '',
                    paraKey: '',
                    style: 'width:300px;max-width:600px',
                    format: '',
                },
            }
        },
        created() { },
        computed: {
            temp_style: {
                get: function () {
                    return this.searchstyle
                },
                set: function () { },
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'searchform', { style: this.temp_style, key: this.keyid })
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

            handle_addaction() {
                this.isaddaction = true
                this.savetype = 'add'
                this.$refs.actionForm.resetFields()
            },
            delete_actions(i) {
                this.temp_style.splice(i, 1)
                $emit(this, 'searchform', { style: this.temp_style, key: this.keyid })
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
                    let flag = 1
                    this.temp_style.some((e) => {
                        if (e.key == this.form.key) {
                            this.$message.error('Key 不能重复')
                            flag = 0
                            return true
                        }
                    })
                    if (flag == 1) this.temp_style.push({ ...this.form })
                } else if (this.savetype == 'update') {
                    this.temp_style.splice(this.savei, 1, { ...this.form })
                }
                $emit(this, 'searchform', { style: this.temp_style, key: this.keyid })
            },
            handle_cancelaction() {
                this.isaddaction = false
                this.$refs.actionForm.resetFields()
            },
        },
        emits: ['searchform'],
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