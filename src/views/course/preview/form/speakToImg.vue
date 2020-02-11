<template>
  <div :class="['form', form.type]">
    <a>
      <img :src="assetsDomain + form.image" alt="">
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
.sentenceToImg {
  width: 100%;
  height: 207px;
}
a {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 207px;
    object-fit: cover;
    border-radius:16px;
  }
}
</style>
