<template>
    <div :class="autoHide ? 'form-area form-area-hover' : 'form-area'" ref="root" @mouseenter="mouseenter"
        @mouseleave="mouseleave">
        <div class="select-root" ref="selectRoot"></div>
        <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <div v-for="(item, index) in formItems" :key="index">
                <a-form-item v-if="item.type === 'input'" :name="item.key" :label="getTitle(item, lang)">
                    <a-input v-bind="getInputAttrs(item)" v-model:value="form[item.key]" />
                </a-form-item>
                <a-form-item v-else-if="item.type === 'enterinput'" :name="item.key" :label="getTitle(item, lang)">
                    <a-input v-bind="getInputAttrs(item)" @keyup.enter="handle_enter(item)"
                        v-model:value="form[item.key]" />
                </a-form-item>
                <a-form-item v-else-if="item.type === 'numberinput'" :name="item.key" :label="getTitle(item, lang)">
                    <a-input v-bind="getInputAttrs(item)" v-model:value="form[item.key]"
                        oninput="value=value.replace(/[^\d]/g,'')" />
                </a-form-item>
                <a-form-item v-else-if="item.type === 'radio'" :name="item.key" :label="getTitle(item, lang)">
                    <a-radio-group v-model:value="form[item.key]" button-style="solid">
                        <a-radio-button v-for="(m, i) in item.options" :value="m.key" :key="i">
                            {{ m.title }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item v-else-if="item.type === 'select'" :name="item.key" :label="getTitle(item, lang)">
                    <a-select v-bind="getSelectAttrs(item)" :options="getOptions(item, lang)"
                        v-model:value="form[item.key]" @change="onSelectChange(item)" :filterOption="onFilterOption"
                        :maxTagCount="getMaxTagCount(item)" :get-popup-container="() => $refs.selectRoot">
                    </a-select>
                </a-form-item>
                <a-form-item v-else-if="item.type === 'cascader'" :name="item.key" :label="getTitle(item, lang)">
                    <a-cascader v-bind="getSelectAttrs(item)" :options="getOptions(item, lang)"
                        v-model:value="form[item.key]" @change="onSelectChange(item)" :filterOption="onFilterOption"
                        :maxTagCount="getMaxTagCount(item)" :get-popup-container="() => $refs.selectRoot" />
                </a-form-item>

                <a-form-item v-else-if="item.type === 'textarea'" :name="item.key" :label="getTitle(item, lang)">
                    <a-textarea v-bind="getTextareaAttrs(item)" v-model:value="form[item.key]" :rows="item.rows || 3" />
                </a-form-item>

                <a-form-item v-else-if="item.type === 'date'" :name="item.key" :label="getTitle(item, lang)">
                    <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="form[item.key]"
                        @change="onDateChange(item)" class="date-picker"
                        :get-calendar-container="() => item.container || $refs.root" />
                </a-form-item>

                <a-form-item v-else-if="item.type === 'slider'" :name="item.key" :label=" getTitle(item, lang)">
                    <a-row>
                        <a-col :span="12">

                            <a-slider v-model:value="form[item.key]" :min="item.min ||0" :max="item.max || 100" />
                        </a-col>
                        <a-col :span="4">
                            <a-form-item :name="item.key">
                                <a-input-number v-model:value="form[item.key]" :min="item.min ||0"
                                    :max="item.max || 100" style="margin-left: 16px" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form-item>

                <a-form-item v-else-if="item.type === 'upload'" :name="item.key" :label="getTitle(item, lang)">
                    <a-upload :accept="item.accept == null ? '.*' : item.accept" action="#" :multiple="true"
                        :file-list="form[item.key]" v-model:value="form[item.key]"
                        :list-type="item.picture ? 'picture' : 'text'" @change="handleChange($event, item)"
                        :before-upload="beforeUpload">
                        <a-button type="primary">
                            <upload-outlined /> Upload

                        </a-button>
                    </a-upload>
                </a-form-item>

                <a-form-item v-else-if="item.type === 'imglist'" :name="item.key" :label="getTitle(item, lang)">
                    <transition>
                        <img v-if="form[item.key] != ''" :src="icons + '/file/' + form[item.key] + '/small'"
                            :large="icons + '/file/' + form[item.key] + '/large'" class="img"
                            :preview="form[item.key]" />
                    </transition>
                </a-form-item>

                <a-form-item v-else-if="item.type === 'selecttime'" :name="item.key" :label="getTitle(item, lang)">
                    <a-select v-bind="getSelectAttrs(item)" style="width: 100px" :options="item.options[0]"
                        v-model:value="form[item.key][0]" @change="onSelectChange(item)" :filterOption="onFilterOption"
                        :maxTagCount="getMaxTagCount(item)" :get-popup-container="() => $refs.selectRoot">
                    </a-select>
                    :
                    <a-select v-bind="getSelectAttrs(item)" style="width: 100px" :options="item.options[1]"
                        v-model:value="form[item.key][1]" @change="onSelectChange(item)" :filterOption="onFilterOption"
                        :maxTagCount="getMaxTagCount(item)" :get-popup-container="() => $refs.selectRoot">
                    </a-select>
                </a-form-item>

                <a-form-item v-else-if="item.type === 'taginput'" :name="item.key" :label="getTitle(item, lang)">
                    <div @click="focused" style="
              width: 100%;
              padding: 5px;
              margin-bottom: 5px;
              border: 1px solid #d9d9d9;
              border-radius: 4px;
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;
            ">
                        <a-tag color="green" v-for="(m, index) in form[item.key]" :key="index + '-' + m" closable
                            @close="delete_tag(index, item.key)" style="margin: 2px">
                            {{ m }}</a-tag>
                        <input v-drag="{ key: item.key, checkmethod: item.checkmethod }" style="
                outline: 0;
                display: inline;
                width: 100px;
                border: 0px;
                height: 20px;
              " id="taginput" placeholder="输入后回车" autocomplete="off" />
                    </div>
                </a-form-item>



                <a-form-item v-else-if="item.type === 'glbmodel'" :name="item.key" :label="getTitle(item, lang)">
                    <div>
                        <canvas :key="cavkey" style="width: 100%; height: 100%" id="threeas"></canvas>
                    </div>
                </a-form-item>
            </div>

            <!-- <a-form-item v-for="(item, index) in formItems" :key="index" :label=" getTitle(item, lang) "
      				:name="item.key"> 
      				<div v-if="item.type === 'range'">
      					<a-range-picker :format="item.format" v-model="item.value"
      						:disabled-date="(current) => disabledRangeDate(current, item)"
      						@change="(dates, datesStr) => onRangeChange(dates, datesStr, item)"
      						@open-change="(open) => onRangeOpenChange(open, item)"
      						@calendarChange="(dates) => onRangeCalendarChange(dates, item)" :ranges="ranges"
      						class="range-picker" v-bind="item.attrs"
      						:get-calendar-container="() => item.container || $refs.root">
      						<a-icon slot="suffixIcon" type="calendar" />
      					</a-range-picker>
      				</div>
      				<div v-else-if="item.type === 'datetime'">
      					<a-date-picker :format="item.format" v-model="item.value"
      						@change="(date, dateStr) => onCalendarChange(date, dateStr, item)"
      						@open-change="(open) => onCalendarOpenChange(open, item)" class="datetime-picker"
      						style="min-width:104px;" show-time v-bind="item.attrs"
      						:get-calendar-container="() => item.container || $refs.root" />
      				</div>
      				<div v-else-if="item.type === 'date'">
      					<a-date-picker :format="item.format" v-model="item.value" @change="onDateChange(item)"
      						class="date-picker" v-bind="item.attrs"
      						:get-calendar-container="() => item.container || $refs.root" />
      				</div>
      				<div v-else-if="item.type === 'month'">
      					<a-month-picker :format="item.format" v-model="item.value" :placeholder="$ta('plsSelect| |time')"
      						@change="(time, timeStr) => onCalendarChange(time, timeStr, item)"
      						@open-change="(open) => onCalendarOpenChange(open, item)" class="date-picker"
      						v-bind="item.attrs" :get-calendar-container="() => item.container || $refs.root" />
      				</div>
      				<div v-else-if="item.type === 'time'">
      					<a-time-picker :format="item.format" v-model="item.value" :placeholder="$ta('plsSelect| |time')"
      						@change="(time, timeStr) => onCalendarChange(time, timeStr, item)"
      						@open-change="(open) => onCalendarOpenChange(open, item)" class="time-picker"
      						v-bind="item.attrs" :get-popup-container="() => item.container || $refs.root" />
      				</div>
      				<div v-else-if="item.type === 'select'">
      					<a-select :options="getOptions(item, lang)" v-model="item.value" @change="onSelectChange(item)"
      						v-bind="getSelectAttrs(item)" :filterOption="onFilterOption" :maxTagCount="getMaxTagCount(item)"
      						:get-popup-container="() => $refs.selectRoot">
      					</a-select>
      				</div>
      				<div v-else-if="item.type === 'switch'">
      					<a-switch @change="onSwitchChange(item)" class="switch" v-model="item.value"
      						:checked-children="item.checked || $t('y')" :un-checked-children="item.unchecked || $t('n')"
      						v-bind="item.attrs" />
      					<a-icon v-if="item.value !== undefined" class="close" @click="(e) => onCloseClick(e, item)"
      						type="close-circle" theme="filled" />
      				</div>  
      			</a-form-item> -->
            <a-form-item :wrapper-col="{ span: 14, offset: 5 }">
                <a-button :class="'success'" v-if=" formItems && formItems.length > 0" @click="onSubmit"
                    :loading="loading" :disabled="btndisable">
                    <check-outlined />OK
                </a-button>

                <a-button :class="'reset'" v-if=" formItems && formItems.length > 0" @click="reset" :loading="loading"
                    :disabled="btndisable">
                    <redo-outlined />Reset

                </a-button>
            </a-form-item>
        </a-form>

        <div style="text-align: right; margin-top: 10px"></div>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
    import { mapState } from 'vuex'
    import { reqPost } from '@/services/base'
    import { merge, isEmpty } from '@/utils/util'
    import dayjs from 'dayjs';
    import * as THREE from 'three'
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'

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

            rules: {
                type: Object,
                default: () => ({
                    name: [
                        { required: true, message: 'Please input Name', trigger: 'blur' },
                    ],
                }),
            },
            form: {
                type: Object,
                default: () => ({ name: '' }),
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
        watch: {
            glbsrc() {
                this.cavkey++
                if (this.glbsrc != '') {
                    this.$nextTick(() => {
                        this.initThree()
                    })
                }
            },
        },
        data() {
            return {
                camera: '',
                mouse: '',
                scene: '',
                group: '',
                cavkey: 0,

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
                icons: process.env.VUE_APP_API_WEB_URL,
            }
        },
        computed: {
            glbsrc() {
                return this.form.glbsrc
            },
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
                        return { key: e, title: this.$t(e), label: this.$t(e) }
                    } else if (typeof e === 'object') {
                        if (e.children && e.children.length > 0)
                            return { key: e.key, label: e.title, value: e.key, children: this.array_option(e.children) }
                        else
                            return { key: e.key, label: e.title, value: e.key }
                    } else {
                        if (item.type === 'radio') {
                            return {
                                value: e.key,
                                label: e['title_' + lang] || e.title || this.$t(e.key),
                            }
                        } else {
                            return {
                                key: e.key,
                                title: e['title_' + lang] || e.title || this.$t(e.key),
                            }
                        }
                    }
                })

                return rtn
            },

            array_option(arr) {
                const res = arr.map((e) => {
                    if (typeof e === 'string') {
                        return { key: e, title: this.$t(e), label: this.$t(e) }
                    } else if (typeof e === 'object') {

                        if (e.children && e.children.length > 0) {
                            return { key: e.key, label: e.title, value: e.key, children: this.array_option(e.children) }
                        }
                        else {
                            return { key: e.key, label: e.title, value: e.key }
                        }

                    } else {
                        if (item.type === 'radio') {
                            return {
                                value: e.key,
                                label: e['title_' + lang] || e.title || this.$t(e.key),
                            }
                        } else {
                            return {
                                key: e.key,
                                title: e['title_' + lang] || e.title || this.$t(e.key),
                            }
                        }
                    }
                })
                return res
            },

            getSelectAttrs(item) {
                const def = {
                    class: 'select',
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
                    allowClear: true,
                    placeholder: this.$t('plsInput') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getTextareaAttrs(item) {
                const def = {
                    class: 'select',
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
            reset() {
                this.$refs.ruleForm.resetFields()
            },
            onSubmit() {
                this.$refs.ruleForm.validate().then(async (valid) => {
                    this.$emit('submit', this.getFormValues(), this.getFormOptions())
                }).catch(error => {
                    error.errorFields.map(item => {
                        this.$message.error(item.errors)

                    })
                });
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
                //return formValues
                return this.form
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
            beforeUpload() {
                return false
            },
            handleChange(info, item) {
                // const reader = new FileReader();
                // reader.readAsDataURL(info.file);
                // reader.onload = () => {
                // 	this.option.img = reader.result
                // };
                let fileList = [...info.fileList]

                fileList = fileList.slice(-1)
                if (info.file.size / 1024 / 1024 > 100) {
                    this.$message.error('文件大小不能超過100M')
                } else {
                    this.form[item.key] = fileList
                    $emit(this, 'filechange', fileList)
                }
            },
            delete_tag(index, key) {
                this.form[key].splice(index, 1)
            },
            clearForm() {
                this.$refs.ruleForm.resetFields()
            },
            handle_enter(e) {
                $emit(this, 'handle_enter', { prop: e.enterprop, val: this.form[e.key] })
            },
            displayRender(e, item) {
                this.form[item.key] = e.labels
                //	return	labels => labels.join(' / ')
            },
            initThree() {
                const group = new THREE.Group()
                const scene = new THREE.Scene()
                //	scene.fog = new THREE.Fog('#B9E6F2', 20, 100);
                scene.background = new THREE.Color('#B9E6F2')
                const canvas = document.querySelector('#threeas')
                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                })
                renderer.shadowMap.enabled = true
                this.renderer = renderer

                const camera = new THREE.PerspectiveCamera(
                    50,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    5000
                )
                camera.position.z = 2
                // camera.position.x = 0
                // camera.position.y = 0
                // camera.position.z = 2

                this.camera = camera
                // var axis = new THREE.AxisHelper(3); // 3表示轴的长度  显示坐标轴
                // scene.add(axis);
                let loader = new GLTFLoader()
                loader.load(this.form.glbsrc, (gltf) => {
                    let model = gltf.scene
                    model.traverse((o) => {
                        o.castShadow = false
                    })
                    group.add(model)
                    scene.add(group)
                })

                this.group = group
                const ambient = new THREE.AmbientLight('#fff', 1)
                scene.add(ambient) //将环境光添加到场景中

                // const pointLight = new THREE.PointLight("#fff", 0.8, 5);
                // pointLight.position.set(1, 1, 1);
                // scene.add(pointLight);

                // const pointLight2 = new THREE.PointLight("#fff", 0.8, 5);
                // pointLight2.position.set(-1, 1, 1);
                // scene.add(pointLight2);

                // const pointLight3 = new THREE.PointLight("#fff", 0.8, 5);
                // pointLight3.position.set(-1, 1, -1);
                // scene.add(pointLight3);

                // const pointLight4 = new THREE.PointLight("#fff", 0.8, 8);
                // pointLight4.position.set(1, 1, -1);
                // scene.add(pointLight4);

                // const dirLight = new THREE.DirectionalLight("#fff", 1)
                // //光源等位置
                // dirLight.position.set(5, 5, 5)
                // //可以产生阴影
                // //dirLight.castShadow = true
                // dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024)

                // scene.add(dirLight)

                this.scene = scene

                this.controls = new OrbitControls(this.camera, renderer.domElement)
                this.controls.enableDamping = true //阻尼感
                this.controls.enablePan = true
                // this.controls.minPolarAngle = 0;
                // this.controls.maxPolarAngle = 0.49 * Math.PI;
                // // this.controls.minZoom = 0;
                // this.controls.minDistance = 1;
                // this.controls.maxDistance = 100;
                var that = this
                function animate() {
                    // that.controls.target.set(0, 0, 0);
                    that.controls.update()
                    renderer.render(scene, that.camera)
                    requestAnimationFrame(animate)
                    TWEEN.update()
                    if (resizeRendererToDisplaySize(renderer)) {
                        const canvas = renderer.domElement
                        that.camera.aspect = canvas.clientWidth / canvas.clientHeight
                        that.camera.updateProjectionMatrix()
                    }
                }
                animate()

                function resizeRendererToDisplaySize(renderer) {
                    const canvas = renderer.domElement
                    var height = window.innerHeight
                    var width = window.innerWidth
                    var canvasPixelWidth = canvas.width / window.devicePixelRatio
                    var canvasPixelHeight = canvas.height / window.devicePixelRatio

                    const needResize =
                        canvasPixelWidth !== width || canvasPixelHeight !== height
                    if (needResize) {
                        renderer.setSize(width, height, false)
                    }
                    return needResize
                }
            },
            focused() {
                document.getElementById('taginput').focus()
            },
        },
        directives: {
            drag: {
                beforeMount: function (el, binding, vnode) {
                    let that = vnode.context
                    let key = binding.value.key
                    el.onkeydown = (e) => {
                        e = e || window.event
                        if (e.keyCode == 13) {
                            if (el.value != '') {
                                var index = that.form[key].findIndex(function (item) {
                                    return item == el.value
                                })
                                if (index == -1) {
                                    if (binding.value.checkmethod == undefined) {
                                        that.form[key].push(el.value)
                                    } else {
                                        $emit(that, 'checkmethod', {
                                            prop: binding.value.checkmethod,
                                            val: el.value,
                                        })
                                    }
                                    el.value = ''
                                } else {
                                    that.$message.warning(el.value + ' 已存在')
                                    el.value = ''
                                }
                            }
                        }
                    }
                    el.onfocus = (e) => {
                        if (e.isTrusted) el.placeholder = ''
                    }
                    el.onblur = (e) => {
                        if (e.isTrusted) el.placeholder = '输入后回车'
                    }
                },
            },
        },
        emits: ['submit', 'change', 'filechange', 'handle_enter', 'checkmethod'],
    }
</script>

<style lang="less" scoped>
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
</style>