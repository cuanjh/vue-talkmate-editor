<template>
  <div :class="['form', form.type]">
    <div class="img-box">
      <img :src="(assetsDomain + form.image) | urlFix('imageView2/1/format/jpg')" alt="" @click="playVoice">
    </div>
    <div class="content">
      <div class="make-sentence">
        <span class="sentence">
          <i v-for="(itm, index) in options"
            :key="index"
            v-text="itm"
            @click="reset(index)">
          </i>
        </span>
        <div class="words">
          <a v-for="(word, index) in words"
            :key="'word' + index"
            @click="makeSentence(index)">
            <span v-text="word"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  props: ['form'],
  data () {
    return {
      isPlay: false,
      options: [],
      words: []
    }
  },
  created () {
    this.$on('init', () => {
      console.log('makeSentence init')
      this.resetAll()
      this.playVoice()
    })
    this.$on('break', () => {
      console.log('makeSentence break')
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
    },
    makeSentence (index) {
      this.$parent.$emit('setSwiperMousewheel', false)
      let word = this.words[index]
      this.words.splice(index, 1)
      let i = _.findIndex(this.options, (o) => {
        return o === ''
      })
      this.options[i] = word
      let sentence = this.options.join(' ')
      console.log(sentence, this.form.sentence)
      if (sentence === this.form.sentence) {
        this.$parent.$emit('setSwiperMousewheel', true)
        this.$parent.$emit('nextForm')
      }
      console.log('this.options', this.options)
    },
    reset (index) {
      var word = this.options[index]
      this.options[index] = ''
      this.words.push(word)
    },
    resetAll () {
      let allWords = this.form.sentence.split(' ')
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
.sentence {
  // margin-top: 30px;
  margin-top: 6%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  i {
    font-style:normal;
    min-width: 58px;
    border-bottom: 1px solid #D8D8D8;
    font-size:17px;
    font-weight:400;
    color:rgba(0,0,0,1);
    height: 26px;
    line-height: 25px;
    margin-right: 10px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
