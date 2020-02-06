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
      feilds: [],
      baseFormData: {}
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
      this.feilds = params.model.feilds
      this.feilds.forEach(item => {
        let val
        if (item.type === 'int') {
          val = 0
        } else if (item.type === 'string' || item.type === 'template') {
          val = ''
        } else if (item.type === 'templateArray' || item.type === 'array') {
          val = []
        }
        this.baseFormData[item.feild] = val
      })
      if (params.contents && params.contents.length) {
        this.contents = params.contents
      } else {
        this.contents.push(this.baseFormData)
      }
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
