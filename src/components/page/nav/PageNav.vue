<template>
    <div :class="['page-header', layout, pageWidth]">
        <div class="page-header-wide">
            <div class="breadcrumb">
                <a-breadcrumb>
                    <a-breadcrumb-item :key="index" v-for="(item, index) in breadcrumb">
                        <!-- <router-link v-if="breadcrumb.length - 1 > index" :to="item.url">{{
                            item.name
                            }}</router-link> -->
                            <div v-if="breadcrumb.length - 1 > index">{{
                                item.name
                                }}</div>
                        <span v-else :to="item.url">{{ item.name }}</span>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="action">
                <template v-slot:tabBarExtraContent>
                    <a-tooltip placement="left" :title="$t('fullscreen')">
                        <a-button icon="fullscreen" :style="{ borderRadius: 0 }" size="small"
                            @click="$emit('fullscreen')" />
                    </a-tooltip>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex'
    import { getRoutesMatch } from '@/utils/routerUtil'

    export default {
        name: 'PageNav',
        i18n: {
            messages: {
                cn: {
                    fullscreen: '全屏显示',
                },
                tw: {
                    fullscreen: '全屏顯示',
                },
                us: {
                    fullscreen: 'full screen display',
                },
            },
        },
        data() {
            return {}
        },
        computed: {
            ...mapState('setting', ['layout', 'showPageTitle', 'pageWidth']),
            ...mapGetters('setting', ['lang']),
            breadcrumb() {
                return getRoutesMatch(this.$route.fullPath)
            },
        },
        emits: ['fullscreen'],
    }
</script>

<style lang="less" scoped>
    @import 'index';
</style>