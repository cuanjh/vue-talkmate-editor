<template>
  <div :class="['form', form.type]">
    <div class="img-box">
      <img :src="assetsDomain + form.image" alt="" @click="playVoice">
    </div>
    <div class="content">
      <input type="text"
        :ref="'form' + index"
        v-model="input"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form', 'index'],
  data () {
    return {
      isPlay: false,
      input: ''
    }
  },
  created () {
    this.$on('init', () => {
      console.log('writeWords init')
      this.input = ''
      this.focus()
      this.playVoice()
    })

    this.$on('break', () => {
    })
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    focus () {
      setTimeout(() => {
        this.$refs['form' + this.index].focus()
      }, 100)
    },
    playVoice () {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.form.sound
        audio.oncanplay = () => {
          audio.play()
          this.isPlay = true
        }
        audio.onended = () => {
          this.isPlay = false
        }
      } else {
        audio.pause()
        this.isPlay = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20px;
}
input {
  background: none;
  border: 0;
  border-bottom: 1px solid #c8d4db;
  width: 90%;
  padding: 0 8px;
  padding-bottom: 3px;
  padding-top: 18px;
  font-size:17px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:24px;
}
</style>
