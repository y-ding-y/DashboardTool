<template>
    <a-drawer :visible="visible" class="custom-class" style="color: red" :title="drawerTitle" placement="right"
        @close="aclose" :width="drawerWidth">
        {{form}}
        <a-spin :spinning="formLoading">
            <div class="drawerform" ref="root">
                <div class="select-root" ref="selectRoot"></div>
                <a-form v-if="formItems" ref="formitem" :rules="rule" :model="form" :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }">
                    <div v-for="(item, index) in formItems">

                        <a-form-item v-if="item.type === 'input'" :name="item.key" :label="getTitle(item, lang)">
                            <a-input autocomplete="off" v-bind="getInputAttrs(item)" v-model:value="form[item.key]" />
                        </a-form-item>

                        <a-form-item v-if="item.type === 'password'" :name="item.key" :label="getTitle(item, lang)">
                            <a-input-password v-bind="getInputAttrs(item)" v-model:value="form[item.key]" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'numberinput'" :name="item.key"
                            :label="getTitle(item, lang)">
                            <a-input v-bind="getInputAttrs(item)" v-model:value="form[item.key]"
                                @change="inputNumber(item)" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'textarea'" :name="item.key"
                            :label="getTitle(item, lang)">
                            <a-textarea v-bind="getInputAttrs(item)" v-model:value="form[item.key]"
                                :rows="item.rows || 3" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'radio'" :name="item.key" :label="getTitle(item, lang)">
                            <a-radio-group v-model:value="form[item.key]" button-style="solid">
                                <a-radio-button v-for="(m, i) in item.options" :value="m.key" :key="i">
                                    {{ m.title ||m.name }}
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'select'" :name="item.key" :label="getTitle(item, lang)">
                            <a-select v-bind="getSelectAttrs(item)" :options="getOptions(item, lang)"
                                v-model:value="form[item.key]" :filterOption="onFilterOption"
                                :maxTagCount="getMaxTagCount(item)" :get-popup-container="() => $refs.selectRoot"
                                @change="onSelectChange($event,item)">
                            </a-select>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'date'" :name="item.key" :label="getTitle(item, lang)">
                            <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="form[item.key]"
                                class="date-picker" :get-popup-container="() => item.container || $refs.root" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'range'" :name="item.key" :label="getTitle(item, lang)">
                            <a-range-picker v-bind="item.attrs" :format="item.format" v-model:value="form[item.key]"
                                :ranges="ranges" class="range-picker"
                                :get-popup-container="() => item.container || $refs.root">
                                <template v-slot:suffixIcon>
                                    <calendar-outlined />
                                </template>
                            </a-range-picker>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'switch'" :name="item.key" :label="getTitle(item, lang)">
                            <a-switch :checked="form[item.key] == 'Y'" v-bind="item.attrs"
                                @change="(e) => switch_change(e ? 'Y' : 'N', item.key)" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'slider'" :name="item.key" :label="getTitle(item, lang)">
                            <a-row>
                                <a-col :span="12">
                                    <a-slider v-model:value="form[item.key]" :min="item.min ||0"
                                        :max="item.max || 100" />
                                </a-col>
                                <a-col :span="4">
                                    <a-form-item :name="item.key">
                                        <a-input-number v-model:value="form[item.key]" :min="item.min ||0"
                                            :max="item.max || 100" style="margin-left: 16px" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'inputtag'" :name="item.key"
                            :label="getTitle(item, lang)">
                            <div @click="focused" class="taginput">
                                <a-tag color="green" v-for="(m, index) in form[item.key]" :key="index + '-' + m"
                                    closable @close="delete_tag(index, item.key)" style="margin: 2px">
                                    {{ m }}</a-tag>
                                <input v-bind="getInputAttrs(item)"
                                    v-inputtag="{ key: item.key, checkmethod: item.checkmethod}" id="taginput"
                                    placeholder="输入后回车" autocomplete="off" />
                            </div>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'upload'" :name="item.key" :label="getTitle(item, lang)">
                            <a-upload :accept="item.accept==null?'.*':item.accept" :action="item.api??'#'"
                                :multiple="true" :file-list="fileList" :list-type="item.picture?'picture':'text'"
                                @change="handleChange($event,item)" :before-upload="()=>{if(!item.api) return false}">
                                <a-button type="primary">
                                    <upload-outlined /> Upload
                                </a-button>
                            </a-upload>
                        </a-form-item>
                    </div>


                    <a-form-item :wrapper-col="{ offset: 5, span: 12 }">
                        <a-button :class="'success'" @click="submit">
                            <check-outlined /> 提交
                        </a-button>
                        <a-button :class="'warning'" style="margin-left: 10px" @click="reset">
                            <redo-outlined />重置
                        </a-button>

                    </a-form-item>
                </a-form>
            </div>
        </a-spin>
    </a-drawer>
</template>
<script>
    import { mapState } from 'vuex'
    import dayjs from 'dayjs'
    import { merge, isEmpty } from '@/utils/util'
    import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
    const i18n = merge(require('@/i18n'), require('./i18n'))
    export default {
        i18n: i18n,
        props: {
            visible: { type: Boolean, default: false },
            width: { type: Number, default: 0 },
            drawerTitle: { type: String, default: "Form" },
            form: { type: Object, default: () => ({}) },
            rule: { type: Object, default: () => ({}) },
            formItem: { type: Array, default: () => ([]) },
            formLoading: { type: Boolean, default: false, }
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
        created() {
            this.iniFormItems()
        },
        computed: {
            ...mapState('setting', ['lang']),
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
            drawerWidth() {
                return this.$props.width == 0 ? (window.screen.width / 4) * 2 : this.$props.width
            },
        },
        methods: {
            aclose() {
                this.reset()
                this.$emit("closeDrawer", true);
            },
            iniFormItems() {
                const paras = []
                const maps = {}
                this.formItems = this.formItem.map((item) => {
                    let { key, type,
                        dataIndex, value, paraKey, paraMap,
                        paraAtt, container, ...attrs } = item
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
                    else if (item.type == "upload" && Array.isArray(this.form[item.key])) {
                        this.fileList = this.form[e.key]
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
            getInputAttrs(item) {
                const def = {
                    class: 'select',
                    allowClear: true,
                    placeholder: this.$t('plsInput') + '...',
                }
                return { ...def, ...(item.attrs || {}) }
            },
            getMaxTagCount(item) {
                return item.maxTagCount ??
                    (Array.isArray(item.value) && item.value.length > 1)
                    ? item.maxTagCount
                    : 1
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

            onFilterOption(input, option) {
                const { value, label, } = option
                const rtn = (value + '*' + label)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                return rtn
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
            submit(e) { //返回值调整
                this.$refs.formitem.validate().then(async (valid) => {
                    // this.$emit('submit', this.getFormValues(), this.getFormOptions())
                    this.$emit('action', this.getFormValues())
                    console.log(this.getFormValues())
                    this.reset()
                }).catch(error => {
                    console.log(error)
                    error.errorFields.map(item => {
                        this.$message.error(item.errors)

                    })
                });
            },
            handleChange(info, item) {
                if (info.file.size / 1024 / 1024 > 100) {
                    this.$message.error("文件大小不能超過100M")
                }
                else {
                    fileList.value = [...info.fileList];
                    var max = item.max ?? 1
                    fileList.value = fileList.value.slice(-max);
                    this.form[item.key] = fileList;
                }
            },
            reset() { //重置表单
                this.$refs.formitem.resetFields();
            },

            inputNumber(e) { //只能輸入數字 
                this.form[e.key] = this.form[e.key].replace(/[^\-?\d.]/g, '')
            },

            focused() { //input tag 点击焦点
                document.getElementById('taginput').focus()
            },
            delete_tag(index, key) { //删除input tag
                this.form[key].splice(index, 1)
                this.$message.success("Delete Success")
            },

            switch_change(e, key) {
                this.form[key] = e
                console.log(this.form)
            },

            onSelectChange(value, e) {
                this.form[e.key] = value
                console.log(e)
                this.$emit('change', this.getFormValues())
            }
        },
        emits: ["closeDrawer", 'action', 'checkmethod', 'change'],
        directives: {
            inputtag: {
                beforeMount: function (el, binding, vnode) {
                    let that = binding.instance
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
                                        emit('checkmethod', {
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
                        if (e.isTrusted) {
                            el.value = ''
                            el.placeholder = '输入后回车'
                        }
                    }
                }
            },
        }

    } 
</script>

<!-- <script setup>
    import { ref, toRefs, toRef, reactive, computed, getCurrentInstance, onMounted, watch, toRaw } from 'vue';

    // const formItems = computed(() => {
    //     props.formItem.map(e => {
    //         let { ...attrs } = e
    //         e.attrs = attrs
    //         e.format = getFormat(e)
    //         if (e.type == "upload" && Array.isArray(form.value[e.key])) {

    //             fileList.value = toRaw(form.value[e.key])
    //             console.log("uploads")
    //         }
    //         return e
    //     })
    //     return props.formItem
    // }) 

</script> -->

<style scoped lang="less">
    .drawerform :deep(.ant-form-item) {
        margin-bottom: 15px;
    }

    .success,
    .success:hover,
    .success:visited {
        color: white;
        background: @success-color;
    }

    .warning,
    .warning:hover,
    .warning:visited {
        color: white;
        background: @warning-color;
    }

    .taginput {
        width: 100%;
        padding: 5px;
        margin-bottom: 5px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

    }

    #taginput {
        outline: 0;
        display: inline;
        width: 100px;
        border: 0px;
        height: 20px;

    }
</style>