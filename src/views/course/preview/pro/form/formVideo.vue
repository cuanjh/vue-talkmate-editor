<template>
  <div class="video-box">
      <video
        :id="'form-video-' + index"
        :src="videoUrl"
        controls
        :poster="coverUrl"
        autoplay="autoplay"></video>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form', 'index'],
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    }),
    coverUrl () {
      let url = ''
      if (this.form && this.form.cover) {
        url = this.assetsDomain + this.form.cover
      }
      return url
    },
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
.video-box {
  width: 100%;
  height: 100%;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
