<template>
    <div>
        <a-popover :trigger="['click']">
            <template #content>
                <a-tabs v-model:activeKey="activeKey" :tabBarStyle="{ textAlign: 'center', }"
                    :style="{ width: '297px' }">
                    <a-tab-pane tab="待办" key="1">
                        <a-list class="tab-pane">
                            <a-list-item @click="to_workersign">
                                <a-list-item-meta title="上岗证E化签核">
                                    <template v-slot:avatar>
                                        <svg style="width: 3rem; height: 3rem" aria-hidden="true">
                                            <use xlink:href="#icon-fenlei"></use>
                                        </svg>
                                    </template>

                                    <template v-slot:description>
                                        <a-tag color="red"> {{ worker_sign_list }}</a-tag> 待签核
                                    </template>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-tab-pane>
                    <a-tab-pane tab="通知" key="2"> </a-tab-pane>
                    <a-tab-pane tab="消息" key="3">
                        <a-list class="tab-pane"></a-list>
                    </a-tab-pane>
                </a-tabs>

            </template>
            <a-badge class="notice-badge" :count="total" :overflow-count="10">
                <bell-outlined :class="['header-notice-icon']" @click="fetchNotice" class="header-notice" />
            </a-badge>
        </a-popover>
    </div>
</template>

<script setup>

   // console.log($funAxios)
    // this.$funAxios
    //     .reqPost('WORKER', {
    //         prop: 'getsignlist',
    //         userad: this.user.ad,
    //         unsigned: true,
    //     })
    //     .then((res) => {
    //         this.worker_sign_list = res.data.length
    //     })

</script>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'HeaderNotice',
        data() {
            return {
                loading: false,
                show: false,
                activeKey: "1",
                worker_sign_list: 0,
            }
        },
        computed: {
            ...mapGetters('account', ['user']),
            total() {
                return this.worker_sign_list + 0
            },
        },
        created() {
            // this.$socket.connect();
            // this.$socket.emit('login', JSON.stringify(this.user));
            // console.log(this.$funAxios)
            // this.$funAxios
            //     .reqPost('WORKER', {
            //         prop: 'getsignlist',
            //         userad: this.user.ad,
            //         unsigned: true,
            //     })
            //     .then((res) => {
            //         this.worker_sign_list = res.data.length
            //     })
        },
        methods: {
            fetchNotice() {
                if (this.loading) {
                    this.loading = false
                    return
                }
                this.loadding = true
                setTimeout(() => {
                    this.loadding = false
                }, 1000)
            },
            to_workersign() {
                if (this.$route.path != '/my/workerjob/workersign')
                    this.$router.push('/my/workerjob/workersign')
                // window.open("../../../sys/worker/OQA/dutyinfo?empno=" + this.empno + "&first=" + this.first + "&second=" + this.second + "&name=" + this.name,"_self");
            },
        },
    }
</script>

<style lang="less">
    .header-notice {
        display: inline-block;
        transition: all 0.3s;

        span {
            vertical-align: initial;
        }

        .notice-badge {
            color: inherit;

            .header-notice-icon {
                font-size: 16px;
                padding: 4px;
            }
        }
    }

    .dropdown-tabs {
        background-color: @base-bg-color;
        box-shadow: 0 2px 8px @shadow-color;
        border-radius: 4px;

        .tab-pane {
            padding: 0 24px 12px;
            min-height: 250px;

        }
    }

    .menuicon {
        margin: 0;
        width: 3rem;
        height: 3rem;
    }
</style>