<template>
  <el-dialog
    :visible.sync="dialogVisible"
    append-to-body
    @close="close">
    <video id="myVideo" class="video-js"></video>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VideoPlayer',
  data () {
    return {
      dialogVisible: false,
      player: null,
      options: {
        controls: true,
        sources: []
      }
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    show (video) {
      if (!(video.mp4 || video.m3u8)) return
      const sources = [
        {
          src: this.assetsDomain + video.mp4,
          type: 'video/mp4'
        },
        {
          src: this.assetsDomain + video.m3u8,
          type: 'application/x-mpegURL'
        }
      ]
      this.dialogVisible = true
      if (this.player) {
        this.player.src(sources)
        this.player.play()
      } else {
        this.options.sources = sources
        this.$nextTick(() => {
          let ele = document.getElementById('myVideo')
          this.player = this.$video(ele, this.options, function onPlayerReady () {
            // videojs.log('Your player is ready!')
            console.log(this)
            ele.play()
          })
        })
      }
    },
    close () {
      if (this.player) {
        this.player.pause()
      }
    }
  },
  beforeDestroy () {
    // this.close()
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style>
.video-js {
  width: 100%;
}
.video-js .vjs-big-play-button {
  display: none;
}
</style>
