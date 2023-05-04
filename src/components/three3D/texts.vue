<template>
    <div :class="' combtn animated ' + animated" :style="[styleSet,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>

        <div v-if="maincontent == null" class="loadingOne" :style="{ height: styleSet.height + 'px' }">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
        {{ maincontent }}
    </div>
</template>

<script>
    //  import merge from 'deepmerge'
    import { toRaw } from 'vue'
    export default {
        props: {
            ss: {
                type: Object,
                default: () => ({
                    left: 10,
                    top: 10,
                    width: 100,
                    height: 100,
                    fontSize: 20,
                }),
            },
            curdiv: { type: Boolean, default: false },
        },
        sockets: {
            // welcom: function (data) {
            //     console.log("welcome data 数据返回 = >", data);
            // },
        },
        data() {
            return {
                isshow: true,
                result: null,
                click_style:{},
                temp_nodejsemit: '',
                //maincontent: this.$props.ss.content,
                animated: this.ss.inanimate,
                refreshData: null,

                temp_paras: {},
            }
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
                    this.result = this.ss.content
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
        },
        updated() {

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
        beforeUnmount() {
            clearInterval(this.refreshData)
            this.refreshData = null
        },
        computed: {
            maincontent() {
                if (this.ss.datebind) {
                    return this.result
                } else if (this.ss.content) {
                    return this.ss.content
                } else {
                    return ''
                }
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

            styleSet() {
                var style = {
                    //  border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    top: this.ss.top + 'px',
                    left: this.ss.left + 'px',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                    fontSize: this.ss.fontSize + 'px',
                    lineHeight: this.ss.height + 'px',
                    zIndex: this.ss.zindex,
                    color: this.ss.color,
                    background:
                        this.ss.gradient == 'right' || this.ss.gradient == 'top'
                            ? '-webkit-linear-gradient(' +
                            this.ss.gradient +
                            ',rgba(0,0,0,0),' +
                            this.ss.backgroundcolor +
                            ',rgba(0,0,0,0))'
                            : this.ss.backgroundcolor,
                    borderRadius: this.ss.borderradius + '%',
                    textAlign: this.ss.textAlign,
                    letterSpacing: this.ss.spacing + 'px',
                    fontWeight: this.ss.fontweight,
                    textDecoration: this.ss.decoration,
                    fontStyle: this.ss.fontstyle, 
                    //background:this.ss.gradient '-webkit-linear-gradient(right,rgba(0,0,0,0),'+this.ss.backgroundcolor+',rgba(0,0,0,0))'
                }
                if (this.ss.bordershow) {
                    style.width = this.ss.width + this.ss.borderwidth * 2 + 'px'
                    style.height = this.ss.height + this.ss.borderwidth * 2 + 'px'
                    style.borderStyle = 'solid'
                    style.borderWidth = this.ss.borderwidth + 'px'
                    style.borderColor = this.ss.bordercolor
                }
                return style
            },
            styleclick() {
                var style = {
                    border: this.curdiv ? '5px solid blue' : '0px',
                    position: 'absolute',
                    width: this.ss.width + 'px',
                    height: this.ss.height + 'px',
                }
                return style
            },
        },
        methods: {
            handle_search() {
                this.result = null
                let dtype = this.ss.datetype
                let dsource = this.ss.datesource
                switch (dsource) {
                    case 'phpapi':
                        this.handle_phpapi(dsource, dtype)
                        break

                    case 'publicdata':
                        this.handle_publicdata(dsource, dtype)
                        break
                    default:
                        break
                }
            },

            handle_phpapi(dsource, dtype) {
                let temp = eval('(' + this.ss[dsource] + ')')
                this.temp_paras = { ...temp }
                if (temp.url != '') {
                    this.$funAxios
                        .reqPost(temp.url, temp.params)
                        .then((res) => {
                            if (typeof res.data == dtype) {
                                this.result = res.data
                            } else {
                                this.$message.error(this.ss.componentname + '数据格式错误')
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = null
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },

            handle_component_search(e) {
                if (this.temp_paras.url != '') {
                    this.result=null
                    this.$funAxios
                        .reqPost(this.temp_paras.url, { ...this.temp_paras.params, ...e })
                        .then((res) => {
                            this.result = res.data
                            // this.myChart.setOption(this.option)
                        })
                        .catch((error) => {
                            console.log(error)
                            this.result = null
                            this.$message.error(this.ss.componentname + 'NetWork Error')
                        })
                }
            },

            handle_publicdata(dsource, dtype) {
                var publicdata = this.$store.getters['tdpublic/commondata']
                let temp = eval('(' + this.ss[dsource] + ')')
                if (publicdata.length > 0) {
                    if (dtype == 'string') {
                        var table = publicdata[Number(temp.key)].tabledata
                        this.result = table[Number(temp.row) - 1][temp.colname]
                    } else if (dtype == 'array') {
                        this.result = publicdata[Number(temp.key)].tabledata
                    }
                }
            },
        },
    }
</script>

<style scoped>
    .title {
        width: 100%;
        text-align: center;
        margin: 60px 0;
        font-size: 18px;
        color: #999;
    }

    .loadingOne {
        width: 80px;
        margin: 0 auto;
    }

    .loadingOne span {
        display: inline-block;
        width: 8px;
        height: 100%;
        border-radius: 4px;
        background: lightgreen;
        -webkit-animation: load 1s ease infinite;
        animation: load 1s ease infinite;
    }

    @-webkit-keyframes load {

        0%,
        100% {
            height: 20px;
            background: lightgreen;
        }

        50% {
            height: 30px;
            margin: -15px 0;
            background: lightblue;
        }
    }

    .loadingOne span:nth-child(2) {
        -webkit-animation-delay: 0.2s;
        animation-delay: 0.2s;
    }

    .loadingOne span:nth-child(3) {
        -webkit-animation-delay: 0.4s;
        animation-delay: 0.4s;
    }

    .loadingOne span:nth-child(4) {
        -webkit-animation-delay: 0.6s;
        animation-delay: 0.6s;
    }

    .loadingOne span:nth-child(5) {
        -webkit-animation-delay: 0.8s;
        animation-delay: 0.8s;
    }

    #wave-wrap {
        position: relative;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        border: 1px solid #adcbfe;
        overflow: hidden;
    }

    .wave {
        position: absolute;
        width: 250px;
        height: 300px;
        background: #adcbfe;
    }

    #wave1 {
        top: 120px;
        left: -50px;
        border-top-right-radius: 150px;
        border-top-left-radius: 150px;
        border-bottom-right-radius: 150px;
        border-bottom-left-radius: 140px;
        animation: waveA 4s linear infinite;
    }

    #wave2 {
        top: 130px;
        right: -50px;
        border-top-right-radius: 120px;
        border-top-left-radius: 150px;
        border-bottom-right-radius: 130px;
        border-bottom-left-radius: 140px;
        animation: waveB 6s linear infinite;
    }

    @keyframes waveA {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes waveB {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>