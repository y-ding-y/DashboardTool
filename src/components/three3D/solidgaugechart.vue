<template>
    <div :class="'animated ' + animated" :style="[style,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>

        <div ref="chart" :style="{ width: ss.width + 'px', height: ss.height + 'px' }"></div>
    </div>
</template>

<script>
    const DataSet = require('@antv/data-set')
    import { markRaw } from "vue"
    const data = { value: 10 }
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
        data() {
            return {
                isshow: true,
                i: 0,
                result: data,
                data,
                animated: this.ss.inanimate,
                refreshData: null,
                click_style:{},
                toroute: null,
                myChart: null,
                temp_paras: {},
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
                    renderer: 'svg',
                }))
                const option = this.option
                this.myChart.setOption(option, true)
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
        },
        computed: {
            credits() {
                return this.ss.highchart.credits
            },
            series() {
                return this.ss.highchart.series
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

            style() {
                return {
                    // border: this.curdiv ? '5px solid blue' : '0px',
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
                return {
                    series: this.series.map((s) => {
                        return {
                            type: 'gauge',
                            center: [s.center1 + '%', s.center2 + '%'],
                            radius: s.radius + '%',
                            startAngle: s.startangle,
                            endAngle: s.endangle,
                            min: s.min,
                            max: s.max,
                            splitNumber: s.splitnumber,
                            axisLine: {
                                show: s.axislineshow,
                                lineStyle: {
                                    width: s.axislinewidth,
                                    color: s.axislinecolor,
                                },
                            },
                            pointer: {
                                show: s.pointershow,
                                width: s.pointerwidth,
                                length: s.pointerlength,
                                icon: s.pointericon,
                                itemStyle: {
                                    color: s.pointercolor,
                                },
                            },
                            progress: {
                                show: s.progressshow,
                                itemStyle: {
                                    color: s.progresscolor,
                                },
                                width: s.progresswidth,
                            },
                            axisTick: {
                                show: s.tickshow,
                                distance: s.tickdistance,
                                splitNumber: s.tickcount,
                                length: s.ticklength,
                                lineStyle: {
                                    color: s.tickcolor,
                                    width: s.tickwidth,
                                },
                            },
                            splitLine: {
                                show: s.splitlineshow,
                                distance: s.splitlinedistance,
                                length: s.splitlinelength,
                                lineStyle: {
                                    color: s.splitlinecolor,
                                    width: s.splitlinewidth,
                                },
                            },
                            axisLabel: {
                                show: s.labelshow,
                                color: s.labelcolor,
                                distance: s.labeldistance,
                                fontSize: s.labelfontsize,
                            },
                            detail: {
                                show: s.detailshow,
                                valueAnimation: true, //数字标签动画
                                formatter:
                                    '{value} ' +
                                    (s.detailformatter == null ? '' : s.detailformatter),
                                color: s.detailcolor == null ? 'auto' : s.detailcolor,
                                fontSize: s.detailfontsize,
                                offsetCenter: [s.detailcenter1 + '%', s.detailcenter2 + '%'],
                            },
                            data: [{ value: Number(this.result[s.yname]) }],
                        }
                    }),
                }
            },
        },
        methods: {
            click_interval(e) {
                if (e != undefined && e.data != undefined && this.toroute != null) {
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
                //let dtype = this.ss.datetype;
                let dsource = this.ss.datesource
                switch (dsource) {
                    case 'phpapi':
                        this.handle_phpapi(dsource)
                        break
                    case 'phpsocket':
                        this.handle_phpsocket(dsource)
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
                            this.myChart.setOption(this.option)
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = []
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },

            handle_component_search(e) {
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
                            this.myChart.setOption(this.option)
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = []
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },

            handle_phpsocket(dsource, dtype) {
                let temp = eval('(' + this.ss[dsource] + ')')
                console.log(temp, dtype)

                this.$socket.emit('threeD', { asd: 'asd' })

                if (temp.url != '') {
                    console.log(this.$socket.connected)
                    this.$socket.emit('threeD', temp)

                    // console.log(temp.params.prop)
                    // this.$socket.on("chatserver", msg => {
                    //     console.log(msg)
                    // })
                }

                // this.ss[dsource], data => {
                //     this.temp_nodejsemit = this.ss[dsource]
                //     if (typeof (data) == dtype) {
                //         this.result = data
                //     }
                //     else {
                //         this.$message.error(this.ss.componentname + "数据格式错误")
                //     }
                // })
            },

            // myCallback(e) {
            //     this.refreshData = setInterval(() => {
            //         var point = e.series[0].points[0];
            //         var inc = Math.round((Math.random() - 0.5) * 100);
            //         var newVal = point.y + inc;

            //         if (newVal < 0 || newVal > 200) {
            //             newVal = point.y - inc;
            //         }
            //         point.update(Number(newVal));
            //     }, Number(this.ss.refreshdatatime) * 1000 * 60);

            // },
        },
    }
</script>