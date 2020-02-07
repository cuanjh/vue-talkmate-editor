<template>
  <div class="item" @mouseleave="isShow = false" @mouseenter="isShow = true">
    <div class="form-type">
      <span></span>
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
      <el-checkbox :text-color="'#FFFFFF'" v-model="checkedImg" @change="use('image')">使用图片</el-checkbox>
      <el-checkbox v-model="checkedSound" @change="use('sound')">使用声音</el-checkbox>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['item'],
  data () {
    return {
      isShow: false,
      isPlay: false,
      checkedImg: false,
      checkedSound: false
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    // 使用图片（声音）
    use (type) {
      this.$emit('use', {
        type: type,
        flag: type === 'image' ? this.checkedImg : this.checkedSound,
        url: type === 'image' ? this.item.image : this.item.sound
      })
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
      margin-top: 10px;
      width: 200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        float: right;
        width: 17px;
        height: 17px;
        background-image: url('../../../assets/images/course/icon-voice.png');
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
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
      background: rgba($color: #000000, $alpha: 0.1);
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
