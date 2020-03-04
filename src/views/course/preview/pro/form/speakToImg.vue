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
      isPlay: false,
      audio: new Audio()
    }
  },
  created () {
    this.$on('init', () => {
      console.log('speakToImg init')
      this.playAudio()
    })
    this.$on('break', () => {
      this.audio.pause()
      this.isPlay = false
    })
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    playAudio () {
      this.audio = new Audio()
      if (!this.isPlay) {
        this.audio.src = this.assetsDomain + this.form.sound
        this.audio.oncanplay = () => {
          this.audio.play()
          this.isPlay = true
        }
        this.audio.onended = () => {
          this.isPlay = false
          this.$parent.$emit('nextForm')
        }
      } else {
        this.audio.pause()
        this.isPlay = false
        this.$parent.$emit('nextForm')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
