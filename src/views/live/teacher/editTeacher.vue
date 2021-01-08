<template>
  <el-dialog
    title="编辑"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form :model="form" ref="form" size="small" label-width="84px">
      <el-form-item label="头像：">
        <el-upload
          class="avatar-uploader"
          action="#"
          accept="image/jpeg,image/jpg,image/png"
          :on-change="changeUpload"
          :auto-upload="false"
          :show-file-list="false">
          <img v-if="form.photo" :src="form.photo.indexOf('http') > -1 ? form.photo : uploadfileDomain + form.photo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="主修语言：">
        <el-input v-model="form.ownLangs" placeholder="请输入主修语言"></el-input>
        <el-tag type="warning">注：自定义格式如“英/法”</el-tag>
      </el-form-item>
      <el-form-item label="角色：">
        <el-checkbox-group v-model="checkRoles">
          <el-checkbox label="1">直播</el-checkbox>
          <el-checkbox label="2">值班</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="save">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

import {
  updateTeacher,
  getInfoTokenUploadFile
} from '@/api/course'

import {
  uploadQiniu
} from '@/utils/uploadQiniu'

export default {
  data () {
    return {
      dialogVisible: false,
      checkRoles: [],
      photoFile: null,
      form: {
        user_id: '',
        photo: '',
        ownLangs: '',
        status: '',
        role: ''
      }
    }
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.dialogVisible = true
      this.photoFile = null
      this.form.user_id = params.user_id
      this.form.photo = params.photo
      this.form.ownLangs = params.ownLangs
      if (params.role) {
        this.checkRoles = params.role.split(',')
      }
      this.form.status = params.status
      console.log(this.form)
    },
    changeUpload (file, fileList) {
      this.photoFile = file
      this.form.photo = URL.createObjectURL(file.raw)
    },
    async save () {
      this.form.role = this.checkRoles.join(',')
      if (this.photoFile) {
        const file = this.photoFile
        let date = moment(new Date()).format('YYYY/MM/DD')
        let i = file.name.lastIndexOf('.')
        let ext = file.name.substring(i + 1)
        let url = `liveroom/images/${date}/${file.uid}.${ext}`
        let resToken = await getInfoTokenUploadFile()
        let res = await uploadQiniu(file.raw, resToken.data.token, url)
        this.form.photo = res.key
      }
      updateTeacher(this.form).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      })
    },
    close () {
      this.$emit('loadData')
    }
  }
}
</script>

<style lang="scss" scoped>
.identify-photo {
  .el-image {
    width: 160px;
    height: 90px;
    border-radius: 4px;
    margin-right: 20px;
  }
}

.dialog-footer {
  display: block;
  text-align: center;
}
</style>
