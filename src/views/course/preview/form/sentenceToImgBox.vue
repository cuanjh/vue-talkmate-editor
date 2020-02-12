<template>
  <div :class="['choice-container', form.type]">
    <div class="sentence-box">
      <a class="text-box" @click="playVoice">
        <div class="trumpet">
          <i></i>
        </div>
        <span>{{ curForm.sentence }}</span>
      </a>
    </div>
    <div class="choice-form-box">
      <div class="choice-item img-box"
        :ref="'form' + item.uuid"
        v-for="(item, index) in form.data"
        :key="index"
        :class="[{'correct': current == index && form.sentence == curForm.sentence && addCorrect}, {'wrong': current == index && form.sentence !== curForm.sentence && addWrong}]">
        <img
          :src="assetsDomain + item.image"
          @click="check(item, index)"
          alt="">
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
      curForm: this.form.data[0],
      curIndex: 0,
      addCorrect: false,
      addWrong: false,
      current: 0
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  created () {
    this.$on('init', () => {
      this.curForm = this.form.data[0]
      this.forms = this.getForms()
      this.playVoice()
      console.log(this.form.data, this.curForm)
    })
    this.$on('break', () => {
    })
  },
  methods: {
    check (item, index) {
      console.log(item)
      this.current = index
      if (this.curForm.uuid !== item.uuid) {
        this.addWrong = true
        setTimeout(() => {
          this.addWrong = false
        }, 500)
        console.log(this.curIndex, this.curForm)
        return false
      } else {
        if (this.curIndex === this.form.data.length - 1) {
          this.curIndex = index
        } else {
          this.curIndex++
        }
        this.addCorrect = true
        setTimeout(() => {
          this.addCorrect = false
        }, 500)
        console.log(this.curForm.sentence)
        if (item.uuid === this.form.data[this.form.data.length - 1].uuid) {
          return false
        }
        this.curForm = this.form.data[this.curIndex]
        this.playVoice()
      }
      console.log(this.curIndex, this.form.data.length)
    },
    playVoice () {
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
      let options = this.form.data.filter((val) => {
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
  .trumpet {
    i {
      background-image: url('../../../../assets/images/course/icon-voice.png');
    }
  }
}
</style>
