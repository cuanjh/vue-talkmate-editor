<template>
  <el-dialog
    :visible.sync="showEdit"
    width="1000px"
    @close="close">
    <div class="edit-content">
      <div class="course-content">
        <el-form ref="form" :model="form">
          <el-form-item label="等级分类：" prop="levelCatUuid" :rules="[
            { required: true, message: '请选择等级分类', trigger: 'blur' }
          ]">
            <el-select v-model="form.levelCatUuid"
              placeholder="请选择等级分类"
              :rules="[
                { required: true, message: '请选择等级分类', trigger: 'change' }
              ]"
              @change="changeType">
              <el-option
                v-for="item in levelTypeList"
                :key="item.uuid"
                :label="item.title"
                :value="item.uuid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级：" prop="levelCode" :rules="[
            { required: true, message: '等级不能为空', trigger: 'blur' }
          ]">
            <el-input v-model="form.levelCode" maxlength="20" placeholder="A1">
            </el-input>
          </el-form-item>
          <el-form-item label="标签：" class="desc" required>
            <el-row v-for="l in langInfos" :key="'tag' + l.langKey">
              <el-form-item  class="input-box" :prop="'tag.' + l.langKey"
              :rules="[{required: true, message: '标签不能为空', trigger: 'blur'}]"
                >
                <el-input type="text" v-model="form.tag[l.langKey]" maxlength="100" show-word-limit></el-input>
                <span>{{'(' + l.name + ')'}}</span>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="能力级别：" class="desc" required>
            <el-row v-for="l in langInfos" :key="'title' + l.langKey">
              <el-form-item  class="input-box" :prop="'title.' + l.langKey"
                :rules="[{required: true, message: '能力级别不能为空', trigger: 'blur'}]">
                <el-input v-model="form.title[l.langKey]" maxlength="100" show-word-limit></el-input>
                <span>{{'(' + l.name + ')'}}</span>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="等级描述：" class="desc" required>
            <div class="input-box" v-for="l in langInfos" :key="'desc' + l.langKey"
              :rules="[{required: true, message: '等级描述不能为空', trigger: 'blur'}]">
              <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
              <span>{{'(' + l.name + ')'}}</span>
            </div>
            <el-tag type="warning">注：段落用回车键分开</el-tag>
          </el-form-item>
          <el-form-item label="主题色：" prop="color" :rules="[
            { required: true, message: '主题色不能为空', trigger: 'blur' }
          ]">
            <el-input v-model="form.color" placeholder="#000000" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="背景图：">
            <el-upload
              list-type="picture-card"
              action="#"
              accept="image/webp;image/png;image/jpg;image/jpeg"
              :file-list="bigImgs"
              :auto-upload="false"
              :on-change="onChangeImage"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="声音：" prop="sound">
            <el-input placeholder="请上传声音" v-model="form.sound" class="input-with-select">
              <el-upload slot="prepend"
                action="#"
                :accept="'audio/mp3'"
                :on-change="uploadOnchange"
                :show-file-list="false"
                :auto-upload="false">
                <el-button icon="el-icon-upload2"></el-button>
              </el-upload>
              <el-button slot="append" icon="el-icon-video-play" @click="playAudio(form.sound)"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="声音时长：">
            <el-input v-model="form.soundTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="数据：">
            <div class="statistics">
              <div class="statistics-item" v-for="(ctr, index) in form.statistics" :key="'ctr' + index">
                <div class="left">
                  <el-input v-model="form.statistics[index]['num']" placeholder="请输入数字"></el-input>
                  <el-input v-model="form.statistics[index]['zh-CN']" placeholder="请输入中文"></el-input>
                  <el-input v-model="form.statistics[index]['en']" placeholder="请输入英文"></el-input>
                  <el-input v-model="form.statistics[index]['list_order']" placeholder="请输入排序号"></el-input>
                </div>
                <div class="right">
                  <el-button icon="el-icon-minus" circle @click="minusStatistics(index)"></el-button>
                  <el-button v-if="form.statistics.length == index + 1" icon="el-icon-plus" circle @click="plusStatistics"></el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="btns">
          <el-button
            class="cancel"
            @click="close()">取消</el-button>
          <el-button
            class="determine active"
            type="primary"
            @click="determine()" >确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { createLearnLevel, updateLearnLevel, getInfoToken } from '@/api/course'
import { mapState } from 'vuex'
import { uploadQiniu } from '@/utils/uploadQiniu'
import moment from 'moment'

export default {
  data () {
    return {
      showEdit: false,
      lang: '',
      imageFile: null,
      dialogImageUrl: '',
      dialogImageVisible: false,
      form: {
        uuid: '',
        levelCode: '',
        levelCatUuid: '', // 等级分类
        bgImg: [], // 大图标
        desc: {}, // 描述
        color: '',
        title: {}, // 标题
        tag: {},
        statistics: [],
        sound: '',
        soundTime: ''
      },
      bigImgUrl: '',
      bigImgs: [],
      bigFileRaw: {},
      type: ''
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      levelTypeList: state => state.course.levelTypeList,
      langInfos: state => state.course.langInfos
    })
  },
  mounted () {
  },
  methods: {
    show (params) {
      console.log(params)
      this.type = params.type
      this.showEdit = true
      this.bigImgs = []
      this.imageFile = null
      if (this.type === 'add') {
        let obj = {
          uuid: '',
          levelCode: '',
          levelCatUuid: '', // 课程分类
          bgImg: [], // 大图标
          desc: {}, // 描述
          color: '',
          title: {}, // 标题
          tag: {},
          statistics: [
            {
              num: '',
              'zh-CN': '',
              en: '',
              'list_order': ''
            }
          ],
          sound: '',
          soundTime: ''
        }
        this.form = obj
        this.bigImgUrl = ''
      } else if (this.type === 'edit') {
        this.lang = params.form.levelCode.split('-')[0]
        this.form = params.form
        if (!this.form.tag) {
          this.form.tag = {}
        }
        if (params.form.bgImg) {
          this.bigImgUrl = this.assetsDomain + '/' + params.form.bgImg
          this.bigImgs.push({
            name: params.form.bgImg,
            url: this.assetsDomain + params.form.bgImg
          })
        } else {
          this.bigImgUrl = ''
          this.bigImgs = []
        }
      }
    },
    close () {
      this.showEdit = false
      this.$emit('close')
    },
    async uploadBig () {
      if (Object.keys(this.bigFileRaw).length === 0) {
        return false // 如果为空,返回false
      }
      let res1 = await getInfoToken()
      let token = res1.data.token
      let arr = this.bigFileRaw.name.split('.')
      let filename = this.bigFileRaw.uid + '.' + arr[1]
      let url = 'course/coversV2/' + filename
      let res2 = await uploadQiniu(this.bigFileRaw.raw, token, url)
      this.form.bgImg = [res2.key]
    },
    bigFileChange (file, fileList) {
      console.log(file)
      this.bigImgUrl = URL.createObjectURL(file.raw)
      console.log(this.bigImgUrl)
      this.bigFileRaw = file
      this.uploadBig()
    },
    handleBigSuccess (res, file) {
      console.log(res, file)
      this.bigImgUrl = URL.createObjectURL(file.raw)
    },
    // 上传图片前的过滤
    handleBeforeUpload (file) {
      if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$alert(`请上传正确的图片格式`, '温馨提示!', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return false
      }
    },
    // 添加
    determine () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let res1 = await getInfoToken()
          let token = res1.data.token
          let bgImg = ''
          if (this.bigImgs.length > 0) {
            let img = this.bigImgs[0]
            if (img.raw) {
              let date = moment(new Date()).format('YYYY/MM/DD')
              let i = img.name.lastIndexOf('.')
              let ext = img.name.substring(i + 1)
              let url = 'course/images/covers/' + date + '/' + img.uid + '.' + ext
              let res = await uploadQiniu(img.raw, token, url)
              bgImg = res.key
            } else {
              bgImg = img.name
            }
          }

          this.form.bgImg = bgImg
          let obj = {
            uuid: this.form.uuid,
            levelCode: this.form.levelCode,
            levelCatUuid: this.form.levelCatUuid, // 等级分类
            bgImg: this.form.bgImg, // 大图标
            desc: this.form.desc, // 描述
            color: this.form.color,
            title: this.form.title, // 标题
            tag: this.form.tag,
            sound: this.form.sound,
            soundTime: this.form.soundTime ? this.form.soundTime : 0,
            statistics: this.form.statistics
          }
          console.log(obj)
          if (this.type === 'add') {
            createLearnLevel(obj).then(res => {
              console.log(res)
              if (res.success) {
                this.close()
              }
            })
          } else {
            updateLearnLevel(obj).then(res => {
              console.log(res)
              if (res.success) {
                this.close()
              }
            })
          }
        }
      })
    },
    changeType () {
      console.log(this.form)
    },
    getGroupVAs (data) {
      let ret = []
      if (data && data.length > 0) {
        data.forEach(item => {
          ret.push(item.name)
        })
      }
      return ret.length > 0 ? `（${ret.join('、')}）` : ''
    },
    onChangeImage (file, fileList) {
      this.bigImgs = fileList
    },
    handleRemove (file, fileList) {
      this.bigImgs = fileList
    },
    handlePictureCardPreview (file) {
      console.log(file)
      if (file.raw) {
        this.dialogImageUrl = URL.createObjectURL(file.raw)
      } else {
        this.dialogImageUrl = file.url
      }
      this.dialogImageVisible = true
    },
    plusStatistics () {
      let obj = {
        num: '',
        'zh-CN': '',
        en: '',
        'list_order': ''
      }
      this.form.statistics.push(obj)
    },
    minusStatistics (index) {
      if (this.form.statistics.length === 1) {
        this.form.statistics = [{
          num: '',
          'zh-CN': '',
          en: '',
          'list_order': ''
        }]
      } else {
        this.form.statistics.splice(index, 1)
      }
    },
    async uploadOnchange (file) {
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let url = `course/audios/${date}/${file.uid}.${ext}`
      let res1 = await getInfoToken()
      let token = res1.data.token
      let res = await uploadQiniu(file.raw, token, url)
      this.$set(this.form, 'sound', res.key)
      let mySound = new Audio()
      mySound.src = this.assetsDomain + res.key
      mySound.oncanplay = () => {
        this.$set(this.form, 'soundTime', mySound.duration)
      }
    },
    playAudio (url) {
      if (!url) return
      let audio = new Audio()
      audio.src = this.assetsDomain + url
      audio.oncanplay = () => {
        audio.play()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.edit-content .course-content {
  width: 100%;
  height: 100%;
  // max-height:500px;
  // overflow-y: auto;

  .img-box {
    display: flex;
    align-items: flex-end;
    #upload-btn {
      width: 30px;
      height: 30px;
      border:1px solid rgba(0,0,0,.1);
      border-radius: 2px;
      margin-left: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar-uploader-icon {
        color: #007AFF;
      }
    }
  }
  .big-img-box .img {
    width:400px;
    height:120px;
    background:rgba(239,239,239,1);
    border-radius:4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin-bottom: 20px;
    }
  }
  .small-img-box .img {
    width:120px;
    height:120px;
    background:rgba(239,239,239,1);
    border-radius:4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin-bottom: 20px;
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    button {
      cursor: pointer;
      display: inline-block;
      width:150px;
      height:40px;
      font-size:14px;
      font-weight:400;
      border-radius:4px;
      color:rgba(0,122,255,1);
      border:1px solid rgba(0,122,255,1);
      margin-right: 48px;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        opacity: .8;
      }
      &.active {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
      &.is-disabled {
        cursor: not-allowed;
        border: none;
        background-color: #a0cfff;
      }
    }
  }
}
/*滚动条样式*/
.edit-content .course-content::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.edit-content .course-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.edit-content .course-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}

.statistics {
  .statistics-item {
    display:  flex;
    flex-direction: row;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .left {
      display:  flex;
      flex-direction: row;
      flex: 1;
      .el-select {
        width: 320px;
      }
      .el-input {
        margin-left: 10px;
      }
    }
    .right {
      width: 100px;
      padding-left: 10px;
    }
  }
}
</style>
<style>
.course-content .el-input__inner {
  padding: 0 44px 0 10px;
}
.course-content .el-input {
  /* width: 200px!important; */
  margin-right: 10px;
}

.course-content .el-form .el-form-item {
  display: flex;
}
.course-content .el-form .flex-class {
  align-items: center;
}
.course-content .el-form-item__content {
  display: flex!important;
  flex-direction: column;
  flex: 1;
}
.course-content .input-box .el-input {
  margin-bottom: 10px;
}
.course-content .desc .input-box {
  display: flex;
  align-items: center;
}
.course-content .desc .el-textarea {
  width: auto!important;
  margin-right: 10px;
  margin-bottom: 20px;
}
.course-content .desc .el-textarea textarea{
  width: 500px!important;
  min-height: 80px!important;
}
.course-content .el-row .el-form-item__content {
  display: flex!important;
  flex-direction: row;
}
.course-content .el-form-item__label {
  width: 110px;
}
</style>
