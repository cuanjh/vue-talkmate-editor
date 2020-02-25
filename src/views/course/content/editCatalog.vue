<template>
  <el-drawer
    :visible.sync="drawer"
    :with-header="false"
    size="50%"
    direction="rtl">
    <div class="edit-catalog-container" :style="{height: height + 'px'}">
      <div class="path">{{ '路径: ' + pathDesc }}</div>
      <div class="title" v-text="title"></div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="个数" v-show="handler == 'add'">
          <el-input-number v-model="form.num" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="模型" v-show="form.type === 'content'">
          <el-select v-model="form.content_model" placeholder="请选择模型">
            <el-option
              v-for="item in modelList"
              :key="item.model_key"
              :label="item.name"
              :value="item.model_key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
            <el-input v-model="form.title[l.langKey]"></el-input>
            <div class="text" v-text="'(' + l.name + ')'"></div>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
            <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
            <div class="text" v-text="'(' + l.name + ')'"></div>
          </div>
        </el-form-item>
        <el-form-item label="图标">
          <div class="img-box small-img-box">
            <div class="img">
              <img v-if="flagUrl" :src="flagUrl" fit="cover" />
            </div>
            <el-upload
              action="#"
              accept="image/png,image/jpg,image/jpeg"
              :on-change="uploadFlagOnchange"
              :show-file-list="false"
              :auto-upload="false">
              <div id="upload-btn">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="封面">
          <div class="img-box big-img-box">
            <div class="img">
              <img v-if="coverUrl" :src="coverUrl" />
            </div>
            <el-upload
              action="#"
              accept="image/png,image/jpg,image/jpeg"
              :on-change="uploadCoverOnchange"
              :show-file-list="false"
              :auto-upload="false">
              <div id="upload-btn">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="是否展示">
          <el-radio-group v-model="form.is_show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="handler">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="close">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import {
  addCatalog,
  editCatalog,
  getInfoToken
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      height: 0,
      token: '',
      trackNum: 0,
      title: '',
      drawer: false,
      handler: '',
      pathDesc: '',
      form: {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        desc: {},
        is_show: false,
        flag: [],
        cover: [],
        list_order: 0,
        content_model: '',
        type: '',
        num: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos,
      assetsDomain: state => state.course.assetsDomain,
      modelList: state => state.course.modelList,
      userInfo: state => state.user.userInfo
    }),
    flagUrl () {
      let url = ''
      if (this.form.flag && this.form.flag.length > 0) {
        url = this.form.flag[0]
      }
      if (url && url.indexOf('http') === -1) {
        url = this.assetsDomain + url
      }
      return url
    },
    coverUrl () {
      let url = ''
      if (this.form.cover && this.form.cover.length > 0) {
        url = this.form.cover[0]
      }
      if (url && url.indexOf('http') === -1) {
        url = this.assetsDomain + url
      }
      return url
    }
  },
  methods: {
    show (params) {
      this.resetFormData()
      // 获取上传图片token
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      this.pathDesc = params.pathDesc
      this.handler = params.handler
      this.trackNum = params.trackNum
      if (params.handler === 'add' && params.type === 'catalog') {
        this.title = '添加目录'
      }
      if (params.handler === 'add' && params.type === 'content') {
        this.form.content_model = 'content_model_pro_sound'
        this.title = '添加文件'
      }
      if (params.handler === 'edit' && params.type === 'catalog') {
        this.title = '编辑目录'
      }
      if (params.handler === 'edit' && params.type === 'content') {
        this.title = '编辑文件'
      }
      this.form.type = params.type
      if (params.handler === 'add') {
        this.form.parent_uuid = params.uuid
        this.form.list_order = params.maxOrder + 10
      }
      if (params.handler === 'edit') {
        this.form.parent_uuid = params.folder.parent_uuid
        let folder = params.folder
        this.form.uuid = folder.uuid
        this.form.name = folder.name
        this.form.title = folder.title
        this.form.desc = folder.desc
        this.form.flag = folder.flag
        this.form.cover = folder.cover
        this.form.is_show = folder.is_show
        this.form.content_model = folder.content_model
        this.form.type = folder.type
        this.form.list_order = folder.list_order
      }
      this.drawer = true
    },
    onSubmit () {
      console.log('submit!', this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.handler === 'add') {
            let obj1 = {
              catalogsInfo: {
                content_model: this.form.content_model,
                cover: this.form.cover,
                desc: this.form.desc,
                flag: this.form.flag,
                tags: [],
                has_changed: true,
                is_show: this.form.is_show,
                list_order: this.form.list_order,
                name: this.form.name,
                parent_uuid: this.form.parent_uuid,
                title: this.form.title,
                type: this.form.type
              },
              num: this.form.num
            }
            addCatalog(obj1).then(res => {
              this.trackNum += 1
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.$emit('resetTrackData', { pUUID: this.form.parent_uuid, trackNum: this.trackNum })
                this.drawer = false
              }
            })
          } else {
            let obj2 = {
              catalog_info: {
                cover: this.form.cover,
                desc: this.form.desc,
                flag: this.form.flag,
                has_changed: true,
                list_order: this.form.list_order,
                name: this.form.name,
                tags: [],
                title: this.form.title,
                is_show: this.form.is_show
              },
              uuid: this.form.uuid
            }
            console.log(obj2)
            editCatalog(obj2).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.$emit('resetTrackData', { pUUID: this.form.parent_uuid, trackNum: this.trackNum })
                this.drawer = false
              }
            })
          }
        }
      })
    },
    resetFormData () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.height = h - 2
      this.pathDesc = ''
      this.form = {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        desc: {},
        is_show: false,
        flag: [],
        cover: [],
        list_order: 0,
        content_model: '',
        num: 1
      }
    },
    async uploadFlagOnchange (file, fileList) {
      this.form.flag = []
      let url = 'course/content/catalog/flag/' + file.raw.name
      let res = await uploadQiniu(file.raw, this.token, url)
      this.form.flag.push(res.key)
    },
    async uploadCoverOnchange (file, fileList) {
      this.form.cover = []
      let url = 'course/content/catalog/cover/' + file.raw.name
      let res = await uploadQiniu(file.raw, this.token, url)
      this.form.cover.push(res.key)
    },
    close () {
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-catalog-container {
  widows: 100%;
  height: 100%;
  padding: 10px;
  overflow: auto;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  text-align: center;
  margin: 20px 0;
}
.lang-input {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  .el-input {
    width: 80%;
    margin-right: 10px;
  }
  .el-textarea {
    width: 80%;
    margin-right: 10px;
  }
}
.flag {
  position: relative;
  .flag-image {
    display: inline-block;
    width: 80px;
    height: 80px;
    background: #EFEFEF;
    border-radius: 4px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .el-button {
    position: absolute;
    margin: 40px 0 0 20px;
  }
}

.cover {
  position: relative;
  .cover-image {
    display: inline-block;
    width: 169px;
    height: 113px;
    background: #EFEFEF;
    border-radius: 4px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .el-button {
    position: absolute;
    margin: 70px 0 0 20px;
  }
}

.handler {
  margin: 20px 0;
  text-align: center;
}

.el-form {
  .el-radio {
    margin: 5px 10px;
  }
  .el-select {
    width: 100%;
  }
}
.img-box {
  display: flex;
  align-items: flex-end;
  #upload-btn {
    width: 30px;
    height: 30px;
    border:1px solid rgba(0,0,0,.1);
    border-radius: 2px;
    margin-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar-uploader-icon {
      color: #007AFF;
    }
  }
}
.big-img-box .img {
  width:400px;
  height:120px;
  background:rgba(239,239,239,1);
  overflow: hidden;
  border: 1px solid rgba(239,239,239,1);
  border-radius:4px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin-bottom: 20px;
  }
}
.small-img-box .img {
  width:120px;
  height:120px;
  background:rgba(239,239,239,1);
  border-radius:4px;
  border: 1px solid rgba(239,239,239,1);
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin-bottom: 20px;
  }
}
</style>
