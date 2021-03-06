<template>
  <div :class="['swiper-container', getFormsTypes]" id="preview-swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide"
        v-for="(form, index) in slideForms"
        :key="form.code + index">
        <h2>{{typeName(form.type)}}</h2>
        <keep-alive>
          <component
            :ref="'comp-' + index"
            :is="'form-' + form.type"
            :form='form'
            :index="index"
            :slideForms="slideForms" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
import { mapState } from 'vuex'

import AutoSpeak from './form/autoSpeak'
import RepeatSpeak from './form/repeatSpeak'
import ImgToSentence from './form/imgToSentence'
import MakeSentence from './form/makeSentence'
import FillGap from './form/fillGap'
import WriteWords from './form/writewords'
import SentenceToImgBox from './form/sentenceToImgBox'
// 看图听音选句子
import PictureSentence from './form/pictureSentence'

export default {
  props: ['slideForms'],
  data () {
    return {
      mySwiper: null
    }
  },
  created () {
    this.$on('init', () => {
      this.initSwiper()
      setTimeout(() => {
        this.mySwiper.init()
      }, 500)
    })
    this.$on('nextForm', () => {
      console.log('nextForm', this.mySwiper.activeIndex, this.mySwiper.realIndex, this.mySwiper.previousIndex)
      setTimeout(() => {
        this.mySwiper.slideTo(this.mySwiper.activeIndex + 1)
      }, 500)
    })
    this.$on('setSwiperMousewheel', (flag) => {
      if (flag) {
        this.mySwiper.mousewheel.enable()
      } else {
        this.mySwiper.mousewheel.disable()
      }
    })
    this.$on('reset', () => {
      this.$refs['comp-' + this.mySwiper.activeIndex][0].$emit('break')
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
  components: {
    'form-autoSpeak': AutoSpeak, // 自动读
    'form-repeatSpeak': RepeatSpeak, // 跟读
    'form-imgToSentence': ImgToSentence, // 由图片选句子
    'form-sentenceToImgBox': SentenceToImgBox, // 有句子选图片
    'form-writeWords': WriteWords, // 写单词
    'form-makeSentence': MakeSentence, // 组句子
    'form-fillGap': FillGap, // 选词填空
    'form-pictureSentence': PictureSentence // 看图听音选句
  },
  methods: {
    initSwiper () {
      let that = this
      that.mySwiper = new Swiper('#preview-swiper', {
        init: false,
        loop: false,
        autoplay: false,
        speed: 500,
        slidesPerView: 'auto',
        // slidesOffsetAfter: 10,
        // slidesOffsetBefore: 10,
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
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
  padding-left: 10px;
  padding-top: 10%;
  box-sizing: border-box;
  h1 {
    text-align: center;
    padding-bottom: 20px;
  }
  h2 {
    font-size:16px;
    font-weight: 400;
    color:rgba(0,0,0,1);
    line-height:28px;
    padding-bottom: 20px;
    text-align: center;
  }
  .swiper-slide {
    cursor: default;
    // width: 320px;
    width: 96%;
    height: 100%;
    padding: 0 10px 0 0;
    box-sizing: border-box;
  }
}
.imgtosentence {
  padding-left: 0px;
  padding-top: 30px;
  .swiper-slide {
    width: 100%;
    padding: 0 10px;
  }
}
</style>
