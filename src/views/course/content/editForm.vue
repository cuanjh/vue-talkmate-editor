<template>
  <el-drawer
    :visible.sync="drawer"
    :with-header="false"
    @closed="closed"
    size="80%"
    direction="rtl">
    <model-pro ref="modelPro" :style="{height: height + 'px'}" :contents="contents" :feilds="feilds" :contentModel="contentModel" v-if="contentModel == 'content_model_pro_sound'" />
    <model-video v-if="contentModel == 'content_model_video'" />
    <model-kid v-if="contentModel == 'content_model_kid_sound'" />
  </el-drawer>
</template>

<script>
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
      this.resetData()
      this.contentModel = params.folder.content_model
      this.feilds = params.model.feilds
      this.feilds.forEach(item => {
        let val
        if (item.type === 'int') {
          val = 0
        } else if (item.type === 'string' || item.type === 'template') {
          val = ''
        } else if (item.type === 'templateArray' || item.type === 'array') {
          val = null
        }
        this.baseFormData[item.feild] = val
      })
      this.baseFormData['uuid'] = ''
      if (params.contents && params.contents.length) {
        this.contents = params.contents
      } else {
        this.contents.push(this.baseFormData)
      }
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.height = h - 2
      this.drawer = true
      setTimeout(() => {
        if (this.contentModel === 'content_model_pro_sound') {
          this.$refs['modelPro'].initData({ contents: this.contents, feilds: this.feilds, contentModel: this.contentModel, baseFormData: this.baseFormData })
        }
      }, 0)
    },
    closed () {
      if (this.contentModel === 'content_model_pro_sound') {
        this.$refs['modelPro'].resetData()
      }
    },
    resetData () {
      this.contentModel = ''
      this.contents = []
      this.feilds = []
      this.baseFormData = {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
