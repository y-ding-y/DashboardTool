<template>
    <div :class="autoHide ? 'form-area form-area-hover' : 'form-area'" ref="root" @mouseenter="mouseenter"
        @mouseleave="mouseleave">
        <div class="select-root" ref="selectRoot"></div>
        <div class="form-item" v-show="item.value || mouseon || !autoHide" :key="index"
            v-for="(item, index) in formItems">
            <!--range-->
            <div v-if="item.type === 'range'" :class="['title', { active: item.value }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-range-picker style="width: 220px;" v-bind="item.attrs" :format="item.format"
                    v-model:value="item.value" :disabled-date="(current) => disabledRangeDate(current, item)"
                    @change="(dates, datesStr) => onRangeChange(dates, datesStr, item)"
                    @open-change="(open) => onRangeOpenChange(open, item)"
                    @calendarChange="(dates) => onRangeCalendarChange(dates, item)" :ranges="ranges"
                    class="range-picker" :size="size" :get-popup-container="() => item.container || $refs.root">
                    <template v-slot:suffixIcon>
                        <calendar-outlined />
                    </template>
                </a-range-picker>
            </div>
            <!--datetime-->
            <div v-else-if="item.type === 'datetime'" :class="['title', 'datetime', { active: item.value }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                    @change="(date, dateStr) => onCalendarChange(date, dateStr, item)"
                    @open-change="(open) => onCalendarOpenChange(open, item)" class="datetime-picker"
                    style="min-width: 104px" :size="size" show-time
                    :get-calendar-container="() => item.container || $refs.root" />
            </div>
            <!--date-->
            <div v-else-if="item.type === 'date'" :class="['title', { active: item.value }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                    @change="onDateChange(item)" class="date-picker" :size="size"
                    :get-calendar-container="() => item.container || $refs.root" />
            </div>
            <div v-else-if="item.type === 'month'" :class="['title', { active: item.value }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-month-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                    :placeholder="$ta('plsSelect| |time')"
                    @change="(time, timeStr) => onCalendarChange(time, timeStr, item)"
                    @open-change="(open) => onCalendarOpenChange(open, item)" class="date-picker" :size="size"
                    :get-calendar-container="() => item.container || $refs.root" />
            </div>
            <!--time-->
            <div v-else-if="item.type === 'time'" :class="['title', { active: item.value }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-time-picker v-bind="item.attrs" :format="item.format" v-model:value="item.value"
                    :placeholder="$ta('plsSelect| |time')"
                    @change="(time, timeStr) => onCalendarChange(time, timeStr, item)"
                    @open-change="(open) => onCalendarOpenChange(open, item)" class="time-picker" :size="size"
                    :get-popup-container="() => item.container || $refs.root" />
            </div>
            <!--select-->
            <div v-else-if="item.type === 'select'" :class="['title', { active: item.value !== undefined }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-select v-bind="getSelectAttrs(item)" :options="getOptions(item, lang)" v-model:value="item.value"
                    @change="onSelectChange(item)" :filterOption="onFilterOption" :maxTagCount="getMaxTagCount(item)"
                    :get-popup-container="() => $refs.selectRoot">
                </a-select>
            </div>
            <!--switch-->
            <div v-else-if="item.type === 'switch'" :class="['title', { active: item.value !== undefined }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-switch v-bind="item.attrs" @change="onSwitchChange(item)" class="switch" :checked="item.value"
                    :size="size" :checked-children="item.checked || $t('y')"
                    :un-checked-children="item.unchecked || $t('n')" />
                <close-circle-outlined v-if="item.value !== undefined" class="close"
                    @click="(e) => onCloseClick(e, item)" theme="filled" />

            </div>
            <!--input-->
            <div v-else-if="item.type === 'input'" :class="['title', { active: item.value !== undefined }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-input v-bind="getInputAttrs(item)" v-model:value="item.value" :size="size" />
            </div>
            <!--textarea-->
            <div v-else-if="item.type === 'textarea'" :class="['title', { active: item.value !== undefined }]">
                <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                <template v-else>{{ getTitle(item, lang) }}</template>
                <a-textarea v-bind="getTextareaAttrs(item)" v-model:value="item.value" :size="size" />
            </div>
            <!--popinput poptxt-->
            <div v-else-if="item.type === 'popinput' || item.type === 'poptextarea'"
                :class="['title', { active: item.value }]">
                <a-popover @visible-change="onVisibleChange(item, index)" v-model:value="item.visible"
                    placement="bottom" :trigger="['click']" :get-popup-container="() => item.container || $refs.root">
                    <slot v-if="item.slots && item.slots.title" :name="item.slots.title"></slot>
                    <template v-else>{{ getTitle(item, lang) }}</template>
                    <div class="value" v-if="item.value">
                        :&nbsp;&nbsp;{{
                        item.format && typeof item.format === 'function'
                        ? item.format(item.value)
                        : item.value
                        }}
                    </div>
                    <down-outlined v-if="!item.value" class="icon-down" />
                    <template v-slot:title>
                        {{$t('plsInput')}}
                    </template>
                    <template v-slot:content>
                        <div class="form-overlay">
                            <a-input v-bind="item.attrs" v-if="item.type === 'popinput'" allowClear
                                @keyup.esc="onCancel(item)" v-model:value="item.value" :size="size" />
                            <a-textarea v-bind="item.attrs" v-if="item.type === 'poptextarea'" allowClear
                                @keyup.esc="onCancel(item)" v-model:value="item.value" :size="size" />
                        </div>
                    </template>
                </a-popover>
                <close-circle-outlined v-if="item.value" @click="(e) => onCloseClick(e, item)" class="close"
                    theme="filled" />
            </div>
        </div>
        <a-button v-if="formItems && formItems.length > 0" :size="size" @click="onSubmit" :loading="loading"
            type="primary">{{ $t('search') }}</a-button>
        <!-- $listeners.submit &&  -->
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
    import { mapState } from 'vuex'
    import { reqPost } from '@/services/base'
    import { merge, isEmpty } from '@/utils/util'
    import dayjs from 'dayjs';

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
                value1: null
            }
        },
        computed: {
            ...mapState('setting', ['lang']),
            formIdPrefix() {
                return this.id + '-ipt-'
            },
            ranges() {
                return {
                    [this.$t('today')]: [dayjs(), dayjs()],
                    [this.$t('thisweek')]: [
                        dayjs().startOf('week'),
                        dayjs().endOf('week'),
                    ],
                    [this.$t('thismonth')]: [
                        dayjs().startOf('month'),
                        dayjs().endOf('month'),
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
                        item.value = dayjs(value)
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
                title += item.type != 'input' && title ? ':' : ''
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
            getSelectAttrs(item) {
                const def = {
                    class: 'select',
                    slot: 'content',
                    size: 'small',
                    allowClear: true,
                    showArrow: true,
                    showSearch: true,
                    dropdownMatchSelectWidth: true,
                    placeholder: this.$t('plsSelect') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getInputAttrs(item) {
                const def = {
                    class: 'select',
                    slot: 'content',
                    size: 'small',
                    allowClear: true,
                    placeholder: this.$t('plsInput') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getTextareaAttrs(item) {
                const def = {
                    class: 'textarea',
                    slot: 'content',
                    size: 'small',
                    allowClear: true,
                    placeholder: this.$t('plsInput') + '...',
                    autoSize: { minRows: 1, maxRows: 2 },
                }
                return { ...def, ...(item.attrs || {}) }
            },
            onFilterOption(input, option) {
                const {
                    value,
                    label
                } = option
                const rtn = (value + '*' + label)
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
                    backupAndEmitChange(item, [dayjs(value[0]), dayjs(value[1])])
                }
            },
            onRangeChange(dates, datesStr, item) {
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!item.visible && !momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, [dayjs(value[0]), dayjs(value[1])])
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
                        current > dayjs(new Date(selectV + microSeconds), 'YYYY-MM-DD') ||
                        current < dayjs(new Date(selectV - microSeconds), 'YYYY-MM-DD')
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
                    backupAndEmitChange(item, dayjs(value))
                }
            },
            onCalendarChange(date, dateStr, item) {
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!item.visible && !momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, dayjs(value))
                }
            },
            onDateChange(item) {
                const { momentEqual, backupAndEmitChange } = this
                const { value, backup, format } = item
                if (!momentEqual(value, backup, format)) {
                    backupAndEmitChange(item, dayjs(value))
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
                            item.value !== undefined &&
                            item.value !== '' &&
                            item.value !== null &&
                            !(Array.isArray(item.value) && item.value.length === 0)
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
                                        dayjs(d0).format('YYYY-MM-DD 00:00:00'),
                                        dayjs(d1).format('YYYY-MM-DD 23:59:59'),
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
        },
        emits: ['submit', 'change'],
    }
</script>

<style lang="less" scoped>
    .form-area-hover {
        &:hover {
            border: 1px solid @primary-color;
            border-radius: 4px;
            padding: 2px;
        }
    }

    .form-area {
        .select-root {
            text-align: left;
        }

        margin: -4px 0;

        .form-item {
            margin: 4px 4px;
            display: inline-block;

            .title {
                padding: 4px 8px;
                cursor: pointer;
                border-radius: 4px;
                user-select: none;
                display: inline-flex;
                align-items: center;

                .close {
                    color: @text-color-second;
                    margin-left: 4px;
                    font-size: 12px;
                    vertical-align: middle;

                    :hover {
                        color: @text-color;
                    }
                }

                .range-picker {
                    text-align: left;
                    margin-left: 4px;
                    width: 200px;
                }

                .datetime-picker {
                    margin-left: 4px;
                    width: 159px;
                }

                .date-picker {
                    margin-left: 4px;
                    width: 104px;
                }

                .time-picker {
                    margin-left: 4px;
                    width: 82px;
                }

                .switch {
                    margin-left: 4px;
                }

                .value {
                    display: inline-block;
                    overflow: hidden;
                    flex: 1;
                    vertical-align: top;
                    max-width: 120px;
                    padding-bottom: '5px;';
                    text-overflow: ellipsis;
                    word-break: break-all;
                    white-space: nowrap;
                }

                &.active {
                    background-color: @layout-bg-color;
                }
            }

            .icon-down {
                vertical-align: middle;
                font-size: 12px;
            }
        }

        .form-overlay {
            padding: 8px 0px;
            text-align: center;
        }

        .select {
            margin-left: 4px;
            max-width: 154px;
            min-width: 94px;
            height: 24px;
            text-align: left;
            overflow: hidden;
        }

        .textarea {
            margin-left: 4px;
            max-width: 154px;
            min-width: 94px;
            text-align: left;
            overflow: hidden;
        }

        .operations {
            display: flex;
            margin: -6px 0;
            justify-content: space-between;

            .btn {}
        }
    }
</style>