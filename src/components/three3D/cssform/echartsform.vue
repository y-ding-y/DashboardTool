<template>
    <div style="margin: -16px">
        <a-divider>Charts</a-divider>
        <a-collapse accordion>
            <a-collapse-panel header="Chart">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="height">
                        <a-slider v-model:value="chart.height" @change="handle_change" />
                    </a-form-item>
                    <a-form-item label="width">
                        <a-slider v-model:value="chart.width" @change="handle_change" />
                    </a-form-item>
                    <div v-for="(item, index) in ['top', 'left']" :key="index + item">
                        <a-form-item :label="item">
                            <a-slider v-model:value="chart['spacing' + item]" @change="handle_change" />
                        </a-form-item>
                    </div>
                </a-form>
            </a-collapse-panel>
            <a-collapse-panel header="Tooltip">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="Trigger">
                        <el-select v-model="tooltip.trigger" size="small" placeholder="请选择" @change="handle_change">
                            <el-option v-for="item in triggerlist" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="边框颜色">
                        <el-color-picker size="small" v-model="tooltip.bordercolor" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="边框粗细">
                        <a-slider :min="0" :max="40" v-model:value="tooltip.borderwidth" @change="handle_change">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="tooltip.style.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体大小">
                        <a-slider :min="10" :max="60" v-model:value="tooltip.style.fontsize" @change="handle_change">
                        </a-slider>
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
            <a-collapse-panel header="Legend">
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="图例">
                        <a-switch default-checked @change="handle_change" v-model:checked="legend.enabled" />
                    </a-form-item>
                    <a-form-item label="Left">
                        <a-slider @change="handle_change" v-model:value="legend.x">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="Top">
                        <a-slider @change="handle_change" v-model:value="legend.y">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="legend.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体大小">
                        <a-slider @change="handle_change" v-model:value="legend.fontsize">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="Layout">
                        <a-radio-group button-style="solid" v-model:value="legend.layout" @change="handle_change">
                            <a-radio-button value="horizontal"> 水平 </a-radio-button>
                            <a-radio-button value="vertical"> 垂直 </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-divider>
            xAxis
            <el-button link size="small" @click="handle_addx">新增X轴</el-button>
        </a-divider>
        <a-collapse accordion>
            <a-collapse-panel :header="'xAxis' + (index + 1)" v-for="(xitem, index) in xAxis" :key="index + 'xitem'">
                <template v-slot:title>
                    <i v-if="xAxis.length > 1" @click="handle_deletex(index)" class="el-icon-remove-outline"></i>
                    &nbsp;&nbsp;&nbsp;xAxis {{ index + 1 }}
                </template>
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="显示坐标">
                        <a-switch default-checked @change="handle_change" v-model:checked="xitem.enabled" />
                    </a-form-item>
                    <a-form-item label="Tick">
                        <a-slider @change="handle_change" :max="50" v-model:value="xitem.tickcount">
                        </a-slider>
                    </a-form-item>
                    <a-divider>坐标轴名</a-divider>
                    <a-form-item label="坐标轴名">
                        <a-input @change="handle_change" v-model:value="xitem.titletext" />
                    </a-form-item>
                    <a-form-item label="对齐">
                        <el-radio-group @change="handle_change" v-model="xitem.titlealign" size="small">
                            <el-radio-button label="start"></el-radio-button>
                            <el-radio-button label="center"></el-radio-button>
                            <el-radio-button label="end"></el-radio-button>
                        </el-radio-group>
                    </a-form-item>
                    <a-form-item label="字体大小">
                        <a-slider @change="handle_change" v-model:value="xitem.namefontsize">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="xitem.namecolor" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <a-slider :min="0" :max="999" @change="handle_change" v-model:value="xitem.namefontweight">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体边框">
                        <a-slider :min="0" :max="30" @change="handle_change" v-model:value="xitem.nameborderwidth">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="边框颜色">
                        <el-color-picker size="small" v-model="xitem.namebordercolor" @change="handle_change">
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="旋转">
                        <a-slider :min="0" :max="360" v-model:value="xitem.rotation" :step="10" @change="handle_change">
                        </a-slider>
                    </a-form-item>
                    <a-divider>Split Line</a-divider>
                    <a-form-item label="显示">
                        <a-switch default-checked @change="handle_change" v-model:checked="xitem.splitline.show" />
                    </a-form-item>
                    <a-form-item label="类型">
                        <el-select v-model="xitem.splitline.type" size="small" placeholder="请选择"
                            @change="handle_change">
                            <el-option v-for="item in dashStyles" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="颜色">
                        <el-color-picker size="small" v-model="xitem.splitline.color" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="粗细">
                        <a-slider :min="0" :max="10" @change="handle_change" v-model:value="xitem.splitline.width">
                        </a-slider>
                    </a-form-item>
                    <a-divider>xAxis Label</a-divider>
                    <a-form-item label="字体大小">
                        <a-slider @change="handle_change" v-model:value="xitem.labels.style.fontsize">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="xitem.labels.style.color" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="竖排">
                        <a-switch default-checked @change="handle_change" v-model:checked="xitem.labels.style.shupai" />
                    </a-form-item>
                    <a-form-item label="旋转">
                        <a-slider :min="-180" :max="180" v-model:value="xitem.labels.style.rotate" :step="10"
                            @change="handle_change">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="Margin">
                        <a-slider :min="-20" :max="20" v-model:value="xitem.labels.style.margin"
                            @change="handle_change">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="对齐">
                        <el-radio-group @change="handle_change" v-model="xitem.labels.style.align" size="small">
                            <el-radio-button label="left"></el-radio-button>
                            <el-radio-button label="center"></el-radio-button>
                            <el-radio-button label="right"></el-radio-button>
                        </el-radio-group>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <a-slider :min="0" :max="999" @change="handle_change"
                            v-model:value="xitem.labels.style.fontweight">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体边框">
                        <a-slider :min="0" :max="30" @change="handle_change" v-model:value="xitem.labels.style.border">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="边框颜色">
                        <el-color-picker size="small" v-model="xitem.labels.style.bordercolor" @change="handle_change">
                        </el-color-picker>
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-divider>
            yAxis<el-button link size="small" @click="handle_addy">新增Y轴</el-button>
        </a-divider>
        <a-collapse accordion>
            <a-collapse-panel :header="'yAxis' + (index + 1)" v-for="(yitem, index) in yAxis" :key="index + 'yitem'">
                <template v-slot:title>
                    <i v-if="yAxis.length > 1" @click="handle_deletey(index)" class="el-icon-remove-outline"></i>
                    &nbsp;&nbsp;&nbsp;yAxis {{ index + 1 }}
                </template>
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="显示坐标">
                        <a-switch default-checked @change="handle_change" v-model:checked="yitem.enabled" />
                    </a-form-item>
                    <a-form-item label="Tick">
                        <a-slider @change="handle_change" :max="50" v-model:value="yitem.tickcount">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="Min">
                        <a-input-number @change="handle_change" v-model:value="yitem.min" />
                    </a-form-item>
                    <a-form-item label="Max">
                        <a-input-number @change="handle_change" v-model:value="yitem.max" />
                    </a-form-item>
                    <a-divider>坐标轴名</a-divider>
                    <a-form-item label="坐标轴名">
                        <a-input @change="handle_change" v-model:value="yitem.titletext" />
                    </a-form-item>
                    <a-form-item label="对齐">
                        <el-radio-group @change="handle_change" v-model="yitem.titlealign" size="small">
                            <el-radio-button label="start"></el-radio-button>
                            <el-radio-button label="center"></el-radio-button>
                            <el-radio-button label="end"></el-radio-button>
                        </el-radio-group>
                    </a-form-item>
                    <a-form-item label="字体大小">
                        <a-slider @change="handle_change" v-model:value="yitem.namefontsize">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="yitem.namecolor" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <a-slider :min="0" :max="999" @change="handle_change" v-model:value="yitem.namefontweight">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体边框">
                        <a-slider :min="0" :max="30" @change="handle_change" v-model:value="yitem.nameborderwidth">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="边框颜色">
                        <el-color-picker size="small" v-model="yitem.namebordercolor" @change="handle_change">
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="旋转">
                        <a-slider :min="0" :max="360" v-model:value="yitem.rotation" :step="10" @change="handle_change">
                        </a-slider>
                    </a-form-item>
                    <a-divider>Split Line</a-divider>
                    <a-form-item label="显示">
                        <a-switch default-checked @change="handle_change" v-model:checked="yitem.splitline.show" />
                    </a-form-item>
                    <a-form-item label="类型">
                        <el-select v-model="yitem.splitline.type" size="small" placeholder="请选择"
                            @change="handle_change">
                            <el-option v-for="item in dashStyles" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="颜色">
                        <el-color-picker size="small" v-model="yitem.splitline.color" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="粗细">
                        <a-slider :min="0" :max="10" @change="handle_change" v-model:value="yitem.splitline.width">
                        </a-slider>
                    </a-form-item>
                    <a-divider>yAxis Label</a-divider>
                    <a-form-item label="字体大小">
                        <a-slider @change="handle_change" v-model:value="yitem.labels.style.fontsize">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="yitem.labels.style.color" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <a-slider :min="0" :max="999" @change="handle_change"
                            v-model:value="yitem.labels.style.fontweight">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体边框">
                        <a-slider :min="0" :max="30" @change="handle_change" v-model:value="yitem.labels.style.border">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="边框颜色">
                        <el-color-picker size="small" v-model="yitem.labels.style.bordercolor" @change="handle_change">
                        </el-color-picker>
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
        </a-collapse>

        <a-divider>
            Series
            <el-button link size="small" @click="handle_addseries">新增Series</el-button>
        </a-divider>
        <a-collapse accordion>
            <a-collapse-panel :header="'Series' + (index + 1 + '-' + seriesitem.yname)"
                v-for="(seriesitem, index) in series" :key="index + 'seriesitem'">
                <template v-slot:extra>
                    <i v-if="series.length > 1" @click="handle_deleteseries(index)" class="el-icon-remove-outline"></i>
                </template>
                &nbsp;&nbsp;&nbsp;
                <a-form layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
                    <a-form-item label="Type">
                        <el-select v-model="seriesitem.type" size="small" placeholder="请选择" @change="handle_change">
                            <el-option v-for="item in seriestype" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="面积图">
                        <a-textarea :rows="4" v-model:value="seriesitem.areastyle" @keydown="handlePushKeyword($event)"
                            @keyup.enter="handle_change"></a-textarea>
                    </a-form-item>
                    <a-form-item label="xname">
                        <a-input @change="handle_change" v-model:value="seriesitem.xname"></a-input>
                    </a-form-item>
                    <a-form-item label="yname">
                        <a-input @change="handle_change" v-model:value="seriesitem.yname"></a-input>
                    </a-form-item>
                    <div v-if="seriesitem.type == 'pie'">
                        <a-form-item label="内半径">
                            <a-slider @change="handle_change" v-model:value="seriesitem.radius1">
                            </a-slider>
                        </a-form-item>
                        <a-form-item label="外半径">
                            <a-slider @change="handle_change" v-model:value="seriesitem.radius2">
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
                    </div>
                    <div v-else>
                        <a-form-item label="堆叠">
                            <a-input @change="handle_change" v-model:value="seriesitem.stack"></a-input>
                        </a-form-item>
                    </div>

                    <a-form-item label="x轴">
                        <el-select v-model="seriesitem.xAxis" size="small" placeholder="请选择">
                            <el-option v-for="(m, i) in xAxis" :key="i" :value="i" :label="'xAxis' + (i + 1)">
                                <span style="float: left"> xAxis {{ i + 1 }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="y轴">
                        <el-select v-model="seriesitem.yAxis" size="small" placeholder="请选择">
                            <el-option v-for="(m, i) in yAxis" :key="i" :value="i" :label="'yAxis' + (i + 1)">
                                <span style="float: left"> yAxis {{ i + 1 }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="series颜色">
                        <el-color-picker size="small" v-model="seriesitem.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="阶梯点">
                        <el-select v-model="seriesitem.step" size="small" placeholder="请选择" @change="handle_change">
                            <el-option value="false"> </el-option>
                            <el-option value="start"> </el-option>
                            <el-option value="middle"> </el-option>
                            <el-option value="end"> </el-option>
                        </el-select>
                    </a-form-item>
                    <a-divider>Series Label</a-divider>
                    <a-form-item label="显示文本">
                        <a-switch default-checked @change="handle_change" v-model:checked="seriesitem.enabled" />
                    </a-form-item>
                    <a-form-item label="文本内容">
                        <a-input @change="handle_change" v-model:value="seriesitem.format"></a-input>
                    </a-form-item>
                    <a-form-item label="Position">
                        <el-select v-model="seriesitem.position" size="small" placeholder="请选择" @change="handle_change">
                            <el-option v-for="item in labelposition" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="字体大小">
                        <a-slider @change="handle_change" v-model:value="seriesitem.labelfontsize">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体颜色">
                        <el-color-picker size="small" v-model="seriesitem.labelcolor" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="字体粗细">
                        <a-slider :min="0" :max="999" @change="handle_change"
                            v-model:value="seriesitem.labelfontweight">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="字体边框">
                        <a-slider :min="0" :max="30" @change="handle_change" v-model:value="seriesitem.labelborder">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="边框颜色">
                        <el-color-picker size="small" v-model="seriesitem.labelbordercolor" @change="handle_change">
                        </el-color-picker>
                    </a-form-item>
                    <a-divider>Pie Style</a-divider>
                    <a-form-item label="显示引导线">
                        <a-switch default-checked @change="handle_change" v-model:checked="seriesitem.lablelineshow" />
                    </a-form-item>
                    <a-form-item label="类型">
                        <el-select v-model="seriesitem.lablelinetype" size="small" placeholder="请选择"
                            @change="handle_change">
                            <el-option v-for="item in dashStyles" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>
                    </a-form-item>
                    <a-form-item label="颜色">
                        <el-color-picker size="small" v-model="seriesitem.lablelinecolor" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-item>
                    <a-form-item label="Length">
                        <a-slider :min="0" :max="50" @change="handle_change" v-model:value="seriesitem.lablelinelength">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="Length2">
                        <a-slider :min="0" :max="50" @change="handle_change"
                            v-model:value="seriesitem.lablelinelength2">
                        </a-slider>
                    </a-form-item>
                    <a-form-item label="粗细">
                        <a-slider :min="0" :max="10" @change="handle_change" v-model:value="seriesitem.lablelinewidth">
                        </a-slider>
                    </a-form-item>
                    <a-divider>Events</a-divider>
                    <a-form-item label="Events">
                        <el-select v-model="seriesitem.event" size="small" placeholder="请选择">
                            <el-option v-for="item in seriesevent" :key="item" :value="item">
                                <span style="float: left">{{ item }}</span>
                            </el-option>
                        </el-select>

                        <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                            v-if="seriesitem.event == 'showdetail'" v-model:value="seriesitem.eventparams" :rows="5">
                        </a-textarea>
                        <a-textarea @keydown="handlePushKeyword($event)" @keyup.enter="handle_change" v-if="
                seriesitem.event == 'topage' ||
                seriesitem.event == 'toontherpage'
              " v-model:value="seriesitem.eventparams" :rows="5">
                        </a-textarea>
                    </a-form-item>
                </a-form>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    export default {
        name: 'cssformecharts',
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
                activeNames: ['1'],
                triggerlist: ['none', 'axis', 'item'],
                dashStyles: ['solid', 'dotted', 'dashed'],
                seriestype: ['bar', 'line', 'pie', 'area'],
                seriesevent: ['showdetail', 'topage', 'toontherpage'],
                labelposition: [
                    'top',
                    'left',
                    'right',
                    'bottom',
                    'inside',
                    'insideLeft',
                    'insideRight',
                    'insideTop',
                    'insideBottom',
                    'insideTopLeft',
                    'insideBottomLeft',
                    'insideTopRight',
                    'insideBottomRight',
                    'outside',
                    'center',
                ],
            }
        },
        created() { },
        computed: {
            chart: {
                get: function () {
                    return this.prop_style.chart
                },
                set: function () { },
            },
            tooltip: {
                get: function () {
                    return this.prop_style.tooltip
                },
                set: function () { },
            },
            xAxis: {
                get: function () {
                    return this.prop_style.xAxis
                },
                set: function () { },
            },
            yAxis: {
                get: function () {
                    return this.prop_style.yAxis
                },
                set: function () { },
            },
            series: {
                get: function () {
                    return this.prop_style.series
                },
                set: function () { },
            },
            legend: {
                get: function () {
                    return this.prop_style.legend
                },
                set: function () { },
            },
            pane: {
                get: function () {
                    return this.prop_style.pane
                },
                set: function () { },
            },
            total_style() {
                return {
                    chart: this.chart,
                    tooltip: this.tooltip,
                    xAxis: this.xAxis,
                    yAxis: this.yAxis,
                    series: this.series,
                    legend: this.legend,
                    pane: this.pane,
                }
            },
        },
        methods: {
            formatTooltip(val) {
                return val / 10
            },
            handle_change() {
                $emit(this, 'highchart', { style: this.total_style, key: this.keyid })
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
            handle_addx() {
                var temp = JSON.parse(JSON.stringify(this.xAxis[0]))
                this.xAxis.push(temp)
            },
            handle_deletex(e) {
                this.xAxis.splice(e, 1)
            },
            handle_addy() {
                var temp = JSON.parse(JSON.stringify(this.yAxis[0]))
                this.yAxis.push(temp)
            },
            handle_deletey(e) {
                this.yAxis.splice(e, 1)
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