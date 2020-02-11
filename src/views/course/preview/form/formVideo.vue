<template>
  <div class="video-box">
      <video></video>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form'],
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    }),
    videoUrl () {
      let url = ''
      if (this.form && this.form.video) {
        url = this.assetsDomain + this.form.video
      }
      return url
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
