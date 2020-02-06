<template>
  <div class="item" @mouseleave="isShow = false" @mouseenter="isShow = true">
    <div class="form-type">
      <span v-show="false">{{ '自动跟读' }}</span>
      <i @click="playVoice"></i>
    </div>
    <el-image
      class="form-img"
      :src="assetsDomain + item['image']"
      fit="cover">
    </el-image>
    <div class="desc" v-html="item['sentence'].replace(new RegExp(/\./, 'g'), '.<br/>').replace(new RegExp(/\?/, 'g'), '?<br/>')">
    </div>
    <div class="handler" v-show="isShow">
      <span v-if="activeFeild == 'sound'" @click="useSound">使用声音</span>
      <span v-else @click="useImg">使用图片</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['item', 'activeFeild'],
  data () {
    return {
      isShow: false,
      isPlay: false
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  mounted () {
    console.log(this.item, this.activeFeild)
  },
  methods: {
    // 使用声音
    useSound () {
      console.log(this.item.sound)
      this.$emit('useSound', this.item.sound)
    },
    // 使用图片
    useImg () {
      console.log(this.item.image)
      this.$emit('useImg', this.item.image)
    },
    playVoice () {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.item.sound
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .item {
    position: relative;
    width: 240px;
    height: 240px;
    background: #ffffff;
    border-radius: 15px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .form-type {
      width: 200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        width: 17px;
        height: 17px;
        display: inline-block;
        background-image: url('../../../assets/images/course/icon-voice.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    .form-img {
      width: 210px;
      height: 120px;
      min-height: 120px;
      background: #D8D8D8;
      border-radius: 4px;
      margin-top: 15px;
    }
    .desc {
      width: 210px;
      height: 75px;
      margin-top: 10px;
      line-height: 18px;
      overflow: hidden;
    }
    .handler {
      position: absolute;
      background: #007AFF;
      height: 40px;
      width: 100%;
      bottom: 0;
      text-align: center;
      cursor: pointer;
      span {
        height: 40px;
        width: 100%;
        display: inline-block;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
</style>
