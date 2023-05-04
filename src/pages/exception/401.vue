<template>
  <exception-page
    :home-route="'/' + site"
    :style="`min-height: ${minHeight}`"
    type="401"
  />
</template>

<script>
import ExceptionPage from '@/components/exception/ExceptionPage'
import { mapState } from 'vuex'
export default {
  name: 'Exp401',
  components: { ExceptionPage },
  computed: {
    ...mapState('setting', ['pageMinHeight', 'site']),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh'
    },
  },
}
</script>
