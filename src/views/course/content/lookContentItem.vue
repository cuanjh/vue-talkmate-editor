<template>
  <div class="item" @mouseleave="isShow = false" @mouseenter="isShow = true">
    <div class="form-type">
      <span v-if="item['image']"><i @click="playVoice"></i>({{item['image'].slice(item['image'].lastIndexOf('.') + 1) ? item['image'].slice(item['image'].lastIndexOf('.') + 1) : '无'}})</span>
      <el-button size="small" type="text" v-show="showSave" @click="save">确定</el-button>
    </div>
    <el-image
      class="form-img"
      :src="(assetsDomain + item['image']) | urlFix('imageView2/1/format/jpg')"
      fit="cover">
    </el-image>
    <el-tooltip
      effect="dark"
      placement="top"
      :content="item['sentence']">
      <div class="desc" v-html="item['sentence']">
      </div>
    </el-tooltip>
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
    }),
    showSave () {
      return this.checkedImg || this.checkedSound
    }
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
    save () {
      if (this.checkedImg) {
        this.use('image')
      }
      if (this.checkedSound) {
        this.use('sound')
      }
      this.$emit('closeUse')
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
      height: 46px;
      width: 200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        display: flex;
        flex-direction: row;
        align-items: center;
        i {
          width: 17px;
          height: 17px;
          background-image: url('../../../assets/images/course/icon-voice.png');
          background-repeat: no-repeat;
          background-size: cover;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
    .form-img {
      width: 210px;
      height: 120px;
      min-height: 120px;
      background: #D8D8D8;
      border-radius: 4px;
      margin-top: 4px;
    }
    .desc {
      width: 210px;
      height: 75px;
      margin-top: 10px;
      line-height: 18px;
      overflow: hidden;/*超出部分隐藏*/
      white-space: nowrap;/*不换行*/
      text-overflow:ellipsis;/*超出部分文字以...显示*/
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
