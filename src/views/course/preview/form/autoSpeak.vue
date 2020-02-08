<template>
  <div class="item-form">
    <div class="img-box" @click="playVoice(form)">
      <img :src="assetsDomain + form.image" alt="">
    </div>
    <span class="sentence">{{form.sentence}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form'],
  data () {
    return {
      isPlay: false
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    playVoice (form) {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + form.sound
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
.item-form {
  position: relative;
  width: 100%;
  height: 100%;
}
.img-box {
  width: 100%;
  height: 207px;
  &:hover {
    cursor: pointer;
    transform: scale(1.02);
    transition: all 0.5s;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius:16px;
  }
}
.sentence {
  display: block;
  max-width: 100%;
  margin: 0 auto;
  font-size:20px;
  font-weight: 400;
  color:rgba(0,0,0,1);
  line-height:28px;
  padding-top: 18px;
  padding-left: 16px;
}

</style>
