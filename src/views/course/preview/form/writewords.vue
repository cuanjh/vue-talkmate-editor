<template>
  <div :class="['form', form.type]">
    <div class="img-box">
      <img :src="assetsDomain + form.image" alt="" @click="playVoice">
    </div>
    <div class="content">
      <span class="text"></span>
      <input type="text"
        v-model="input"/>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import { mapState } from 'vuex'

export default {
  props: ['form'],
  data () {
    return {
      isPlay: false,
      input: ''
    }
  },
  created () {
    this.$on('init', () => {
      console.log('writeWords init')
    })

    this.$on('break', () => {
    })
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    playVoice () {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.form.sound
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
.img-box {
  width: 100%;
  height: 207px;
  a {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
    transition: all 0.3s;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius:16px;
  }
}
.content {
  padding: 0 20px;
}
input {
  background: none;
  border: 0;
  border-bottom: 1px solid #c8d4db;
  width: 90%;
  padding: 0 8px;
  padding-bottom: 3px;
  padding-top: 18px;
  font-size:17px;
  font-weight:400;
  color:rgba(0,0,0,1);
  line-height:24px;
}
</style>
