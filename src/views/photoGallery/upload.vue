<template>
  <el-dialog
    title="图片上传"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form>
      <el-form-item label="选择分类：">
        <el-checkbox-group v-model="checkTags">
          <el-checkbox v-for="(item, index) in tags" :key="index" :label="item.TagKey"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="#"
          accept="image/png,image/jpg,image/jpeg,image/webp"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :limit="10"
          :multiple="true"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传并保存</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { uploadQiniu } from '@/utils/uploadQiniu'
import {
  addMoreImages
} from '@/api/course'
export default {
  data () {
    return {
      dialogVisible: false,
      tags: [],
      checkTags: [],
      token: '',
      fileList: []
    }
  },
  methods: {
    show (params) {
      console.log(params)
      this.tags = params.tags
      this.token = params.token
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    submitUpload () {
      if (this.checkTags.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择分类'
        })
        return false
      }
      let uploadFiles = this.$refs.upload.uploadFiles
      if (uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要上传的文件'
        })
        return false
      }
      console.log(uploadFiles)
      let imageUrls = []
      let names = []
      let date = moment(new Date()).format('YYYY/MM/DD')
      uploadFiles.forEach(file => {
        let ext = file.name.split('.')[1]
        let url = 'course/images/common/' + date + '/' + file.uid + '.' + ext
        imageUrls.push(url)
        names.push(file.name.split('.')[0])
        uploadQiniu(file.raw, this.token, url)
      })
      let obj = {
        image_urls: imageUrls,
        tagKeys: this.checkTags,
        names: names
      }
      addMoreImages(obj).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.$emit('closeLoad')
          this.dialogVisible = false
        }
      })
      // this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
