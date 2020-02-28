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
      isPlay: false
    }
  },
  created () {
    this.$on('init', () => {
      console.log('followRead init', this.form)
      this.playAudio()
    })
  },
  methods: {
    playAudio () {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.form.sentence_audio
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
  background: url('../../../../../assets/images/preview/pic-bofang.png') no-repeat center;
  background-size: cover;
  padding: 2px;
}
</style>
