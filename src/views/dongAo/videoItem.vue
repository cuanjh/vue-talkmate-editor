<template>
  <div class="video">
    <div class="video-cover">
      <div class="video-shade"></div>
      <i :class="isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'" @click="playVideo"></i>
    </div>
    <div class="num">video{{num}}</div>
  </div>
</template>

<script>
export default {
  props: ['num', 'url'],
  data () {
    return {
      isPlay: false
    }
  },
  methods: {
    playVideo () {
      // this.isPlay = !this.isPlay
      this.$emit('openVideo', this.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  display: flex;
  flex-direction: column;
  align-items: center;
  .video-cover {
    position: relative;
    width: 100px;
    height: 69px;
    // opacity: 0.34;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-image: url('../../assets/images/dongao/video-cover.png');
    background-size: cover;
    background-repeat: no-repeat;
    i {
      color: #FFFFFF;
      font-size: 26px;
      cursor: pointer;
      z-index: 1;
    }
    .video-shade {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      background: rgba($color: #000000, $alpha: .34);
    }
  }
  .num {
    margin-top: 6px;
    font-size: 15px;
    font-weight: 400;
    text-align: center;
    color: #bcbcbc;
    line-height: 21px;
  }
}
</style>
