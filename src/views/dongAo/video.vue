<template>
  <el-dialog
    :visible.sync="dialogVisible"
    center
    top="5vh"
    width="800px"
    @closed="closed">
    <div class="video-content">
      <video ref="video" :src="url" controls></video>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      url: '',
      videoOptions: {
        autoplay: 'play', // 自动播放
        controls: true, // 用户可以与之交互的控件
        loop: false, // 视频一结束就重新开始
        muted: false, // 默认情况下将使所有音频静音
        aspectRatio: '16:9', // 显示比率
        fullscreen: {
          options: { navigationUI: 'hide' }
        },
        sources: [
          {
            src: '',
            type: 'video/mp4'
          }
        ]
      }
    }
  },
  methods: {
    show (url) {
      this.url = 'https://uploadfile1.talkmate.com/' + url
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['video'].onloadedmetadata = () => {
          this.$refs['video'].play()
        }
      })
    },
    closed () {
      this.$refs['video'].pause()
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.video-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 750px;
  height: 500px;
}
video {
  width: 100%;
  height: 100%;
  // object-fit: cover;
}
</style>
