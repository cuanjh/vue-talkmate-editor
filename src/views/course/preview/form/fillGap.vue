<template>
  <div :class="['form', form.type]">
    <div class="img-box" @click="playVoice">
      <img :src="assetsDomain + form.image" alt="">
    </div>
    <div class="content">
      <div class="fill-gap">
        <div class="sentence">
          <span>{{ sentence }}</span>
          <!-- <span class="text"
            v-for="(item, index) in sentence" :key="index">
            <i v-show="item">{{ item }}</i>
          </span> -->
        </div>
        <div class="words">
          <a v-for="(word, index) in words"
            :id="'word' + index"
            :key="'word' + index"
            @click="fillWords(word, index)">
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
      sentence: [],
      words: []
    }
  },
  created () {
    this.$on('init', () => {
      console.log('fillGap init')
      this.resetAll()
      this.playVoice()
    })
    this.$on('break', () => {
      console.log('fillGap break')
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
    fillWords (word, index) {
      console.log(word, index)
      this.sentence = this.sentence.replace(/_+/g, word)
    },
    resetAll () {
      this.words = this.form.options
      let word = this.words[0]
      let showSentence = this.form.sentence.replace(word, ' ______ ')
      console.log(this.words[0], showSentence)
      this.sentence = showSentence
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  width: 100%;
  height: 207px;
  a {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
    transition: all 0.3s;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius:16px;
  }
}
.fill-gap {
  width: 100%;
  display: flex;
  flex-direction: column;
  .sentence {
    margin-top: 30px;
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
  .words {
    margin-top: 40px;
    min-height: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    a {
      cursor: pointer;
      padding: 10px 20px;
      margin-right: 16px;
      margin-bottom: 6px;
      border-radius: 4px;
      background:rgba(255,255,255,1);
      box-shadow:0px 11px 51px -13px rgba(0,0,0,0.4);
      border-radius:5px;
      span {
        font-size:16px;
        font-weight:400;
        color:rgba(68,68,68,1);
      }
    }
  }
}
</style>
