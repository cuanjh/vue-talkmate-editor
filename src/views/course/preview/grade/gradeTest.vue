<template>
  <div class="grade-test-container">
    <div class="grade-test-content">
      <div class="swiper-container" id="grade-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide"
            v-for="(form, index) in slideForms"
            :key="index">
            <div class="grade-item">
              <keep-alive>
                <component
                  :ref="'comp-' + index"
                  :is="'form-' + form.content_type"
                  :contentTypes="contentTypes"
                  :assetsDomain="assetsDomain"
                  :form='form'/>
              </keep-alive>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.css'
import { mapState } from 'vuex'
import listenForImg from './form/listenForImg'
import listenForSentence from './form/listenForSentence'
import fillGap from './form/fillGap'
import followRead from './form/followRead'
import makeSentence from './form/makeSentence'
import listenAnswerQuestion from './form/listenAnswerQuestion'
import question from './form/question'

export default {
  props: ['slideForms'],
  data () {
    return {
      mySwiper: null
    }
  },
  components: {
    'form-listenForImg': listenForImg, // 听音选图 content_type: "listenForImg"
    'form-listenForSentence': listenForSentence, // 听录音选择正确的句子 content_type: "listenForSentence"
    'form-fillGap': fillGap, // 选词填空 content_type: "fillGap"
    'form-followRead': followRead, // 跟读 content_type: "followRead"
    'form-makeSentence': makeSentence, // 造句 content_type: "makeSentence"
    'form-listenAnswerQuestion': listenAnswerQuestion, // 造句 content_type: "listenAnswerQuestion"
    'form-question': question // 问题 content_type: "question"
  },
  created () {
    this.$on('init', () => {
      console.log('gradeTest init', this.slideForms, this.contentTypes, this.assetsDomain)
      this.initSwiper()
      setTimeout(() => {
        this.mySwiper.init()
      }, 500)
    })
    this.$on('reset', () => {
      this.$refs['comp-' + this.mySwiper.activeIndex][0].$emit('break')
    })
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    initSwiper () {
      let that = this
      that.mySwiper = new Swiper('#grade-swiper', {
        init: false,
        loop: false,
        autoplay: false,
        speed: 500,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        centeredSlides: true,
        grabCursor: true,
        observer: true,
        mousewheel: true,
        on: {
          init: () => {
            console.log('swiper initialized', that.mySwiper.activeIndex)
            that.$refs['comp-' + that.mySwiper.activeIndex][0].$emit('init')
          },
          slideChange: () => {
            console.log('slideChange', that.mySwiper.activeIndex, that.mySwiper.previousIndex)
            // 重置前一个组件数据
            that.$refs['comp-' + that.mySwiper.previousIndex][0].$emit('break')
            // 初始化当前组件
            that.$refs['comp-' + that.mySwiper.activeIndex][0].$emit('init')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper-container {
  height: 100%;
}
</style>
