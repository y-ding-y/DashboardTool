<template>
  <div class="action-size" ref="root">
    <a-tooltip title="密度">
      <a-dropdown
        placement="bottomCenter"
        :trigger="['click']"
        :get-popup-container="() => $refs.root"
      >
        <a-icon class="action" type="column-height" />
        <template v-slot:overlay>
          <a-menu :selected-keys="[value]" @click="onClick">
            <a-menu-item key="default"> 默认 </a-menu-item>
            <a-menu-item key="middle"> 中等 </a-menu-item>
            <a-menu-item key="small"> 紧密 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-tooltip>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
export default {
  name: 'ActionSize',
  props: ['value'],
  inject: ['table'],
  data() {
    return {
      selectedKeys: ['middle'],
    }
  },
  methods: {
    onClick({ key }) {
      $emit(this, 'update:value', key)
    },
  },
  emits: ['update:value'],
}
</script>

<style lang="less" scoped>
.action-size {
  display: inline-block;
}
</style>
