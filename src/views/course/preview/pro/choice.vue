<template>
  <div class="choice-container">
    <div class="sentence-box">
      <a class="text-box" @click="playVoice">
        <div class="trumpet">
          <i></i>
        </div>
        <span >{{ curForm.sentence }}</span>
      </a>
    </div>
    <div class="choice-list">
      <div class="choice-item"
        :id="'form' + form.uuid"
        v-for="(form, index) in forms"
        :key="index"
        :class="[{'correct': current == index && form.sentence == curForm.sentence && addCorrect}, {'wrong': current == index && form.sentence !== curForm.sentence && addWrong}]"
        >
        <keep-alive>
          <component
            :ref="'comp-' + index"
            :is="'form-' + form.type"
            :form="form"
            :index="index" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'
import SentenceToImg from '../form/sentenceToImg'
import SpeakToImg from '../form/speakToImg'

export default {
  props: ['slideForms'],
  data () {
    return {
      curForm: this.slideForms[0],
      forms: [],
      isPlay: false,
      curIndex: 0,
      addCorrect: false,
      addWrong: false,
      current: 0
    }
  },
  created () {
    this.$on('init', () => {
      this.curForm = this.slideForms[0]
      this.forms = this.getForms()
      this.$emit('curFormPlay')
      console.log(this.slideForms, this.curForm)
    })
    this.$on('check', (obj) => {
      console.log(obj)
      this.current = obj.index
      if (this.curForm.uuid !== obj.form.uuid) {
        this.addWrong = true
        setTimeout(() => {
          this.addWrong = false
        }, 500)
        console.log(this.curIndex, this.curForm)
        return false
      } else {
        if (this.curIndex === this.slideForms.length - 1) {
          this.curIndex = obj.index
        } else {
          this.curIndex++
        }
        this.addCorrect = true
        setTimeout(() => {
          this.addCorrect = false
        }, 500)
        if (obj.form.uuid === this.slideForms[this.slideForms.length - 1].uuid) {
          return false
        }
        this.curForm = this.slideForms[this.curIndex]
        this.forms = this.getForms()
        this.$emit('curFormPlay')
      }
      console.log(this.curIndex, this.slideForms.length)
    })
    this.$on('curFormPlay', () => {
      this.playVoice()
    })
  },
  components: {
    'form-sentenceToImg': SentenceToImg,
    'form-countDown': SentenceToImg,
    'form-speakToImg': SpeakToImg
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    playVoice () {
      console.log(this.curForm)
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.curForm.sound
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
    // 从数组中随机一个
    getForms () {
      let answer = this.curForm
      let arr = [answer]
      let options = this.slideForms.filter((val) => {
        return val.sentence !== answer.sentence
      })
      console.log('options', options)
      arr = arr.concat(_.sampleSize(options, 1))
      arr = _.shuffle(arr)
      console.log('arr', arr)
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.choice-container {
  padding: 50px 20px 0;
  .trumpet {
    i {
      background-image: url('../../../../assets/images/course/icon-voice.png');
    }
  }
}
.choice-list {
  .choice-item {
    margin-bottom: 20px;
    border-radius: 16px;
  }
  .correct {
    border: 2px solid #7ED321 !important;
  }
  .wrong {
    border: 2px solid #DD2B2B !important;
  }
}
</style>
