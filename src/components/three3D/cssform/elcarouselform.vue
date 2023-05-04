<template>
    <div>
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="图片来源">
                <a-radio-group button-style="solid" v-model:value="temp_style.imgsrc" size="small">
                    <a-radio-button value="upload"> 上传 </a-radio-button>
                    <a-radio-button value="folderid"> folderid </a-radio-button>
                </a-radio-group>
            </a-form-item>
        </a-form>

        <div v-if="temp_style.imgsrc == 'upload'">
            <a-upload :multiple="false" :action="actionapi" @change="chose_image">
                <a-button type="primary">
                    <upload-outlined /> 选择图片
                </a-button>
            </a-upload>
        </div>

        <div v-else>
            <a-input v-model:value="temp_style.folderid" @keydown="handlePushKeyword($event)"
                @keyup.enter="handle_effile">
            </a-input>
        </div>

        <div style="display: flex; flex-wrap: wrap" v-if="temp_style.imgsrc == 'upload'">
            <div v-for="(item, i) in temp_style.files" :key="i + '-' + item" style="border: 1px solid; margin: 5px">
                <transition>
                    <img :src="icons + '/file/' + item.id + '/small'" :large="icons + '/file/' + item.id + '/large'"
                        class="img" :preview="item" />
                </transition>
                <delete-outlined @click="handle_delete(i)" />

            </div>
        </div>

        <div style="display: flex; flex-wrap: wrap" v-else>
            <div v-for="(item, i) in files" :key="i + '-2' + item" style="border: 1px solid; margin: 5px">
                <transition>
                    <img :src="icons + '/file/' + item + '/small'" :large="icons + '/file/' + item + '/large'"
                        class="img" :preview="item" />
                </transition>
                <delete-outlined @click="handle_delete(i)" />
            </div>
        </div>

        <a-divider></a-divider>
        <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
            <a-form-item label="轮播间隔">
                <a-slider @change="handle_change" :min="-0" :max="10" v-model:value="temp_style.interval">
                </a-slider>
            </a-form-item>
        </a-form>
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
                fileList: [],

                files: [],
                actionapi: process.env.VUE_APP_API_BASE_URL + '/file/upload',
                imgsrc: 'upload',
                folderid: '',
            }
        },
        created() {
            if (this.temp_style.imgsrc == 'folderid') this.handle_effile()
        },
        computed: {
            temp_style: {
                get: function () {
                    return this.prop_style
                },
                set: function () { },
            },
            icons() {
                return process.env.VUE_APP_API_WEB_URL
            },
        },
        methods: {
            handle_effile() {
                this.$funAxios
                    .reqPost('EF_FILE', {
                        prop: 'getfiles',
                        folderid: this.temp_style.folderid,
                    })
                    .then((res) => {
                        this.files = res.data.map((e) => {
                            return e.id
                        })
                    })
            },
            handle_change() {
                $emit(this, 'eltable', { style: this.temp_style, key: this.keyid })
            },

            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
            handle_delete(e) {
                this.temp_style.files.splice(e, 1)
            },

            chose_image(info) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-1)
                fileList.map((file) => {
                    if (file.response) {
                        this.temp_style.files.push({
                            id: file.response.id,
                            path:
                                process.env.VUE_APP_API_WEB_URL +
                                '/modelapi/uploads/' +
                                file.response.url,
                        })
                    }
                    return file
                })
            },
        },
        emits: ['eltable'],
    }
</script>

<style lang="less" scoped>
    .img {
        width: 4rem;
        height: 4rem;
        border-radius: 0.04rem;
        margin-left: 0.3rem;
        margin-top: 0.3rem;
        object-fit: cover;
    }
</style>