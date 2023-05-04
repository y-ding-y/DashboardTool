<template>
    <div class="common-layout">
        <div>
            <header-lang class="lang header-item" />
        </div>
        <div class="content">
            <slot></slot>
        </div>
        <page-footer :link-list="footerLinks" :copyright="copyright"></page-footer>
    </div>
</template>

<script setup>
    import HeaderLang from '@/layouts/header/HeaderLang'
    import PageFooter from '@/layouts/footer/PageFooter'


</script>

<script>
    import { mapState } from 'vuex'
    export default {
        name: 'CommonLayout',
        computed: {
            ...mapState('setting', ['footerLinks', 'copyright']),
        },
    }
</script>

<style scoped lang="less">
    .lang {
        float: right;
        margin: 24px;
        width: 80px;
    }

    .lang:hover {
        cursor: pointer;
    }

    .common-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: auto;
        background-color: @layout-body-background;
        background-image: url('/bg_login.svg');
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y: 110px;
        background-size: 100%;

        .content {
            padding: 32px 0;
            flex: 1;

            @media (min-width: 768px) {
                padding: 42px 0 24px;
            }
        }
    }
</style>