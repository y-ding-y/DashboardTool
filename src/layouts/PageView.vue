<template>
    <page-layout :desc="desc" :linkList="linkList">
        <template v-slot:extra>
            <div v-if="this.extraImage && !isMobile" class="extraImg">
                <img :src="extraImage" />
            </div>
        </template>
        <router-view ref="page" v-slot="{ Component }">
            <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
                <component :is="Component" />
            </page-toggle-transition>
        </router-view>

    </page-layout>
</template>

<script>
    import PageLayout from './PageLayout'
    import PageToggleTransition from '@/components/transition/PageToggleTransition'
    import { mapState } from 'vuex'

    export default {
        name: 'PageView',
        components: { PageToggleTransition, PageLayout },
        data() {
            return {
                page: {},
            }
        },
        computed: {
            ...mapState('setting', ['isMobile', 'multiPage', 'animate']),
            desc() {
                return this.page.desc
            },
            /**
             * this.page.linkList
             */
            linkList() {
                return []
            },
            extraImage() {
                return this.page.extraImage
            },
        },
        mounted() {
            this.page = this.$refs.page
        },
        updated() {
            this.page = this.$refs.page
        },
    }
</script>

<style lang="less" scoped>
    .extraImg {
        margin-top: -60px;
        text-align: center;
        width: 195px;

        img {
            width: 100%;
        }
    }
</style>