<template>
    <div>
        <a-dropdown class="lang header-item">
            <div>
                <global-outlined /> {{ langAlias }}
            </div>
            <template v-slot:overlay>
                <a-menu @click="(val) => setLang(val.key)" :selected-keys="[lang]">
                    <a-menu-item v-for="lang in langs" :key="lang.key">{{
                        lang.short + ' ' + lang.name
                        }}</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>

</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { langs } from '@/config'

    export default {
        name: 'HeaderLanguage',
        data() {
            return { langs }
        },
        computed: {
            ...mapGetters('setting', ['lang']),
            langAlias() {
                const { alias } = this.langs.find((item) => item.key == this.lang)
                return alias
            },
        },
        methods: {
            ...mapMutations('setting', ['setLang']),
        },
    }
</script>