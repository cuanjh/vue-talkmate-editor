<template>
  <el-dialog
    :title="flag === 'add' ? '添加' : '修改'"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form label-width="100px">
      <el-form-item label="分类：">
        <el-select
          v-model="form.category"
          filterable
          default-first-option
          placeholder="请选择分类">
          <el-option
            v-for="item in typeList"
            :key="item.key"
            :label="item.val"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源类型：">
        <el-radio-group v-model="form.genre">
          <el-radio label="video">视频</el-radio>
          <el-radio label="image">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频：" v-show="form.genre == 'video'">
        <el-input placeholder="请查找相关视频"  v-model="form.video_url.mp4" readonly>
          <el-button slot="prepend" @click="searchVideo()">搜索</el-button>
          <el-button slot="append" @click="playVideo(form.video_url)">预览</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="封面：" v-if="form.genre == 'video'">
        <el-input placeholder="请查找相关封面"  v-model="form.image_url" readonly>
          <el-button slot="append" @click="picturePreview(form.image_url)">预览</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="封面：" v-else>
        <el-input placeholder="请查找相关封面"  v-model="form.image_url" readonly>
          <el-button slot="prepend" @click="searchImage()">搜索</el-button>
          <el-button slot="append" @click="picturePreview(form.image_url)">预览</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="标题：">
        <fieldset v-for="l in langInfos" :key="l.langKey">
          <legend>{{ l.name }}</legend>
          <el-input v-model="form.title[l.langKey]" maxlength="100" show-word-limit></el-input>
        </fieldset>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea" v-model="form.describe"></el-input>
      </el-form-item>
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
  <search-image ref="searchImage" tag="可儿幼儿园" @checked="checkedImage"/>
</el-dialog>
</template>

<script>
import {
  createKindResources,
  updateKindResources
} from '@/api/kindResources'
import { mapState, mapGetters } from 'vuex'
import SearchVideo from '@/components/searchVideo/searchVideo.vue'
import VideoPlayer from '@/components/common/videoPlayer.vue'
import SearchImage from '@/components/searchImage/searchImage.vue'

export default {
  data () {
    return {
      typeList: [
        { key: '1', val: '看得见的进步' },
        { key: '2', val: '园长讲话' },
        { key: '3', val: '课堂融合' },
        { key: '4', val: '园所挂牌' }
      ],
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
        category: '',
        genre: 'video',
        list_order: 0,
        is_show: false,
        video_url: {
          mp4: '',
          m3u8: ''
        },
        image_url: '',
        describe: '',
        title: {}
      }
    }
  },
  components: {
    SearchVideo,
    VideoPlayer,
    SearchImage
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
        category: '',
        genre: 'video',
        list_order: 0,
        is_show: true,
        describe: '',
        video_url: {
          mp4: '',
          m3u8: ''
        },
        video_time: 0,
        image_url: '',
        title: {}
      }
      this.flags = []
      console.log(params)
      this.flag = params.flag
      if (this.flag === 'edit') {
        this.form = params.form
        if (this.form.image_url) {
          this.flags = [{
            name: this.form.image_url,
            url: this.assetsDomain + this.form.image_url
          }]
        }
      }
      this.dialogVisible = true
    },
    close () {
      this.flags = {}
      this.dialogVisible = false
    },
    async submitUpload () {
      if (this.flag === 'add') {
        createKindResources(this.form).then(res => {
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
        updateKindResources(this.form).then(res => {
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
    picturePreview (url) {
      if (!url) return
      this.dialogImageUrl = this.assetsDomain + url
      this.dialogImageVisible = true
    },
    playVideo (video) {
      this.$refs['videoPlayer'].show(video)
    },
    searchVideo () {
      this.$refs.searchVideo.show()
    },
    searchImage () {
      this.$refs.searchImage.show()
    },
    checkedVideo (item) {
      console.log(item)
      if (!item) return
      this.form.video_url = item.video
      this.form.video_time = item.video_time
      this.form.image_url = item.cover_url
      this.form.title['zh-CN'] = item.title
      this.form.title['en'] = item.title
      this.form.describe = item.desc
    },
    checkedImage (item) {
      if (!item) return
      this.form.image_url = item.image_url
      this.form.title = {
        en: item.desc,
        'zh-CN': item.desc
      }
      this.form.describe = item.desc
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
