<template>
  <div class="edit-file">
    <model-comp ref="model"/>
  </div>
</template>

<script>
import ModelComp from './model'

export default {
  data () {
    return {
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
        } else if (item.type === 'templateArray') {
          val = []
        } else if (item.type === 'array') {
          val = ['']
        }
        baseFormData[item.feild] = val
      })
      baseFormData['uuid'] = ''
      if (params.contents && params.contents.length) {
        this.contents = params.contents
      } else {
        this.contents.push(baseFormData)
      }
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
.edit-file {
  height: 100%;
  flex: 1;
  overflow-y: auto
}
</style>
