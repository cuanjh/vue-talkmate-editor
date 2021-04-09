<template>
  <el-dialog
    title="视频信息编辑"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form label-width="100px">
      <el-form-item label="选择标签：" required>
        <el-checkbox-group v-model="form.tags">
          <el-checkbox v-for="item in videoTagList" :key="item.uuid" :label="item.uuid">{{item.title}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="视频：">
        <el-input placeholder="请输入视频地址"  v-model="form.video.mp4">
          <el-upload
            slot="prepend"
            accept="video/mp4"
            name="filename"
            :headers="{
              'x-token': token
            }"
            :action="api + '/editor/video/upload'"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess">
            <el-button type="text">上传</el-button>
          </el-upload>
          <el-button slot="append" @click="playVideo()">预览</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="封面：">
        <el-upload
          list-type="picture-card"
          action="#"
          accept="image/webp,image/png,image/jpg,image/jpeg"
          :file-list="flags"
          :auto-upload="false"
          :on-change="onChangeImage"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题：" class="desc" required>
        <el-row class="mb10" v-for="l in langInfos" :key="'title' + l.langKey">
          <el-form-item class="input-box" :prop="'title.' + l.langKey">
            <el-input style="width: 90%" class="mr10" v-model="form.title[l.langKey]" maxlength="100" show-word-limit></el-input>
            <span>{{'(' + l.name + ')'}}</span>
          </el-form-item>
        </el-row>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
    </el-form>
  <div class="btns">
    <a class="cancel" @click="close()">取消</a>
    <a class="determine active" @click="submitUpload()">保存</a>
  </div>
  <el-dialog :visible.sync="dialogImageVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
</el-dialog>
</template>

<script>
import moment from 'moment'
import { uploadQiniu } from '@/utils/uploadQiniu'
import {
  getInfoToken,
  createVideo,
  updateVideo
} from '@/api/course'
import { mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      flag: '',
      dialogVisible: false,
      dialogImageVisible: false,
      dialogImageUrl: '',
      api: process.env.VUE_APP_BASE_API,
      uploadToken: '',
      fileList: [],
      loading: null,
      flags: [],
      form: {
        uuid: '',
        title: {},
        desc: '',
        video: {
          mp4: '',
          m3u8: ''
        },
        video_time: 0,
        cover_url: '',
        tags: []
      }
    }
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos,
      videoTagList: state => state.course.videoTagList,
      assetsDomain: state => state.course.assetsDomain
    }),
    ...mapGetters({
      token: 'user/token'
    })
  },
  methods: {
    show (params) {
      this.form = {
        tags: [],
        uuid: '',
        title: {},
        desc: '',
        video: {
          mp4: '',
          m3u8: ''
        },
        video_time: 0,
        cover_url: ''
      }
      console.log(params)
      this.flag = params.flag
      if (this.flag === 'edit') {
        this.form = params.form
        this.flags = [{
          name: this.form.cover_url,
          url: this.assetsDomain + this.form.cover_url
        }]
      }
      this.dialogVisible = true
    },
    close () {
      this.flags = []
      this.dialogVisible = false
    },
    async submitUpload () {
      if (this.form.tags.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择标签'
        })
        return false
      }

      if (!(this.form.title && this.form.title['en'] && this.form.title['zh-CN'])) {
        this.$message({
          type: 'warning',
          message: '请输入标题内容'
        })
        return false
      }
      if (this.flags[0].raw) {
        const file = this.flags[0]
        let i = file.name.lastIndexOf('.')
        let ext = file.name.substring(i + 1)
        const date = moment(new Date()).format('YYYY/MM/DD')
        let url = 'course/images/common/' + date + '/' + file.uid + '.' + ext
        const resToken = await getInfoToken()
        const token = resToken.data.token
        await uploadQiniu(file.raw, token, url)
        this.form.cover_url = url
      }
      let obj = this.form
      console.log(obj)
      if (this.flag === 'add') {
        createVideo(obj).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            this.$emit('closeLoad')
            this.dialogVisible = false
          }
        })
      } else {
        updateVideo(obj).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.$emit('closeLoad')
            this.dialogVisible = false
          }
        })
      }
      // this.$refs.upload.submit()
    },
    beforeUpload (file) {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    // 上传
    uploadSuccess (res, file, fileList) {
      this.loading.close()
      console.log(res)
      if (res.success) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        this.form.video.mp4 = res.data.mp4
        this.form.video.m3u8 = res.data.m3u8
        this.form.video_time = res.data.video_time
        console.log(this.form)
      } else {
        this.$message({
          type: 'error',
          message: '上传失败'
        })
      }
    },
    onChangeImage (file, fileList) {
      this.flags = [file]
    },
    handleRemove (file, fileList) {
      this.flags = fileList
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

<style lang="scss" scope>
.btns {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  a {
    cursor: pointer;
    display: inline-block;
    width:150px;
    height:40px;
    line-height: 40px;
    font-size:14px;
    font-weight:400;
    border-radius:4px;
    color:rgba(0,122,255,1);
    border:1px solid rgba(0,122,255,1);
    margin-right: 48px;
    &:last-child {
      margin-right: 0;
    }
    &:hover {
      color:rgba(255,255,255,1);
      background: #007AFF;
    }
    &.active {
      color:rgba(255,255,255,1);
      background: #007AFF;
    }
  }
}
</style>
