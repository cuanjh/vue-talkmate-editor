<template>
  <div :class="['form', form.type]">
    <a class="img-box">
      <img :src="(assetsDomain + form.image) | urlFix('imageView2/1/format/jpg')" alt="">
    </a>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  props: ['form'],
  data () {
    return {
      isPlay: false
    }
  },
  created () {
    this.$on('init', () => {
      console.log('speakToImg init')
      this.playAudio()
    })
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    playAudio () {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.form.sound
        audio.oncanplay = () => {
          audio.play()
          this.isPlay = true
        }
        audio.onended = () => {
          this.isPlay = false
          this.$parent.$emit('nextForm')
        }
      } else {
        audio.pause()
        this.isPlay = false
        this.$parent.$emit('nextForm')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
