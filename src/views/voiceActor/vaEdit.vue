<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    center="center"
    width="80%">
    <el-form :model="ruleForm" :rules="rules" size="small" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="声优名称：" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="国籍：" prop="country">
        <el-input v-model="ruleForm.country"></el-input>
      </el-form-item>
      <el-form-item label="城市：" prop="city">
        <el-input v-model="ruleForm.city"></el-input>
      </el-form-item>
      <el-form-item label="分组：" prop="role">
        <el-input v-model="ruleForm.role"></el-input>
        <el-tag type="warning">注：存在多个分组用“,”分割</el-tag>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="请选择性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="语言：" prop="lang">
        <el-select v-model="ruleForm.lang" placeholder="请选择语言" filterable>
          <el-option v-for="lang in langList" :key="lang.lan_code" :label="lang.title['zh-CN']" :value="lang.lan_code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板声音：" prop="sound">
        <el-input placeholder="请上传声音" v-model="ruleForm.sound" class="input-with-select">
          <el-upload slot="prepend"
            action="#"
            :accept="'audio/mp3'"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button icon="el-icon-upload2"></el-button>
          </el-upload>
          <el-button slot="append" icon="el-icon-video-play" @click="playAudio(ruleForm.sound)"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="声音时长：">
        <el-input v-model="ruleForm.soundTime" disabled></el-input>
      </el-form-item>
      <el-form-item label="声音特点：">
        <el-input type="textarea" v-model="ruleForm.feature"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="头像：" prop="photo">
        <el-upload
          class="avatar-uploader"
          action="#"
          accept="image/webp;image/png;image/jpg;image/jpeg"
          :on-preview="handlePictureCardPreview"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onChangeImage">
          <img v-if="ruleForm.photo" :src="ruleForm.photo.indexOf('http') > -1 ? ruleForm.photo : assetsDomain + ruleForm.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogImageVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

import {
  getInfoToken,
  createVoiceActor,
  updateVoiceActor
} from '@/api/course'

import {
  uploadQiniu
} from '@/utils/uploadQiniu'
export default {
  data () {
    return {
      flag: 'add',
      dialogVisible: false,
      selLang: '',
      toLang: '',
      uploadIndex: '',
      token: '',
      dialogImageUrl: '',
      dialogImageVisible: false,
      disabled: false,
      photoFile: null,
      ruleForm: {
        uuid: '',
        name: '',
        gender: '',
        country: '',
        city: '',
        feature: '',
        desc: '',
        lang: '',
        photo: '',
        role: '',
        sound: '',
        soundTime: '',
        status: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入声音名称', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        country: [
          { required: true, message: '请输入国籍', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        feature: [
          { required: true, message: '请输入声音特点', trigger: 'blur' }
        ],
        lang: [
          { required: true, message: '请选择语言', trigger: 'change' }
        ],
        photo: [
          { required: true, message: '请上传头像', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请输入分组', trigger: 'blur' }
        ],
        sound: [
          { required: true, message: '请上传声音', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langList: state => state.course.langList
    })
  },
  methods: {
    show (params) {
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      console.log(params)
      this.flag = params.type
      this.photoFile = null
      this.ruleForm = {
        uuid: '',
        name: '',
        gender: '',
        country: '',
        city: '',
        feature: '',
        desc: '',
        lang: '',
        photo: '',
        role: '',
        sound: '',
        soundTime: ''
      }
      if (this.flag === 'edit') {
        this.ruleForm.uuid = params.form.uuid
        this.ruleForm.name = params.form.name
        this.ruleForm.gender = params.form.gender
        this.ruleForm.country = params.form.country
        this.ruleForm.city = params.form.city
        this.ruleForm.feature = params.form.feature
        this.ruleForm.desc = params.form.desc
        this.ruleForm.lang = params.form.lang
        this.ruleForm.photo = params.form.photo
        this.ruleForm.sound = params.form.sound
        this.ruleForm.soundTime = params.form.soundTime
        this.ruleForm.status = params.form.status
        this.ruleForm.role = params.form.role
      }
      this.dialogVisible = true
    },
    handleRemove (file) {
      console.log(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    async uploadOnchange (file) {
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let url = `voiceActor/audios/${date}/${file.uid}.${ext}`
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.ruleForm, 'sound', res.key)
      let mySound = new Audio()
      mySound.src = this.assetsDomain + res.key
      mySound.oncanplay = () => {
        this.$set(this.ruleForm, 'soundTime', mySound.duration)
      }
    },
    playAudio (url) {
      if (!url) return
      let audio = new Audio()
      audio.src = this.assetsDomain + url
      audio.oncanplay = () => {
        audio.play()
      }
    },
    onChangeImage (file, fileList) {
      this.photoFile = file
      this.ruleForm.photo = URL.createObjectURL(file.raw)
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let photoUrl = this.ruleForm.photo
          let p = this.photoFile
          if (this.photoFile && p.raw) {
            let date = moment(new Date()).format('YYYY/MM/DD')
            let i = p.name.lastIndexOf('.')
            let ext = p.name.substring(i + 1)
            let url = 'voiceActor/images/' + date + '/' + p.uid + '.' + ext
            let res = await uploadQiniu(p.raw, this.token, url)
            photoUrl = res.key
          }
          if (this.flag === 'edit') {
            this.ruleForm.photo = photoUrl
            updateVoiceActor(this.ruleForm).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })
                this.$emit('initData')
                this.dialogVisible = false
              }
            })
          } else {
            let obj = {
              country: this.ruleForm.country,
              city: this.ruleForm.city,
              feature: this.ruleForm.feature,
              desc: this.ruleForm.desc,
              gender: parseInt(this.ruleForm.gender),
              lang: this.ruleForm.lang,
              name: this.ruleForm.name,
              photo: photoUrl,
              role: this.ruleForm.role,
              sound: this.ruleForm.sound,
              soundTime: this.ruleForm.soundTime,
              status: 0
            }
            createVoiceActor(obj).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.$emit('initData')
                this.dialogVisible = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.soundInfos {
  display:  flex;
  flex-direction: column;
  .sound-info-item {
    display:  flex;
    flex-direction: row;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
    &:last-child {
      margin-bottom: 0;
    }
    .left {
      display:  flex;
      flex-direction: column;
      flex: 1;
      padding: 0 10px 0px 0;
      border-right: 1px solid rgba($color: #000000, $alpha: .1);
      .row {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        .el-select {
          margin-right: 10px;
        }
      }
    }
    .right {
      width: 100px;
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
  }
}

.content-tr-item {
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
      margin-right: 10px;
    }
  }
  .right {
    width: 100px;
    padding-left: 10px;
  }
}

.synonym {
  .synonym-item {
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

.homonyms {
  .homonyms-item {
    display:  flex;
    flex-direction: row;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
    &:last-child {
      margin-bottom: 0;
    }
    .left {
      display:  flex;
      flex-direction: column;
      flex: 1;
      border-right: 1px solid rgba($color: #000000, $alpha: .1);
      .el-select {
        width: 320px;
      }
      .homonyms-attrs {
        display: flex;
        flex-direction: row;
        margin-top: 10px;
        &-left {
          display: flex;
          flex-direction: row;
          flex: 1;
          .el-input {
            margin-right: 10px;
          }
        }
      }
    }
    .right {
      width: 100px;
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
  }
}

.phrase {
  .phrase-item {
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
        margin-right: 10px;
      }
    }
    .right {
      width: 100px;
      padding-left: 10px;
    }
  }
}
</style>

<style lang="scss">
.soundInfos {
  .el-icon-upload2 {
    font-size: 20px;
  }
  .el-icon-video-play {
    font-size: 24px;
  }
}
</style>
