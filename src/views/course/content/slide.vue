<template>
  <div class="slide-container">
    <div class="forms">
      <form-comp :form="form"/>
      <form-comp :form="form"/>
      <form-comp :form="form"/>
      <form-comp :form="form"/>
      <form-comp :form="form"/>
      <form-comp :form="form"/>
    </div>
    <div class="bottom">
      <div class="name">Slide1</div>
      <div class="handler">
        <div class="add-form">新增Form</div>
        <div class="preview">预览</div>
      </div>
    </div>
  </div>
</template>

<script>
import FormComp from './form'
export default {
  data () {
    return {
      forms: [],
      form: {
        formType: 'repeatSpeak',
        sentence: 'Hello',
        sound: '',
        image: 'https://course-assets1.talkmate.com/course/images/common/Basic/Level1/Unit1/Chapter1/A0/1-2.webp?imageMogr2/thumbnail/460x258!/q/80'
      }
    }
  },
  components: {
    FormComp
  }
}
</script>

<style lang="scss" scoped>
.slide-container {
  width: 100%;
  margin-bottom: 30px;
  background: #FFFFFF;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  .forms {
    min-height: 210px;
    background: #E5E6E5;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 30px;
  }
  .bottom {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .name {
      font-size: 14px;
      font-weight: 400;
      color: #000;
      margin-left: 35px;
    }
    .handler {
      font-size: 14px;
      font-weight: 400;
      color: #007AFF;
      display: flex;
      flex-direction: row;
      .add-form {
        margin-right: 20px;
        cursor: pointer;
      }
      .preview {
        margin-right: 30px;
        cursor: pointer;
      }
    }
  }
}
</style>
