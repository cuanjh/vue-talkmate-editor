<template>
  <div :class="['form', form.type]">
    <div class="img-box">
      <img :src="(assetsDomain + form.image) | urlFix('imageView2/1/format/jpg')" alt="" @click="playVoice">
    </div>
    <div class="content">
      <input type="text"
        :ref="'form' + index"
        v-model="input"
        @input="check()"/>
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
      input: '',
      audio: new Audio()
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
    focus () {
      setTimeout(() => {
        this.$refs['form' + this.index].focus()
      }, 100)
    },
    check () {
      console.log(this.input)
      if (this.input === this.form.sentence) {
        this.$parent.$emit('nextForm')
      }
    },
    playVoice () {
      this.audio = new Audio()
      if (!this.isPlay) {
        this.audio.src = this.assetsDomain + this.form.sound
        this.audio.oncanplay = () => {
          this.audio.play()
          this.isPlay = true
        }
        this.audio.onended = () => {
          this.isPlay = false
        }
      } else {
        this.audio.pause()
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
