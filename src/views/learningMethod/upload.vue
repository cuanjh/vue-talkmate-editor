<template>
  <el-dialog
    :title="flag === 'add' ? '添加' : '修改'"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form label-width="100px">
      <fieldset v-for="l in langInfos" :key="l.langKey">
        <legend>{{ l.name }}</legend>
        <el-form-item label="视频：">
          <el-input placeholder="请查找相关视频"  v-model="form[l.langKey].video.mp4" readonly>
            <el-button slot="prepend" @click="searchVideo(l.langKey)">搜索</el-button>
            <el-button slot="append" @click="playVideo(form[l.langKey].video)">预览</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="封面：">
          <el-upload
            list-type="picture-card"
            action="#"
            accept="image/webp,image/png,image/jpg,image/jpeg"
            :file-list="flags[l.langKey]"
            :auto-upload="false"
            :on-change="l.langKey == 'en' ? onChangeImage : onChangeImage2"
            :on-preview="handlePictureCardPreview"
            :on-remove="l.langKey == 'en' ? handleRemove : handleRemove2">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="form[l.langKey].title" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input type="textarea" v-model="form[l.langKey].desc"></el-input>
        </el-form-item>
      </fieldset>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="form.is_show">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  <div class="btns">
    <a class="cancel" @click="close()">取消</a>
    <a class="determine active" @click="submitUpload()">保存</a>
  </div>
  <video-player ref="videoPlayer" />
  <el-dialog :visible.sync="dialogImageVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  <search-video ref="searchVideo" @checkedVideo="checkedVideo"/>
</el-dialog>
</template>

<script>
import moment from 'moment'
import { uploadQiniu } from '@/utils/uploadQiniu'
import {
  getInfoToken,
  createStudyMethod,
  updateStudyMethod
} from '@/api/course'
import { mapState, mapGetters } from 'vuex'
import SearchVideo from '@/components/searchVideo/searchVideo.vue'
import VideoPlayer from '@/components/common/videoPlayer.vue'

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
      flags: {
        en: [],
        'zh-CN': []
      },
      selLang: '',
      form: {
        uuid: '',
        list_order: 0,
        is_show: false,
        en: {
          title: '',
          desc: '',
          video: {
            mp4: '',
            m3u8: ''
          },
          video_time: 0,
          cover_url: ''
        },
        'zh-CN': {
          title: '',
          desc: '',
          video: {
            mp4: '',
            m3u8: ''
          },
          video_time: 0,
          cover_url: ''
        }
      }
    }
  },
  components: {
    SearchVideo,
    VideoPlayer
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
        uuid: '',
        list_order: 0,
        is_show: true,
        en: {
          title: '',
          desc: '',
          video: {
            mp4: '',
            m3u8: ''
          },
          video_time: 0,
          cover_url: ''
        },
        'zh-CN': {
          title: '',
          desc: '',
          video: {
            mp4: '',
            m3u8: ''
          },
          video_time: 0,
          cover_url: ''
        }
      }
      this.flags = {
        en: [],
        'zh-CN': []
      }
      console.log(params)
      this.flag = params.flag
      if (this.flag === 'edit') {
        this.form = params.form
        for (const item of this.langInfos) {
          if (this.form[item.langKey].cover_url) {
            this.flags[item.langKey] = [{
              name: this.form[item.langKey].cover_url,
              url: this.assetsDomain + this.form[item.langKey].cover_url
            }]
          }
        }
      }
      this.dialogVisible = true
    },
    close () {
      this.flags = {}
      this.dialogVisible = false
    },
    async submitUpload () {
      for (const item of this.langInfos) {
        if (this.flags[item.langKey].length > 0 && this.flags[item.langKey][0].raw) {
          const file = this.flags[item.langKey][0]
          let i = file.name.lastIndexOf('.')
          let ext = file.name.substring(i + 1)
          const date = moment(new Date()).format('YYYY/MM/DD')
          let url = 'course/images/common/' + date + '/' + file.uid + '.' + ext
          const resToken = await getInfoToken()
          const token = resToken.data.token
          await uploadQiniu(file.raw, token, url)
          this.form[item.langKey].cover_url = url
        }
      }
      let obj = this.form
      console.log(obj)
      if (this.flag === 'add') {
        createStudyMethod(obj).then(res => {
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
        updateStudyMethod(obj).then(res => {
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
    onChangeImage (file, fileList) {
      this.flags['en'] = [file]
    },
    onChangeImage2 (file, fileList) {
      this.flags['zh-CN'] = [file]
    },
    handleRemove (file, fileList) {
      this.flags['en'] = fileList
    },
    handleRemove2 (file, fileList) {
      this.flags['zh-CN'] = fileList
    },
    handlePictureCardPreview (file) {
      console.log(file)
      if (file.raw) {
        this.dialogImageUrl = URL.createObjectURL(file.raw)
      } else {
        this.dialogImageUrl = file.url
      }
      this.dialogImageVisible = true
    },
    playVideo (video) {
      this.$refs['videoPlayer'].show(video)
    },
    searchVideo (lang) {
      this.selLang = lang
      this.$refs.searchVideo.show()
    },
    checkedVideo (item) {
      console.log(item)
      if (!item) return
      this.form[this.selLang] = {
        video: item.video,
        video_time: item.video_time,
        cover_url: item.cover_url,
        title: item.title,
        desc: item.desc
      }
      if (item.cover_url) {
        this.flags[this.selLang] = [{
          name: item.cover_url,
          url: this.assetsDomain + item.cover_url
        }]
      }
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

fieldset {
  padding: 10px;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  margin: 10px 0;
}
</style>
