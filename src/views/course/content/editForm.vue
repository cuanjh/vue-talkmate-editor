<template>
  <el-drawer
    :visible.sync="drawer"
    :with-header="false"
    @closed="closed"
    size="80%"
    direction="rtl">
    <model-comp ref="model" :style="{height: height + 'px'}" />
  </el-drawer>
</template>

<script>
import ModelComp from './model'

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
    ModelComp
  },
  methods: {
    show (params) {
      console.log(params)
      this.resetData()
      this.contentModel = params.folder.content_model
      this.feilds = params.model.feilds
      let baseFormData = {}
      this.feilds.forEach(item => {
        let val
        if (item.type === 'int') {
          val = 0
        } else if (item.type === 'string' || item.type === 'template') {
          val = ''
        } else if (item.type === 'templateArray' || item.type === 'array') {
          val = []
        }
        baseFormData[item.feild] = val
      })
      baseFormData['uuid'] = ''
      if (params.contents && params.contents.length) {
        this.contents = params.contents
      } else {
        this.contents.push(baseFormData)
      }
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.height = h - 2
      this.drawer = true
      setTimeout(() => {
        this.$refs['model'].initData({ pUUID: params.folder.uuid, contents: this.contents, feilds: this.feilds, contentModel: this.contentModel, baseFormData: JSON.stringify(baseFormData), pathDesc: params.pathDesc })
      }, 0)
    },
    closed () {
      this.$refs['model'].resetData()
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
