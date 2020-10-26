<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    center="center"
    width="80%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="句子：" prop="sentence">
        <el-input type="textarea" v-model="ruleForm.sentence"></el-input>
      </el-form-item>
      <el-form-item label="翻译：">
        <el-input type="textarea" v-model="ruleForm.contentTr"></el-input>
      </el-form-item>
      <el-form-item label="声音：">
        <div class="soundInfos">
          <div class="sound-info-item" v-for="(ctr, index) in ruleForm.soundInfos" :key="'si' + index">
            <div class="left">
              <div class="row">
                <el-select size="small" v-model="ruleForm.soundInfos[index]['gender']" placeholder="请选择男女声">
                  <el-option label="男" value="male"></el-option>
                  <el-option label="女" value="female"></el-option>
                </el-select>
              </div>
              <div class="row">
                <el-input size="small" placeholder="请上传声音" v-model="ruleForm.soundInfos[index]['sound']" class="input-with-select">
                  <el-upload slot="prepend"
                    action="#"
                    :accept="'audio/mp3'"
                    :on-change="uploadOnchange"
                    :show-file-list="false"
                    :auto-upload="false">
                    <el-button icon="el-icon-upload2" @click="upload('audio', 'soundInfos', index)"></el-button>
                  </el-upload>
                  <el-button slot="append" icon="el-icon-video-play" @click="playAudio(ruleForm.soundInfos[index]['sound'])"></el-button>
                </el-input>
              </div>
            </div>
            <div class="right">
              <el-button icon="el-icon-minus" circle @click="minusSoundInfo(index)"></el-button>
              <el-button v-if="ruleForm.soundInfos.length == index + 1" icon="el-icon-plus" circle @click="plusSoundInfo"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="标签：" prop="type">
        <el-checkbox-group v-model="ruleForm.tags">
          <el-checkbox v-for="tag in dictTags" :key="tag.key" :label="tag.key" name="type">{{ tag.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="配图：">
        <el-upload
          action="#"
          accept="image/webp"
          list-type="picture-card"
          :file-list="ruleForm.images"
          :on-change="onChangeImage"
          :auto-upload="false">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传webp文件</div>
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
import md5 from 'md5'

import {
  getInfoToken,
  updateDictSentence
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
      ruleForm: {
        uuid: '',
        courseInfos: null,
        images: [],
        source: '',
        mold: 0,
        sentence: '',
        soundInfos: [],
        contentTr: [],
        parent: '',
        tags: []
      },
      rules: {
        sentence: [
          { required: true, message: '请输入句子', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      partOfSpeech: state => state.course.partOfSpeech,
      assetsDomain: state => state.course.assetsDomain,
      dictTags: state => state.course.dictTags
    })
  },
  methods: {
    show (params) {
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      console.log(params)
      this.flag = params.type
      this.selLang = params.fromLang
      this.toLang = params.toLang
      console.log(this.partOfSpeech)
      this.ruleForm.uuid = ''
      this.ruleForm.courseInfos = null
      this.ruleForm.contentTr = ''
      this.ruleForm.parent = ''
      this.ruleForm.mold = 0
      this.ruleForm.source = ''
      this.ruleForm.sentence = ''
      this.ruleForm.tags = []
      this.ruleForm.soundInfos = [
        {
          sound: '',
          gender: ''
        }
      ]
      this.ruleForm.images = []
      if (this.flag === 'edit') {
        this.ruleForm.uuid = params.form.uuid
        this.ruleForm.mold = params.form.mold
        this.ruleForm.source = params.form.source
        this.ruleForm.courseInfos = params.form.courseInfos
        this.ruleForm.sentence = params.form.sentence
        this.ruleForm.sentenceTr = params.form.sentenceTr
        if (params.form.sentenceTr) {
          if (params.form.sentenceTr.tags) {
            params.form.sentenceTr.tags.forEach(item => {
              this.ruleForm.tags.push(item.key)
            })
          }
          this.ruleForm.contentTr = params.form.sentenceTr.contentTr
          this.ruleForm.parent = params.form.sentenceTr.parent
        }
        if (params.form.soundInfos) {
          this.ruleForm.soundInfos = params.form.soundInfos
        }
        if (params.form.image && params.form.image.length > 0) {
          params.form.image.forEach(item => {
            this.ruleForm.images.push({
              name: item,
              url: this.assetsDomain + item
            })
          })
        }
      }
      this.dialogVisible = true
    },
    plusSoundInfo () {
      let obj = {
        ct: '',
        ps: '',
        sound: '',
        gender: ''
      }
      this.ruleForm.soundInfos.push(obj)
    },
    minusSoundInfo (index) {
      if (this.ruleForm.soundInfos.length === 1) {
        this.ruleForm.soundInfos = [{
          sound: '',
          gender: ''
        }]
      } else {
        this.ruleForm.soundInfos.splice(index, 1)
      }
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
    upload (source, feild, index) {
      this.uploadIndex = source + ',' + feild + ',' + index
      console.log(this.uploadIndex)
    },
    async uploadOnchange (file) {
      let uploadIndexArr = this.uploadIndex.split(',')
      let dataFrom = uploadIndexArr[0]
      let feild = uploadIndexArr[1]
      let index = uploadIndexArr[2]
      let date = moment(new Date()).format('YYYY/MM/DD')
      let time = parseInt((new Date()).getTime() / 1000)
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let name = file.name.substring(0, i)
      let url = ''
      if (dataFrom === 'audio') {
        if (!this.ruleForm.soundInfos[index]['gender']) {
          this.$message({
            type: 'waring',
            message: '请选择男女声'
          })
          return
        }
        url = `dict/${this.selLang.toLowerCase()}/sentence/${this.ruleForm.soundInfos[index]['gender']}/${md5(time)}.${ext}`
      } else if (dataFrom === 'image') {
        url = 'dict/images/' + date + '/' + file.uid + '.' + ext
        this.saveImages([url], [name])
      } else if (dataFrom === 'video') {
        url = 'dict/videos/' + date + '/' + file.uid + '.' + ext
      }
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      if (feild === 'soundInfos') {
        this.$set(this.ruleForm['soundInfos'][index], 'sound', res.key)
      }
      console.log(this.ruleForm)
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
      this.ruleForm.images = fileList
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let tags = []
          this.ruleForm.tags.forEach(item => {
            let tag = this.dictTags.find(f => {
              return f.key === item
            })
            tags.push(tag)
          })

          let images = []
          for (let i = 0; i < this.ruleForm.images.length; i++) {
            let p = this.ruleForm.images[i]
            if (p.raw) {
              let date = moment(new Date()).format('YYYY/MM/DD')
              let i = p.name.lastIndexOf('.')
              let ext = p.name.substring(i + 1)
              let url = 'dict/images/' + date + '/' + p.uid + '.' + ext
              let res = await uploadQiniu(p.raw, this.token, url)
              images.push(res.key)
            } else {
              images.push(p.url)
            }
          }
          if (this.flag === 'edit') {
            let obj = {
              courseInfos: this.ruleForm.courseInfos,
              from: this.selLang,
              image: images,
              mold: this.ruleForm.mold,
              sentence: this.ruleForm.sentence,
              sentenceTr: {
                contentTr: this.ruleForm.contentTr,
                from: this.selLang,
                parent: this.ruleForm.parent,
                tags: tags,
                to: this.toLang
              },
              soundInfos: this.ruleForm.soundInfos,
              source: this.ruleForm.source,
              to: this.toLang,
              uuid: this.ruleForm.uuid
            }
            console.log(obj)
            updateDictSentence(obj).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '更新成功'
                })
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
