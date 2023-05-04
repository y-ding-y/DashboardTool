<template>
      <ef-three :height="pageMinHeight" :width="600" />
</template>

<script>
import { mapState } from 'vuex'
import EfThree from '@/components/three'
import { merge } from '@/utils/util'

const i18n = require('./i18n')

export default {
  i18n: merge(require('@/i18n'), i18n),
  components: { EfThree },

  data() {
    return {}
  },
  computed: {
    ...mapState('setting', ['pageWidth', 'pageMinHeight']),
  },
  created() {},

  mounted() {
    console.log
  },
  methods: {},
}
</script>

<style lang="less" scoped></style>
