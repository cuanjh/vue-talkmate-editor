<template>
  <!-- 听音选图片 -->
  <div class="form-wrap">
    <div class="correct-area">
      <div class="wrap">
        <span>{{ form.sentence.replace(form.words_choice[0], '_____') }}</span>
      </div>
    </div>
    <div class="options" v-show="form.words_choice.length">
      <div class="option" v-for="(item, index) in form.words_choice" :key="index">
        {{ item }}
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
      audio: new Audio()
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
        image: this.form.image[0]
      }
    },
    options () {
      let arr = []
      if (this.form.image && this.form.image.length && this.form.sound && this.form.sound.length) {
        this.form.image.forEach((val, index) => {
          let obj = {}
          obj['image'] = val
          obj['sound'] = this.form.sound[index]
          arr.push(obj)
        })
      }
      return arr
    }
  },
  methods: {
    play (audioUrl) {
      this.audio.src = this.assetsDomain + audioUrl
      this.audio.oncanplay = () => {
        this.audio.play()
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
      background: #FFF;
      display: inline-block;
      padding: 10px 20px;
      border-radius: 20px;
    }
  }
  .options {
    display: flex;
    flex-direction: column;
    justify-content:space-around;
    // align-items: center;
    text-align: center;
    margin: 0 10px;
    .option {
      background: #FFF;
      margin-top: 10px;
      padding: 7px;
      border-radius: 4px;
      cursor: pointer;
      .el-image {
        width: 100px;
        height: 50px;
        border-radius: 4px;
      }
    }
  }
}
</style>
