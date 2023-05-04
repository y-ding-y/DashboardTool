<template>
    <a-drawer :visible="props.visible" class="custom-class" style="color: red" :title="props.drawerTitle"
        placement="right" @close="aclose" :width="drawerWidth">

        <a-spin :spinning="props.formLoading">
            <div class="drawerform" ref="root">
                <div class="select-root" ref="selectRoot"></div>
                <a-form ref="formitem" :rules="formRule" :model="formState" :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 16 }">
                    <div v-for="(item, index) in formItems">
                        <a-form-item v-if="item.type === 'input'" :name="item.key" :label="getTitle(item, lang,proxy)">
                            <a-input autocomplete="off" v-bind="getInputAttrs(item,proxy)"
                                v-model:value="formState[item.key]" />
                        </a-form-item>

                        <a-form-item v-if="item.type === 'password'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-input-password v-bind="getInputAttrs(item,proxy)" v-model:value=" formState[item.key]" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'numberinput'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-input v-bind="getInputAttrs(item,proxy)" v-model:value="formState[item.key]"
                                @change="inputNumber(item)" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'textarea'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-textarea v-bind="getInputAttrs(item,proxy)" v-model:value="formState[item.key]"
                                :rows="item.rows || 3" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'radio'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-radio-group v-model:value="formState[item.key]" button-style="solid">
                                <a-radio-button v-for="(m, i) in item.options" :value="m.key" :key="i">
                                    {{ m.title ||m.name }}
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'select'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-select :key="selecti" v-bind="getSelectAttrs(item,proxy)"
                                :options="getOptions(item, lang)" v-model:value="formState[item.key]"
                                :filterOption="onFilterOption" :maxTagCount="getMaxTagCount(item)"
                                :get-popup-container="() => $refs.selectRoot" @change="onSelectChange($event,item)">
                            </a-select>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'date'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-date-picker v-bind="item.attrs" :format="item.format" v-model:value="formState[item.key]"
                                class="date-picker" :get-popup-container="() => item.container || $refs.root" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'range'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-range-picker v-bind="item.attrs" :format="item.format"
                                v-model:value="formState[item.key]" :ranges="ranges" class="range-picker"
                                :get-popup-container="() => item.container || $refs.root">
                                <template v-slot:suffixIcon>
                                    <calendar-outlined />
                                </template>
                            </a-range-picker>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'switch'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-switch :checked="formState[item.key] == 'Y'" v-bind="item.attrs"
                                @change="(e) => switch_change(e ? 'Y' : 'N', item.key)" />
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'slider'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <a-row>
                                <a-col :span="12">
                                    <a-slider v-model:value="formState[item.key]" :min="item.min ||0"
                                        :max="item.max || 100" />
                                </a-col>
                                <a-col :span="4">
                                    <a-form-item :name="item.key">
                                        <a-input-number v-model:value="formState[item.key]" :min="item.min ||0"
                                            :max="item.max || 100" style="margin-left: 16px" />
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'inputtag'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
                            <div @click="focused" class="taginput">
                                <a-tag color="green" v-for="(m, index) in formState[item.key]" :key="index + '-' + m"
                                    closable @close="delete_tag(index, item.key)" style="margin: 2px">
                                    {{ m }}</a-tag>
                                <input v-bind="getInputAttrs(item,proxy)"
                                    v-inputtag="{ key: item.key, checkmethod: item.checkmethod}" id="taginput"
                                    placeholder="输入后回车" autocomplete="off" />
                            </div>
                        </a-form-item>

                        <a-form-item v-else-if="item.type === 'upload'" :name="item.key"
                            :label="getTitle(item, lang,proxy)">
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
    import { merge, } from '@/utils/util'
    const i18n = merge(require('@/i18n'), require('./i18n'))
    export default {
        i18n: i18n,
    } 
</script>

<script setup>
    import { ref, toRefs, toRef, reactive, computed, getCurrentInstance, onMounted, watch, toRaw, isProxy } from 'vue';
    import { useStore } from "vuex";
    import dayjs from 'dayjs';
    import { getInputAttrs, getMaxTagCount, getSelectAttrs, onFilterOption, getTitle, getFormat } from './form.js'
    import { isEmpty } from '@/utils/util'

    onMounted(() => {
        load()
    })
    const props = defineProps({
        visible: { type: Boolean, default: false },
        width: { type: Number, default: 0 },
        drawerTitle: { type: String, default: "Form" },
        form: { type: Object, default: () => ({}) },
        rule: { type: Object, default: () => ({}) },
        formItem: { type: Array, default: () => ([]) },
        formLoading: { type: Boolean, default: false, }
    })

    const { proxy } = getCurrentInstance();
    const store = useStore();
    const checked = ref(true)

    const drawerWidth = computed(() => (props.width == 0 ? (window.screen.width / 4) * 2 : props.width))
    const ranges = computed(() => {
        return {
            [proxy.$t('today')]: [dayjs(), dayjs()],
            [proxy.$t('thisweek')]: [
                dayjs().startOf('week'),
                dayjs().endOf('week'),
            ],
            [proxy.$t('thismonth')]: [
                dayjs().startOf('month'),
                dayjs().endOf('month'),
            ],
        }
    })
    const { form } = toRefs(props)
    const { rule } = toRefs(props)
    //const { form: formState, rule: formRule } = toRefs(props)
    const formState1 = reactive(toRef(props, 'form'))
    // const formRule = reactive(toRef(props, 'rule'))
    const formRule = rule
    const formState = form

    const title = computed(() => props.drawerTitle)

    const selecti = ref(0)
    const formItems = computed(() => {
        props.formItem.map(e => {
            let { ...attrs } = e
            e.attrs = attrs
            e.format = getFormat(e)
            if (e.type == "upload" && Array.isArray(formState.value[e.key])) {
                fileList.value = toRaw(formState.value[e.key])
                console.log("uploads")
            }
            return e
        })
        return props.formItem
    })

    var fileList = ref([])
    var allParaData = reactive([])

    const lang = store.getters['setting/lang']

    const emit = defineEmits(["closeDrawer", 'action', 'checkmethod', 'change']);

    const formitem = ref(null)

    const aclose = () => {
        reset()
        emit("closeDrawer", true);
    };
    watch(formItems, () => {
        load()
    })
    const load = () => {
        const paras = []
        const maps = {}
        props.formItem.map((item) => {
            let { key, paraKey, paraMap, paraAtt, } = item
            if (paraKey && !paras.find((e) => e.key == paraKey)) {
                paras.push({ key: paraKey, paras: paraAtt })
                if (paraMap) {
                    maps[paraKey] = paraMap
                }
            }
            return item
        })
        if (paras.length > 0)
            proxy.$funAxios.reqPost('PARA_SET', { paras }).then((res) => {
                const arrData = []
                res.data.forEach((item) => {
                    const { key, data } = item
                    const map = maps[key] || {}
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
                allParaData = arrData
                selecti.value++
            })
    }


    const formatValue = () => {
        const formValues = { ...formState.value }
        formItems.value.forEach((item) => {
            const { format, type, expandDayTime } = item
            if (format) {
                if (typeof format === 'string' && type === 'date') {
                    if (formState.value[item.key] != null)
                        formValues[item.key] = formState.value[item.key].format(format)
                    else {
                        formValues[item.key] = formState.value[item.key]
                    }
                }
                else if (typeof format === 'string' && type === 'range') {
                    if (formState.value[item.key] != null) {
                        formValues[item.key] = formState.value[item.key].map((e) => e.format(format))
                        if (expandDayTime === true) {
                            const [d0, d1] = formValues[item.key]
                            formValues[item.key] = [
                                dayjs(d0).format('YYYY-MM-DD 00:00:00'),
                                dayjs(d1).format('YYYY-MM-DD 23:59:59'),
                            ]
                        }
                    }
                    else {
                        formValues[item.key] = formState.value[item.key]
                    }
                }
                else if (type === 'switch') {
                    formValues[item.key] = format[formState.value[item.key]]
                }
            }
            else {
                formValues[item.key] = formState.value[item.key]
            }
        })
        return formValues
    }
    const submit = (e) => { //返回值调整
        formitem.value.validate().then(async (valid) => {
            const formValues = formatValue()
            reset()
            emit('action', formValues)
        }).catch(error => {
            console.log(error)
            error.errorFields.map(item => {
                proxy.$message.error(item.errors)
            })
        })

    }

    const onSelectChange = (value, e) => {
        formState.value[e.key] = value
        emit('change', formatValue())
    }

    const reset = () => { //重置表单
        formitem.value.resetFields();
    }
    const inputNumber = (e) => { //只能輸入數字 
        formState.value[e.key] = formState.value[e.key].replace(/[^\-?\d.]/g, '')
    }

    const focused = () => { //input tag 点击焦点
        document.getElementById('taginput').focus()
    }
    const delete_tag = (index, key) => { //删除input tag
        formState.value[key].splice(index, 1)
        proxy.$message.success("Delete Success")
    }

    const getOptions = (item, lang) => { //select选项   
        const paraData = allParaData.find(
            (e) => e && item.paraKey && e.key === item.paraKey
        )
        const data = paraData && paraData.data ? paraData.data : []
        const options = (item.options || []).concat(data)
        const rtn = options.map((e) => {
            if (item.optionKey) {
                if (typeof e === 'string') {
                    return { value: e, label: proxy.$t(e) }
                } else if (typeof e === 'object') {
                    return { value: e[item.optionKey], label: e.name || e.title }
                } else {
                    return {
                        value: e[item.optionKey],
                        label: e['title_' + lang] || e.title || proxy.$t(e[item.optionKey]),
                    }
                }
            }
            else {
                if (typeof e === 'string') {
                    return { value: e, label: proxy.$t(e) }
                } else if (typeof e === 'object') {
                    return { value: e.key, label: e.name || e.title }
                } else {
                    return {
                        value: e.key,
                        label: e['title_' + lang] || e.title || proxy.$t(e.key),
                    }
                }
            }
        })
        return rtn
    }

    const switch_change = (e, key) => {
        formState.value[key] = e
    }

    const handleChange = (info, item) => {
        if (info.file.size / 1024 / 1024 > 100) {
            proxy.$message.error("文件大小不能超過100M")
        }
        else {
            fileList.value = [...info.fileList];
            var max = item.max ?? 1
            fileList.value = fileList.value.slice(-max);
            formState.value[item.key] = fileList;
        }
    }

    const VInputtag = { //自定义指令-输入回车生成tag
        mounted(el, binding, vnode) {
            let that = vnode.context
            let key = binding.value.key
            el.onkeydown = (e) => {
                e = e || window.event
                if (e.keyCode == 13) {
                    if (el.value != '') {
                        var index = formState.value[key].findIndex(function (item) {
                            return item == el.value
                        })
                        if (index == -1) {
                            if (binding.value.checkmethod == undefined) {
                                formState.value[key].push(el.value)
                            } else {
                                emit('checkmethod', {
                                    prop: binding.value.checkmethod,
                                    val: el.value,
                                })
                            }
                            el.value = ''
                        } else {
                            proxy.$message.warning(el.value + ' 已存在')
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
    }


</script>

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