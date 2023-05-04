<template>
    <div>
        <a-collapse class="paneltop" accordion>
            <a-collapse-panel key="0">
                <template v-slot:header>
                    <span>
                        <meh-two-tone two-tone-color="#52c41a" />
                        {{ name }}-{{ keyid }}基本信息
                    </span>
                </template>
                <v-baseform :basestyle="ss" :keyid="keyid" @baseform="handle_form"></v-baseform>
            </a-collapse-panel>

            <a-collapse-panel key="2">
                <template v-slot:header>
                    <span>
                        <meh-two-tone two-tone-color="#52c41a" />
                        数据绑定
                    </span>
                </template>
                <v-dataform :datastyle="ss" :keyid="keyid" @dataform="handle_dataform" :name="name"></v-dataform>
            </a-collapse-panel>

            <a-collapse-panel key="3">
                <template v-slot:header>
                    <span>
                        <meh-two-tone two-tone-color="#52c41a" />
                        组件交互
                    </span>
                </template>
                <v-actionform :key="keyid" :action_style="ss.actions" :keyid="keyid" @actionform="handle_action"
                    :actiondivs="actiondivs">
                </v-actionform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'bg'" key="11">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        模型样式
                    </span>
                </template>
                <v-modelform :modeldetail="ss" :keyid="keyid" @modelform="handle_form" :actiondivs="actiondivs">
                </v-modelform>
            </a-collapse-panel>

            <a-collapse-panel key="12" v-if="
          [
            'text',
            'datetime',
            'search',
            'echartsbar',
            'solidgaugechart',
            'comdiv',
            'weather',
          ].includes(name)
        ">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        文字样式
                    </span>
                </template>
                <v-textform :textstyle="ss" :keyid="keyid" @baseform="handle_form"></v-textform>
            </a-collapse-panel>

            <a-collapse-panel key="13" v-if="['image', 'comdiv'].includes(name)">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        图片样式
                    </span>
                </template>

                <v-imageform :imagestyle="ss" :keyid="keyid" @imageform="handle_form">
                </v-imageform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'datetime'" key="14">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        日期时间
                    </span>
                </template>
                <v-dateform :datestyle="ss" :keyid="keyid" @dateform="handle_form"></v-dateform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'solidgaugechart'" key="15">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        仪表盘图
                    </span>
                </template>
                <v-gaugesform :keyid="keyid" :prop_style="ss.highchart" @highchart="handle_highchart">
                </v-gaugesform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'eltable'" key="16">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        Element-UI表格
                    </span>
                </template>
                <v-eltableform :keyid="keyid" :prop_style="ss.table" @eltable="handle_eltable">
                </v-eltableform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'echartsbar'" key="17">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        柱-线-饼图
                    </span>
                </template>
                <v-echartsform :keyid="keyid" :prop_style="ss.highchart" @highchart="handle_highchart">
                </v-echartsform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'elcarousel'" key="18">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        Element-UI走马灯
                    </span>
                </template>
                <v-elcarouselform :keyid="keyid" :prop_style="ss" @highchart="handle_highchart">
                </v-elcarouselform>
            </a-collapse-panel>

            <a-collapse-panel v-if="name == 'search'" key="19">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        搜索框
                    </span>
                </template>
                <v-searchform :keyid="keyid" :searchstyle="ss.searchform" @searchform="handle_searchform">
                </v-searchform>
            </a-collapse-panel>

            <!-- <a-collapse-panel v-if="name=='comdiv'" key="21">
                  <template slot="header">
                      <frown-two-tone two-tone-color="#00ff1a"/>
                      组合div
                  </template>
                  <v-comdivform :keyid="keyid" :divstyle="ss" @divform="handle_form">
                  </v-comdivform>
              </a-collapse-panel> -->

            <a-collapse-panel v-if="name == 'weather'" key="22">
                <template v-slot:header>
                    <span>
                        <frown-two-tone two-tone-color="#00ff1a" />
                        天气
                    </span>
                </template>
                <v-weatherform :keyid="keyid" :weatherstyle="ss" @weatherform="handle_form">
                </v-weatherform>
            </a-collapse-panel>

            <a-collapse-panel header="Video" v-if="name == 'videoplay'">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-upload name="file" :multiple="false" action="#" @change="handle_video" :file-list="videolist"
                        :before-upload="beforeUpload">
                        <a-button type="primary">
                            <upload-outlined /> 选择视频
                        </a-button>
                    </a-upload>
                </a-form>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
    import { defineAsyncComponent } from 'vue'
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    //import merge from 'deepmerge'
    import VBaseform from '@/components/three3D/cssform/baseform'
    import VTextform from '@/components/three3D/cssform/textform'
    import VModelform from '@/components/three3D/cssform/modelform'
    import VDataform from '@/components/three3D/cssform/dataform'
    import VDateform from '@/components/three3D/cssform/dateform'
    import VImageform from '@/components/three3D/cssform/imageform'
    import VActionform from '@/components/three3D/cssform/actionform'
    import VGaugesform from '@/components/three3D/cssform/gaguesform.vue'
    import VEltableform from '@/components/three3D/cssform/eltableform.vue'
    import VEchartsform from '@/components/three3D/cssform/echartsform.vue'

    import VElcarouselform from '@/components/three3D/cssform/elcarouselform.vue'
    //import VComdivform from '@/components/three3D/cssform/comdivform.vue'
    import VSearchform from '@/components/three3D/cssform/searchform.vue'
    import VWeatherform from '@/components/three3D/cssform/weatherform.vue'

    export default {
        props: {
            ss: {
                type: Object,
                default: () => ({}),
            },
            keyid: { type: Number, default: 0 },
            name: { type: String, default: ' as' },
            actiondivs: { type: Array, default: () => [] },
        },
        components: {
            VGaugesform,
            VEltableform,
            VEchartsform,
            VBaseform,
            VTextform,
            VModelform,
            VDataform,
            VImageform,
            VDateform,
            VActionform,
            VElcarouselform,
            VSearchform,
            VWeatherform, //VComdivform,
        },
        watch: {},
        data() {
            return {
                videolist: [],
                fileList: [],
            }
        },
        created() { },
        computed: {},
        methods: {
            handle_downmodel() { },
            beforeUpload() {
                return false
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },

            handle_video(info) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-1)
                if (info.file.size / 1024 / 1024 > 100) {
                    this.$message.error('文件大小不能超過100M')
                } else {
                    if (fileList[0].originFileObj != undefined) {
                        let formData = new FormData()
                        formData.append('file', fileList[0].originFileObj)
                        this.loadcount = 1
                        this.$funAxios.reqPost('FILE_UPLOAD', formData).then((res) => {
                            this.loadcount--
                            $emit(this, 'vcss', {
                                style: { ...this.ss, ...{ videourl: res.id } },
                                key: this.keyid,
                            })
                        })
                    }
                }
            },

            handle_highchart(e) {
                $emit(this, 'vcss', {
                    style: { ...this.ss, ...{ highchart: e.style } },
                    key: this.keyid,
                })
            },

            handle_eltable(e) {
                $emit(this, 'vcss', {
                    style: { ...this.ss, ...{ table: e.style } },
                    key: this.keyid,
                })
            },
            handle_dataform(e) {
                $emit(this, 'vcss', {
                    style: { ...this.ss, ...e.style },
                    key: this.keyid,
                })
            },
            handle_action(e) {
                $emit(this, 'vcss', {
                    style: { ...this.ss, ...{ actions: e.style } },
                    key: this.keyid,
                })
            },

            handle_form(e) {
                $emit(this, 'vcss', {
                    style: { ...this.ss, ...e.style },
                    key: this.keyid,
                })
            },
            handle_searchform(e) {
                $emit(this, 'vcss', {
                    style: { ...this.ss, searchform: [...e.style] },
                    key: this.keyid,
                })
            },
        },
        emits: ['vcss'],
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
</style>