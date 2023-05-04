<template>
    <div :class="'animated ' + animated" :style="[style,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>

        <div ref="chart" :style="{ width: ss.width + 'px', height: ss.height + 'px' }"></div>

        <v-modaldetail :modaltitle="modaltitle" :visible="visible" @closemodal="handleCancel" :params="params"
            :extraparams="extraparams">
        </v-modaldetail>
    </div>
</template>

<script>
    import VModaldetail from './modaldetail.vue'
    import { markRaw } from "vue"
    const DataSet = require('@antv/data-set')
    const data = [
        {
            name: 'Chrome',
            value: 1.5,
            x: 'as',
            sliced: true,
            color: 'orange',
        },
        {
            name: 'Safari',
            value: 1,
            color: 'green',
        },
    ]
    export default {
        props: {
            ss: {
                type: Object,
                default: () => ({
                    left: 0,
                    width: 100,
                    height: 100,
                }),
            },
            curdiv: { type: Boolean, default: false },
        },
        components: {
            VModaldetail,
        },
        data() {
            return {
                isshow: true,
                i: 0,
                visible: false,
                result: data,
                data,
                animated: this.ss.inanimate,
                refreshData: null,
                click_style: {},
                toroute: null,
                modaltitle: '',
                params: '{}',
                myChart: null,
                temp_paras: {},
                extraparams: {},
            }
        },
        created() {
            if (this.datebind) {
                this.handle_search()
                if (this.datarefresh) {
                    this.refreshData = setInterval(() => {
                        this.handle_search()
                    }, Number(this.ss.refreshdatatime) * 1000 * 60)
                }
            }
            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        mounted() {
            const chart = this.$refs.chart
            if (chart) {
                this.myChart = markRaw(this.$echarts.init(chart, null, {
                    height: this.ss.height,
                    width: this.ss.width,
                }))
                const option = this.option
                this.myChart.setOption(option, true)
                if (this.datebind)
                    this.myChart.showLoading(this.loadingtext)

                var that = this
                this.myChart.on('click', function (e) {
                    that.series.map((s) => {
                        var params = s.eventparams == undefined ? '{}' : s.eventparams
                        var temp = eval('(' + params + ')')
                        switch (s.event) {
                            case 'showdetail':
                                that.visible = true
                                that.modaltitle = e.name
                                that.params = params
                                that.extraparams = { ...that.result[e.dataIndex] }
                                break
                            case 'topage':
                                window.open(
                                    that.$router.resolve({
                                        path: temp.path,
                                    }).href,
                                    temp.type
                                )
                                break
                            case 'toontherpage':
                                window.open(temp.path, temp.type)
                                break
                            default:
                                break
                        }
                    })
                })
            }
        },
        beforeUnmount() {
            clearInterval(this.refreshData)
            this.refreshData = null
        },
        watch: {
            isshow(vnew, vold) {
                if (this.isshow) {
                    this.animated = this.ss.inanimate
                } else if (vnew != vold && !this.isshow) {
                    this.animated = this.ss.outanimate
                }
            },
            datebind(vnew, vold) {
                if (this.datebind && vnew != vold) {
                    this.handle_search()
                } else {
                    this.result = this.data
                }
            },
            datedetail() {
                this.handle_search()
            },
            datesource() {
                this.handle_search()
            },
            datarefresh() {
                if (this.datarefresh) {
                    this.refreshData = setInterval(() => {
                        this.handle_search()
                    }, Number(this.ss.refreshdatatime) * 1000 * 60)
                } else {
                    clearInterval(this.refreshData)
                    this.refreshData = null
                }
            },
            ss() {
                this.myChart.setOption(this.option, true)
                this.myChart.resize({ width: this.ss.width, height: this.ss.height })
            },
            series() {
                this.myChart.setOption(this.option, true)
            },
            yAxis() {
                this.myChart.setOption(this.option, true)
            },
            chart() {
                this.i++
            },
        },
        computed: {
            chart() {
                return this.ss.highchart.chart
            },
            tooltip() {
                return this.ss.highchart.tooltip
            },
            xAxis() {
                return this.ss.highchart.xAxis
            },
            yAxis() {
                return this.ss.highchart.yAxis
            },
            series() {
                return this.ss.highchart.series
            },
            legend() {
                return this.ss.highchart.legend
            },
            datarefresh() {
                return this.ss.refreshdata
            },
            datebind() {
                return this.ss.datebind
            },
            datesource() {
                return this.ss.datesource
            },
            datedetail() {
                return this.ss[this.ss.datesource]
            },
            loadingtext() {
                return {
                    text: this.ss.content,
                    color: this.ss.color,
                    textColor: this.ss.color,
                    fontSize: this.ss.fontSize + 'px',
                    maskColor: this.ss.backgroundcolor ?? 'rgba(0,0,0,0)',
                }
            },
            style() {
                return {
                    //border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    top: this.ss.top + 'px',
                    left: this.ss.left + 'px',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                    backgroundColor: 'rgba(0,0,0,0)',
                    zIndex: this.ss.zindex,
                }
            },
            styleclick() {
                return {
                    border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                }
            },
            option() {
                const that = this

                return {
                    grid: {
                        height: this.chart.height + '%',
                        width: this.chart.width + '%',
                        top: this.chart.spacingtop + '%',
                        left: this.chart.spacingleft + '%',
                    },
                    legend: {
                        show: this.legend.enabled,
                        orient: this.legend.layout,
                        left: this.legend.x + '%',
                        top: this.legend.y + '%',
                        textStyle: {
                            color: this.legend.color,
                            fontSize: this.legend.fontsize,
                        },
                    },
                    tooltip: {
                        borderColor: this.tooltip.bordercolor,
                        borderWidth: this.tooltip.borderwidth,
                        trigger: this.tooltip.trigger,
                        textStyle: {
                            fontSize: this.tooltip.style.fontsize,
                            color: this.tooltip.style.color,
                            fontWeight: this.tooltip.style.fontweight,
                        },
                    },
                    xAxis: this.xAxis.map((e) => {
                        return {
                            show: e.enabled,
                            type: 'category',
                            name: e.titletext,
                            splitNumber: e.tickcount,
                            nameLocation: e.titlealign,
                            nameRotate: e.rotation,
                            nameTextStyle: {
                                fontSize: e.namefontsize,
                                color: e.namecolor,
                                width: e.namefontweight,
                                fontWeight: e.namefontweight,
                                textBorderWidth: e.nameborderwidth,
                                textBorderColor: e.namebordercolor,
                            },
                            splitLine: {
                                show: e.splitline.show,
                                lineStyle: {
                                    type: e.splitline.type,
                                    width: e.splitline.width,
                                    color: e.splitline.color,
                                },
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    fontSize: e.labels.style.fontsize,
                                    color: e.labels.style.color,
                                },
                            },
                            axisLabel: {
                                show: true,
                                interval: 0,
                                fontSize: e.labels.style.fontsize,
                                color: e.labels.style.color,
                                textBorderWidth: e.labels.style.border,
                                textBorderColor: e.labels.style.bordercolor,
                                fontWeight: e.labels.style.fontweight,
                                rotate: e.labels.style.rotate ?? 0,
                                align: e.labels.style.align ?? 'left',
                                margin: e.labels.style.margin ?? 8,
                                formatter: function (value) {
                                    if (e.labels.style.shupai) {
                                        var str = value.split('')
                                        return str.join('\n')
                                    } else {
                                        return value
                                    }
                                },
                            },
                        }
                    }),
                    yAxis: this.yAxis.map((e) => {
                        return {
                            crosshair: e.crosshair,
                            splitNumber: e.tickcount,
                            opposite: e.opposite, //在对面显示坐标轴
                            show: e.enabled,
                            min: e.min,
                            max: e.max,
                            name: e.titletext,
                            nameLocation: e.titlealign,
                            nameRotate: e.rotation,
                            nameTextStyle: {
                                fontSize: e.namefontsize,
                                color: e.namecolor,
                                width: e.namefontweight,
                                fontWeight: e.namefontweight,
                                textBorderWidth: e.nameborderwidth,
                                textBorderColor: e.namebordercolor,
                            },
                            splitLine: {
                                show: e.splitline.show,
                                lineStyle: {
                                    type: e.splitline.type,
                                    width: e.splitline.width,
                                    color: e.splitline.color,
                                },
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    fontSize: e.labels.style.fontsize,
                                    color: e.labels.style.color,
                                    textOutline:
                                        e.labels.style.border + 'px   ' + e.labels.style.bordercolor,
                                    fontWeight: e.labels.style.fontweight,
                                },
                            },
                            axisLabel: {
                                show: true,
                                fontSize: e.labels.style.fontsize,
                                color: e.labels.style.color,
                                textBorderWidth: e.labels.style.border,
                                textBorderColor: e.labels.style.bordercolor,
                                fontWeight: e.labels.style.fontweight,
                            },
                        }
                    }),

                    series: this.series.map((s) => {
                        if (s.type == 'pie') {
                            return {
                                name: s.yname,
                                type: s.type,
                                color: s.color,
                                radius: [s.radius1 + '%', s.radius2 + '%'],
                                center: [s.center1 + '%', s.center2 + '%'],
                                label: {
                                    show: s.enabled,
                                    position: s.position,
                                    fontSize: s.labelfontsize,
                                    color: s.labelcolor,
                                    textBorderWidth: s.labelborder,
                                    textBorderColor: s.labelbordercolor,
                                    fontWeight: s.labelfontweight,
                                    formatter: '{b}:\r\n {c}' + s.format,
                                },
                                labelLine: {
                                    show: s.lablelineshow,
                                    length: s.lablelinelength,
                                    length2: s.lablelinelength2,
                                    lineStyle: {
                                        type: s.lablelinetype,
                                        width: s.lablelinewidth,
                                        color: s.lablelinecolor,
                                    },
                                },
                                data: this.result.map((e) => {
                                    return { name: e[s.xname], value: e[s.yname] }
                                }),
                                events: {
                                    click: function (event) {
                                        var params = s.eventparams == undefined ? '{}' : s.eventparams
                                        var temp = eval('(' + params + ')')
                                        switch (s.event) {
                                            case 'showdetail':
                                                that.visible = true
                                                that.modaltitle = event.point.name
                                                that.params = params
                                                break
                                            case 'topage':
                                                window.open(
                                                    that.$router.resolve({
                                                        path: temp.path,
                                                    }).href,
                                                    temp.type
                                                )
                                                break
                                            default:
                                                break
                                        }
                                    },
                                },
                            }
                        } else {
                            //除pie 
                            return {
                                name: s.yname,
                                type: s.type,
                                stack: s.stack,
                                xAxisIndex: s.xAxis,
                                yAxisIndex: s.yAxis,
                                color: s.color,
                                areaStyle: (s.areastyle != undefined && s.areastyle.length > 0) ? eval("(" + s.areastyle + ")") : null,
                                step: s.step == 'false' ? false : s.step,
                                label: {
                                    show: s.enabled,
                                    position: s.position,
                                    fontSize: s.labelfontsize,
                                    color: s.labelcolor,
                                    textBorderWidth: s.labelborder,
                                    textBorderColor: s.labelbordercolor,
                                    fontWeight: s.labelfontweight,
                                },
                                data: this.result.map((e) => {
                                    return [e[s.xname], e[s.yname]]
                                }),
                            }
                        }
                    }),
                }
            },
        },
        methods: {
            getRefsAff() {
                return document.getElementById('fulls')
            },
            handleCancel() {
                this.visible = false
            },

            click_interval() {
                if (this.toroute != null) {
                    let temp = eval('(' + this.toroute + ')')
                    window.open(
                        this.$router.resolve({
                            path: temp.path,
                        }).href,
                        temp.type
                    )
                }
            },
            handle_search() {
                if (this.myChart) {
                    this.myChart.showLoading(this.loadingtext)
                }
                let dsource = this.ss.datesource
                switch (dsource) {
                    case 'phpapi':
                        this.handle_phpapi(dsource)
                        break
                    default:
                        break
                }
            },

            handle_phpapi(dsource) {
                let temp = eval('(' + this.ss[dsource] + ')')
                this.temp_paras = { ...temp }
                if (temp.url != '') {
                    this.$funAxios
                        .reqPost(temp.url, temp.params)
                        .then((res) => {
                            if (this.ss.transform) {
                                const dv = new DataSet.View().source(res.data)
                                dv.transform(eval('(' + this.ss.transformjson + ')'))
                                this.result = dv.rows
                            } else {
                                this.result = res.data
                            }
                            this.i++
                            this.myChart.setOption(this.option)
                            this.myChart.hideLoading()
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = []
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },

            handle_component_search(e) {
                this.myChart.showLoading(this.loadingtext)
                if (this.temp_paras.url != '') {
                    this.$funAxios
                        .reqPost(this.temp_paras.url, { ...this.temp_paras.params, ...e })
                        .then((res) => {
                            if (this.ss.transform) {
                                const dv = new DataSet.View().source(res.data)
                                dv.transform(eval('(' + this.ss.transformjson + ')'))
                                this.result = dv.rows
                            } else {
                                this.result = res.data
                            }
                            this.i++
                            this.myChart.setOption(this.option)
                            this.myChart.hideLoading()
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = []
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },
        },
    }
</script>