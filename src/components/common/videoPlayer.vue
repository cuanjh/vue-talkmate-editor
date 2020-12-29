<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      player: null
    }
  },
  mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
      videojs.log('Your player is ready!')
      console.log(this)
    })
  },
  methods: {
    show (url) {
      this.player.src([
        {
          type: 'video/mp4',
          src: url
        }
      ])
      this.player.autoplay()
    },
    close () {
      console.log(this.player)
      if (this.player) {
        this.player.pause()
      }
    }
  },
  beforeDestroy () {
    this.close()
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style>
.video-js .vjs-big-play-button {
  display: none;
}
</style>
