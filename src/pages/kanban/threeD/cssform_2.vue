<template>
    <div>
        <a-collapse class="paneltop" accordion>
            <a-collapse-panel key="0" :header="name+'-'+keyid+'基本信息'">
                <div>
                    <v-baseform :basestyle="basestyle" :keyid="keyid" @baseform="handle_baseform"></v-baseform>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="1" :header="name+'-'+keyid+'基本信息'">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="名称">
                        <a-input v-model="name" disabled />
                    </a-form-model-item>
                    <a-form-model-item label="显示">
                        <a-switch default-checked @change="handle_change" v-model="temp_ss.isshow" />
                    </a-form-model-item>
                    <a-form-model-item label="颜色">
                        <el-color-picker size="mini" v-model="temp_ss.color" @change="handle_change" show-alpha>
                        </el-color-picker>
                    </a-form-model-item>
                    <a-form-model-item label="背景颜色">
                        <el-color-picker size="mini" v-model="temp_ss.backgroundcolor" @change="handle_change"
                            show-alpha>
                        </el-color-picker>
                    </a-form-model-item>
                    <a-form-model-item label="边框弧度">
                        <el-slider @input="handle_change" v-model="temp_ss.borderradius">
                        </el-slider>
                    </a-form-model-item>
                    <a-form-model-item label="图片">
                        <a-upload name="file" :multiple="false" action="#" @change="handleChange" :file-list="fileList"
                            :before-upload="beforeUpload">
                            <a-button type="primary">
                                <a-icon type="upload" /> 选择图片
                            </a-button>
                        </a-upload>
                    </a-form-model-item>
                    <a-form-model-item label="进入动画">
                        <a-select v-model="temp_ss.inanimate" style="width: 100%;" @change="handle_change">
                            <a-select-option value=" " title="文本">无动画</a-select-option>
                            <a-select-option value="backInLeft" title="文本">从左进入</a-select-option>
                            <a-select-option value="backInRight" title="文本">从右进入</a-select-option>
                            <a-select-option value="backInUp" title="文本">从下进入</a-select-option>
                            <a-select-option value="backInDown" title="文本">从上进入</a-select-option>
                            <a-select-option value="fadeIn" title="文本">淡入</a-select-option>
                            <a-select-option value="fadeInUp" title="文本">从下淡入</a-select-option>

                            <!-- <a-select-option value="object" title="对象"> 对象</a-select-option> -->
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="退出动画">
                        <a-select v-model="temp_ss.outanimate" style="width: 100%;" @change="handle_change">
                            <a-select-option value=" " title="文本">无动画</a-select-option>
                            <a-select-option value="backOutLeft" title="文本">从左退出</a-select-option>
                            <a-select-option value="backOutRight" title="文本">从右退出</a-select-option>
                            <a-select-option value="backOutDown" title="文本">从下退出</a-select-option>
                            <a-select-option value="backOutUp" title="文本">从上退出</a-select-option>
                            <a-select-option value="fadeOut" title="文本">淡出</a-select-option>
                            <a-select-option value="fadeOutUp" title="文本">从下淡出</a-select-option>
                            <!-- <a-select-option value="object" title="对象"> 对象</a-select-option> -->
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="大小&位置">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="左">
                        <a-slider :defaultValue="Number(100)" v-model="temp_ss.left" @change="handle_change" :min="1"
                            :max="2000" />
                        <a-input-number v-model="temp_ss.left" @change="handle_change" :min="1" :max="2000" />
                    </a-form-model-item>
                    <a-form-model-item label="顶">
                        <a-slider v-model="temp_ss.top" @change="handle_change" :min="1" :max="2000" />
                        <a-input-number v-model="temp_ss.top" @change="handle_change" :min="1" :max="2000" />
                    </a-form-model-item>
                    <a-form-model-item label="宽">
                        <a-slider v-model="temp_ss.width" @change="handle_change" :min="1" :max="2000" />
                        <a-input-number v-model="temp_ss.width" @change="handle_change" :min="1" :max="2000" />
                    </a-form-model-item>
                    <a-form-model-item label="高">
                        <a-slider v-model="temp_ss.height" @change="handle_change" :min="1" :max="1100" />
                        <a-input-number v-model="temp_ss.height" @change="handle_change" :min="1" :max="1100" />
                    </a-form-model-item>
                    <a-form-model-item label="z-index">
                        <a-slider v-model="temp_ss.zindex" @change="handle_change" :min="-1000" :max="1000" />
                        <a-input-number v-model="temp_ss.zindex" @change="handle_change" :min="-1000" :max="1000" />
                    </a-form-model-item>
                </a-form-model>
            </a-collapse-panel>

            <a-collapse-panel key="3" header="文字样式">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="文本内容">
                        <a-input v-model="temp_ss.content" @change="handle_change" />
                    </a-form-model-item>
                    <a-form-model-item label="字体大小">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.fontSize" @change="handle_change" :min="10"
                                :max="60" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.fontSize" :min="10" :max="60"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="字体间距">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.spacing" @change="handle_change" :min="-30"
                                :max="30" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.spacing" :min="-30" :max="30"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="字体粗细">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.fontweight" @change="handle_change" :min="0"
                                :max="1000" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.fontweight" :min="0" :max="1000"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="对齐">
                        <a-radio-group button-style="solid" v-model="temp_ss.textAlign" @change="handle_change">
                            <a-radio-button value="left">
                                <a-icon type="align-left" />
                            </a-radio-button>
                            <a-radio-button value="center">
                                <a-icon type="align-center" />
                            </a-radio-button>
                            <a-radio-button value="right">
                                <a-icon type="align-right" />
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="字体划线">
                        <a-radio-group button-style="solid" v-model="temp_ss.decoration" @change="handle_change">
                            <a-radio-button value="none">
                                无
                            </a-radio-button>
                            <a-radio-button value="overline">
                                上划
                            </a-radio-button>
                            <a-radio-button value="underline">
                                下划
                            </a-radio-button>
                            <a-radio-button value="line-through">
                                贯穿
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-model-item>
                    <a-form-model-item label="字体倾斜">
                        <a-radio-group button-style="solid" v-model="temp_ss.fontstyle" @change="handle_change">
                            <a-radio-button value="normal">
                                正常
                            </a-radio-button>
                            <a-radio-button value="italic">
                                倾斜
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-model-item>
                </a-form-model>
            </a-collapse-panel>

            <a-collapse-panel key="4" header="图表样式">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="内间距-上">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.paddingtop" @change="handle_change" :min="0"
                                :max="100" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.paddingtop" :min="0" :max="100"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="内间距-右">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.paddingright" @change="handle_change"
                                :min="0" :max="100" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.paddingright" :min="0" :max="100"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="内间距-下">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.paddingbottom" @change="handle_change"
                                :min="0" :max="100" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.paddingbottom" :min="0" :max="100"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="内间距-左">
                        <div style="display: flex;justify-content: space-between;">
                            <a-slider style="width: 50%;" v-model="temp_ss.paddingleft" @change="handle_change" :min="0"
                                :max="100" />
                            <a-input-number style="width: 40%;" v-model="temp_ss.paddingleft" :min="0" :max="100"
                                @change="handle_change" />
                        </div>
                    </a-form-model-item>
                </a-form-model>
            </a-collapse-panel>

            <a-collapse-panel key="5" header="数据绑定">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="绑定数据">
                        <a-switch default-checked @change="handle_change" v-model="temp_ss.datebind" />
                    </a-form-model-item>
                    <a-form-model-item label="定时刷新">
                        <a-switch default-checked @change="handle_change" v-model="temp_ss.refreshdata" />
                    </a-form-model-item>
                    <a-form-model-item v-if="temp_ss.refreshdata" label="间隔/min">
                        <a-input @keydown="handlePushKeyword($event)" @keyup.enter.native="handle_change"
                            v-model="temp_ss.refreshdatatime"></a-input>
                    </a-form-model-item>

                    <a-form-model-item v-if="['chartline','piechart','piechart3D'].includes(name)" label="Transform">
                        <a-switch default-checked @change="handle_change" v-model="temp_ss.transform" />
                    </a-form-model-item>

                    <a-form-model-item v-if="['chartline','piechart','piechart3D'].includes(name) && temp_ss.transform"
                        label="Transform">
                        <a-input type="textarea" @keydown="handlePushKeyword($event)"
                            @keyup.enter.native="handle_change" v-model="temp_ss.transformjson"></a-input>

                    </a-form-model-item>
                    <!-- <a-form-model-item label="显示数据">
                        <a-switch default-checked @change="handle_change" v-model="temp_ss.dateshow" />
                    </a-form-model-item> -->
                    <a-form-model-item label="数据类型">
                        <a-select v-model="temp_ss.datetype" style="width: 100%;" @change="handle_change">
                            <a-select-option value="string" title="文本"> 文本</a-select-option>
                            <a-select-option value="number" title="数字"> 数字</a-select-option>
                            <a-select-option value="array" title="数组"> 数组</a-select-option>
                            <!-- <a-select-option value="object" title="对象"> 对象</a-select-option> -->
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="数据来源">
                        <a-select v-model="temp_ss.datesource" style="width: 100%;" @change="handle_change">
                            <a-select-option value="text" title="本地txt"> 本地txt</a-select-option>
                            <a-select-option value="phpsocket" title="本地txt"> PHP Socket</a-select-option>
                            <a-select-option value="excel" title="本地excel"> 本地excel</a-select-option>
                            <a-select-option value="publicdata" title="公共数据"> 公共数据</a-select-option>
                            <a-select-option value="phpapi" title=" php api"> php api</a-select-option>
                            <a-select-option value="joincomponent" title="关联其他组件"> 关联其他组件</a-select-option>
                            <a-select-option value="vuestore" title="Vue Store"> Vue Store</a-select-option>
                        </a-select>
                        <a-input type="textarea" @keydown="handlePushKeyword($event)"
                            @keyup.enter.native="handle_change" v-if="['phpapi' ].includes(temp_ss.datesource)"
                            v-model="temp_ss.phpapi">
                        </a-input>
                        <a-input type="textarea" @keydown="handlePushKeyword($event)"
                            @keyup.enter.native="handle_change" v-if="['vuestore' ].includes(temp_ss.datesource)"
                            v-model="temp_ss.vuestore">
                        </a-input>
                        <a-input type="textarea" @keydown="handlePushKeyword($event)"
                            @keyup.enter.native="handle_change" v-if="['publicdata' ].includes(temp_ss.datesource)"
                            v-model="temp_ss.publicdata">
                        </a-input>
                        <a-input type="textarea" @keydown="handlePushKeyword($event)"
                            @keyup.enter.native="handle_change" v-if="[ 'phpsocket'].includes(temp_ss.datesource)"
                            v-model="temp_ss.phpsocket">
                        </a-input>
                        <!-- <a-select v-if="temp_ss.datesource=='store'" v-model="temp_ss.store" style="width: 100%;"
                            @change="handle_change">
                            <a-select-option v-for="(item,index) in storelist" :key="index" :value="index"
                                :title="item.val">
                                {{item.name}}
                            </a-select-option>
                        </a-select> -->
                    </a-form-model-item>

                    <a-form-model-item v-if="name=='scrolltable'" label="表名">
                        <a-input type="textarea" v-model="scrolltablecol" @keyup.enter.native="handle_scrolltable"
                            @keydown="hande_pushkeyenter($event)" placeholder="name,key,width 顺序string"></a-input>
                        <a-tag v-for="(item,index) in scrolltablecols" :key="item.name+'-'+item.key+'-'+index" closable
                            @close="delete_scrolltablecol(item.name+'-'+item.key+'-'+index)">
                            <a-tooltip>
                                <template slot="title">
                                    {{item}}
                                </template>
                                {{item.name}}
                            </a-tooltip>
                        </a-tag>
                    </a-form-model-item>

                </a-form-model>
            </a-collapse-panel>


            <a-collapse-panel key="7" header="组件交互">
                <a-tag v-for="(item,index) in temp_ss.actions" :key="item.actiontype+'-'+index" closable
                    @close="delete_actions(index)" @click="handle_exitaction(item,index)">
                    {{item.actiontype}}
                </a-tag>

                <a-button type="primary" style="width: 100%;" @click="handle_addaction">
                    <a-icon type="plus"></a-icon>
                    添加交互
                </a-button>

                <a-form-model v-if="isaddaction" layout="horizontal" :label-col=" { span: 8 }"
                    :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="类型">
                        <a-select style="width: 100%;" v-model="actiontype">
                            <a-select-option v-for="(item,index) in actiontypelist" :key="'actiontype'+index"
                                :value="item.value"> {{item.title}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="组件">

                        <a-select v-model="actionobj" mode="multiple" style="width: 100%;">
                            <a-select-option v-for="(item,index) in actiondivs" :key="'actionobj'+index"
                                :value="item.name+item.keyid"> {{item.name}}-{{item.keyid}}
                            </a-select-option>
                        </a-select>

                    </a-form-model-item>
                    <a-form-model-item label="Json"
                        v-if="['click_style','click_phpapi','click_topage','click_changebg'].includes(actiontype)">
                        <a-input type="textarea" v-model="actionstyle"></a-input>
                    </a-form-model-item>

                    <a-form-model-item :wrapper-col="{ span: 8, offset: 8 }">
                        <a-button :class="'success'" @click="handle_saveaction">Save</a-button>
                        <a-button :class="'cancel'" @click="handle_cancelaction">Cancels</a-button>
                    </a-form-model-item>
                </a-form-model>
            </a-collapse-panel>

            <a-collapse-panel key="8" header="模型样式" v-if="name=='bg'">

                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="间隔/min">
                        <a-input @keydown="handlePushKeyword($event)" @keyup.enter.native="handle_change"
                            v-model="temp_ss.rotatetime"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="旋转速度">
                        <el-slider :min="-5" :max="5" v-model="temp_ss.rotatespeed" @input="handle_change">
                        </el-slider>
                    </a-form-model-item>
                </a-form-model>

                <a-tag v-for="(item,index) in temp_ss.modelstyle" :key="item.name+index" closable
                    @close="delete_model(index)" @click="handle_exitmodel(item,index)">
                    {{item.title==undefined?index:item.title}}
                </a-tag>

                <a-button type="primary" style="width: 100%;" @click="handle_addmodel">
                    <a-icon type="plus"></a-icon>
                    添加交互
                </a-button>

            </a-collapse-panel>

            <a-collapse-panel v-if="name=='piechart3D'" key="10" header="3D饼图">
                <v-highchart :keyid="keyid" :prop_style="ss.highchart" @highchart="handle_highchart">
                </v-highchart>
            </a-collapse-panel>


            <a-collapse-panel v-if="name=='datetime'" key="11" header="日期时间">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-form-model-item label="Radius">
                        <a-select v-model="temp_ss.datetimetype" style="width: 100%;" @change="handle_change">
                            <a-select-option v-for="(item,index) in datetimetype" :key="'datetime'+index"
                                :value="item.value"> {{item.label}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
            </a-collapse-panel>

            <a-collapse-panel v-if=" name=='solidgaugechart'" key="12" header="仪表盘图">
                <v-gauges :keyid="keyid" :prop_style="ss.highchart" @highchart="handle_highchart">
                </v-gauges>
            </a-collapse-panel>

            <a-collapse-panel v-if=" name=='eltable'" key="13" header="Table">
                <v-eltable :keyid="keyid" :prop_style="ss.table" @eltable="handle_eltable">
                </v-eltable>
            </a-collapse-panel>

            <a-collapse-panel v-if="name=='echartsbar'" key="14" header="Echarts">
                <v-echarts :keyid="keyid" :prop_style="ss.highchart" @highchart="handle_highchart">
                </v-echarts>
            </a-collapse-panel>

            <a-collapse-panel key="15" header="Video" v-if="name=='videoplay'">
                <a-form-model layout="horizontal" :label-col=" { span: 8 }" :wrapper-col=" { span: 16 }">
                    <a-upload name="file" :multiple="false" action="#" @change="handle_video" :file-list="videolist"
                        :before-upload="beforeUpload">
                        <a-button type="primary">
                            <a-icon type="upload" /> 选择视频
                        </a-button>
                    </a-upload>
                </a-form-model>
            </a-collapse-panel>
        </a-collapse>


        <a-modal title="模型样式" :visible="isaddmodel" :footer="null" @cancel="handleCancel">
            <a-form-model-item label="title">
                <a-input v-model="modeltitle"></a-input>
            </a-form-model-item>
            <a-form-model-item label="模型">
                <a-select :allowClear="true" style="width: 100%;" mode="multiple" v-model="modelname" :maxTagCount="2">
                    <a-select-option v-for="(item) in modelllist" :key="item.id+'model'" :value="item.name">
                        {{item.name.split('_')[2]}}
                    </a-select-option>
                </a-select>
            </a-form-model-item>

            <a-form-model-item label="样式">
                <a-input type="textarea" :auto-size="{ minRows: 6}" v-model="modelstyle"></a-input>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 8, offset: 8 }">
                <a-button :class="'success'" @click="handle_savemodel">Save</a-button>
                <a-button :class="'cancel'" @click="handle_cancelmodel">Cancels</a-button>
            </a-form-model-item>
        </a-modal>



    </div>
</template>

<script>
    //import merge from 'deepmerge'
    import VBaseform from '@/components/three3D/cssform/baseform'
    import VHighchart from './cssformHighchart.vue'
    import VEcharts from './cssformecharts.vue'
    import VGauges from './cssformGauges.vue'
    import VEltable from './cssformEltable.vue'

    export default {
        props: {
            ss: {
                type: Object, default: () => ({})
            },
            keyid: { type: Number, default: 0, },
            name: { type: String, default: " as", }, actiondivs: { type: Array, default: () => [] }
        },
        components: {
            VHighchart, VGauges, VEltable, VEcharts, VBaseform
        },
        watch: {
        },
        data() {
            return {
                visible: false,
                videolist: [],
                fileList: [],
                color: '#e2e2e2',
                storelist: [],
                scrolltablecols: this.$props.ss.scrolltablecols ?? [],
                scrolltablecol: "",
                chartoptions: [
                    { label: '点', value: 'point' },
                    { label: '线', value: 'line' },
                    { label: '柱状', value: 'bar' },
                ],
                datetimetype: [
                    { label: '年月日时分秒', value: 'Y-m-d H:i:s' },
                    { label: '年月日', value: 'Y-m-d' },
                    { label: '年月日', value: 'H:i:s' },
                ],
                actiontypelist: [
                    {
                        key: "1",
                        value: "click_none",
                        title: "鼠标点击消失",
                    },
                    {
                        key: "2",
                        value: "click_block",
                        title: "鼠标点击显示",
                    },
                    {
                        key: "3",
                        value: "model_click",
                        title: "点击模型",
                    },
                    {
                        key: "4",
                        value: "model_unclick",
                        title: "无点击模型",
                    },
                    {
                        key: "5",
                        value: "click_style",
                        title: "点击样式",
                    },
                    {
                        key: "6",
                        value: "click_return_name",
                        title: "点击返回名字",
                    },
                    {
                        key: "7",
                        value: "click_phpapi",
                        title: "API查询",
                    },
                    {
                        key: "8",
                        value: "chose_model",
                        title: "选择模型",
                    },
                    {
                        key: "9",
                        value: "click_return_binddata",
                        title: "点击返回绑定数据",
                    },
                    {
                        key: "10",
                        value: "click_topage",
                        title: "点击跳转页面",
                    },
                    {
                        key: "11",
                        value: "click_changebg",
                        title: "切换屏幕",
                    },
                    {
                        key: "12",
                        value: "click_handle_search",
                        title: "组件刷新",
                    },
                ],
                actiontype: "",
                actionobj: [],
                actionstyle: "",
                isaddaction: false,
                savetype: "add",
                savei: 0,

                modelllist: [],
                modelname: [],
                modeltitle: "",
                modelstyle: "",
                isaddmodel: false,
                savemodeltype: "add",
                savem: 0,
            };
        },
        created() {
            let publicdatatab = Array(this.$localForage.getItem('3dmodel'))
            Promise.all(publicdatatab).then(value => {
                if (value[0] != null) {
                    if (value[0].length > 0) {
                        this.modelllist = value[0]
                    }
                }
            })
        },
        computed: {
            basestyle() {
                return this.ss
            },
            temp_ss: {
                get: function () {
                    var obj = {
                        modeltitle: this.ss.modeltitle ?? "",
                        modelname: this.ss.modelname ?? [],
                        isshow: this.ss.isshow ?? true,
                        componentname: this.name + "-" + this.keyid,
                        backgroundColor: this.color,
                        color: this.ss.color ?? "#e2e2e2",
                        paddingtop: this.ss.paddingtop ?? 24,
                        paddingright: this.ss.paddingright ?? 24,
                        paddingbottom: this.ss.paddingbottom ?? 24,
                        paddingleft: this.ss.paddingleft ?? 24,
                        datebind: this.ss.datebind ?? false,
                        dateshow: this.ss.dateshow ?? true,
                        datetype: this.ss.datetype ?? 'string',
                        datesource: this.ss.datesource ?? 'text',
                        store: this.ss.store ?? 0,
                        phpapi: this.ss.phpapi ?? "{url:'',params:''}",
                        vuestore: this.ss.vuestore ?? "{url:'',params:''}",
                        phpsocket: this.ss.phpsocket ?? "{url:'',params:''}",
                        transform: this.ss.transform ?? false,
                        transformjson: this.ss.transformjson ?? "",
                        islegend: this.ss.islegend ?? false,
                        chartlineX: this.ss.chartlineX ?? { name: "", isshow: false, charttype: "bar" },
                        piechart: this.ss.piechart ?? { position: "qty", color: "name", },
                        refreshdatatime: this.ss.refreshdatatime ?? 1,
                        refreshdata: this.ss.refreshdata ?? false,
                        datetimetype: this.ss.datetimetype ?? 'Y-m-d H:i:s',

                        rotatetime: this.ss.rotatetime ?? 1,
                        rotatespeed: this.ss.rotatespeed ?? -3
                        // scrolltablecols: this.ss.scrolltablecols ?? this.scrolltablecols
                    }
                    // return merge(this.ss, obj)
                    return { ...this.ss, ...obj }
                },
                set: function () { },

                // return this.ss
            },
        },
        methods: {
            handle_downmodel() {

            },
            handle_change() {
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
            },
            beforeUpload() {
                return false;
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    return false;
                }
            },
            hande_pushkeyenter() {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    return false;
                }
            },
            handleChange(info) {
                let fileList = [...info.fileList];
                fileList = fileList.slice(-1);
                this.fileList = fileList;
                const reader = new FileReader();
                reader.readAsDataURL(info.file);
                reader.onload = () => {
                    this.temp_ss.url = reader.result;
                    this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
                };
            },
            handle_scrolltable() {
                var arr = this.scrolltablecol.split(',')
                var temp = {};
                temp.name = arr[0] ?? ""
                temp.key = arr[1] ?? ""
                temp.width = arr[2] ?? ""
                this.scrolltablecols.push(temp)
                this.scrolltablecol = ""
                this.$emit("vcss", {
                    style: { ...this.temp_ss, ...{ scrolltablecols: this.scrolltablecols } }, key:
                        this.keyid
                })
            },
            delete_scrolltablecol(e) {
                var index = this.scrolltablecols.findIndex(function (item, i) {
                    return (item.name + '-' + item.key + '-' + i) === e;
                });
                this.scrolltablecols.splice(index, 1)
                this.$emit("vcss", {
                    style: { ...this.temp_ss, ...{ scrolltablecols: this.scrolltablecols } }, key:
                        this.keyid
                })
            },
            handle_addaction() {
                this.isaddaction = true
                this.savetype = "add"
            },
            handle_saveaction() {
                this.isaddaction = false
                if (this.savetype == 'add') {
                    if (this.temp_ss.actions == undefined) {
                        this.temp_ss.actions = []
                    }
                    this.temp_ss.actions.push({
                        actiontype: this.actiontype,
                        actionobj: this.actionobj,
                        actionstyle: this.actionstyle
                    })
                }
                else if (this.savetype == 'update') {
                    this.temp_ss.actions.splice(this.savei, 1, {
                        actiontype: this.actiontype,
                        actionobj: this.actionobj,
                        actionstyle: this.actionstyle
                    })
                }
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
                this.actiontype = "";
                this.actionobj = [];
                this.actionstyle = "";
            },
            handle_cancelaction() {
                this.isaddaction = false
                this.actiontype = "";
                this.actionobj = [];
                this.actionstyle = "";
            },
            handle_exitaction(e, i) {
                this.isaddaction = true
                this.savetype = "update"
                this.savei = i
                this.actiontype = e.actiontype;
                this.actionobj = e.actionobj
                this.actionstyle = e.actionstyle
            },
            delete_actions(i) {
                this.temp_ss.actions.splice(i, 1)
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
                this.handle_cancelaction();
            },
            ///
            handle_addmodel() {
                this.isaddmodel = true
                this.savemodeltype = "add"
            },
            handle_savemodel() {
                this.isaddmodel = false
                if (this.savemodeltype == 'add') {
                    this.temp_ss.modelstyle.push({
                        name: this.modelname,
                        style: this.modelstyle,
                        title: this.modeltitle
                    })
                }
                else if (this.savemodeltype == 'update') {
                    this.temp_ss.modelstyle.splice(this.savem, 1, {
                        name: this.modelname,
                        style: this.modelstyle,
                        title: this.modeltitle
                    })
                }
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
                this.modelstyle = "";
                this.modelname = [];
                this.modeltitle = "";
            },
            handle_cancelmodel() {
                this.isaddmodel = false
                this.modelstyle = "";
                this.modelname = [];
                this.modeltitle = ""
            },
            handle_exitmodel(e, i) {
                this.isaddmodel = true
                this.savemodeltype = "update"
                this.savem = i
                this.modelname = e.name;
                this.modelstyle = e.style
                this.modeltitle = e.title
            },
            delete_model(i) {
                this.temp_ss.modelstyle.splice(i, 1)
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
                this.handle_cancelmodel();
            },
            handle_highchart(e) {
                this.temp_ss.highchart = e.style
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
            },
            handle_eltable(e) {
                this.temp_ss.table = e.style
                this.$emit("vcss", { style: this.temp_ss, key: this.keyid })
            },
            handleCancel() {
                this.isaddmodel = false;
            },
            handle_video(info) {

                let fileList = [...info.fileList];
                fileList = fileList.slice(-1);
                if (info.file.size / 1024 / 1024 > 100) {
                    this.$message.error("文件大小不能超過100M")
                }
                else {
                    if (fileList[0].originFileObj != undefined) {
                        let formData = new FormData();
                        formData.append('file', fileList[0].originFileObj);
                        this.loadcount = 1;
                        this.$funAxios.reqPost('FILE_UPLOAD', formData).then((res) => {
                            this.loadcount--;
                            console.log(res)
                            this.temp_ss.videourl = res.id;
                            this.$emit("vcss", { style: this.temp_ss, key: this.keyid })

                        })
                    }
                }

            },

            handle_baseform(e) {
                console.log(e)

                this.$emit("vcss", { style: { ...this.ss, ...e.style }, key: this.keyid })

            },
        },
    };
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