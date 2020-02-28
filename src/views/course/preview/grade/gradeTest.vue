<template>
  <div class="grade-test-container">
    <div class="grade-test-content">
      <div class="grade-item">
        <component
          :ref="'form-' + slideForms[0].content_type"
          :is="'form-' + slideForms[0].content_type"
          :contentTypes="contentTypes"
          :assetsDomain="assetsDomain"
          :form='slideForms[0]'
          :slideForms='slideForms'/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import listenForImg from './form/listenForImg'
import listenForSentence from './form/listenForSentence'
import fillGap from './form/fillGap'
import followRead from './form/followRead'
import makeSentence from './form/makeSentence'
import listenAnswerQuestion from './form/listenAnswerQuestion'

export default {
  props: ['slideForms'],
  data () {
    return {
    }
  },
  components: {
    'form-listenForImg': listenForImg, // 听音选图 content_type: "listenForImg"
    'form-listenForSentence': listenForSentence, // 听录音选择正确的句子 content_type: "listenForSentence"
    'form-fillGap': fillGap, // 选词填空 content_type: "fillGap"
    'form-followRead': followRead, // 跟读 content_type: "followRead"
    'form-makeSentence': makeSentence, // 造句 content_type: "makeSentence"
    'form-listenAnswerQuestion': listenAnswerQuestion // 造句 content_type: "listenAnswerQuestion"
  },
  created () {
    this.$on('init', () => {
      console.log('gradeTest init', this.slideForms, this.contentTypes, this.assetsDomain)
      this.initView()
    })
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    initView () {
      this.$refs['form-' + this.slideForms[0].content_type].$emit('init')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
