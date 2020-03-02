<template>
  <div :class="['form', form.content_type]">
    <h2>{{typeName(form.content_type)}}</h2>
    <div class="trumpet-box">
      <div class="trumpet" @click="playAudio">
        <i></i>
      </div>
    </div>
    <span class="sentence">{{form.sentence}}</span>
    <div class="record">
      <i></i>
    </div>
  </div>
</template>

<script>
export default {
  props: ['form', 'contentTypes', 'assetsDomain'],
  data () {
    return {
      isPlay: false,
      audio: new Audio()
    }
  },
  created () {
    this.$on('init', () => {
      console.log('followRead init', this.form)
      this.playAudio()
    })
    this.$on('break', () => {
      this.audio.pause()
      this.isPlay = false
    })
  },
  methods: {
    playAudio () {
      this.audio = new Audio()
      if (!this.isPlay) {
        this.audio.src = this.assetsDomain + this.form.sentence_audio
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
    },
    typeName (type) {
      let obj = this.contentTypes.find(item => {
        return item.type === type
      })
      let desc = ''
      if (obj) {
        desc = obj.desc
      }
      return desc
    }
  }
}
</script>

<style lang="scss" scoped>
.sentence {
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
<style >
.preview .grade-test-content .record {
  width: 100%;
  position: absolute;
  /* bottom: 86px; */
  bottom: 10%;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview .grade-test-content .record i {
  display: inline-block;
  width: 56px;
  height: 56px;
  background: url('../../../../../assets/images/course/icon-follow-read.png') no-repeat center;
  background-size: cover;
  padding: 2px;
}
</style>
