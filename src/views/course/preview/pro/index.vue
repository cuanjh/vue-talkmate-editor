<template>
<transition name="fade">
  <div class="preview" v-if="showPreview" @click="hideModel">
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
    show (params) {
      this.slideForms = params.contents
      this.contentModel = params.contentModel
      console.log(params, this.slideForms, this.contentModel)
      this.changeView(params.contents)
    },
    changeView (thunk) {
      let that = this
      let formTypes = this.getFormsTypes(this.slideForms)
      // if (formTypes.length === 1 && (formTypes.indexOf('sentencetoimg') > -1 || formTypes.indexOf('speaktoimg') > -1)) {
      //   this.view = 'choice'
      // } else {
      //   this.view = 'swiper'
      // }
      if (formTypes.length === 1 && (formTypes.indexOf('sentencetoimg') > -1 || formTypes.indexOf('imgtosentencew') > -1)) {
        this.view = 'choice'
      } else if (formTypes.length === 1 && formTypes.indexOf('speaktoimg') > -1) {
        this.view = 'imgAuto'
      } else {
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
        if (_.isArray(val)) {
          arr.push(val[0].type.toLowerCase())
        } else {
          arr.push(val.type.toLowerCase())
        }
      })
      console.log(_.uniq(arr))
      return _.uniq(arr)
    }
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 436px;
  height: 750px;
  // width:375px;
  // height:667px;
  border-radius:4px;
  box-sizing: border-box;
  background: url('../../../../assets/images/preview/pic-preview.png') no-repeat center;
  background-size: cover;
  padding: 76px 66px 126px 60px;
  .preview-content {
    width: 100%;
    height: 100%;
  }
}
.preview-warp {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>
