<template>
    <div style="margin: -16px">
        <a-divider>
            Series
            <el-button link size="small" @click="handle_addseries">新增Series</el-button>
        </a-divider>
        <a-collapse accordion>
            <a-collapse-panel :header="'Series' + (index + 1)" v-for="(seriesitem, index) in series"
                :key="index + 'seriesitem'">
                <template v-slot:extra>
                    <i v-if="series.length > 1" @click="handle_deleteseries(index)" class="el-icon-remove-outline"></i>
                </template>
                &nbsp;&nbsp;&nbsp;
                <div style="margin: -16px">
                    <a-collapse accordion>
                        <a-collapse-panel header="基础">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="yname">
                                    <a-input @change="handle_change" v-model:value="seriesitem.yname"></a-input>
                                </a-form-item>
                                <a-form-item label="radius">
                                    <a-slider @change="handle_change" v-model:value="seriesitem.radius">
                                    </a-slider>
                                </a-form-item>

                                <a-form-item label="Min">
                                    <a-input-number @change="handle_change" v-model:value="seriesitem.min">
                                    </a-input-number>
                                </a-form-item>
                                <a-form-item label="Max">
                                    <a-input-number @change="handle_change" v-model:value="seriesitem.max">
                                    </a-input-number>
                                </a-form-item>
                                <a-form-item label="分隔">
                                    <a-slider @change="handle_change" :max="10" v-model:value="seriesitem.splitnumber">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="起始">
                                    <a-slider @change="handle_change" :min="-180" :max="180" :step="10"
                                        v-model:value="seriesitem.startangle">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="结束">
                                    <a-slider @change="handle_change" :min="-180" :max="180" :step="10"
                                        v-model:value="seriesitem.endangle">
                                    </a-slider>
                                </a-form-item>

                                <a-form-item label="center1">
                                    <a-slider @change="handle_change" v-model:value="seriesitem.center1">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="center2">
                                    <a-slider @change="handle_change" v-model:value="seriesitem.center2">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="指针">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.pointershow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <el-color-picker size="small" v-model="seriesitem.pointercolor"
                                        @change="handle_change" show-alpha>
                                    </el-color-picker>
                                </a-form-item>
                                <a-form-item label="Length">
                                    <a-slider @change="handle_change" v-model:value="seriesitem.pointerlength">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="Width">
                                    <a-slider @change="handle_change" :max="10" v-model:value="seriesitem.pointerwidth">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="icon">
                                    <el-select v-model="seriesitem.pointericon" size="small" placeholder="请选择"
                                        @change="handle_change">
                                        <el-option v-for="item in icontype" :key="item" :value="item">
                                            <span style="float: left">{{ item }}</span>
                                        </el-option>
                                    </el-select>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="进度条">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.progressshow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <el-color-picker size="small" v-model="seriesitem.progresscolor"
                                        @change="handle_change" show-alpha>
                                    </el-color-picker>
                                </a-form-item>
                                <a-form-item label="Width">
                                    <a-slider @change="handle_change" v-model:value="seriesitem.progresswidth">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="坐标线">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.axislineshow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <div style="width: 100%">&nbsp;</div>
                                    <div v-for="colorindex in [0, 1, 2]" :key="colorindex" style="display: flex">
                                        <div style="width: 70%">
                                            <a-slider :min="0" :max="1" :step="0.1" @change="handle_change"
                                                v-model:value="seriesitem.axislinecolor[colorindex][0]">
                                            </a-slider>
                                        </div>
                                        <div style="width: 20%">
                                            <el-color-picker size="small"
                                                v-model="seriesitem.axislinecolor[colorindex][1]"
                                                @change="handle_change" show-alpha>
                                            </el-color-picker>
                                        </div>
                                    </div>
                                </a-form-item>
                                <a-form-item label="线宽">
                                    <a-slider @change="handle_change" v-model:value="seriesitem.axislinewidth">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="距离">
                                    <a-slider @change="handle_change" :min="-50" :max="50"
                                        v-model:value="seriesitem.axislinedistance">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="分隔线">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.splitlineshow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <el-color-picker size="small" v-model="seriesitem.splitlinecolor"
                                        @change="handle_change" show-alpha>
                                    </el-color-picker>
                                </a-form-item>
                                <a-form-item label="线宽">
                                    <a-slider @change="handle_change" :max="20"
                                        v-model:value="seriesitem.splitlinewidth">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="线长">
                                    <a-slider @change="handle_change" :max="50"
                                        v-model:value="seriesitem.splitlinelength">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="距离">
                                    <a-slider @change="handle_change" :min="-50" :max="50"
                                        v-model:value="seriesitem.splitlinedistance">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="刻度">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.tickshow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <el-color-picker size="small" v-model="seriesitem.tickcolor" @change="handle_change"
                                        show-alpha>
                                    </el-color-picker>
                                </a-form-item>
                                <a-form-item label="线宽">
                                    <a-slider @change="handle_change" :max="20" v-model:value="seriesitem.tickwidth">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="线长">
                                    <a-slider @change="handle_change" :max="50" v-model:value="seriesitem.ticklength">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="间隔">
                                    <a-slider @change="handle_change" :max="10" v-model:value="seriesitem.tickcount">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="距离">
                                    <a-slider @change="handle_change" :min="-50" :max="50"
                                        v-model:value="seriesitem.tickdistance">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="坐标文本">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.labelshow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <el-color-picker size="small" v-model="seriesitem.labelcolor"
                                        @change="handle_change" show-alpha>
                                    </el-color-picker>
                                </a-form-item>
                                <a-form-item label="字体大小">
                                    <a-slider @change="handle_change" :min="8" :max="50"
                                        v-model:value="seriesitem.labelfontsize">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="距离">
                                    <a-slider @change="handle_change" :min="-50" :max="50"
                                        v-model:value="seriesitem.labeldistance">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>

                        <a-collapse-panel header="数据文本">
                            <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                                <a-form-item label="显示">
                                    <a-switch default-checked @change="handle_change"
                                        v-model:checked="seriesitem.detailshow" />
                                </a-form-item>
                                <a-form-item label="颜色">
                                    <el-color-picker size="small" v-model="seriesitem.detailcolor"
                                        @change="handle_change" show-alpha>
                                    </el-color-picker>
                                </a-form-item>
                                <a-form-item label="字体大小">
                                    <a-slider @change="handle_change" :min="8" :max="50"
                                        v-model:value="seriesitem.detailfontsize">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="单位">
                                    <a-input @change="handle_change" v-model:value="seriesitem.detailformatter">
                                    </a-input>
                                </a-form-item>
                                <a-form-item label="center1">
                                    <a-slider @change="handle_change" :step="10"
                                        v-model:value="seriesitem.detailcenter1">
                                    </a-slider>
                                </a-form-item>
                                <a-form-item label="center2">
                                    <a-slider @change="handle_change" :step="10"
                                        v-model:value="seriesitem.detailcenter2">
                                    </a-slider>
                                </a-form-item>
                            </a-form>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </a-collapse-panel>

        </a-collapse>
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
                color: '#e2e2e2',
                icontype: [
                    'circle',
                    'rect',
                    'roundRect',
                    'triangle',
                    'diamond',
                    'pin',
                    'arrow',
                    'none',
                ],
            }
        },
        created() {
            //this.$emit("highchart", { style: this.total_style, key: this.keyid })
            // console.log(this.prop_style)
        },
        computed: {
            series: {
                get: function () {
                    return this.prop_style.series
                },
                set: function () { },
            },
            total_style() {
                return {
                    series: this.series,
                }
            },
        },
        methods: {
            handle_change() {
                $emit(this, 'highchart', { style: this.total_style, key: this.keyid })
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
            handle_addseries() {
                var temp = JSON.parse(JSON.stringify(this.series[0]))
                this.series.push(temp)
            },
            handle_deleteseries(e) {
                this.series.splice(e, 1)
            },
        },
        emits: ['highchart'],
    }
</script>

<style lang="less" scoped>
    .paneltop {
        background-color: @primary-6;
    }
</style>