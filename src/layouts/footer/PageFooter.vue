<template>
    <div class="footer">
        <div class="links">
            <!-- <a target="_blank" :key="index" :href="item.link ? item.link : 'javascript: void(0)'"
                v-for="(item, index) in linkList">
                <a-icon  :type="item.icon" />
            </a> -->
        </div>
        <div class="copyright">
            Copyright
            <copyright-circle-outlined />
            {{ copyright }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PageFooter',
        props: ['copyright', 'linkList'],
    }
</script>

<style lang="less" scoped>
    .footer {
        padding: 24px 16px;
        text-align: center;

        .copyright {
            color: @text-color-second;
            font-size: 14px;
        }

        .links {
            margin-bottom: 8px;

            a:not(:last-child) {
                margin-right: 40px;
            }

            a {
                color: @text-color-second;
                -webkit-transition: all 0.3s;
                transition: all 0.3s;
            }
        }
    }
</style>
