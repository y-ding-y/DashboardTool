<template>
    <nav-layout>
        <router-view ref="page" v-slot="{ Component }">
            <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
                <component :is="Component" />
            </page-toggle-transition>
        </router-view>

    </nav-layout>
</template>

<script>
    import NavLayout from './NavLayout'
    import PageToggleTransition from '@/components/transition/PageToggleTransition'
    import { mapState } from 'vuex'

    export default {
        name: 'NavView',
        components: { PageToggleTransition, NavLayout },
        data() {
            return {
                page: {},
            }
        },
        computed: {
            ...mapState('setting', ['multiPage', 'animate']),
        },
        mounted() {
            this.page = this.$refs.page
        },
        updated() {
            this.page = this.$refs.page
        },
    }
</script>