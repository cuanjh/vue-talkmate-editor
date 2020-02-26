<template>
  <!-- 造句 -->
  <div class="form-wrap">
    <div class="correct-area">
      <div class="wrap" v-show="correct">
        <i @click="play(correct)"></i>
        <span>{{ correct.sentence }}</span>
      </div>
    </div>
    <div class="options">
      <div class="option" v-for="item in form.options" :key="item">{{ item }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['form'],
  data () {
    return {
      myAudio: new Audio()
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    }),
    correct () {
      return {
        sentence: this.form.sentence[0],
        sound: this.form.sound[0],
        image: this.form.image[0],
        option: this.form.options[0]
      }
    },
    options () {
      let arr = []
      if (this.form.image && this.form.image.length && this.form.sound && this.form.sound.length) {
        this.form.image.forEach((val, index) => {
          let obj = {}
          obj['image'] = val
          if (this.form.sound[index]) {
            obj['sound'] = this.form.sound[index]
          }
          if (this.form.sentence[index]) {
            obj['sentence'] = this.form.sentence[index]
          }
          arr.push(obj)
        })
      }
      return arr
    }
  },
  methods: {
    play (item) {
      this.myAudio.src = this.assetsDomain + item.sound
      this.myAudio.oncanplay = () => {
        this.myAudio.play()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrap {
  .correct-area {
    text-align: center;
    width: 100%;
    padding: 20px 0 10px;
    .wrap {
      background: #FFF;
      display: inline-block;
      padding: 10px 20px;
      border-radius: 20px;
      i {
        width: 15px;
        min-width: 15px;
        margin-right: 10px;
        vertical-align: middle;
        height: 15px;
        display: inline-block;
        background-image: url('../../../../../assets/images/course/icon-voice.png');
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
      }
      span {
        margin: 0 5px;
        padding: 0 5px;
      }
    }
  }
  .options {
    display: flex;
    flex-direction: row;
    .option {
      background: #FFF;
      width: 100px;
      height: 50px;
      margin: 20px 5px 10px;
      padding: 2px;
      border-radius: 4px;
      text-align: center;
      line-height: 46px;
    }
  }
}
</style>
