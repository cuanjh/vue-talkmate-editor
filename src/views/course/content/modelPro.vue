<template>
  <div class="model-pro-container" v-show="isShow">
    <div class="top-bar">
      <div class="left">
        路径：{{ pathDesc }}
      </div>
      <div class="right">
        <el-button type="text" @click="addForm">新增</el-button>
        <el-button type="text" @click="lookPreview">预览</el-button>
      </div>
    </div>
    <div id="forms" @contextmenu="contentmenu" class="forms">
      <div class="list" id="sort-form">
        <form-comp
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
    </div>
    <el-form ref="form" :model="contents[activeFormIndex]" label-width="80px">
      <div class="item" v-for="f in feilds" :key="f.feild">
        <el-form-item :label="f.name" v-show="(f.feild !== 'list_order' && f.feild !== 'options' && f.type !== 'template' && f.type !== 'templateArray' && f.feild !== 'sentence_phoneticize' && f.feild !== 'options_phoneticize') || (f.type == 'template' && contents[activeFormIndex]['' + f.feild + '']) || (version['selLang'] == 'JPN' && (f.feild == 'sentence_phoneticize' || f.feild == 'options_phoneticize')) || (f.feild === 'options' && (contents[activeFormIndex]['type'] == 'makeSentence' || contents[activeFormIndex]['type'] == 'fillGap'))">
          <el-input
            v-if="f.type != 'array' && f.data_from == '' && f.type !== 'templateArray'"
            v-model="contents[activeFormIndex]['' + f.feild + '']"
            :disabled="f.feild == 'list_order' || f.type == 'template'"></el-input>
          <el-select v-if="f.data_from == 'content_types'" v-model="contents[activeFormIndex]['' + f.feild + '']" placeholder="请选择">
            <el-option
              v-for="item in contentTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
          <div class="options" v-if="f.feild === 'options' && (contents[activeFormIndex]['type'] == 'makeSentence' || contents[activeFormIndex]['type'] == 'fillGap')">
            <div class="option-list">
              <div class="option-item" v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']" :key="index">
                <input type="text" v-model="contents[activeFormIndex]['' + f.feild + ''][index]">
                <i class="el-icon-circle-close" @click="delOption(f, index)"></i>
              </div>
            </div>
            <div class="add-option" @click="addOption(f)">
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <div class="form-sound" v-if="f.feild == 'sound' || f.feild == 'image'">
            <el-input v-model="contents[activeFormIndex]['' + f.feild + '']">
              <el-button slot="append" @click="clear(f.feild)">清除</el-button>
            </el-input>
            <el-button v-show="f.feild == 'image'" type="text" @click="searchContent(f.feild)">内容查找</el-button>
            <el-button v-show="f.feild == 'image'" type="text" @click="searchImg('images')">图库查找</el-button>
            <el-button type="text">本地上传</el-button>
            <look-image
              v-show="f.feild == 'image' && activeFeild == 'images'"
              @close="closeLook"
              @use="use"/>
            <look-content
              :contentModel="contentModel"
              :activeFeild="activeFeild"
              v-show="f.feild == activeFeild"
              @close="closeLook"
              @use="use"/>
          </div>
        </el-form-item>
        <el-form-item :label="f.name" v-show="(f.type == 'templateArray' && contents[activeFormIndex]['' + f.feild + ''] && contents[activeFormIndex]['' + f.feild + ''].length)">
          <div class="template-options">
            <el-tag
              v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']"
              :key="'templateArray' + index"
              type="info"
              effect="plain">
              {{ item }}
            </el-tag>
          </div>
        </el-form-item>
      </div>
      <el-form-item class="btn-handler">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <preview-comp ref="preview"/>
    <right-menu-form
      ref="rightMenuForm"
      @paste="paste"
    />
  </div>
</template>

<script>
import FormComp from './form'
import LookImage from './lookImage'
import LookContent from './lookContent'
import PreviewComp from '../preview/pro/index'
import RightMenuForm from './rightMenuForm'
import { mapState } from 'vuex'
import {
  editContent,
  delContent
} from '@/api/course'
import Sortable from 'sortablejs'

export default {
  data () {
    return {
      pathDesc: '',
      pUUID: '',
      isShow: false,
      contents: [],
      feilds: [],
      contentModel: '',
      form: {},
      activeFormIndex: 0,
      activeFeild: '',
      baseFormDataSelf: ''
    }
  },
  components: {
    FormComp,
    LookImage,
    LookContent,
    PreviewComp,
    RightMenuForm
  },
  mounted () {
    let formsEl = document.getElementById('forms')
    formsEl.oncontextmenu = (e) => {
      e.preventDefault()
    }
    formsEl.onclick = () => {
      if (this.$refs['rightMenuForm']) {
        this.$refs['rightMenuForm'].hide()
      }
    }
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain,
      version: state => state.course.version
    })
  },
  methods: {
    initData (params) {
      console.log(params)
      this.activeFormIndex = 0
      this.pathDesc = params.pathDesc
      this.$set(this.$data, 'pUUID', params.pUUID)
      this.$set(this.$data, 'contents', params.contents)
      this.baseFormDataSelf = params.baseFormData
      this.$set(this.$data, 'feilds', params.feilds)
      this.$set(this.$data, 'contentModel', params.contentModel)
      this.resetSortable()
      this.isShow = true
    },
    resetSortable () {
      /* eslint-disable */
      let el = document.getElementById('sort-form')
      let sortable = new Sortable(el, {
        animation: 150,
        onEnd: (evt) => {
          let newContents = []
          let copyContents = this.contents
          let indexArr = sortable.toArray()
          indexArr.forEach((item, index) => {
            let obj = copyContents[parseInt(item)]
            obj['list_order'] = (index + 1) * 10
            newContents.push(obj)
          })
          this.$set(this.$data, 'contents', newContents)
          this.activeFormIndex = evt.newIndex
          let obj = {
            content_model: this.contentModel,
            contents: this.contents,
            parent_uuid: this.pUUID
          }
          editContent(obj)
        }
      })
      /* eslint-enable */
    },
    resetData () {
      this.pUUID = ''
      this.contents = []
      this.feilds = []
      this.contentModel = ''
      this.form = {}
      this.activeFormIndex = 0
      this.activeFeild = ''
      this.isShow = false
    },
    switchForm (params) {
      this.activeFormIndex = params.formIndex
      this.$set(this.contents, this.activeFormIndex, params.content)
    },
    async onSubmit () {
      let arr = []
      this.contents.forEach((item, index) => {
        let obj = item
        obj['list_order'] = (index + 1) * 10
        arr.push(obj)
      })
      this.$set(this.$data, 'contents', arr)
      let obj = {
        content_model: this.contentModel,
        contents: this.contents,
        parent_uuid: this.pUUID
      }
      let res = await editContent(obj)
      if (res.success) {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$set(this.$data, 'contents', res.data.contents)
      }
    },
    addForm () {
      let obj = JSON.parse(this.baseFormDataSelf)
      this.contents.push(obj)
      this.activeFormIndex = this.contents.length - 1
      this.resetSortable()
    },
    delForm (params) {
      console.log(params)
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          content_model: this.contentModel,
          del_uuids: [
            params.uuid
          ]
        }
        delContent(obj).then(res => {
          if (res.success) {
            this.activeFormIndex = 0
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            let delIndex = this.contents.findIndex(item => {
              return item.uuid === params.uuid
            })
            this.contents.splice(delIndex, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 内容查找
    searchContent (feild) {
      this.activeFeild = feild
      console.log(this.activeFeild)
    },
    // 图库查找
    searchImg (feild) {
      this.activeFeild = feild
    },
    // 使用图片（声音）
    use (params) {
      let url = ''
      if (params.flag) {
        url = params.url
      }
      this.$set(this.contents[this.activeFormIndex], params.type, url)
    },
    // 使用图片
    useImg (img) {
      console.log('modelProImg', img)
      console.log('this.curForm', this.curForm)
      this.curForm.image = img
    },
    // 预览
    lookPreview () {
      this.$refs.preview.show(this.contents)
    },
    // 取消图库查找
    closeLook () {
      this.activeFeild = ''
    },
    // 清除图片（声音）地址
    clear (type) {
      this.$set(this.contents[this.activeFormIndex], type, '')
    },
    // 添加一个选项
    addOption (f) {
      console.log(f)
      if (!this.contents[this.activeFormIndex]['' + f.feild + '']) {
        this.contents[this.activeFormIndex]['' + f.feild + ''] = []
      }
      this.contents[this.activeFormIndex]['' + f.feild + ''].push('')
    },
    // 删除一个选项
    delOption (f, index) {
      this.contents[this.activeFormIndex]['' + f.feild + ''].splice(index, 1)
    },
    // form区域右键菜单
    contentmenu (ev) {
      this.$refs['rightMenuForm'].show(ev)
    },
    paste () {
      let obj = JSON.parse(this.version.copyForm)
      obj['uuid'] = ''
      this.contents.push(obj)
      this.activeFormIndex = this.contents.length - 1
      this.resetSortable()
      this.$refs['rightMenuForm'].hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.model-pro-container {
  overflow: auto;
}
.top-bar {
  padding-right: 20px;
  height: 40px;
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .left {
    padding-left: 20px;
  }
}
.forms {
  background: #E5E6E5;
  flex: 1;
  padding: 30px;
  // width: 400px;
  // overflow-x: auto;
  .list {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
.el-form {
  padding: 20px;
}
.form-image {
  .el-image {
    margin-top: 15px;
    border-radius: 4px;
    margin-right: 10px;
  }
}
.options {
  display: flex;
  flex-direction: row;
  .option-list {
    display: flex;
    flex-direction: row;
    .option-item {
      margin-right: 10px;
      position: relative;
      input {
        padding: 3px;
        text-align: center;
        width: 100px;
        border: 0;
        border-bottom: 1px solid #DCDFE6;
      }
      i {
        position: absolute;
        top: 6px;
        right: 0;
        cursor: pointer;
      }
    }
  }
  .add-option {
    width: 30px;
    height: 30px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
    i {
      color: #DCDFE6;
      font-size: 20px;
    }
  }
}

.template-options {
  .el-tag {
    margin-right: 10px;
  }
}

.btn-handler {
  text-align: center;
}
</style>
