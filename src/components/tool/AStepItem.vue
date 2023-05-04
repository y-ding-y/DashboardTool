<template>
  <div :class="['step-item', link ? 'linkable' : null]" @click="go">
    <span :style="titleStyle">{{ title }}</span>
    <a-icon v-if="icon" :style="iconStyle" :type="icon" />
    <slot></slot>
  </div>
</template>

<script>
import { plantRenderPara } from '../../utils/gogocodeTransfer'
import * as Vue from 'vue'
const Group = {
  name: 'AStepItemGroup',
  props: {
    align: {
      type: String,
      default: 'center',
      validator(value) {
        return ['left', 'center', 'right'].indexOf(value) != -1
      },
    },
  },
  render() {
    return Vue.h(
      'div',
      plantRenderPara({
        attrs: { style: `text-align: ${this.align}; margin-top: 8px` },
      }),
      [
        Vue.h(
          'div',
          plantRenderPara({
            attrs: { style: 'text-align: left; display: inline-block;' },
          }),
          [this.$slots.default && this.$slots.default()]
        ),
      ]
    )
  },
}

export default {
  name: 'AStepItem',
  Group: Group,
  props: ['title', 'icon', 'link', 'titleStyle', 'iconStyle'],
  methods: {
    go() {
      const link = this.link
      if (link) {
        this.$router.push(link)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.step-item {
  cursor: pointer;
}
:global {
  .ant-steps-item-process {
    .linkable {
      color: @primary-color;
    }
  }
}
</style>
