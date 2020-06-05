<template>
  <el-dialog width="70%" title="课程编辑" :visible.sync="dialogFormVisible" @close="close">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="标题">
        <label>{{title}}</label>
      </el-form-item>
      <el-form-item label="视频地址" prop="videoUrl">
        <el-input v-model="form.videoUrl" placeholder="https://"></el-input>
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
      form: {
        uuid: '',
        videoUrl: ''
      },
      rules: {
        videoUrl: [
          { required: true, message: '请填写课程视频地址', trigger: 'blur' }
        ]
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
      this.form.uuid = params.uuid
      this.dialogFormVisible = true
    },
    resetForm () {
      this.form = {
        videoUrl: ''
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
      }
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.form, feild, res.key)
    },
    setUploadField (name) {
      this.uploadField = name
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form)
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
</style>
