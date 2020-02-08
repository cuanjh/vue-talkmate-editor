<template>
  <div class="choice-container">
    <div class="sentence-box">
      <a class="text-box" @click="playVoice">
        <span >{{ curForm.sentence }}</span>
        <div class="trumpet">
          <i></i>
        </div>
      </a>
    </div>
    <div class="choice-list">
      <div class="choice-item"
        :id="'form' + form.uuid"
        v-for="(form, index) in slideForms"
        :key="index"
        >
        <keep-alive>
          <component
            :ref="'comp-' + index" :is="'form-' + form.type"
            :form='form' />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SentenceToImg from '../form/sentenceToImg'

export default {
  props: ['slideForms'],
  data () {
    return {
      curForm: this.slideForms[0],
      isPlay: false,
      addClass: false
    }
  },
  created () {
    this.$on('init', () => {
      console.log(this.slideForms)
      this.curForm = this.slideForms[0]
    })
    this.$on('check', (form) => {
      console.log(form)
      let formObj = document.getElementById('form' + form.uuid)
      console.log(formObj)
      if (this.curForm.uuid === form.uuid) {
        formObj.className = 'active'
        // this.addClass = true
      }
    })
  },
  components: {
    'form-sentenceToImg': SentenceToImg
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    playVoice () {
      console.log(this.curForm)
      let audio = new Audio()
      if (!this.isPlay) {
        audio.src = this.assetsDomain + this.curForm.sound
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
.choice-container {
  padding: 50px 20px 0;
}
.sentence-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 30px;
  .text-box {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    // width: 500px;
    // height: 90px;
    padding: 12px 22px;
    background: #2A9FE4;
    border-radius: 5px;
    box-shadow:0px 3px 10px 0px rgba(0,0,0,0.1);
    span {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      line-height: 22px;
      margin-right: 20px;
    }
    .trumpet {
      display: flex;
      i {
        background: url('../../../../assets/images/course/icon-voice.png') no-repeat center;
        background-size: cover;
        width: 22px;
        height: 20px;
        // float: right;
        // position: absolute;
        top: 34px;
        right: 34px;
      }
    }
  }
}
.choice-list {
  .choice-item {
    margin-bottom: 20px;
  }
  .active {
    border: 2px solid #7ED321 !important;
    border-radius: 16px;
    margin-bottom: 20px;
  }
}
</style>
