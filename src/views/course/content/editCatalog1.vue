<template>
  <div class="edit-catalog-container">
    <div class="left-bar">
      <div class="icon-box right" @click="hideCatalog" v-if="isLeft">
        <a href="javascript:;" class="icon-left"></a>
      </div>
      <div class="icon-box left" @click="hideCatalog" v-else>
        <a href="javascript:;" class="icon-right"></a>
      </div>
    </div>
    <div v-show="isShowRight">
      <div class="path">{{ '路径: ' + pathDesc }}</div>
      <div class="title" v-text="title"></div>
      <el-form ref="form" :model="form" :rules="rules"  label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="目录属性" v-show="catalogAttr && catalogAttr.length">
          <el-select v-model="attr_tag" filterable placeholder="请选择" @change="changeAttrTag()">
            <el-option value="" label="无"></el-option>
            <el-option
              v-for="item in catalogAttr"
              :key="item.key"
              :label="item.name"
              :value="item.key">
            </el-option>
          </el-select>
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
        <el-form-item label="目标语">
          <el-input v-model="form.goalTitle"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
            <el-input v-model="form.title[l.langKey]" :disabled="attr_tag != ''"></el-input>
            <div class="text" v-text="'(' + l.name + ')'"></div>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
            <el-input type="textarea" v-model="form.desc[l.langKey]" :disabled="attr_tag != ''"></el-input>
            <div class="text" v-text="'(' + l.name + ')'"></div>
          </div>
        </el-form-item>
        <el-form-item label="图标">
          <div class="img-box small-img-box">
            <div class="img">
              <img v-if="flagUrl" :src="flagUrl" fit="cover" />
            </div>
            <el-upload
              v-show="attr_tag == ''"
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
            <div class="img" v-if="form.cover.length">
              <div
                class="block"
                v-for="(cover, index) in form.cover"
                :key="'cover' + index">
                <span>{{ cover.split('/')[cover.split('/').length - 2]}}</span>
                <el-image
                  lazy
                  :src="assetsDomain + cover"
                  :preview-src-list="[assetsDomain + cover]"
                  fit="cover">
                </el-image>
                <div class="btn-handler" v-show="attr_tag == ''">
                  <el-button round size="small" @click="cropperImage(assetsDomain + cover)">裁剪</el-button>
                  <el-button round plain type="danger" size="small" @click="delImage('cover', index)">删除</el-button>
                </div>
              </div>
              <div class="block" v-show="attr_tag == ''">
                <el-upload
                  :disabled="attr_tag != ''"
                  action="#"
                  accept="image/png,image/jpg,image/jpeg"
                  :on-change="uploadCoverOnchange"
                  :show-file-list="false"
                  :auto-upload="false">
                  <div class="self-upload">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
              </div>
            </div>
            <div class="img" v-else>
              <div class="block">
                <el-upload
                  action="#"
                  accept="image/png,image/jpg,image/jpeg"
                  :on-change="uploadCoverOnchange"
                  :show-file-list="false"
                  :auto-upload="false">
                  <div class="self-upload">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="选择标签" v-show="selfContentTags && selfContentTags.length">
          <el-checkbox-group v-model="tags">
            <el-checkbox v-for="(tag, index) in selfContentTags" :key="tag.key + index" :label="tag.key">{{ tag.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否展示" v-show="handler === 'edit' && false" >
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
  </div>
</template>

<script>
import {
  addCatalog,
  editCatalog,
  getInfoToken,
  setAuthority
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isLeft: true,
      isShowRight: true,
      token: '',
      trackNum: 0,
      title: '',
      handler: '',
      pathDesc: '',
      attr_tag: '',
      tags: [],
      folder: {},
      form: {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        goalTitle: '',
        desc: {},
        is_show: true,
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
  created () {
    this.$bus.$on('uploadCopperImages', (data) => {
      console.log(data)
      this.form.cover = [...this.form.cover, ...data]
      console.log(this.form.cover)
    })
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos,
      assetsDomain: state => state.course.assetsDomain,
      modelList: state => state.course.modelList,
      contentTags: state => state.course.contentTags,
      version: state => state.course.version,
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
    },
    selfContentTags () {
      let arr = []
      if (this.contentTags) {
        arr = this.contentTags.filter(item => {
          return item.type.toLowerCase() === 'kid' || item.type.toLowerCase() === 'pro'
        })
      }
      console.log(arr)
      return arr
    },
    catalogAttr () {
      let arr1 = []
      if (this.version && this.contentTags) {
        let courseType = this.version.selCourseType
        let type = 'catalog'
        if (courseType === 3) {
          type = 'kidCatalog'
        }
        arr1 = this.contentTags.filter(item => {
          return item.type === type
        })
      }
      if (arr1.length) {
        arr1 = arr1.sort((a, b) => {
          return a.list_order - b.list_order
        })
      }
      return arr1
    }
  },
  methods: {
    hideCatalog () {
      this.isLeft = !this.isLeft
      this.isShowRight = !this.isShowRight
      this.$emit('hideCatalog1', this.isLeft)
    },
    show (params) {
      console.log(params)
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
        this.tags = []
        this.form.parent_uuid = params.uuid
        this.form.list_order = params.maxOrder + 10
      }
      if (params.handler === 'edit') {
        this.form.parent_uuid = params.folder.parent_uuid
        this.folder = params.folder
        let folder = params.folder
        this.form.uuid = folder.uuid
        this.attr_tag = folder.attr_tag ? folder.attr_tag : ''
        this.tags = folder.tags ? folder.tags : []
        this.form.name = folder.name
        this.form.title = folder.title
        this.form.goalTitle = folder.goalTitle
        this.form.desc = folder.desc
        this.form.flag = folder.flag
        this.form.cover = folder.cover
        this.form.is_show = folder.is_show
        this.form.content_model = folder.content_model
        this.form.type = folder.type
        this.form.list_order = folder.list_order
      }
    },
    onSubmit () {
      console.log('submit!', this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.handler === 'add') {
            let obj1 = {
              catalogsInfo: {
                content_model: this.form.content_model,
                attr_tag: this.attr_tag,
                cover: this.form.cover,
                desc: this.form.desc,
                flag: this.form.flag,
                tags: this.tags,
                has_changed: true,
                is_show: this.form.is_show,
                list_order: this.form.list_order,
                name: this.form.name,
                parent_uuid: this.form.parent_uuid,
                title: this.form.title,
                goalTitle: this.form.goalTitle,
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
                if (this.trackNum === 0 && res.data && res.data.catalog.length) {
                  res.data.catalog.forEach(item => {
                    let obj = {
                      authorities: [{
                        authority: 'rw',
                        user_uuid: this.userInfo.uuid
                      }],
                      type: 'catalog',
                      uuid: item.uuid
                    }
                    setAuthority(obj).then(res => {
                      this.$emit('resetTrackData', { pUUID: this.form.parent_uuid, trackNum: this.trackNum })
                    })
                  })
                } else {
                  this.$emit('resetTrackData', { pUUID: this.form.parent_uuid, trackNum: this.trackNum })
                }
              }
            })
          } else {
            let obj2 = {
              catalog_info: {
                cover: this.form.cover,
                attr_tag: this.attr_tag,
                desc: this.form.desc,
                flag: this.form.flag,
                has_changed: true,
                list_order: this.form.list_order,
                name: this.form.name,
                tags: this.tags,
                title: this.form.title,
                goalTitle: this.form.goalTitle,
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
              }
            })
          }
        }
      })
    },
    resetFormData () {
      this.pathDesc = ''
      this.form = {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        desc: {},
        is_show: true,
        flag: [],
        cover: [],
        list_order: 0,
        content_model: '',
        num: 1
      }
      this.form.cover.length = 0
    },
    async uploadFlagOnchange (file, fileList) {
      this.form.flag = []
      let ext = file.raw.name.split('.')[1]
      let url = 'course/content/catalog/flag/' + file.uid + '.' + ext
      let res = await uploadQiniu(file.raw, this.token, url)
      this.form.flag.push(res.key)
    },
    async uploadCoverOnchange (file, fileList) {
      console.log(file)
      let reader = new FileReader()
      reader.onload = (e) => {
        console.log(e)
        let data = e.target.result
        let image = new Image()
        image.onload = () => {
          let width = image.width
          let height = image.height
          let ext = file.raw.name.split('.')[1]
          let url = 'course/images/icon/' + width + '*' + height + '/' + file.uid + '.' + ext
          uploadQiniu(file.raw, this.token, url).then(res => {
            this.form.cover.push(res.key)
          })
        }
        image.src = data
      }
      reader.readAsDataURL(file.raw)
    },
    close () {
    },
    cropperImage (url) {
      this.$bus.$emit('showCropperDialog', { url: url, token: this.token })
    },
    delImage (flag, index) {
      this.form[flag].splice(index, 1)
    },
    changeAttrTag () {
      if (this.attr_tag) {
        let attr = this.catalogAttr.find(item => {
          return item.key === this.attr_tag
        })
        console.log(attr)
        this.form.title = attr.title
        this.form.desc = attr.desc
        this.form.cover = attr.cover
        this.form.flag = attr.flag
      } else {
        this.form.title = this.folder.title
        this.form.desc = this.folder.desc
        this.form.cover = this.folder.cover
        this.form.flag = this.folder.flag
      }
    }
  },
  destroyed () {
    this.$bus.$off('uploadCopperImages')
  }
}
</script>

<style lang="scss" scoped>
.left-bar {
  width: 40px;
  height: 100%;
}
.icon-box {
  width: 40px;
  height: 40px;
  position: fixed;
  top: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  a::before {
    content: '';
  }
  a {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }
  .icon-left {
    background-image: url('../../../assets/images/icons/icon-right.png');
  }
  .icon-right {
    background-image: url('../../../assets/images/icons/icon-left.png');
  }
  &.right {
    animation: bb 2s linear 0s infinite;
  }
  &.left {
    animation: bb2 2s linear 0s infinite;
  }
  &:hover {
    animation: none;
  }
}
@keyframes bb {
  from {
    margin-left: -15px;
    opacity: 0;
  }
  to {
    margin-left: 0px;
    opacity: 1;
  }
}
@keyframes bb2 {
  from {
    margin-left: 5px;
    opacity: 0;
  }
  to {
    margin-left: -5px;
    opacity: 1;
  }
}
.edit-catalog-container {
  display: flex;
  position: relative;
  flex: 1;
  height: 100%;
  padding: 0 10px;
  overflow: auto;
  .path {
    height: 50px;
    line-height: 50px;
  }
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
  .self-upload {
    width: 100px;
    height: 100px;
    i {
      font-size: 30px;
      line-height: 100px;
    }
  }
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
  // width:400px;
  // height:120px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .block {
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    min-height: 182px;
    border: 1px solid rgba(239,239,239,1);
    padding: 10px;
    margin: 5px;
    span {
    }
    .el-image {
      width: 200px;
      height: 100px;
      background:rgba(239,239,239,1);
      border-radius: 4px;
    }
    .el-button {
      margin-top: 10px;
      width: 80px;
    }
  }
  // img {
  //   width: 100%;
  //   height: 100%;
  //   object-fit: cover;
  //   margin-bottom: 20px;
  // }
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
