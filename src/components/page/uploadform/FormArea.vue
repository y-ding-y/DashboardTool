<template>
    <div :class="autoHide ? 'form-area form-area-hover' : 'form-area'" ref="root" @mouseenter="mouseenter"
        @mouseleave="mouseleave">
        <div class="select-root" ref="selectRoot"></div>
        <a-descriptions size="small" bordered>
            <a-descriptions-item v-for="(item, index) in formItems" :key="index"
                v-show="item.value || mouseon || !autoHide" :label="getTitle(item, lang)" :span="item.span || '1'">
                <div v-if="item.type === 'range'">
                    <a-range-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                        :disabled-date="(current) => disabledRangeDate(current, item)"
                        @change="(dates, datesStr) => onRangeChange(dates, datesStr, item)"
                        @open-change="(open) => onRangeOpenChange(open, item)"
                        @calendarChange="(dates) => onRangeCalendarChange(dates, item)" :ranges="ranges"
                        class="range-picker" :get-calendar-container="() => item.container || $refs.root">
                        <template v-slot:suffixIcon>
                            <calendar-outlined />
                        </template>
                    </a-range-picker>
                </div>
                <div v-else-if="item.type === 'datetime'">
                    <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                        @change="(date, dateStr) => onCalendarChange(date, dateStr, item)"
                        @open-change="(open) => onCalendarOpenChange(open, item)" class="datetime-picker"
                        style="min-width: 104px" show-time
                        :get-calendar-container="() => item.container || $refs.root" />
                </div>
                <div v-else-if="item.type === 'date'">
                    <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                        @change="onDateChange(item)" class="date-picker"
                        :get-calendar-container="() => item.container || $refs.root" />
                </div>
                <div v-else-if="item.type === 'month'">
                    <a-month-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                        :placeholder="$ta('plsSelect| |time')"
                        @change="(time, timeStr) => onCalendarChange(time, timeStr, item)"
                        @open-change="(open) => onCalendarOpenChange(open, item)" class="date-picker"
                        :get-calendar-container="() => item.container || $refs.root" />
                </div>
                <div v-else-if="item.type === 'time'">
                    <a-time-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                        :placeholder="$ta('plsSelect| |time')"
                        @change="(time, timeStr) => onCalendarChange(time, timeStr, item)"
                        @open-change="(open) => onCalendarOpenChange(open, item)" class="time-picker"
                        :get-popup-container="() => item.container || $refs.root" />
                </div>
                <div v-else-if="item.type === 'select'">
                    <a-select v-bind="getSelectAttrs(item)" :options="getOptions(item, lang)" v-model:value="item.value"
                        @change="onSelectChange(item)" :filterOption="onFilterOption"
                        :maxTagCount="getMaxTagCount(item)" :get-popup-container="() => $refs.selectRoot">
                    </a-select>
                </div>
                <div v-else-if="item.type === 'switch'">
                    <a-switch v-bind="item.attrs" @change="onSwitchChange(item)" class="switch"
                        v-model:value="item.value" :checked-children="item.checked || $t('y')"
                        :un-checked-children="item.unchecked || $t('n')" />
                    <close-circle-outlined v-if="item.value !== undefined" class="close"
                        @click="(e) => onCloseClick(e, item)" theme="filled" />

                </div>
                <div v-else-if="item.type === 'input'">
                    <a-input v-bind="getInputAttrs(item)" v-model:value="item.value" />
                </div>
                <div v-else-if="item.type === 'numberinput'">
                    <a-input v-bind="getInputAttrs(item)" v-model:value="item.value"
                        oninput="value=value.replace(/[^\-?\d.]/g,'') " />
                </div>
                <!--textarea-->
                <div v-else-if="item.type === 'textarea'">
                    <a-textarea v-bind="getTextareaAttrs(item)" v-model:value="item.value" />
                </div>
                <div v-else-if="item.type === 'radio'">
                    <a-radio-group v-model:value="item.value" :options="getOptions(item, lang)" />
                </div>
                <div v-else-if="item.type === 'uploadfile'">
                    <a-upload :action="item.api" :multiple="true" :file-list="fileList" @change="handleChange"
                        :list-type="item.picture ? 'picture' : 'text'">
                        <a-button type="primary">
                            <upload-outlined /> Upload
                        </a-button>
                    </a-upload>
                </div>
            </a-descriptions-item>
        </a-descriptions>

        <div style="text-align: right; margin-top: 10px">
            <a-button style="margin-right: 10px" v-if="onSubmit && formItems && formItems.length > 0" @click="onSubmit"
                :loading="loading" type="primary" :disabled="btndisable">{{ $t('submit') }}</a-button>
        </div>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
    import { mapState } from 'vuex'
    import { reqPost } from '@/services/base'
    import moment from 'moment'
    import { merge, isEmpty } from '@/utils/util'

    const i18n = merge(require('@/i18n'), require('./i18n'))
    export default {
        name: 'FormArea',
        //i18n: merge(require('@/i18n'), require('./i18n')),
        props: {
            id: String,
            i18n: { type: Object, default: () => ({}) },
            loading: { type: Boolean, default: false },
            size: { type: String, default: 'small' },
            items: {
                type: Array,
                default: () => [],
            },
            autoHide: { type: Boolean, default: false },
            openSubmit: { type: Boolean, default: false },
        },
        created() {
            const { messages } = merge(i18n, this.i18n ?? {})
            Object.keys(messages).forEach((lang) => {
                this.$i18n.mergeLocaleMessage(lang, messages[lang])
            })
            this.iniFormItems()
        },
        mounted() {
            this.openSubmit &&
                $emit(this, 'submit', this.getFormValues(), this.getFormOptions())
        },
        watch: {},
        data() {
            return {
                formValues: {},
                formOptions: [],
                formItems: [], //  [{key,dataIndex,options},...]
                optionSet: {},
                allParaData: [], //  [ {key:paraKey,data:[{key,title,title_us,title_cn}...]},...]
                allParaMap: {}, //  { paraKey:paraMap,...}
                allParaSet: [], //  [ { key: paraKey, paras: paraAtt },...]
                mouseon: false,
                mouseTimer: null,
                fileList: [],
                btndisable: false,
            }
        },
        computed: {
            ...mapState('setting', ['lang']),
            formIdPrefix() {
                return this.id + '-ipt-'
            },
            ranges() {
                return {
                    [this.$t('today')]: [moment(), moment()],
                    [this.$t('thisweek')]: [
                        moment().startOf('week'),
                        moment().endOf('week'),
                    ],
                    [this.$t('thismonth')]: [
                        moment().startOf('month'),
                        moment().endOf('month'),
                    ],
                }
            },
        },
        methods: {
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
                        moment().add(qty, unit).startOf(unit),
                        moment().add(qty, unit).endOf(unit),
                    ]
                    : value && value[0]
                        ? [moment(value[0]), moment(value[1])]
                        : [null, null]
            },
            iniFormItems() {
                const paras = []
                const maps = {}
                this.formItems = this.items.map((item) => {
                    let {
                        key,
                        type,
                        dataIndex,
                        value,
                        paraKey,
                        paraMap,
                        paraAtt,
                        container,
                        ...attrs
                    } = item
                    item.format = this.getFormat(item)
                    item.dataIndex = dataIndex = dataIndex || key
                    item.container = container
                    item.attrs = attrs
                    if (item.type === 'range') {
                        item.value = this.iniRangeValue(value)
                    } else if (['date', 'month', 'week', 'datetime'].includes(type)) {
                        item.value = moment(value)
                    } else if (item.type == 'uploadfile') {
                        this.fileList = value
                    }
                    if (paraKey && !paras.find((e) => e.key == paraKey)) {
                        paras.push({ key: paraKey, paras: paraAtt })
                        if (paraMap) {
                            maps[paraKey] = paraMap
                        }
                    }
                    return item
                })
                this.allParaMap = maps
                this.allParaSet = paras
                this.loadParas()
            },
            getTitle(item, lang) {
                let title = ''
                if (item.title !== '' && item.title !== null) {
                    title = item['title_' + lang] || item.title || this.$t(item.key)
                } else {
                    title = ''
                }
                title += item.type != 'input' && title ? '' : ''
                return title
            },
            getMaxTagCount: (item) => {
                return item.maxTagCount ??
                    (Array.isArray(item.value) && item.value.length > 1)
                    ? 0
                    : 1
            },
            getOptions(item, lang) {
                const paraData = this.allParaData.find(
                    (e) => e && item.paraKey && e.key === item.paraKey
                )
                const data = paraData && paraData.data ? paraData.data : []
                const options = (item.options || []).concat(data)
                const rtn = options.map((e) => {
                    if (typeof e === 'string') {
                        return { key: e, label: this.$t(e), value: e }
                    } else {
                        if (item.type === 'radio') {
                            return {
                                key: e.key,
                                value: e.key,
                                label: e['title_' + lang] || e.title || this.$t(e.key),
                            }
                        } else {
                            return {
                                key: e.key,
                                value: e.key,
                                label: e['title_' + lang] || e.title || this.$t(e.key),
                            }
                        }
                    }
                })
                return rtn
            },
            getSelectAttrs(item) {
                const def = {
                    class: 'select',
                    slot: 'content',
                    allowClear: true,
                    showArrow: true,
                    showSearch: true,
                    dropdownMatchSelectWidth: false,
                    placeholder: this.$t('plsSelect') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getInputAttrs(item) {
                const def = {
                    class: 'select',
                    slot: 'content',
                    allowClear: true,
                    placeholder: this.$t('plsInput') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getTextareaAttrs(item) {
                const def = {
                    class: 'select',
                    slot: 'content',
                    allowClear: true,
                    placeholder: this.$t('plsInput') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            onFilterOption(input, option) {
                const {
                    key,
                    data: {
                        props: { title },
                    },
                } = option
                const rtn = (key + '*' + title)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                return rtn
            },
            loadParas() {
                const paras = this.allParaSet
                const param = this.allParaMap
                if (paras.length == 0) return
                reqPost('PARA_SET', { paras }).then((res) => {
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
            onSubmit() {
                $emit(this, 'submit', this.getFormValues(), this.getFormOptions())
            },
            onCloseClick(e, item) {
                e.preventDefault()
                e.stopPropagation()
                item.value = undefined
                const { backup, value } = item
                if (backup !== value) {
                    this.backupAndEmitChange(item)
                }
            },
            onCancel(item) {
                item.value = item.backup
                item.visible = false
            },
            onConfirm(item) {
                const { backup, value } = item
                item.visible = false
                if (backup !== value) {
                    this.backupAndEmitChange(item)
                }
            },
            onSwitchChange(item) {
                const { backup, value } = item
                if (backup !== value) {
                    this.backupAndEmitChange(item)
                }
            },
            onSelectChange(item) {
                this.backupAndEmitChange(item)
            },
            onRangeOpenChange(open, item) {
                item.visible = open
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!open && !momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, [moment(value[0]), moment(value[1])])
                }
            },
            onRangeChange(dates, datesStr, item) {
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!item.visible && !momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, [moment(value[0]), moment(value[1])])
                }
                item._t = dates[1]
            },
            onRangeCalendarChange(dates, item) {
                item._f = dates[0]
                item._t = null
            },
            disabledRangeDate(current, item) {
                const { maxDays, _f, _t } = item
                if (maxDays && _f && !_t) {
                    const selectV = _f.valueOf()
                    const microSeconds = maxDays * 1000 * 3600 * 24
                    return (
                        current > moment(new Date(selectV + microSeconds), 'YYYY-MM-DD') ||
                        current < moment(new Date(selectV - microSeconds), 'YYYY-MM-DD')
                    )
                } else {
                    return false
                }
            },
            onCalendarOpenChange(open, item) {
                item.visible = open
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!open && !momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, moment(value))
                }
            },
            onCalendarChange(date, dateStr, item) {
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!item.visible && !momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, moment(value))
                }
            },
            onDateChange(item) {
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, moment(value))
                }
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
            backupAndEmitChange(item, backValue = item.value) {
                const { getFormValues, getFormOptions } = this
                item.backup = backValue
                this.formValues = getFormValues(this.formItems)
                this.formOptions = getFormOptions(this.formItems)
                $emit(this, 'change', this.formValues, this.formOptions)
            },
            getFormValues(items = this.formItems) {
                const formValues = {}
                items
                    .filter(
                        (item) =>
                            item.value !== undefined && item.value !== '' && item.value !== null
                    )
                    .forEach((item) => {
                        const { value, format, type, expandDayTime } = item
                        if (format) {
                            if (typeof format === 'function') {
                                formValues[item.dataIndex] = format(item.value)
                            } else if (typeof format === 'string' && type === 'range') {
                                formValues[item.dataIndex] = value.map((e) => e.format(format))
                                if (expandDayTime === true) {
                                    const [d0, d1] = formValues[item.dataIndex]
                                    formValues[item.dataIndex] = [
                                        moment(d0).format('YYYY-MM-DD 00:00:00'),
                                        moment(d1).format('YYYY-MM-DD 23:59:59'),
                                    ]
                                }
                            } else if (
                                typeof format === 'string' &&
                                value.constructor.name === 'Moment'
                            ) {
                                formValues[item.dataIndex] = value.format(format)
                            } else {
                                formValues[item.dataIndex] = value
                            }
                        } else {
                            formValues[item.dataIndex] = value
                        }
                    })
                return formValues
            },
            getFormOptions(items = this.formItems) {
                return items
                    .filter(
                        (item) =>
                            item.value !== undefined && item.value !== '' && item.value !== null
                    )
                    .map(({ key, value, format }) => ({
                        field: key,
                        value: value,
                        format: format,
                    }))
            },
            onVisibleChange(item, index) {
                if (!item.visible) {
                    item.value = item.backup
                } else {
                    let input = document.getElementById(`${this.formIdPrefix}${index}`)
                    if (input) {
                        setTimeout(() => {
                            input.focus()
                        }, 0)
                    } else {
                        this.$nextTick(() => {
                            input = document.getElementById(`${this.formIdPrefix}${index}`)
                            input.focus()
                        })
                    }
                }
            },
            momentEqual(target, source, format) {
                if (target === source) {
                    return true
                } else if (Array.isArray(target) && Array.isArray(source)) {
                    if (target.length !== source.length) {
                        return false
                    }
                    for (let i = 0; i < target.length; i++) {
                        if (!this.momentEqual(target[i], source[i], format)) {
                            return false
                        }
                    }
                    return true
                } else if (
                    target &&
                    source &&
                    target.format(format) === source.format(format)
                ) {
                    return true
                }
                return false
            },
            mouseenter() {
                clearTimeout(this.mouseTimer)
                this.mouseon = true
            },
            mouseleave() {
                const vm = this
                this.mouseTimer = setTimeout(() => (vm.mouseon = false), 2000)
            },
            handleChange(info) {
                let fileList = [...info.fileList]
                fileList = fileList.slice(-10)
                fileList = fileList.map((file) => {
                    if (file.response) {
                        // Component will show file.url as link
                        //file.url = "http://localhost:8080/file/" + file.response.url;
                        file.id = file.response.id
                        file.name = file.response.name
                    }
                    return file
                })
                this.fileList = fileList
                if (this.fileList.length > 0) {
                    this.formItems.map((e) => {
                        if (e.type == 'uploadfile') {
                            e.value = this.fileList
                        }
                    })
                }
            },
        },
        emits: ['submit', 'change'],
    }
</script>

<style lang="less" scoped>
    .form-area {
        .select-root {
            text-align: left;
        }
    }
</style>