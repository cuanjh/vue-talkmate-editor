<template>
  <div :class="['form', form.content_type]">
    <h2>{{typeName(form.content_type)}}</h2>
    <div class="trumpet-box">
      <div class="trumpet" @click="playAudio(form.sentence_audio)">
        <i></i>
      </div>
      <span class="sentence">{{form.sentence}}</span>
    </div>
    <div class="choice-list">
      <ul>
        <li v-for="(word, index) in form.words_choice" :key="index">
          <span>{{word}}</span>
        </li>
      </ul>
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
      console.log('question init', this.form)
      this.playAudio(this.form.sentence_audio)
    })
    this.$on('break', () => {
      this.audio.pause()
      this.isPlay = false
    })
  },
  methods: {
    playAudio (sound) {
      this.audio = new Audio()
      if (!this.isPlay) {
        this.audio.src = this.assetsDomain + sound
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
.question {
  padding: 0 10px 0;
  box-sizing: border-box;
}
.choice-list {
  background:rgba(255,255,255,1);
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  border-radius:14px;
  margin: 10% 6px 0;
  ul {
    li {
      text-align: center;
      span {
        cursor: pointer;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:24px;
        display: inline-block;
        width: 100%;
        padding: 18px;
        border-bottom: .5px solid rgba(0, 0, 0, .2);
        box-sizing: border-box;
        &.active {
          background: #4CD964;
        }
      }
      &:last-child span {
        border-bottom: none;
      }
    }
  }
}
</style>
