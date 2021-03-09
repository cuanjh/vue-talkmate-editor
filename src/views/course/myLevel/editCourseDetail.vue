<template>
  <el-dialog
    title="编辑课程详情"
    :visible.sync="dialogVisible"
    @closed="closed"
    width="50%">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="课程简介">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="课程内容">
        <el-form :inline="true">
          <el-form-item label="课程">
            <el-input v-model="form.content.lesson"></el-input>
          </el-form-item>
          <el-form-item label="词汇">
            <el-input v-model="form.content.word"></el-input>
          </el-form-item>
          <el-form-item label="句型">
            <el-input v-model="form.content.sentence"></el-input>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="课程特色">
        <el-upload
          class="avatar-uploader"
          action="#"
          list-type="picture-card"
          accept="image/png,image/jpg,image/jpeg"
          :on-preview="handlePreview"
          :on-change="uploadOnchange"
          :on-remove="handleRemove"
          :file-list="form.posters"
          :show-file-list="true"
          :auto-upload="false">
          <div class="upload-area">
            <i class="el-icon-plus"></i>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible1" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getCourseDetail,
  getInfoToken,
  editCourseDetail
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'

import { mapState } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      dialogVisible1: false,
      disabled: false,
      token: '',
      fileList: [],
      course: {},
      form: {
        content: {
          lesson: '',
          sentence: '',
          word: ''
        },
        desc: '',
        posters: []
      }
    }
  },
  mounted () {
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    async show (row) {
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      this.course = row
      let res = await getCourseDetail({ course_code: this.course.code })
      console.log(res)
      if (res.success) {
        let detail = res.data.detail
        this.form.desc = detail.desc
        this.form.content.lesson = detail.content.lesson
        this.form.content.word = detail.content.word
        this.form.content.sentence = detail.content.sentence
        let posters = []
        if (detail.features && detail.features.length > 0) {
          detail.features.forEach(item => {
            posters.push({
              name: item.img,
              url: this.assetsDomain + item.img
            })
          })
        }
        this.form.posters = posters
      }
      this.dialogVisible = true
    },
    onSubmit () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          console.log(this.form.posters)
          let features = []
          let posters = []
          for (let i = 0; i < this.form.posters.length; i++) {
            let p = this.form.posters[i]
            if (p.raw) {
              let date = moment(new Date()).format('YYYY/MM/DD')
              let i = p.name.lastIndexOf('.')
              let ext = p.name.substring(i + 1)
              let url = 'course/images/' + date + '/' + p.uid + '.' + ext
              let res = await uploadQiniu(p.raw, this.token, url)
              posters.push(res.key)
            } else {
              posters.push(p.name)
            }
          }
          // 同步获取图片宽和高
          for (let j = 0; j < posters.length; j++) {
            let url = posters[j]
            if (url.indexOf('?') > -1) {
              url = url.split('?')[0]
            }
            let img = await this.imgOnload(url)
            url += '?w=' + img.width + '&h=' + img.height
            posters[j] = url
            features.push({
              desc: '',
              img: url,
              list_order: j,
              title: ''
            })
          }
          let obj = {
            content: {
              lesson: this.form.content.lesson,
              sentence: this.form.content.sentence,
              word: this.form.content.word
            },
            course_code: this.course.code,
            desc: this.form.desc,
            features: features,
            flag: this.course.flag && this.course.flag.length > 0 ? this.course.flag[0] : '',
            title: this.course.title && Object.keys(this.course.title).length > 0 ? this.course.title['zh-CN'] : ''
          }
          console.log(obj)
          let res = await editCourseDetail(obj)
          if (res.success) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.dialogVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handlePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible1 = true
    },
    handleRemove (file, fileList) {
      this.form.posters = this.form.posters.filter(f => {
        return f.name !== file.name
      })
    },
    uploadOnchange (file, fileList) {
      this.form.posters = fileList
    },
    imgOnload (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = this.assetsDomain + url
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          reject(new Error('图片加载失败'))
        }
      })
    },
    closed () {
      this.form = {
        content: {
          lesson: '',
          sentence: '',
          word: ''
        },
        desc: '',
        posters: []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
