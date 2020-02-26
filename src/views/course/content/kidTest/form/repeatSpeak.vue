<template>
  <div class="form">
    <div class="correct-area">
      <div class="wrap" v-show="correct">
        <el-image @click="play(correct)" lazy :src="(assetsDomain + correct.image) | urlFix('imageView2/1/format/jpg')" fit="cover"></el-image>
        <div class="text">{{ correct.sentence }}</div>
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
      if (!this.form) return null
      return {
        sentence: this.form.sentence[0],
        sound: this.form.sound[0],
        image: this.form.image[0]
      }
    }
  },
  methods: {
    play (item) {
      this.audio.src = this.assetsDomain + item.sound
      this.audio.oncanplay = () => {
        this.audio.play()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 16px;
  border-radius: 4px;
  background: #F5F6FA;
  padding-bottom: 20px;
  min-height: 146px;
  .correct-area {
    text-align: center;
    width: 100%;
    padding: 20px 0 10px;
    .wrap {
      width: 150px;
      background: #FFF;
      display: inline-block;
      padding: 10px;
      border-radius: 4px;
      .el-image {
        width: 150px;
        height: 80px;
        border-radius: 4px;
        cursor: pointer;
      }
      .text {
        text-align: left;
      }
    }
  }
}
</style>
