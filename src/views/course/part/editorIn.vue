<template>
  <div class="editor-in" v-show="showEditorIn">
    <div class="top-banner">
      <a :class="{'active': isCourse}">Pro</a>
      <a :class="{'active': !isCourse}">Mini</a>
    </div>
    <div class="editor-in-content">
      <step-one ref="stepOne"
        v-show="stepOne"
        @closeModel="closeModel"
        @clickNextBtn="clickNextBtn"/>
      <step-two ref="stepTwo"
        v-show="!stepOne"
        @stepTeoBack="clickNextBtn" />
    </div>
  </div>
</template>

<script>
import StepOne from './stepOne'
import StepTwo from './stepTwo'

export default {
  data () {
    return {
      showEditorIn: true,
      isCourse: true,
      stepOne: true
    }
  },
  components: {
    StepOne,
    StepTwo
  },
  mounted () {
  },
  methods: {
    showStepOne () {
      this.$refs.stepOne.initSwiper()
    },
    clickNextBtn () {
      this.stepOne = !this.stepOne
    },
    closeModel () {
      this.$emit('closeEditorModel')
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-in {
  padding-top: 40px;
  .top-banner {
    text-align: center;
    a {
      cursor: pointer;
      font-size:18px;
      font-weight:600;
      color:rgba(0,0,0,.4);
      line-height:25px;
      padding-right: 30px;
      &:last-child {
        padding-right: 0;
      }
      &:hover {
        color: #007AFF;
      }
      &.active {
        color: #007AFF;
      }
    }
  }
}
.editor-in-content {
}
</style>
