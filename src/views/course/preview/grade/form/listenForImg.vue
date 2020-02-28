<template>
<div :class="['form', form.content_type]">
  <h2>{{typeName(form.content_type)}}</h2>
  <div class="trumpet-box">
    <div class="trumpet" @click="playAudio">
      <i></i>
    </div>
    <span class="sentence">{{form.sentence}}</span>
  </div>
  <div class="img-list">
    <ul>
      <li v-for="(item, index) in form.imgs_choice" :key="index">
        <img :src="(assetsDomain + item) | urlFix('imageView2/1/format/jpg')" alt="">
      </li>
    </ul>
  </div>
</div>

</template>

<script>

export default {
  props: ['form', 'contentTypes', 'assetsDomain'],
  data () {
    return {
      isPlay: false
    }
  },
  created () {
    this.$on('init', () => {
      console.log('listenForImg init', this.form, this.contentTypes, this.selfContentTypes)
      this.playAudio()
    })
  },
  mounted () {
  },
  computed: {
    selfContentTypes () {
      let result = this.contentTypes.filter(item => {
        return item.model_key === this.form.content_type
      })
      return result
    }
  },
  methods: {
    playAudio () {
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.form.sentence_audio
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
    },
    typeName (type) {
      let obj = this.contentTypes.find(item => {
        return item.type === type
      })
      let desc = ''
      if (obj) {
        desc = obj.desc
      }
      return desc
    }
  }
}
</script>

<style lang="scss" scoped>
.img-list {
  background:rgba(255,255,255,1);
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  border-radius:14px;
  padding: 70px 16px 70px;
  margin: 40px 20px 0;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    li {
      width: 47%;
      height: 29%;
      padding-right: 10px;
      padding-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
      }
      &:nth-child(even) {
        padding-right: 0;
        padding-bottom: 0;
      }
    }
  }
}
</style>
<style >
.preview .grade-test-content .trumpet-box .trumpet i {
  background-image: url('../../../../../assets/images/course/icon-voice.png');
}
</style>
