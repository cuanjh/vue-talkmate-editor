<template>
  <el-dialog width="70%" title="课程编辑" :visible.sync="dialogFormVisible" @close="close">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="标题">
        <label>{{title}}</label>
      </el-form-item>
      <el-form-item label="视频地址" prop="videoUrl">
        <el-input v-model="form.videoUrl" placeholder="https://">
          <el-upload slot="prepend"
            action="#"
            accept="video/mp4"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button type="text" @click="setUploadField('video,videoUrl')">上传</el-button>
          </el-upload>
        </el-input>
      </el-form-item>
      <el-form-item label="视频封面" prop="videoCover">
        <el-input v-model="form.videoCover" placeholder="https://">
          <el-upload slot="prepend"
            action="#"
            accept="image/png,image/jpg,image/jpeg,image/webp"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button type="text" @click="setUploadField('image,videoCover')">上传</el-button>
          </el-upload>
        </el-input>
      </el-form-item>
      <el-form-item label="微信号">
        <el-input v-model="form.weixinNo" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="结束标题">
        <el-input v-model="form.finishTitle" maxlength="12" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="结束通知">
        <el-input type="textarea" v-model="form.finishInfo" maxlength="90" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="直播时间">
        <el-date-picker
          :disabled="state == -1"
          v-model="date"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          class="time-picker"
          :disabled="state == -1"
          is-range
          v-model="times"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import {
  getInfoTokenUploadFile,
  editLiveCourse
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      uploadField: '',
      title: '',
      token: '',
      state: 0,
      date: new Date(),
      times: [
        new Date(), new Date()
      ],
      form: {
        uuid: '',
        videoUrl: '',
        videoTime: '',
        videoCover: '',
        finishTitle: '',
        finishInfo: '',
        weixinNo: '',
        date: '',
        startTime: '',
        EndTime: ''
      },
      rules: {
        // videoUrl: [
        //   { required: true, message: '请填写课程视频地址', trigger: 'blur' }
        // ]
      }
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
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.resetForm()
      this.title = params.title
      this.state = params.state
      this.form.videoUrl = params.videoUrl
      this.form.videoCover = params.videoCover
      this.form.finishTitle = params.finishTitle
      this.form.finishInfo = params.finishInfo
      this.form.weixinNo = params.weixinNo
      this.form.uuid = params.uuid
      this.date = params.date
      let st = params.state === -1 ? params.realStartTime : params.startTime
      let et = params.state === -1 ? params.realEndTime : params.EndTime
      this.times = [
        new Date(st * 1000),
        new Date(et * 1000)
      ]
      this.dialogFormVisible = true
    },
    resetForm () {
      this.form = {
        videoUrl: '',
        videoCover: '',
        videoTime: '',
        finishTitle: '',
        finishInfo: '',
        weixinNo: '',
        date: '',
        startTime: '',
        EndTime: ''
      }
    },
    async uploadOnchange (file, fileList) {
      let uploadIndexArr = this.uploadField.split(',')
      let dataFrom = uploadIndexArr[0]
      let feild = uploadIndexArr[1]
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = ''
      if (dataFrom === 'audio') {
        url = 'live/sounds/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'image') {
        url = 'live/images/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'video') {
        url = 'live/videos/' + date + '/' + file.uid + '.' + ext
        let createUrl = URL.createObjectURL(file.raw)
        let audioElement = new Audio(createUrl)
        audioElement.addEventListener('loadedmetadata', (e) => {
          console.log(audioElement.duration)
          this.form.videoTime = Math.round(audioElement.duration)
        })
      }
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.form, feild, this.uploadfileDomain + res.key)
    },
    setUploadField (name) {
      this.uploadField = name
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let startTime = (new Date(this.date + ' ' + moment(this.times[0]).format('HH:mm:ss'))).getTime() / 1000
          let endTime = (new Date(this.date + ' ' + moment(this.times[1]).format('HH:mm:ss'))).getTime() / 1000
          this.form.date = moment(this.date).format('YYYY-MM-DD')
          this.form.startTime = startTime
          this.form.EndTime = endTime
          editLiveCourse(this.form).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '发表成功'
              })
            }
          })
        }
      })
    },
    close () {
      this.$emit('initData')
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

.time-picker {
  margin-left: 20px;
}
</style>
