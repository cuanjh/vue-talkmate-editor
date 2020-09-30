<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    center="center"
    width="80%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="单词：" prop="content">
        <el-input v-model="ruleForm.content"></el-input>
      </el-form-item>
      <el-form-item label="发音：">
        <div class="soundInfos">
          <div class="sound-info-item" v-for="(ctr, index) in ruleForm.sound_infos" :key="'si' + index">
            <div class="left">
              <div class="row">
                <el-select size="small" v-model="ruleForm.sound_infos[index]['ct']" placeholder="请选择">
                  <el-option v-for="ps in soundLangObj[''+selLang+'']" :key="ps.key" :label="`${ps.name}（${ps.key}）`" :value="ps.key">
                  </el-option>
                </el-select>
                <el-select size="small" v-model="ruleForm.sound_infos[index]['gender']" placeholder="请选择男女声">
                  <el-option label="男" value="male"></el-option>
                  <el-option label="女" value="female"></el-option>
                </el-select>
                <el-input size="small" v-model="ruleForm.sound_infos[index]['ps']" placeholder="请输入音标，音标前后需要加上'['和']'"></el-input>
              </div>
              <div class="row">
                <el-input size="small" placeholder="请上传声音" v-model="ruleForm.sound_infos[index]['sound']" class="input-with-select">
                  <el-upload slot="prepend"
                    action="#"
                    :accept="'audio/mp3'"
                    :on-change="uploadOnchange"
                    :show-file-list="false"
                    :auto-upload="false">
                    <el-button icon="el-icon-upload2" @click="upload('audio', 'sound_infos', index)"></el-button>
                  </el-upload>
                  <el-button slot="append" icon="el-icon-video-play" @click="playAudio(ruleForm.sound_infos[index]['sound'])"></el-button>
                </el-input>
              </div>
            </div>
            <div class="right">
              <el-button icon="el-icon-minus" circle @click="minusSoundInfo(index)"></el-button>
              <el-button v-if="ruleForm.sound_infos.length == index + 1" icon="el-icon-plus" circle @click="plusSoundInfo"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="词性：">
        <div class="contentTR">
          <div class="content-tr-item" v-for="(ctr, index) in ruleForm.content_tr" :key="'ctr' + index">
            <div class="left">
              <el-select v-model="ruleForm.content_tr[index]['cx']" placeholder="请选择分类">
                <el-option v-for="ps in partOfSpeech[''+selLang+'']" :key="ps.key" :label="`${ps.name}（${ps.key}）`" :value="ps.key">
                </el-option>
              </el-select>
              <el-input v-model="ruleForm.content_tr[index]['content']" placeholder="请输入所选分类相应的含义，多个含义之间用'；'隔开"></el-input>
            </div>
            <div class="right">
              <el-button icon="el-icon-minus" circle @click="minusContentTR(index)"></el-button>
              <el-button v-if="ruleForm.content_tr.length == index + 1" icon="el-icon-plus" circle @click="plusContentTR"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="同近义词：">
        <div class="synonym">
          <div class="synonym-item" v-for="(ctr, index) in ruleForm.synonym" :key="'ctr' + index">
            <div class="left">
              <el-select v-model="ruleForm.synonym[index]['cx']" placeholder="请选择分类">
                <el-option v-for="ps in partOfSpeech[''+selLang+'']" :key="ps.key" :label="`${ps.name}（${ps.key}）`" :value="ps.key"></el-option>
              </el-select>
              <el-input v-model="ruleForm.synonym[index]['content']" placeholder="请输入所选分类相应的含义，多个含义之间用'；'隔开"></el-input>
              <el-input v-model="ruleForm.synonym[index]['contentTr']" placeholder="请输入所选分类的同近义词，多个单词之间用','隔开"></el-input>
            </div>
            <div class="right">
              <el-button icon="el-icon-minus" circle @click="minusSynonym(index)"></el-button>
              <el-button v-if="ruleForm.synonym.length == index + 1" icon="el-icon-plus" circle @click="plusSynonym"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="同根词：">
        <div class="homonyms">
          <div class="homonyms-item" v-for="(ctr, index) in ruleForm.homonyms" :key="'ctr' + index">
            <div class="left">
              <el-select size="middle" v-model="ruleForm.homonyms[index]['cx']" placeholder="请选择分类">
                <el-option v-for="ps in partOfSpeech[''+selLang+'']" :key="ps.key" :label="`${ps.name}（${ps.key}）`" :value="ps.key"></el-option>
              </el-select>
              <div class="homonyms-attrs" v-for="(hattr, i) in ruleForm.homonyms[index]['attrs']" :key="'hattr' + i">
                <div class="homonyms-attrs-left">
                  <el-input size="small" v-model="ruleForm.homonyms[index]['attrs'][i]['content']" placeholder="请输入同根词"></el-input>
                  <el-input size="small" v-model="ruleForm.homonyms[index]['attrs'][i]['contentTr']" placeholder="请输入同根词的含义，多个含义之间用'；'隔开"></el-input>
                </div>
                <div class="right">
                  <el-button size="small" icon="el-icon-minus" circle @click="minusHomonymsAttr(index, i)"></el-button>
                  <el-button size="small" v-if="ruleForm.homonyms[index]['attrs'].length == i + 1" icon="el-icon-plus" circle @click="plusHomonymsAttr(index)"></el-button>
                </div>
              </div>
            </div>
            <div class="right">
              <el-button icon="el-icon-minus" circle @click="minusHomonyms(index)"></el-button>
              <el-button v-if="ruleForm.homonyms.length == index + 1" icon="el-icon-plus" circle @click="plusHomonyms"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="固定搭配：">
        <div class="phrase">
          <div class="phrase-item" v-for="(ctr, index) in ruleForm.phrase" :key="'ctr' + index">
            <div class="left">
              <el-input v-model="ruleForm.phrase[index]['content']" placeholder="请输入该单词的固定搭配"></el-input>
              <el-input v-model="ruleForm.phrase[index]['contentTr']" placeholder="请输入固定搭配对应的翻译，多个含义用'；'隔开"></el-input>
            </div>
            <div class="right">
              <el-button icon="el-icon-minus" circle @click="minusPhrase(index)"></el-button>
              <el-button v-if="ruleForm.phrase.length == index + 1" icon="el-icon-plus" circle @click="plusPhrase"></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="标签：" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="配图：">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogImageVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

import {
  getInfoToken
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
      uploadIndex: '',
      token: '',
      dialogImageUrl: '',
      dialogImageVisible: false,
      disabled: false,
      soundLangObj: {
        default: [
          { key: '', name: '标准' }
        ],
        ENG: [
          { key: 'en', name: '英' },
          { key: 'us', name: '美' }
        ]
      },
      ruleForm: {
        content: '',
        sound_infos: [
        ],
        content_tr: [],
        synonym: [],
        homonyms: [],
        phrase: [],
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入单词', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      partOfSpeech: state => state.course.partOfSpeech,
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    show (params) {
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      console.log(params)
      this.flag = params.type
      this.selLang = params.selFromLang
      console.log(this.partOfSpeech)
      this.ruleForm.sound_infos = [
        {
          ct: '',
          ps: '',
          sound: '',
          gender: ''
        }
      ]
      this.ruleForm.content_tr = [
        {
          cx: '',
          content: ''
        }
      ]
      this.ruleForm.synonym = [
        {
          cx: '',
          content: '',
          contentTr: ''
        }
      ]
      this.ruleForm.homonyms = [
        {
          cx: '',
          attrs: [
            {
              content: '',
              contentTr: ''
            }
          ]
        }
      ]
      this.ruleForm.phrase = [
        {
          content: '',
          contentTr: ''
        }
      ]
      if (this.flag === 'edit') {
        this.ruleForm.content = params.form.content
        if (params.form.soundInfos) {
          this.ruleForm.sound_infos = params.form.soundInfos
        }
        const dictTranslate = params.form.dictTranslate
        if (dictTranslate && dictTranslate.contentTr) {
          this.ruleForm.content_tr = dictTranslate.contentTr
        }
        if (dictTranslate && dictTranslate.synonym) {
          this.ruleForm.synonym = dictTranslate.synonym
        }
        if (dictTranslate && dictTranslate.homonyms) {
          this.ruleForm.homonyms = dictTranslate.homonyms
        }
        if (params.form.phrase) {
          this.ruleForm.phrase = params.form.phrase
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
      this.ruleForm.sound_infos.push(obj)
    },
    minusSoundInfo (index) {
      if (this.ruleForm.sound_infos.length === 1) {
        this.ruleForm.sound_infos = [{
          ct: '',
          ps: '',
          sound: '',
          gender: ''
        }]
      } else {
        this.ruleForm.sound_infos.splice(index, 1)
      }
    },
    plusContentTR () {
      let obj = {
        cx: '',
        content: ''
      }
      this.ruleForm.content_tr.push(obj)
    },
    minusContentTR (index) {
      if (this.ruleForm.content_tr.length === 1) {
        this.ruleForm.content_tr = [{
          cx: '',
          content: ''
        }]
      } else {
        this.ruleForm.content_tr.splice(index, 1)
      }
    },
    plusSynonym () {
      let obj = {
        cx: '',
        content: '',
        contentTr: ''
      }
      this.ruleForm.synonym.push(obj)
    },
    minusSynonym (index) {
      if (this.ruleForm.synonym.length === 1) {
        this.ruleForm.synonym = [{
          cx: '',
          content: '',
          contentTr: ''
        }]
      } else {
        this.ruleForm.synonym.splice(index, 1)
      }
    },
    plusHomonyms () {
      let obj = {
        cx: '',
        attrs: [
          {
            content: '',
            contentTr: ''
          }
        ]
      }
      this.ruleForm.homonyms.push(obj)
    },
    minusHomonyms (index) {
      if (this.ruleForm.homonyms.length === 1) {
        this.ruleForm.homonyms = [{
          cx: '',
          attrs: [
            {
              content: '',
              contentTr: ''
            }
          ]
        }]
      } else {
        this.ruleForm.homonyms.splice(index, 1)
      }
    },
    plusHomonymsAttr (index) {
      let obj = {
        content: '',
        contentTr: ''
      }
      this.ruleForm.homonyms[index]['attrs'].push(obj)
    },
    minusHomonymsAttr (index, i) {
      if (this.ruleForm.homonyms[index]['attrs'].length === 1) {
        this.ruleForm.homonyms[index]['attrs'] = [{
          content: '',
          contentTr: ''
        }]
      } else {
        this.ruleForm.homonyms[index]['attrs'].splice(i, 1)
      }
    },
    plusPhrase () {
      let obj = {
        content: '',
        contentTr: ''
      }
      this.ruleForm.phrase.push(obj)
    },
    minusPhrase (index) {
      if (this.ruleForm.phrase.length === 1) {
        this.ruleForm.phrase = [{
          content: '',
          contentTr: ''
        }]
      } else {
        this.ruleForm.phrase.splice(index, 1)
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
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let name = file.name.substring(0, i)
      let url = ''
      if (dataFrom === 'audio') {
        url = 'dict/sounds/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'image') {
        url = 'dict/images/' + date + '/' + file.uid + '.' + ext
        this.saveImages([url], [name])
      } else if (dataFrom === 'video') {
        url = 'dict/videos/' + date + '/' + file.uid + '.' + ext
      }
      console.log(url)
      let res = await uploadQiniu(file.raw, this.token, url)
      if (feild === 'sound_infos') {
        this.$set(this.ruleForm['sound_infos'][index], 'sound', res.key)
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
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
