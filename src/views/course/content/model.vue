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
      <div class="list" id="sort-form" v-if="contentModel == 'content_model_video'">
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
      <div class="list" id="sort-form" v-else-if="contentModel == 'content_model_kid_test'">
        <form-kid-test
          :data-id="index"
          :class="{'active': activeFormIndex == index}"
          v-for="(content, index) in contents"
          :key="index"
          :form="content"
          :formIndex="index"
          @delForm="delForm"
          @switchForm="switchForm"/>
      </div>
      <div class="list" id="sort-form" v-else>
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
        <el-form-item label-width="140px" :label="f.name" v-if="(f.feild !== 'list_order' && f.feild !== 'options' && f.type !== 'template' && f.type !== 'templateArray' && f.feild !== 'sentence_phoneticize' && f.feild !== 'options_phoneticize') || (f.type == 'template' && contents[activeFormIndex]['' + f.feild + '']) || (version['selLang'] == 'JPN' && (f.feild == 'sentence_phoneticize' || f.feild == 'options_phoneticize')) || (f.feild === 'options' && (contents[activeFormIndex]['type'] == 'makeSentence' || contents[activeFormIndex]['type'] == 'fillGap'  || contents[activeFormIndex]['type'] == 'kid_pattern_words_3' || contents[activeFormIndex]['type'] == 'kid_pattern_sentences_3'))">
          <el-input
            :maxlength="100" show-word-limit
            v-if="f.type != 'array_string' && f.type != 'array' && f.data_from == '' && f.type !== 'templateArray'"
            v-model="contents[activeFormIndex]['' + f.feild + '']"
            :disabled="f.feild == 'list_order' || f.type == 'template'"></el-input>
          <el-select v-if="f.data_from == 'content_types'" v-model="contents[activeFormIndex]['' + f.feild + '']" placeholder="请选择">
            <el-option
              v-for="item in selfContentTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
          <el-checkbox-group v-if="f.data_from == 'content_tags'" v-model="contents[activeFormIndex]['' + f.feild + '']">
            <el-checkbox v-for="item in contentTags" :key="item.key" :label="item.key">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
          <!-- <div class="options" v-if="f.feild === 'options' && (contents[activeFormIndex]['type'] == 'makeSentence' || contents[activeFormIndex]['type'] == 'fillGap')">
            <div class="option-list">
              <div class="option-item" v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']" :key="index">
                <input type="text" v-model="contents[activeFormIndex]['' + f.feild + ''][index]">
                <i class="el-icon-circle-close" @click="delOption(f, index)"></i>
              </div>
            </div>
            <div class="add-option" @click="addOption(f)">
              <i class="el-icon-plus"></i>
            </div>
            <el-tag type="warning" v-show="contents[activeFormIndex]['type'] == 'fillGap'">注：第一个输入项为正确选项，其他为错误选项。</el-tag>
          </div> -->
          <!-- 图片声音 start-->
          <div class="form-sound" v-if="f.type == 'string' && (f.feild == 'sound' || f.feild == 'image' || f.feild == 'cover' || f.feild == 'video')">
            <el-input v-model="contents[activeFormIndex]['' + f.feild + '']" :placeholder="f.feild == 'sound' ? '请上传mp3格式的音频' : ''">
              <el-button slot="append" @click="clear(f.feild)">清除</el-button>
            </el-input>
            <div class="upload-area">
              <el-button v-if="contentModel == 'content_model_pro_sound' && f.feild == 'image'" type="text" @click="searchContent(f.feild)">内容查找</el-button>
              <el-button v-if="contentModel == 'content_model_pro_sound' && f.feild == 'image'" type="text" @click="searchImg('images')">图库查找</el-button>
              <el-upload
                v-if="f.feild == 'sound'"
                action="#"
                accept="audio/mp3"
                :on-change="uploadSoundOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="text">本地上传</el-button>
              </el-upload>
              <el-upload
                v-if="f.feild == 'video'"
                action="#"
                accept="video/mp4"
                :on-change="uploadVideoOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="text">本地上传</el-button>
              </el-upload>
              <el-upload
                v-if="f.feild == 'image'"
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="uploadImageOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="text">本地上传</el-button>
              </el-upload>
              <el-upload
                v-if="f.feild == 'cover'"
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="uploadCoverOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="text">本地上传</el-button>
              </el-upload>
            </div>
            <look-image
              v-if="contentModel == 'content_model_pro_sound' && f.feild == 'image' && activeFeild == 'images'"
              @close="closeLook"
              @use="use"/>
            <look-content
              :contentModel="contentModel"
              :activeFeild="activeFeild"
              v-if="contentModel == 'content_model_pro_sound' && f.feild == activeFeild"
              @close="closeLook"
              @use="use"/>
          </div>
          <!-- 图片声音 end-->
          <div class="array-string" v-if="f.type == 'array'">
            <el-input placeholder="请输入内容" :maxlength="f.data_from ? '' : (f.feild == 'options' ? 50 : 100)" show-word-limit v-for="(item, index) in contents[activeFormIndex]['' + f.feild + '']" :key="f.feild + index" v-model="contents[activeFormIndex]['' + f.feild + ''][index]">
              <el-upload slot="prepend"
                v-if="f.data_from == 'upload'"
                action="#"
                :accept="f.feild == 'sound' ? 'audio/mp3' : 'image/png,image/jpg,image/jpeg'"
                :on-change="uploadOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button type="text" @click="upload(f.feild, index)">上传</el-button>
              </el-upload>
              <el-button slot="append" icon="el-icon-minus" @click="minus(index, f.feild)"></el-button>
              <el-button v-show="index == contents[activeFormIndex]['' + f.feild + ''].length - 1" slot="append" icon="el-icon-plus" @click="plus(f.feild)"></el-button>
            </el-input>
            <el-tag type="warning" v-show="f.feild == 'options' && contents[activeFormIndex]['type'] == 'fillGap'">注：第一个输入项为正确选项，其他为错误选项。</el-tag>
          </div>
        </el-form-item>
        <el-form-item :label="f.name" v-if="(f.type == 'templateArray' && contents[activeFormIndex]['' + f.feild + ''] && contents[activeFormIndex]['' + f.feild + ''].length)">
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
    <!-- <preview-comp ref="preview"/> -->
    <right-menu-form
      ref="rightMenuForm"
      @paste="paste"
    />
  </div>
</template>

<script>
import FormComp from './form'
import FormVideo from './formVideo'
import FormKidTest from './kidTest/kidTest'
import LookImage from './lookImage'
import LookContent from './lookContent'
// import PreviewComp from '../preview/pro/index'
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
import moment from 'moment'

export default {
  data () {
    return {
      formHeight: 0,
      pathDesc: '',
      pUUID: '',
      isShow: false,
      contents: [],
      feilds: [],
      contentModel: '',
      form: {},
      activeFormIndex: 0,
      activeFeild: '',
      baseFormDataSelf: '',
      copyBaseFormDataSelf: '',
      uploadIndex: ''
    }
  },
  components: {
    FormComp,
    FormVideo,
    FormKidTest,
    LookImage,
    LookContent,
    // PreviewComp,
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
      contentTags: state => state.course.contentTags,
      assetsDomain: state => state.course.assetsDomain,
      version: state => state.course.version
    }),
    selfContentTypes () {
      return this.contentTypes.filter(item => {
        return item.model_key === this.contentModel
      })
    }
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
      this.copyBaseFormDataSelf = params.baseFormData
      this.$set(this.$data, 'feilds', params.feilds.sort((a, b) => { return a.list_order - b.list_order }))
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
          console.log(indexArr)
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
      this.copyBaseFormDataSelf = this.baseFormDataSelf
      let obj = JSON.parse(this.baseFormDataSelf)
      this.contents.push(obj)
      this.activeFormIndex = this.contents.length - 1
      this.resetSortable()
    },
    delForm (params) {
      console.log(params)
      if (params.form.uuid) {
        this.$confirm('确认要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            content_model: this.contentModel,
            parent_uuid: this.pUUID,
            del_uuids: [
              params.form.uuid
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
                return item.uuid === params.form.uuid
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
      } else {
        this.activeFormIndex = 0
        this.contents.splice(params.formIndex, 1)
      }
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
      let obj = {
        contents: this.contents,
        contentModel: this.contentModel
      }
      // this.$refs.preview.show(obj)
      this.$bus.emit(obj)
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
    },
    // 上传声音
    async uploadSoundOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = 'course/sounds/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'sound', res.key)
      // 计算声音时长
      if (typeof this.contents[this.activeFormIndex]['sound_time'] !== 'undefined') {
        let mySound = new Audio()
        mySound.src = this.assetsDomain + res.key
        mySound.oncanplay = () => {
          this.$set(this.contents[this.activeFormIndex], 'sound_time', mySound.duration)
        }
      }
    },
    // 上传图片
    async uploadImageOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = 'course/images/common/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'image', res.key)
    },
    // 上传视频
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
    // 上传封面
    async uploadCoverOnchange (file) {
      console.log(file)
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = 'course/images/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex], 'cover', res.key)
    },
    // 减少输入框
    minus (index, feild) {
      console.log(index, feild)
      if (this.contents[this.activeFormIndex]['' + feild + ''].length > 1) {
        this.contents[this.activeFormIndex]['' + feild + ''].splice(index, 1)
      } else {
        this.$set(this.contents[this.activeFormIndex]['' + feild + ''], index, '')
      }
      this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
    },
    // 增加输入框
    plus (feild) {
      this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
      let obj = JSON.parse(this.copyBaseFormDataSelf)
      obj['' + feild + ''].push('')
      this.$set(this.contents, this.activeFormIndex, obj)
      this.copyBaseFormDataSelf = JSON.stringify(obj)
    },
    upload (feild, index) {
      this.uploadIndex = feild + '_' + index
      console.log(this.uploadIndex)
    },
    async uploadOnchange (file) {
      console.log(file)
      let uploadIndexArr = this.uploadIndex.split('_')
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = ''
      if (uploadIndexArr[0] === 'sound') {
        url = 'course/sounds/' + this.version.selLang.toLowerCase() + '/' + date + '/' + file.uid + '.' + ext
      } else if (uploadIndexArr[0] === 'image') {
        url = 'course/images/common/' + this.version.selLang.toLowerCase() + '/kid/' + date + '/' + file.uid + '.' + ext
      }
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.contents[this.activeFormIndex][uploadIndexArr[0]], uploadIndexArr[1], res.key)
      this.copyBaseFormDataSelf = JSON.stringify(this.contents[this.activeFormIndex])
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
  .right {
    min-width: 70px;
    margin-left: 20px;
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
  position: relative;
  padding: 20px 40px 20px 20px;
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
    margin-right: 20px;
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

.upload-area {
  display: flex;
  flex-direction: row;
  .el-button {
    margin-right: 20px;
  }
}

.array-string {
  .el-input {
    margin: 5px 0;
  }
}
</style>

<style>
.el-checkbox__label {
  white-space: break-spaces;
}
</style>
