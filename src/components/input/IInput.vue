<template>
  <a-input
    :addon-after="addonAfter"
    :addon-before="addonBefore"
    :default-value="defaultValue"
    :disabled="disabled"
    :id="id"
    :max-length="maxLength"
    :prefix="prefix"
    :size="size"
    :suffix="suffix || lenSuffix"
    :type="type"
    :allow-clear="allowClear"
    v-model:value="sValue"
    :value="value"
    @change="onChange"
    @input="onInput"
    @pressEnter="onPressEnter"
    @keydown="onKeydown"
  >
    <template :slot="slot" v-for="slot in Object.keys($slots)">
      <slot :name="slot"></slot>
    </template>
  </a-input>
</template>

<script>
import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
export default {
  name: 'IInput',
  model: {
    prop: 'value',
    event: 'change.value',
  },
  props: [
    'addonAfter',
    'addonBefore',
    'defaultValue',
    'disabled',
    'id',
    'maxLength',
    'prefix',
    'size',
    'suffix',
    'type',
    'value',
    'allowClear',
  ],
  data() {
    return {
      sValue: this.value || this.defaultValue || '',
    }
  },
  watch: {
    value(val) {
      this.sValue = val
    },
  },
  computed: {
    lenSuffix() {
      return this.maxLength && `${(this.sValue + '').length}/${this.maxLength}`
    },
  },
  methods: {
    onChange(e) {
      $emit(this, 'change', e)
      $emit(this, 'change.value', e.target.value)
    },
    onInput(e) {
      $emit(this, 'update:value', e)
    },
    onPressEnter(e) {
      $emit(this, 'pressEnter', e)
    },
    onKeydown(e) {
      $emit(this, 'keydown', e)
    },
  },
  emits: ['change', 'change.value', 'update:value', 'pressEnter', 'keydown'],
}
</script>
