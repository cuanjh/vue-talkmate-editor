<template>
  <el-drawer
    :visible.sync="drawer"
    :with-header="false"
    size="80%"
    direction="rtl">
    <model-pro :style="{height: height + 'px'}" :contents="contents" :feilds="feilds" v-if="contentModel == 'content_model_pro_sound'" />
    <model-video v-if="contentModel == 'content_model_video'" />
    <model-kid v-if="contentModel == 'content_model_kid_sound'" />
  </el-drawer>
</template>

<script>
// import {
//   getContent
// } from '@api/course'
import ModelPro from './modelPro'
import ModelVideo from './modelVideo'
import ModelKid from './modelKid'
export default {
  data () {
    return {
      height: 0,
      drawer: false,
      contentModel: '',
      contents: [],
      feilds: []
    }
  },
  components: {
    ModelPro,
    ModelVideo,
    ModelKid
  },
  methods: {
    show (params) {
      console.log(params)
      this.contentModel = params.folder.content_model
      this.contents = params.contents
      this.feilds = params.model.feilds
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.height = h - 2
      // this.initData(folder)
      this.drawer = true
    }
    // async initData (folder) {
    //   let content = await getContent({ 'content_model': folder.content_model, 'parent_uuid': folder.uuid })
    //   console.log(content)
    // }
  }
}
</script>

<style lang="scss" scoped>

</style>
