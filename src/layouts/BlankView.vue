<template>
    <router-view v-slot="{ Component }">
        <page-toggle-transition :disabled="animate.disabled" :animate="animate.name" :direction="animate.direction">
            <component :is="Component" />
        </page-toggle-transition>
    </router-view>
</template>

<script>
    import PageToggleTransition from '../components/transition/PageToggleTransition'
    import { mapState } from 'vuex'

    export default {
        name: 'BlankView',
        components: { PageToggleTransition },
        computed: {
            ...mapState('setting', ['multiPage', 'animate']),
        },
    }
</script>