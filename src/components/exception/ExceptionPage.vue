<template>
    <div class="exception-page">
        <div class="img">
            <img :src="config[type].img" />
        </div>
        <div class="content">
            <h1>{{ config[type].title }}</h1>
            <div class="desc">
                {{ config[type]['desc_' + lang.toLowerCase()] || config[type].desc }}
            </div>
            <div class="action">
                <a-button type="primary" @click="backHome">back</a-button>
                {{$route.params.pathMatch}}
            </div>
        </div>
    </div>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
    import Config from './typeConfig'
    import { mapState } from 'vuex'

    export default {
        name: 'ExceptionPage',
        i18n: require('./i18n'),
        props: ['type', 'homeRoute'],
        data() {
            return {
                config: Config,
            }
        },
        computed: {
            ...mapState('setting', ['lang']),
        },
        methods: {
            backHome() {
                if (history.length) {
                    history.back()
                } else if (this.homeRoute) {
                    this.$router.push(this.homeRoute)
                } else {
                    this.$router.push('/')
                }
                $emit(this, 'backHome', this.type)
            },
        },
        emits: ['backHome'],
    }
</script>

<style lang="less" scoped>
    .exception-page {
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: @base-bg-color;

        .img {
            padding-right: 52px;
            zoom: 1;

            img {
                max-width: 430px;
            }
        }

        .content {
            h1 {
                color: #434e59;
                font-size: 72px;
                font-weight: 600;
                line-height: 72px;
                margin-bottom: 24px;
            }

            .desc {
                color: @text-color-second;
                font-size: 20px;
                line-height: 28px;
                margin-bottom: 16px;
            }
        }
    }
</style>