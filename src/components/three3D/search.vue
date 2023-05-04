<template>
    <div :class="' combtn animated ' + animated" :style="[styleSet,click_style]">
        <div v-if="curdiv" :style="[styleclick]"></div>
        <div class="form-area" id="root">
            <a-form layout="inline" ref="ruleForm" :model="form">
                <div v-for="(item, index) in formItems" :key="index" style="display: inline">
                    <a-form-item v-if="item.type === 'input'" :name="item.key">
                        <template v-slot:label>
                            <span :style="[labelStyle]"> {{ item.title }}:</span>
                        </template>
                        <a-input v-bind="getInputAttrs(item)"
                            :style="[itemStyle,{background:'rgba(0,0,0,0)',color:'white !important'}]"
                            v-model:value="form[item.key]" autocomplete="off" />
                    </a-form-item>

                    <a-form-item v-if="item.type === 'select'" :name="item.key">
                        <template v-slot:label>
                            <span :style="[labelStyle]"> {{ item.title }}:</span>
                        </template>
                        <a-select v-bind="getInputAttrs(item)"
                            :style="[itemStyle,{background:'rgba(0,0,0,0)',color:'white !important'}]"
                            :maxTagCount="maxTagCount" :options="getOptions(item)" v-model:value="form[item.key]"
                            :get-popup-container="getRefsAff" show-search>
                        </a-select>
                    </a-form-item>

                    <a-form-item v-if="item.type === 'range'" :name="item.key">
                        <template v-slot:label>
                            <span :style="[labelStyle]"> {{ item.title }}:</span>
                        </template>
                        <a-range-picker v-bind="item.attrs"
                            :style="[itemStyle,{background:'rgba(0,0,0,0)',color:'white !important'}]"
                            :format="item.format" v-model:value="form[item.key]" :ranges="ranges" @change="
                (dates, datesStr) => onRangeChange(dates, datesStr, item)
              " :get-popup-container="getRefsAff">
                            <template v-slot:suffixIcon>
                                <calendar-outlined />
                            </template>
                        </a-range-picker>
                    </a-form-item>
                </div>
                <a-form-item>
                    <a-button type="link" :class="'success'" v-if="formItems && formItems.length > 0" @click="onSubmit">
                        <search-outlined />
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
    import dayjs from 'dayjs'
    import { isEmpty } from '@/utils/util'

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
        data() {
            return {
                isshow: true,
                result: null,
                click_style: {},
                animated: this.ss.inanimate,
                formItems: [],
                form: {},
                formValues: {},
                allParaData: [],
                issubmit: false,
                maxTagCount: 1
                // searchform: this.ss.searchform,
            }
        },
        watch: {
            searchform() {
                this.iniFormItems()
            },
            isshow(vnew, vold) {
                if (this.isshow) {
                    this.animated = this.ss.inanimate
                } else if (vnew != vold && !this.isshow) {
                    this.animated = this.ss.outanimate
                }
            },
        },
        created() {
            // this.searchform = this.ss.searchform;
            this.iniFormItems()
            this.isshow = this.ss.isshow
            if (this.ss.isshow) {
                this.animated = this.ss.inanimate
            } else {
                this.animated = this.ss.outanimate
            }
        },
        computed: {
            searchform() {
                return this.$props.ss.searchform
            },
            maincontent() {
                if (this.ss.datebind) {
                    return this.result
                } else if (this.ss.content) {
                    return this.ss.content
                } else {
                    return ''
                }
            },
            itemStyle() {
                var style = {
                    fontSize: this.ss.fontSize + 'px',
                    color: this.ss.color,
                    textAlign: this.ss.textAlign,
                    letterSpacing: this.ss.spacing + 'px',
                    fontWeight: this.ss.fontweight,
                    textDecoration: this.ss.decoration,
                    fontStyle: this.ss.fontstyle,
                    //background:this.ss.gradient '-webkit-linear-gradient(right,rgba(0,0,0,0),'+this.ss.backgroundcolor+',rgba(0,0,0,0))'
                }
                return style
            },
            labelStyle() {
                var style = {
                    fontSize: this.ss.fontSize + 'px',
                    color: this.ss.color,
                    textAlign: this.ss.textAlign,
                    letterSpacing: this.ss.spacing + 'px',
                    fontWeight: this.ss.fontweight,
                    textDecoration: this.ss.decoration,
                    fontStyle: this.ss.fontstyle,
                    //background:this.ss.gradient '-webkit-linear-gradient(right,rgba(0,0,0,0),'+this.ss.backgroundcolor+',rgba(0,0,0,0))'
                }
                return style
            },
            styleSet: function () {
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
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    //background:this.ss.gradient '-webkit-linear-gradient(right,rgba(0,0,0,0),'+this.ss.backgroundcolor+',rgba(0,0,0,0))'
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
            ranges() {
                return {
                    Today: [dayjs(), dayjs()],
                    'This week': [dayjs().startOf('week'), dayjs().endOf('week')],
                    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
                }
            },
        },
        methods: {
            onSubmit() {
                this.formValues = this.getFormValues()
                this.issubmit = true
            },
            getFormValues(items = this.formItems) {
                const formValues = {}
                items
                    .forEach((item) => {
                        const { value, format, type, expandDayTime } = item
                        if (format) {
                            if (typeof format === 'string' && type === 'date') {
                                if (this.form[item.key] != null)
                                    formValues[item.key] = this.form[item.key].format(format)
                                else {
                                    formValues[item.key] = this.form[item.key]
                                }
                            }
                            else if (typeof format === 'string' && type === 'range') {
                                if (this.form[item.key] != null) {
                                    formValues[item.key] = this.form[item.key].map((e) => e.format(format))

                                    const [d0, d1] = formValues[item.key]
                                    formValues[item.key] = [
                                        dayjs(d0).format('YYYY-MM-DD 00:00:00'),
                                        dayjs(d1).format('YYYY-MM-DD 23:59:59'),
                                    ]

                                }
                                else {
                                    formValues[item.key] = this.form[item.key]
                                }
                            }
                            else if (type === 'switch') {
                                formValues[item.key] = format[this.form[item.key]]
                            }
                        } else {
                            formValues[item.key] = this.form[item.key]
                        }
                    })
                return formValues
            },
            iniRangeValue(value) {
                const qty =
                    value === 'yestoday' || value === 'lastweek' || value === 'lastmonth'
                        ? -1
                        : value === 'tomorrow' ||
                            value === 'nextweek' ||
                            value === 'nextmonth'
                            ? 1
                            : 0
                const unit =
                    value === 'month' || value === 'lastmonth' || value === 'nextmonth'
                        ? 'month'
                        : value === 'week' || value === 'lastweek' || value === 'nextweek'
                            ? 'week'
                            : 'day'
                return value === 'today' ||
                    value === 'yestoday' ||
                    value === 'tomorrow' ||
                    value === 'week' ||
                    value === 'lastweek' ||
                    value === 'nextweek' ||
                    value === 'month' ||
                    value === 'lastmonth' ||
                    value === 'nextmonth'
                    ? [
                        dayjs().add(qty, unit).startOf(unit),
                        dayjs().add(qty, unit).endOf(unit),
                    ]
                    : value && value[0]
                        ? [dayjs(value[0]), dayjs(value[1])]
                        : [null, null]
            },
            iniFormItems() {
                const paras = []
                const maps = {}
                this.formItems = []
                this.formItems = this.searchform.map((item) => {
                    var temp = { ...item }
                    let {
                        key,
                        type,
                        dataIndex,
                        value,
                        paraKey,
                        paraMap,
                        paraAtt,
                        container,
                        defaultvalue,
                        ...attrs
                    } = temp
                    temp.format = this.getFormat(item)
                    item.dataIndex = dataIndex = dataIndex || key
                    temp.container = container

                    temp.attrs = attrs
                    if (defaultvalue) {
                        this.form[key] = defaultvalue
                    }
                    if (item.type === 'range') {
                        this.form[key] = this.iniRangeValue(defaultvalue)
                    } else if (['date', 'month', 'week', 'datetime'].includes(type)) {
                        temp.value = dayjs(value)
                    } else if (temp.type == 'uploadfile') {
                        this.fileList = value
                    }
                    if (paraKey && !paras.find((e) => e.key == paraKey)) {
                        paras.push({ key: paraKey, paras: paraAtt })
                        if (paraMap) {
                            maps[paraKey] = paraMap
                        }
                    }
                    return temp
                })
                this.allParaMap = maps
                this.allParaSet = paras
                this.loadParas()
            },
            getInputAttrs(item) {
                const def = {
                    class: 'select',
                    allowClear: true,
                    placeholder: 'Please Input' + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getFormat(item) {
                if (item && item.format) {
                    return item.format
                }
                const type = item.type
                switch (type) {
                    case 'time':
                        return 'HH:mm:ss'
                    case 'month':
                        return 'YYYY-MM'
                    case 'date':
                    case 'range':
                        return 'MM-DD HH'
                    case 'datetime':
                        return 'YYYY-MM-DD HH:mm:ss'
                    default:
                        return undefined
                }
            },
            loadParas() {
                const paras = this.allParaSet
                const param = this.allParaMap
                if (paras.length == 0) return
                this.$funAxios.reqPost('PARA_SET', { paras }).then((res) => {
                    const arrData = []
                    res.data.forEach((item) => {
                        const { key, data } = item
                        const map = param[key] || {}
                        let options = []
                        if (Array.isArray(data)) {
                            options = data.map((option) => {
                                if (!isEmpty(map)) {
                                    if (map.key && option[map.key]) {
                                        option.key = option[map.key]
                                    }
                                    if (map.title && option[map.title]) {
                                        option.title = option[map.title]
                                    }
                                    if (map.title_us && option[map.title_us]) {
                                        option.title_us = option[map.title_us]
                                    }
                                    if (map.title_cn && option[map.title_cn]) {
                                        option.title_cn = option[map.title_cn]
                                    }
                                } else {
                                    if (!option.key && option.id) {
                                        option.key = option.id
                                    }
                                    if (!option.title && option.name) {
                                        option.title = option.name
                                    }
                                }
                                return option
                            })
                        } else if (data) {
                            const keys = Object.keys(data)
                            options = keys.map((k) => ({ key: k, title: data[k] }))
                        }
                        arrData.push({ key, data: options })
                    })
                    this.allParaData = arrData
                })
            },

            onRangeChange(dates, datesStr, item) {
                this.form[item.key] = [dayjs(datesStr[0]), dayjs(datesStr[1])]
                this.formValues = this.getFormValues()
            },

            getRefsAff() {
                return document.getElementById('fulls')
            },
            getOptions(item) {
                const paraData = this.allParaData.find(
                    (e) => e && item.paraKey && e.key === item.paraKey
                )
                const data = paraData && paraData.data ? paraData.data : []
                const options = (item.options || []).concat(data)

                const rtn = options.map((e) => {
                    if (typeof e === 'string') {
                        return { key: e, label: e, value: e }
                    } else if (typeof e === 'object') {
                        return {
                            key: e.key, label: e.title, value: e.key
                        }
                    } else {
                        return {
                            key: e.key, value: e.key,
                            label: e['title_' + lang] || e.title || this.$t(e.key),
                        }
                    }
                })
                return rtn
            },
        },
    }
</script>

<style lang="less" scoped>
    .title {
        width: 100%;
        text-align: center;
        margin: 60px 0;
        font-size: 18px;
        color: #999;
    }

    .form-area {
        .select-root {
            text-align: left;
        }
    }

    .success,
    .success:hover,
    .success:visited {
        background-color: @success-color;
        color: white;
    }

    .reset,
    .reset:hover,
    .reset:visited {
        background-color: @warning-color;
        color: white;
    }

    .img {
        width: 19.2rem;
        height: 10.8rem;
        border-radius: 0.04rem;
        margin-left: 0.3rem;
        margin-top: 0.3rem;
        object-fit: cover;
    }

    .form-area :deep(.ant-form-item) {
        margin-bottom: 5px;
    }

    .form-area :deep(.ant-input, .ant-picker-input) {
        background: rgba(0, 0, 0, 0);
        color: white;
    }

    .form-area :deep(.ant-select-selection) {
        background: rgba(0, 0, 0, 0);
        color: white;
    }

    .combtn :deep(.ant-calendar-picker-container .ant-calendar-picker-container-placement-bottomLeft) {
        position: absolute;
        top: 0;
        left: 0;
    }

    .form-area :deep(.ant-picker-input input) {
        color: white
    }

    .form-area :deep(.ant-select-selector) {
        background-color: rgba(153, 153, 153, 0);
    }
</style>