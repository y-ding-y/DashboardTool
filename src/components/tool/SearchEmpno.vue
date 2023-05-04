<template>
    <div>
        <a-form-item>
            <a-textarea v-if="!temp_empnos.length > 0" disabled></a-textarea>
            <div v-else style="
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 4px 11px;
          background-color: #f5f5f5;
        ">
                <a-tag v-for="(item, index) in temp_empnos" closable @close="handle_close(index)" :key="item.empno">
                    {{ item.name }}({{ item.empno }})</a-tag>
            </div>
            <a-spin :spinning="spinloading">
                <a-input v-model:value="empno" style="width: 120px" placeholder="工號" @keyup.enter="handle_search" />
                <a-button style="margin-left: 10px" :class="'success'" shape="circle" size="small"
                    @click="handle_search">
                    <plus-outlined />
                </a-button>
            </a-spin>
        </a-form-item>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
    import { reqPost } from '@/services/base'

    export default {
        props: {
            empnos: Array,
        },
        data() {
            return {
                i: 0,
                empno: '',
                spinloadcount: 0,
                temp_empnos: [],
            }
        },
        watch: {
            // temp_empnos() {
            // this.$emit("returndate", this.temp_empnos)
            // },
        },
        computed: {
            spinloading() {
                return this.spinloadcount > 0
            },
        },
        created() {
            console.log(this.empnos)
            this.temp_empnos = [...this.empnos]
        },
        methods: {
            handle_close(e) {
                this.temp_empnos.splice(e, 1)
                $emit(this, 'returndate', this.temp_empnos)
            },

            handle_search() {
                if (this.empno != '') {
                    var flag = 1
                    if (this.temp_empnos.length > 0) {
                        this.temp_empnos.some((e) => {
                            if (e.empno.toUpperCase() == this.empno.toUpperCase()) {
                                flag = 0
                                return true
                            }
                        })
                    }
                    if (flag != 0) {
                        this.spinloadcount = 1
                        reqPost('WORKER', { prop: 'geterpempno', empno: this.empno, orgid: '476' }).then(
                            (res) => {
                                this.spinloadcount--
                                if (res.data.length > 0) {
                                    this.temp_empnos.push({
                                        empno: res.data[0].empno,
                                        name: res.data[0].name,

                                    })
                                    $emit(this, 'returndate', this.temp_empnos)
                                    this.empno = ''
                                } else {
                                    this.$message.warning('工號不存在')
                                }
                            }
                        )
                    } else {
                        this.$message.error('已存在')
                    }
                } else {
                    this.$message.error('請輸入工號')
                }
            },
        },
        emits: ['returndate'],
    }
</script>

<style lang="less" scoped>
    .success,
    .success:hover,
    .success:visited {
        color: white;
        background-color: @success-color;
    }
</style>