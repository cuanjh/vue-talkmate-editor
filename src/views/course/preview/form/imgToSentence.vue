<template>
  <div :class="['form', form.type]">
    <div class="img-box">
      <a @click="playVoice">
        <img :src="(assetsDomain + form.image) | urlFix('imageView2/1/format/jpg')" alt="">
      </a>
    </div>
    <div class="content">
      <div class="choice-item sentences"
        :id="'sentences' + index"
        v-for="(item, index) in sentences"
        :key="item.uuid + index"
        :class="[{'correct': current == index && item.sentence == form.sentence && addCorrect}, {'wrong': current == index && item.sentence !== form.sentence && addWrong}]">
        <a @click="playSentence(item)"><i></i></a>
        <span class="line"></span>
        <span class="sentence" @click="check(item, index)">{{ item.sentence }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  props: ['form', 'slideForms'],
  data () {
    return {
      isPlay: false,
      sentences: [],
      current: 0,
      addCorrect: false,
      addWrong: false,
      audio: new Audio()
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  created () {
    this.$on('init', () => {
      console.log('imgToSentence init')
      console.log(this.form, this.slideForms)
      this.sentences = this.getSentences()
      this.playVoice()
    })
    this.$on('break', () => {
      this.audio.pause()
      this.isPlay = false
    })
  },
  mounted () {
    console.log(this.form, this.slideForms)
  },
  methods: {
    // 选择答案
    check  (item, index) {
      console.log(item, index)
      this.current = index
      if (item.sentence === this.form.sentence) {
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
    // 播放句子
    playSentence (item) {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + item.sound
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
    // 从句子数组中随机抽出3个句子进行选择（包含正确的句子）
    getSentences () {
      let answer = this.form
      let arr = [answer]
      let options = this.slideForms.filter((val) => {
        return val.sentence !== answer.sentence
      })
      console.log('options', options)
      arr = arr.concat(_.sampleSize(options, 2))
      arr = _.shuffle(arr)
      console.log('arr', arr)
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
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
        background: url('../../../../assets/images/course/icon-voice.png') no-repeat center;
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
