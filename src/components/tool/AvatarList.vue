<template>
  <div class="avatar-list">
    <slot> </slot>
  </div>
</template>

<script>
import { plantRenderPara } from '../../utils/gogocodeTransfer'
import * as Vue from 'vue'
import AAvatar from 'ant-design-vue/es/avatar/Avatar'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
const Item = {
  name: 'AvatarListItem',
  props: {
    size: {
      type: String,
      required: false,
      default: 'small',
    },
    src: {
      type: String,
      required: true,
    },
    tips: {
      type: String,
      required: false,
    },
  },
  methods: {
    renderAvatar(h, size, src) {
      return h(AAvatar, { props: { size: size, src: src } }, [])
    },
  },
  render() {
    const avatar = this.renderAvatar(Vue.h, this.$props.size, this.$props.src)
    return Vue.h('li', plantRenderPara({ class: 'avatar-item' }), [
      this.$props.tips
        ? Vue.h(
            ATooltip,
            plantRenderPara({ props: { title: this.$props.tips } }),
            [avatar]
          )
        : avatar,
    ])
  },
}
export default {
  name: 'AvatarList',
  Item: Item,
}
</script>

<style lang="less" scoped>
.avatar-list {
  display: inline-block;
  display: inline-block;
  margin-left: 8px;
  font-size: 0;
  .avatar-item {
    display: inline-block;
    font-size: 14px;
    margin-left: -8px;
    width: 20px;
    height: 20px;
    :global {
      .ant-avatar {
        border: 1px solid #fff;
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
