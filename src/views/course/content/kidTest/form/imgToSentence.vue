<template>
  <!--看图选句子（单词）-->
  <div class="form-wrap">
    <div class="correct-area">
      <div class="wrap" v-show="correct" @click="play(correct)">
        <el-image lazy :src="(assetsDomain + correct.image) | urlFix('imageView2/1/format/jpg')" fit="cover"></el-image>
      </div>
    </div>
    <div class="options">
      <div class="option" v-for="(item, index) in options" :key="form.type + index">
        <i @click="play(item)"></i>
        <span>{{ item.sentence }}</span>
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
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
      .el-image {
        width: 100px;
        height: 50px;
        border-radius: 4px;
      }
    }
  }
  .options {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    .option {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      background: #FFF;
      min-width: 80px;
      min-height: 50px;
      margin: 5px;
      padding: 5px;
      border-radius: 4px;
      i {
        width: 15px;
        min-width: 15px;
        height: 15px;
        margin-right: 5px;
        background-image: url('../../../../../assets/images/course/icon-voice.png');
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
      }
      span {
      }
    }
  }
}
</style>
