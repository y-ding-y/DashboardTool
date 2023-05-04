<template>
    <div>
        <a-dropdown class="header-item">
            <div>
                <block-outlined />{{ siteName }}
            </div>
            <template v-slot:overlay>
                <a-menu :selected-keys="[site]">
                    <a-menu-item v-for="e in sites" :key="e.key">
                        <a :href="'/' + e.key">
                            {{ e['name_' + lang] || e.name }}
                        </a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'HeaderSite',

        computed: {
            ...mapGetters('setting', ['lang', 'site', 'sites']),
            siteName: function () {
                const site = this.sites.find((e) => {
                    return e.key === this.site
                })
                return site['name_' + this.lang] || site.name
            },
        },
        methods: {
            changeSite: function (site) {
                console.log(site)
                this.$route.path.startsWith('/' + site) ||
                    this.$router.push({ path: '/' + site })
            },
        },
    }
</script>