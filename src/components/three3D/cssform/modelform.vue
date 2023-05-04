<template>
    <div class="vform">
        <div v-if="temp_style.modelstyle.length > 0" style=" width: 100%; padding: 5px; background-color: rgb(255, 228, 192);
        margin-bottom: 5px; box-shadow: inset 0px 0px 5px rgb(209, 118, 0);height: 400px;overflow-y: scroll; ">
            <a-tag v-for="(item, index) in temp_style.modelstyle" :key="item.name + index" closable
                @close="delete_model(index)" @click="handle_exitmodel(item, index)" color="cyan" style="margin: 2px">
                {{ item.title == undefined ? index : item.title }}
            </a-tag>
        </div>

        <a-button type="primary" style="width: 100%" @click="handle_addmodel">
            <plus-outlined />
            添加交互
        </a-button>

        <a-form ref="form" layout="horizontal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :model="form">
            <a-form-item label="间隔/min">
                <a-input @keydown="handlePushKeyword($event)" @keyup.enter="handle_change"
                    v-model:value="temp_style.rotatetime"></a-input>
            </a-form-item>
            <a-form-item label="旋转速度">
                <el-slider :min="-5" :max="5" v-model="temp_style.rotatespeed" @change="handle_change">
                </el-slider>
            </a-form-item>
            <a-form-item label="相机参数">
               <a-textarea :rows="4" v-model:value="temp_style.camerajson"  @change="handle_change"></a-textarea>
            </a-form-item>
            <!-- <a-form-item label="相机PosX">
                  <a-input-number v-model="temp_style.cameraX" @change="handle_change" />
              </a-form-item>
              <a-form-item label="相机PosY">
                  <a-input-number v-model="temp_style.cameraY" @change="handle_change" />
              </a-form-item>
              <a-form-item label="相机PosX">
                  <a-input-number v-model="temp_style.cameraZ" @change="handle_change" />
              </a-form-item>
              <a-form-item label="OldTarget">
                  <a-input placeholder="{x:0,Y:0,z:0}" v-model="temp_style.oldtarget" @keydown="handlePushKeyword($event)"
                      @keyup.enter.native="handle_change" />
              </a-form-item>
              <a-form-item label="OldPosition">
                  <a-input placeholder="{x:0,Y:0,z:0}" v-model="temp_style.oldposition"
                      @keydown="handlePushKeyword($event)" @keyup.enter.native="handle_change" />
              </a-form-item>

              <a-form-item label="控制器Target">
                  <a-input placeholder="{x:0,Y:0,z:0}" v-model="temp_style.controlt" @keydown="handlePushKeyword($event)"
                      @keyup.enter.native="handle_change" />
              </a-form-item> -->
        </a-form>

        <a-modal centered title="模型样式" :visible="isaddmodel" :footer="null" @cancel="handleCancel">
            <a-form :style="{overflowY:'scroll' ,height: (pageMinHeight-150)+'px'}" :model="form" ref="form"
                layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
                <a-form-item label="Title" name="title">
                    <a-input v-model:value="form.title"></a-input>
                </a-form-item>
                <a-form-item label="模型" name="name">
                    <a-select :allowClear="true" style="width: 100%" mode="multiple" v-model:value="form.name"
                        :maxTagCount="2">
                        <a-select-option v-for="item in modelllist" :key="item.id + 'model'" :value="item.name">
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="样式" name="style">
                    <a-textarea :auto-size="{ minRows: 4 }" v-model:value="form.style"></a-textarea>
                </a-form-item>
                <a-form-item label="渲染元素" name="actionobj">
                    <!-- <a-tree-select :field-names="fieldNames" v-model:value="form.actionobj" show-search
                        style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                        placeholder="Please select" allow-clear tree-default-expand-all :tree-data="divslist" multiple>
                    </a-tree-select> -->

                    <a-select v-model:value="form.actionobj"  show-search style="width: 100%;" :allowClear="true">
                        <a-select-option v-for="(item,index) in divslist" :key="'actionobj'+index"
                            :value="item.name+item.keyid"> {{item.name}}-{{item.keyid}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="渲染数据" name="domdata">
                    <a-textarea :auto-size="{ minRows: 4 }" v-model:value="form.domdata"></a-textarea>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 8, offset: 8 }">
                    <a-button :class="'success'" @click="handle_savemodel">Save</a-button>
                    <a-button :class="'cancel'" @click="handle_cancelmodel">Cancels</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
    import { mapState } from 'vuex'
    export default {
        name: 'modelform',
        props: {
            modeldetail: {
                type: Object,
                default: () => ({}),
            },
            keyid: { type: Number, default: 0 },
            actiondivs: { type: Array, default: () => [] },
        },
        components: {
            //VFontcss
        },
        watch: {},
        data() {
            return {
                modelllist: [],
                modelname: [],
                modeltitle: '',
                modelstyle: '',
                isaddmodel: false,
                savemodeltype: 'add',
                savem: 0,

                form: {
                    name: [],
                    title: '',
                    style: '{}',
                    actionobj: '',
                    domdata: '{}'
                },
            }
        },
        created() {
            let publicdatatab = Array(this.$localForage.getItem('3dmodel'))
            Promise.all(publicdatatab).then((value) => {
                if (value[0] != null) {
                    if (value[0].length > 0) {
                        this.modelllist = value[0]
                    }
                }
            })
        },
        computed: {
            ...mapState('setting', ['pageMinHeight']),
            temp_style: {
                get: function () {
                    return this.modeldetail
                },
                set: function () { },
            },
            divslist() {
                let res = []
                this.actiondivs.map((e) => {
                    res.push({
                        ...e,
                        title: e.name + '-' + e.keyid,
                        key: e.name + e.keyid
                    })
                    if (e.name == 'comdiv') {
                        e.children.map((m) => {
                            res.push({
                                ...m,
                                title: m.name + '-' + m.keyid,
                                key: m.name + m.keyid
                            })
                        })
                    }

                })
                return res
            },
        },
        methods: {
            handle_change() {
                console.log(this.temp_style)
                $emit(this, 'modelform', { style: this.temp_style, key: this.keyid })
            },
            handlePushKeyword() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },
            hande_pushkeyenter() {
                if (event.keyCode === 13) {
                    event.preventDefault()
                    return false
                }
            },

            handle_addmodel() {
                this.isaddmodel = true
                this.savemodeltype = 'add'
                this.$refs.form.resetFields()
            },
            handle_savemodel() {
                this.isaddmodel = false
                if (this.savemodeltype == 'add') {
                    this.temp_style.modelstyle.push({ ...this.form })
                } else if (this.savemodeltype == 'update') {
                    this.temp_style.modelstyle.splice(this.savem, 1, { ...this.form })
                }
                $emit(this, 'modelform', { style: this.temp_style, key: this.keyid })
            },
            handle_cancelmodel() {
                this.isaddmodel = false
                this.$refs.form.resetFields()
            },
            handle_exitmodel(e, i) {
                this.isaddmodel = true
                this.savemodeltype = 'update'
                this.savem = i
                this.$nextTick(() => {
                    this.form = { ...e }
                })
            },
            delete_model(i) {
                this.temp_style.modelstyle.splice(i, 1)
                $emit(this, 'modelform', { style: this.temp_style, key: this.keyid })
                this.handle_cancelmodel()
            },

            handleCancel() {
                this.isaddmodel = false
            },
        },
        emits: ['modelform'],
    }
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

    .vform :deep(.ant-form-item) {
        margin-bottom: 5px;
    }
</style>