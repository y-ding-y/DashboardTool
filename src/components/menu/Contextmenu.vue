<template>
    <a-menu v-show="visible" class="contextmenu" :style="style" :selectedKeys="selectedKeys" @click="handleClick">
        <a-menu-item :key="item.key" v-for="item in itemList">
            <!-- <a-icon v-if="item.icon" :type="item.icon" /> -->
            <component v-if="item.icon" :is="item.icon+'-outlined'"></component>
            <span>{{ item.text }}</span>
        </a-menu-item>
    </a-menu>
</template>

<script>
    import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
    export default {
        name: 'Contextmenu',
        props: {
            visible: {
                type: Boolean,
                required: false,
                default: false,
            },
            itemList: {
                type: Array,
                required: true,
                default: () => [],
            },
        },
        data() {
            return {
                left: 0,
                top: 0,
                target: null,
                meta: null,
                selectedKeys: [],
            }
        },
        computed: {
            style() {
                return {
                    left: this.left + 'px',
                    top: this.top + 'px',
                }
            },
        },
        created() {
            window.addEventListener('click', this.closeMenu)
            window.addEventListener('contextmenu', this.setPosition)
        },
        beforeUnmount() {
            window.removeEventListener('click', this.closeMenu)
            window.removeEventListener('contextmenu', this.setPosition)
        },
        methods: {
            closeMenu() {
                $emit(this, 'update:visible', false)
            },
            setPosition(e) {
                this.left = e.clientX
                this.top = e.clientY
                this.target = e.target
                this.meta = e.meta
            },
            handleClick({ key }) {
                $emit(this, 'select', key, this.target, this.meta)
                this.closeMenu()
            },
        },
        emits: ['update:visible', 'select'],
    }
</script>

<style lang="less" scoped>
    .contextmenu {
        position: fixed;
        z-index: 1000;
        border-radius: 4px;
        box-shadow: -4px 4px 16px 1px @shadow-color  !important
    }

    .ant-menu-item {
        margin: 0 !important
    }
</style>