<template>
    <a-dropdown>
        <div class="header-avatar" style="cursor: pointer">
            <a-avatar class="avatar" size="large" shape="circle" :src="avatarsrc">{{
                (user.name || '').right(2)
                }}</a-avatar>
            <span class="name">{{ user.name }}</span>
        </div>
        <template v-slot:overlay>
            <a-menu :class="['avatar-menu']" :selected-keys="[$route.path]">
                <a-menu-item v-for="menu in menus" :key="menu.url" @click="goto(menu.url)">
                    <!-- <a-icon type="menu.icon" /> -->
                    <component  v-if="menu.icon" :is="menu.icon+'-outlined'"></component>
                    {{ $t(menu.title) }}
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item @click="userLogout">
                    <poweroff-outlined style="margin-right: 8px;" />
                    <span>{{ $t('userlogout') }}</span>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { logout } from '@/services/user'

    export default {
        name: 'HeaderAvatar',
        i18n: require('./i18n'),
        data() {
            return {
                icons: process.env.VUE_APP_API_WEB_URL,
                menus: [
                    { icon: 'heart', url: '/my/favor', title: 'userfavor' },
                    { icon: 'control', url: '/my/setting', title: 'usersetting' },
                ],
            }
        },
        computed: {
            ...mapGetters('account', ['user']),
            avatarsrc() {
                var src = this.icons + '/file/' + this.user.avatar + '/large'
                return this.user.avatar ? src : '/avatar.png'
            },
        },
        methods: {
            userLogout() {
                logout()
                this.$message.success(this.$t('bye'), 1)
                this.$router.push('/login')
                //this.$socket.disconnect();
            },
            goto($url) {
                if ($url !== this.$route.path) {
                    this.$router.push($url)
                }
            },
        },
    }
</script>

<style lang="less">
    .header-avatar {
        display: inline-flex;

        .avatar,
        .name {
            align-self: center;
        }

        .avatar {
            margin-right: 8px;
        }

        .name {
            font-weight: 500;
        }
    }

    .avatar-menu {
        width: 150px;
    }
</style>