<template>
  <el-dialog width="70%" title="制作分享海报" :visible.sync="dialogFormVisible" @close="close">
    <el-row>
      <el-col :span="12">
        <el-form :model="form" :rules="rules" ref="form" label-width="120px">
          <el-form-item label="分享网址">
            <el-input v-model="form.jumpUrl" placeholder="http://"></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.shareTitle" maxlength="25" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.shareDesc" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="背景图" prop="bgImg">
            <el-upload
              class="upload-demo"
              action="#"
              accept="image/jpeg"
              :auto-upload="false"
              :on-change="changebgImage"
              :file-list="fileList"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="二维码宽" prop="qrCodeX">
                <el-input v-model.number="form.qrCodeX"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二维码高" prop="qrCodeY">
                <el-input v-model.number="form.qrCodeY"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="二维码距左" prop="scaleX">
                <el-input v-model.number="form.scaleX"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="二维码距顶" prop="scaleY">
                <el-input v-model.number="form.scaleY"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="海报" prop=""
            :rules="[
              { required: true, message: '请上传课程海报'}
            ]">
            <el-tag type="warning">第一张图为分享H5课程介绍，第二张图为分享H5课程海报</el-tag>
            <el-upload
              class="avatar-uploader"
              action="#"
              list-type="picture-card"
              accept="image/png,image/jpg,image/jpeg"
              :on-preview="handlePictureCardPreview1"
              :on-change="uploadOnchange"
              :on-remove="handleRemove"
              :file-list="sharePoster"
              :show-file-list="true"
              :auto-upload="false">
              <div class="upload-area">
                <i class="el-icon-plus"></i>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible1" append-to-body>
              <img width="100%" :src="dialogImageUrl1" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="qrcodePoster">
          <el-image v-if="shareImageUrl" :src="shareImageUrl" fit="cover" :preview-src-list="srcList"></el-image>
          <div v-else>此处为生成含二维码的海报</div>
        </div>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import {
  sharePosterLive,
  getInfoTokenUploadFile
} from '@/api/course'
import { mapState } from 'vuex'
import { uploadQiniu } from '@/utils/uploadQiniu'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      srcList: [],
      dialogImageUrl1: '',
      dialogVisible1: false,
      token: '',
      sharePoster: [],
      form: {
        courseCode: '',
        jumpUrl: 'http://test-learn.talkmate.com:82/liveShare/index.html',
        shareTitle: '',
        shareDesc: '',
        bgImg: null,
        qrCodeX: 170,
        qrCodeY: 170,
        scaleX: 506,
        scaleY: 964,
        'sharePoster[]': ''
      },
      rules: {
        shareTitle: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        shareDesc: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ],
        bgImg: [
          { required: true, message: '请上传背景图', trigger: 'change' }
        ],
        qrCodeX: [
          { type: 'number', message: '二维码宽必须为数字值' }
        ],
        qrCodeY: [
          { type: 'number', message: '二维码高必须为数字值' }
        ],
        scaleX: [
          { type: 'number', message: '二维码距左必须为数字值' }
        ],
        scaleY: [
          { type: 'number', message: '二维码距顶必须为数字值' }
        ]
      },
      shareImageUrl: '',
      fileList: []
    }
  },
  mounted () {
    getInfoTokenUploadFile().then(res => {
      this.token = res.data.token
    })
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    }),
    jumpUrl () {
      return 'http://test-learn.talkmate.com:82/liveShare/index.html'
    }
  },
  methods: {
    show (params) {
      this.resetForm()
      let posters = []
      if (params.room.liveInfo.sharePoster && params.room.liveInfo.sharePoster.length) {
        params.room.liveInfo.sharePoster.forEach(item => {
          posters.push({
            name: item,
            url: this.uploadfileDomain + item
          })
        })
      }
      this.sharePoster = posters
      this.form.courseCode = params.room.code
      this.form.shareTitle = params.room.liveInfo.shareTitle
      this.form.shareDesc = params.room.liveInfo.shareDesc
      this.shareImageUrl = params.room.liveInfo.shareBgUrl
      this.srcList = [this.shareImageUrl]
      this.dialogFormVisible = true
    },
    changebgImage (file, fileList) {
      this.form.bgImg = file.raw
    },
    resetForm () {
      this.fileList = []
      this.form = {
        courseCode: '',
        shareTitle: '',
        shareDesc: '',
        jumpUrl: 'http://test-learn.talkmate.com:82/liveShare/index.html',
        bgImg: null,
        qrCodeX: 174,
        qrCodeY: 174,
        scaleX: 506,
        scaleY: 964
      }
    },
    submitForm () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let posters = []
          for (let i = 0; i < this.sharePoster.length; i++) {
            let p = this.sharePoster[i]
            if (p.raw) {
              let date = moment(new Date()).format('YYYY/MM/DD')
              let ext = p.name.split('.')[1]
              let url = 'live/images/' + date + '/' + p.uid + '.' + ext
              let res = await uploadQiniu(p.raw, this.token, url)
              posters.push(res.key)
            } else {
              posters.push(p.name)
            }
          }
          this.form['sharePoster[]'] = posters.join(',')
          sharePosterLive(this.form).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '生成成功'
              })
              this.shareImageUrl = res.data.shareBgUrl
              this.srcList = [this.shareImageUrl]
            }
          })
        }
      })
    },
    handlePictureCardPreview () {
      this.dialogImageUrl = this.shareImageUrl
      this.dialogVisible = true
    },
    close () {
      this.$emit('initData')
    },
    async uploadOnchange (file, fileList) {
      this.sharePoster = fileList
    },
    handlePictureCardPreview1 (file) {
      this.dialogImageUrl1 = file.url
      this.dialogVisible1 = true
    },
    handleRemove (file, fileList) {
      this.sharePoster = this.sharePoster.filter(f => {
        return f.name !== file.name
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 80%;
}
.qrcodePoster {
  width: 250px;
  height: 445px;
  background: #E8E8E8;
  color: rgba(0, 0, 0, .4);
  line-height: 445px;
  margin: 0 auto;
  text-align: center;
}
.dialog-footer {
  text-align: center;
}
</style>
