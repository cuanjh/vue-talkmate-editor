<template>
  <div class="imgAuto-container">
    <div class="speak-swiper">
      <div :class="['swiper-container', getFormsTypes]" id="speakToImg-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide"
            v-for="(form, index) in slideForms"
            :key="form.code">
            <h2>{{typeName(form.type)}}</h2>
            <keep-alive>
              <component
                :ref="'comp-' + index"
                :is="'form-' + form.type"
                :form='form'
                :slideForms="slideForms" />
            </keep-alive>
          </div>
          <div class="swiper-slide">
            <div class="sentence-box" @click="playVoice">
              <a class="text-box" >
                <div class="trumpet">
                  <i></i>
                </div>
                <span >{{ curForm.sentence }}</span>
              </a>
            </div>
            <div class="choice-item speak-item"
              :id="'form' + form.uuid"
              v-for="(form, index) in forms"
              :key="index"
              :class="[{'correct': current == index && form.sentence == curForm.sentence && addCorrect}, {'wrong': current == index && form.sentence !== curForm.sentence && addWrong}]"
              >
              <sentence-toImg
                :ref="'comp-' + slideForms.length"
                :form="form"
                :index="index"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
import { mapState } from 'vuex'
import SpeakToImg from './form/speakToImg'
import SentenceToImg from './form/sentenceToImg'

export default {
  props: ['slideForms'],
  data () {
    return {
      curForm: this.slideForms[0],
      forms: [],
      showSentence: false,
      mySwiper: null,
      isPlay: false,
      curIndex: 0,
      addCorrect: false,
      addWrong: false,
      current: 0
    }
  },
  components: {
    'form-speakToImg': SpeakToImg, // 图片跟读
    SentenceToImg
  },
  created () {
    this.$on('init', () => {
      console.log('imgAuto init')
      this.initSwiper()
      this.initData()
      setTimeout(() => {
        this.mySwiper.init()
      }, 500)
    })
    this.$on('check', (obj) => {
      console.log(obj)
      this.current = obj.index
      if (this.curForm.uuid !== obj.form.uuid) {
        this.addWrong = true
        setTimeout(() => {
          this.addWrong = false
        }, 500)
        console.log(this.curIndex, this.curForm)
        return false
      } else {
        if (this.curIndex === this.slideForms.length - 1) {
          this.curIndex = obj.index
        } else {
          this.curIndex++
        }
        this.addCorrect = true
        setTimeout(() => {
          this.addCorrect = false
        }, 500)
        if (obj.form.uuid === this.slideForms[this.slideForms.length - 1].uuid) {
          return false
        }
        this.curForm = this.slideForms[this.curIndex]
        this.forms = this.getForms()
        this.$emit('curFormPlay')
      }
      console.log(this.curIndex, this.slideForms.length)
    })
    this.$on('nextForm', () => {
      console.log('nextForm', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
      setTimeout(() => {
        this.mySwiper.slideTo(this.mySwiper.activeIndex + 1)
      }, 500)
    })
    this.$on('curFormPlay', () => {
      this.playVoice()
    })
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain
    }),
    getFormsTypes () {
      var type = ''
      _.map(this.slideForms, (val) => {
        if (_.isArray(val)) {
          type = val[0].type.toLowerCase()
        } else {
          type = val.type.toLowerCase()
        }
      })
      return type
    }
  },
  methods: {
    initData () {
      this.curForm = this.slideForms[0]
      this.forms = this.getForms()
      console.log(this.curForm, this.forms)
    },
    initSwiper () {
      let that = this
      that.mySwiper = new Swiper('#speakToImg-swiper', {
        init: false,
        loop: false,
        autoplay: false,
        speed: 500,
        slidesPerView: 'auto',
        slidesOffsetAfter: 10,
        slidesOffsetBefore: 0,
        slideToClickedSlide: true,
        centeredSlides: true,
        grabCursor: true,
        observer: true,
        mousewheel: true,
        on: {
          init: () => {
            console.log('swiper initialized', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
            console.log(that.$refs)
            that.$refs['comp-' + that.mySwiper.activeIndex][0].$emit('init')
          },
          slideChange: () => {
            console.log('slideChange', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
            // 重置前一个组件数据
            that.$refs['comp-' + that.mySwiper.previousIndex][0].$emit('break')
            // 初始化当前组件
            that.$refs['comp-' + that.mySwiper.activeIndex][0].$emit('init')
          }
        }
      })
    },
    typeName (type) {
      let obj = this.contentTypes.find(item => {
        return item.type === type
      })
      let name = ''
      if (obj) {
        name = obj.name
      }
      return name
    },
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
    },
    getForms () {
      let answer = this.curForm
      let arr = [answer]
      let options = this.slideForms.filter((val) => {
        return val.sentence !== answer.sentence
      })
      console.log('options', options)
      arr = arr.concat(_.sampleSize(options, 1))
      arr = _.shuffle(arr)
      console.log('arr', arr)
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  h2 {
    font-size:16px;
    font-weight: 400;
    color:rgba(0,0,0,1);
    line-height:28px;
    padding-bottom: 40px;
    text-align: center;
  }
  .swiper-slide {
    cursor: default;
    width: 100%;
    height: 100%;
    padding: 0 20px 0;
    box-sizing: border-box;
  }
}
.imgAuto-container .trumpet {
  i {
    background-image: url('../../../../assets/images/course/icon-voice.png');
  }
}
.imgAuto-container {
  padding: 50px 0 0;
}
</style>
