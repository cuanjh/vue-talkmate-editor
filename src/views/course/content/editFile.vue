<template>
  <div class="edit-file" id="edit-file">
    <model-comp ref="model"/>
    <form-thumb ref="thumb"/>
  </div>
</template>

<script>
import ModelComp from './model'
import FormThumb from './formThumb'

export default {
  data () {
    return {
      contentModel: '',
      contents: [],
      feilds: []
    }
  },
  components: {
    ModelComp,
    FormThumb
  },
  mounted () {
    document.getElementById('edit-file').addEventListener('scroll', (e) => {
      let formModelEL = document.getElementById('form-model')
      if (e.target.offsetTop + e.target.scrollTop + 100 > formModelEL.offsetTop) {
        this.$refs['thumb'].show({ top: e.target.offsetTop + 10 })
      } else {
        this.$refs['thumb'].hide()
      }
    })
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
          val = []
        } else if (item.type === 'arrayObject') {
          val = []
        }
        baseFormData[item.feild] = val
      })
      baseFormData['uuid'] = ''
      this.contents = []
      if (params.contents && params.contents.length) {
        params.contents.forEach(item => {
          let obj = item
          if (!obj['self_sign']) {
            obj['self_sign'] = ''
          }
          this.contents.push(obj)
        })
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
