<template>
  <div class="size" ref="root">
    <a-tooltip :title="$t('size')">
      <a-dropdown
        placement="bottomCenter"
        :trigger="['click']"
        :get-popup-container="() => $refs.root"
      >
        <a-icon class="action" type="column-height" />
        <template v-slot:overlay>
          <a-menu :selected-keys="[value]" @click="onClick">
            <a-menu-item key="default">{{ $t('default') }}</a-menu-item>
            <a-menu-item key="middle">{{ $t('middle') }}</a-menu-item>
            <a-menu-item key="small">{{ $t('small') }}</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-tooltip>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
export default {
  name: 'Size',
  i18n: {
    messages: {
      cn: {
        size: '密度',
        default: '默认',
        middle: '中等',
        small: '紧密',
      },
      tw: {
        size: '密度',
        default: '默認',
        middle: '中等',
        small: '緊密',
      },
      us: {
        size: 'Size',
        default: 'Defualt',
        middle: 'Middle',
        small: 'Small',
      },
    },
  },
  props: ['value'],
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onClick({ key }) {
      $emit(this, 'update:value', key)
    },
  },
  emits: ['update:value'],
}
</script>

<style lang="less" scoped>
.size {
  display: inline-block;
}
</style>
