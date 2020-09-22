<template>
  <div :class="['form', form.type]">
    <div class="img-box">
      <img :src="(assetsDomain + form.image) | urlFix('imageView2/1/format/jpg')" alt="" @click="playVoice">
    </div>
    <div class="content">
      <div class="choice-item sentences"
        :id="'sentences' + index"
        v-for="(item, index) in form.options"
        :key="index"
        :class="[{'correct': item == form.sentence && addCorrect}, {'wrong': item !== form.sentence && addWrong}]">
        <span class="sentence" @click="check(item, index)">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form'],
  data () {
    return {
      isPlay: false,
      options: [],
      words: [],
      addCorrect: false,
      addWrong: false,
      audio: new Audio()
    }
  },
  created () {
    this.$on('init', () => {
      this.resetAll()
      this.playVoice()
    })
    this.$on('break', () => {
      this.resetAll()
    })
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
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
    },
    // 选择答案
    check (item, index) {
      if (item === this.form.sentence) {
        this.addCorrect = true
        setTimeout(() => {
          this.addCorrect = false
        }, 500)
        this.$parent.$emit('nextForm')
      } else {
        this.addWrong = true
        setTimeout(() => {
          this.addWrong = false
        }, 1000)
      }
    },
    reset (index) {
      var word = this.options[index]
      this.options[index] = ''
      this.words.push(word)
    },
    resetAll () {
      this.audio.pause()
      this.isPlay = false
      let allWords = this.form.options
      console.log(allWords)
      this.words = allWords
      this.options = []
      this.words.forEach(item => {
        this.options.push('')
      })
      console.log(this.words, this.options)
    }
  }
}
</script>

<style lang="scss" scoped>
.make-sentence {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.content {
  width: 100%;
  padding-top: 44px;
  .sentences {
    cursor: pointer;
    width: 100%;
    // height: 60px;
    display: inline-block;
    background:rgba(255,255,255,1);
    box-shadow:0px 11px 51px -13px rgba(0,0,0,0.14);
    border-radius:8px;
    margin-bottom: 16px;
    padding: 4% 4px 4% 20px;
    // padding: 0 30px 0 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    &:last-child {
      margin-bottom: 0;
    }
    a {
      display: inline-block;
      width:17px;
      height:15px;
      i {
        display: inline-block;
        width:17px;
        height:15px;
        background: url('../../../../../assets/images/course/icon-voice.png') no-repeat center;
        background-size: cover;
      }
    }
    .line {
      display: inline-block;
      width:1px;
      height:23px;
      background: #979797;
      margin: 0 10% 0 10px;
    }
    .sentence {
      cursor: pointer;
      font-size:15px;
      font-weight:400;
      color:rgba(0,0,0,1);
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
    }
  }
}
</style>
