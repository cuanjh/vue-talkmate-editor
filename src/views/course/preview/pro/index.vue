<template>
<transition name="fade">
  <div class="preview" v-show="showPreview" @click="hideModel">
    <div class="preview-container" id="preview-container" @click.stop="showModel">
      <div class="preview-content">
        <div class="preview-warp">
          <component
            :ref="view"
            :is="view"
            :slideForms="slideForms"
          />
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
import _ from 'lodash'
// import { mapState } from 'vuex'
import SwiperComp from './swiper'
import ChoiceComp from './choice'
import imgAutoComp from './imgAuto'
import modelVideoComp from './modelVideo'

export default {
  data () {
    return {
      contentModel: '',
      view: 'swiper',
      showPreview: false,
      slideForms: []
    }
  },
  created () {
    this.$bus.on('showPreviewModel', (params) => {
      this.slideForms = params.contents
      this.contentModel = params.contentModel
      console.log(params, this.slideForms, this.contentModel)
      this.changeView(params.contents)
    })
  },
  mounted () {
  },
  components: {
    'swiper': SwiperComp, // 轮播
    'choice': ChoiceComp, // 由句子选图片
    'imgAuto': imgAutoComp, // 由图片跟读
    'modelVideo': modelVideoComp // 视频课程
  },
  computed: {
  },
  methods: {
    hideModel () {
      this.showPreview = false
    },
    showModel () {
      this.showPreview = true
    },
    // show (params) {
    //   this.slideForms = params.contents
    //   this.contentModel = params.contentModel
    //   console.log(params, this.slideForms, this.contentModel)
    //   this.changeView(params.contents)
    // },
    changeView (thunk) {
      let that = this
      if (this.contentModel === 'content_model_video') {
        this.view = 'modelVideo'
        this.showPreview = true
        setTimeout(() => {
          that.$refs[this.view].$emit('init')
        }, 200)
        return false
      }
      let formTypes = this.getFormsTypes(this.slideForms)
      console.log(formTypes.length)
      if (formTypes.length === 0) {
        return false
      }
      // if (formTypes.length === 1 && (formTypes.indexOf('sentencetoimg') > -1 || formTypes.indexOf('speaktoimg') > -1)) {
      //   this.view = 'choice'
      // } else {
      //   this.view = 'swiper'
      // }
      if (formTypes.length === 1 && (formTypes.indexOf('sentencetoimg') > -1 || formTypes.indexOf('countdown') > -1)) {
        this.view = 'choice'
      } else if (formTypes.length === 1 && formTypes.indexOf('speaktoimg') > -1) {
        this.view = 'imgAuto'
      } else {
        let arr = []
        if (formTypes.indexOf('sentencetoimg') > -1) {
          arr = that.slideForms.filter(item => {
            return !(item.type === 'sentenceToImg')
          })
          arr.push({
            type: 'sentenceToImgBox',
            data: _.groupBy(this.slideForms, 'type').sentenceToImg
          })
          that.slideForms = []
          that.slideForms = arr
        } else if (formTypes.indexOf('imgtosentencew') > -1) {
          that.slideForms.forEach(item => {
            item.type = 'imgToSentence'
            arr.push(item)
          })
        } else {
          arr = that.slideForms.filter(item => {
            return (item.type && (item.type !== 'countDown'))
          })
          that.slideForms = arr
        }
        console.log(that.slideForms)
        this.view = 'swiper'
      }
      this.showPreview = true
      setTimeout(() => {
        that.$refs[this.view].$emit('init')
      }, 200)
    },
    getFormsTypes (data) {
      var arr = []
      _.map(data, (val) => {
        console.log(val.type)
        if (_.isArray(val)) {
          if (!val[0].type) {
            return false
          }
          arr.push(val[0].type.toLowerCase())
        } else {
          if (!val.type) {
            return false
          }
          arr.push(val.type.toLowerCase())
        }
      })
      let result = _.uniq(arr)
      console.log(result)
      return result
    }
  },
  beforeDestroy () {
    this.$bus.off('showPreviewModel')
  }
}
</script>
<style lang="scss">
@import '../../../../assets/scss/preview.scss';
.preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 9999;
}
.preview-container {
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  // width: 26%;
  // height: 98%;
  // width:375px;
  // height:656px;
  width:367px;
  height:629px;
  border-radius:4px;
  box-sizing: border-box;
  background: url('../../../../assets/images/preview/pic-preview.png') no-repeat center;
  background-size: cover;
  // padding: 70px 55px 110px 48px;
  padding: 66px 57px 105px 50px;
  .preview-content {
    width: 100%;
    height: 100%;
    // padding: 18% 15% 29% 14%;
    // padding: 20% 10% 33% 8%;
    box-sizing: border-box;
  }
}
.preview-warp {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
