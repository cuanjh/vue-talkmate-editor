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
        <form-video
          :style="{ height: formHeight + 'px' }"
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
        <el-form-item label-width="140px" :label="f.name" v-show="f.feild !== 'list_order'">
          <el-input
            v-if="f.type != 'array' && f.data_from == ''"
            v-model="contents[activeFormIndex]['' + f.feild + '']"
            :disabled="f.feild == 'list_order'"></el-input>
          <el-checkbox-group v-if="f.data_from == 'content_tags'" v-model="contents[activeFormIndex]['' + f.feild + '']">
            <el-checkbox v-for="item in contentTags" :key="item.key" :label="item.key">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <div class="form-sound" v-if="f.feild == 'video'">
            <el-input v-model="contents[activeFormIndex]['' + f.feild + '']">
              <el-button slot="append" @click="clear(f.feild)">清除</el-button>
            </el-input>
            <el-upload
              action="#"
              accept="video/mp4"
              :on-change="uploadVideoOnchange"
              :show-file-list="false"
              :auto-upload="false">
              <el-button type="text">本地上传</el-button>
            </el-upload>
          </div>
          <div class="form-sound" v-if="f.feild == 'cover'">
            <el-input v-model="contents[activeFormIndex]['' + f.feild + '']">
              <el-button slot="append" @click="clear(f.feild)">清除</el-button>
            </el-input>
            <el-upload
              action="#"
              accept="image/png,image/jpg,image/jpeg"
              :on-change="uploadCoverOnchange"
              :show-file-list="false"
              :auto-upload="false">
              <el-button type="text">本地上传</el-button>
            </el-upload>
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
import moment from 'moment'
import FormVideo from './formVideo'
import PreviewComp from '../preview/pro/index'
import RightMenuForm from './rightMenuForm'
import { mapState } from 'vuex'
import {
  editContent,
  delContent,
  getInfoToken
} from '@/api/course'
import {
  uploadQiniu
} from '@/utils/uploadQiniu'
import Sortable from 'sortablejs'

export default {
  data () {
    return {
      formHeight: 0,
      token: '',
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
    FormVideo,
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
      contentTags: state => state.course.contentTags,
      assetsDomain: state => state.course.assetsDomain,
      version: state => state.course.version
    })
  },
  methods: {
    initData (params) {
      console.log(params)
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      this.activeFormIndex = 0
      this.pathDesc = params.pathDesc
      this.$set(this.$data, 'pUUID', params.pUUID)
      this.$set(this.$data, 'contents', params.contents)
      this.baseFormDataSelf = params.baseFormData
      this.$set(this.$data, 'feilds', params.feilds)
      this.$set(this.$data, 'contentModel', params.contentModel)
      this.formHeight = 220
      if (this.version.selCourseType === 0) {
        this.formHeight = 385
      }
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
    // 预览
    lookPreview () {
      this.$refs.preview.show(this.contents)
    },
    // 清除地址
    clear (type) {
      this.$set(this.contents[this.activeFormIndex], type, '')
    },
    async uploadVideoOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = 'course/videos/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'video', res.key)
      let myVideo = document.getElementById('form-video-' + this.activeFormIndex)
      setTimeout(() => {
        myVideo.oncanplay = () => {
          this.$set(this.contents[this.activeFormIndex], 'video_time', myVideo.duration)
        }
      }, 0)
    },
    async uploadCoverOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = 'course/images/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'cover', res.key)
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
