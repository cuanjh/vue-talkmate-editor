<template>
  <div :class="['form', form.type]">
    <div class="img-box" @click="playVoice">
      <img :src="(assetsDomain + form.image) | urlFix('imageView2/1/format/jpg')" alt="">
    </div>
    <div class="content">
      <div class="fill-gap">
        <div class="sentence">
          <span>{{ sentence }}</span>
        </div>
        <div class="words">
          <a v-for="(word, index) in words"
            class="choice-item"
            :id="'word' + index"
            :key="'word' + index"
            @click="fillWords(word, index)"
            :class="{'wrong': current == index && word !== form.options[0] && addWrong}">
            <span v-text="word"></span>
          </a>
        </div>
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
      sentence: '',
      words: [],
      addWrong: false,
      current: 0,
      audio: new Audio()
    }
  },
  created () {
    this.$on('init', () => {
      console.log('fillGap init')
      this.initAll()
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
    fillWords (word, index) {
      console.log(word, index)
      this.current = index
      if (word === this.words[0]) {
        this.sentence = this.sentence.replace(/_+/g, word)
        this.$parent.$emit('nextForm')
      } else {
        this.addWrong = true
        setTimeout(() => {
          this.addWrong = false
        }, 500)
      }
    },
    initAll () {
      this.words = this.form.options
      let word = this.words[0]
      this.sentence = this.form.sentence.replace(word, ' ______ ')
    }
  }
}
</script>

<style lang="scss" scoped>
.fill-gap {
  width: 100%;
  display: flex;
  flex-direction: column;
  .sentence {
    // margin-top: 30px;
    margin-top: 6%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 20px;
    i {
      font-style:normal;
      display: inline-block;
      min-width: 58px;
      font-size:17px;
      font-weight:400;
      color:rgba(0,0,0,1);
      height: 26px;
      line-height: 25px;
      margin-right: 10px;
      text-align: center;
      cursor: pointer;
      &.no-word {
        border-bottom: 1px solid #D8D8D8;
      }
    }
  }
}
</style>
