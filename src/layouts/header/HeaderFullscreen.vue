<template>
    <div @click="$emit('fullscreen')" class="fullscreen-btn">
        <a-tooltip placement="left" title="全屏">
            <fullscreen-outlined />
        </a-tooltip>
    </div>
</template>

<script>
    export default {
        name: 'HeaderFullscreen',
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
        emits: ['fullscreen'],
    }
</script>

<style lang="less" scoped>
    .fullscreen-btn {
        margin-right: 2px;
        font-size: 100%;

        &:hover {
            margin-right: 0;
            font-size: 150%;
            color: @primary-color;
        }
    }
</style>