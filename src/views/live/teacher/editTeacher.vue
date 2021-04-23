<template>
  <el-dialog
    title="编辑"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form :model="form" ref="form" size="small" label-width="96px">
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
      <el-form-item label="通用头像：">
        <el-upload
          list-type="picture-card"
          action="#"
          accept="image/webp,image/png,image/jpg,image/jpeg"
          :file-list="bigImgs"
          :auto-upload="false"
          :on-change="onChangeImage"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="主修语言：" required prop="own_langs" :rules="[
          { required: true, message: '主修语言不能为空', trigger: 'blur' }
        ]">
        <el-input v-model="form.own_langs" placeholder="请输入主修语言"></el-input>
        <el-tag type="warning">注：自定义格式如“英/法”</el-tag>
      </el-form-item>
      <el-form-item label="角色：">
        <el-checkbox-group v-model="checkRoles">
          <el-checkbox label="1">直播</el-checkbox>
          <el-checkbox label="2">值班</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogImageVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
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
      dialogImageVisible: false,
      dialogImageUrl: '',
      checkRoles: [],
      photoFile: null,
      bigImgs: [],
      form: {
        user_id: '',
        photo: '',
        own_langs: '',
        status: '',
        role: '',
        live_image: []
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
      this.form.own_langs = params.own_langs
      if (params.role) {
        this.checkRoles = params.role.split(',')
      }
      this.bigImgs = []
      if (params.live_image && params.live_image.length > 0) {
        params.live_image.forEach(c => {
          this.bigImgs.push({
            name: c,
            url: this.uploadfileDomain + c
          })
        })
      }
      this.form.status = params.status
      console.log(this.form)
    },
    changeUpload (file, fileList) {
      this.photoFile = file
      this.form.photo = URL.createObjectURL(file.raw)
    },
    async save () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.form.role = this.checkRoles.join(',')
          let resToken = await getInfoTokenUploadFile()
          if (this.photoFile) {
            const file = this.photoFile
            let date = moment(new Date()).format('YYYY/MM/DD')
            let i = file.name.lastIndexOf('.')
            let ext = file.name.substring(i + 1)
            let url = `liveroom/images/${date}/${file.uid}.${ext}`
            let res = await uploadQiniu(file.raw, resToken.data.token, url)
            this.form.photo = res.key
          }
          let covers = []
          if (this.bigImgs.length > 0) {
            for (let j = 0; j < this.bigImgs.length; j++) {
              let img = this.bigImgs[j]
              if (img.raw) {
                let date = moment(new Date()).format('YYYY/MM/DD')
                let i = img.name.lastIndexOf('.')
                let ext = img.name.substring(i + 1)
                let url = `liveroom/images/${date}/${img.uid}.${ext}`
                let res = await uploadQiniu(img.raw, resToken.data.token, url)
                covers.push(res.key)
              } else {
                covers.push(img.name)
              }
            }
          }
          this.form.live_image = covers
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close () {
      this.bigImgs = []
      this.$emit('loadData')
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
