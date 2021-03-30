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
        <el-form-item label="目录属性">
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
          <el-tag type="warning">请上传webp格式的图片, 图标第一个为默认图标，第二个为激活态图标。</el-tag>
          <div class="img-box small-img-box">
            <!-- <div class="img">
              <img v-if="flagUrl" :src="flagUrl" fit="cover" />
            </div>
            <el-upload
              action="#"
              accept="image/webp"
              :on-change="uploadFlagOnchange"
              :show-file-list="false"
              :auto-upload="false">
              <div id="upload-btn">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload> -->
            <el-upload
              :disabled="attr_tag != ''"
              action="#"
              accept="image/webp"
              list-type="picture-card"
              :on-change="uploadFlagOnchange"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :file-list="flag">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </div>
        </el-form-item>
        <el-form-item label="封面">
          <el-tag type="warning">请上传webp格式的图片，第一张图为课程列表封面，第二张图为学习首页课程封面，第三张图为课程列表宝贝作品封面</el-tag>
          <div class="img-box big-img-box">
            <div class="img" v-if="form.cover.length">
              <!-- <img v-if="coverUrl" :src="coverUrl" /> -->
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
                  action="#"
                  accept="image/webp"
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
                  accept="image/webp"
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
        <el-form-item label="选择标签">
          <el-checkbox-group v-model="tags">
            <el-checkbox v-for="tag in selfContentTags" :key="tag.key" :label="tag.key">{{ tag.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="展示状态">
          <el-radio-group v-model="form.onlineState">
            <el-radio :label="1">即将上线</el-radio>
            <el-radio :label="0">已上线</el-radio>
          </el-radio-group>
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
  </el-drawer>
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
import moment from 'moment'

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
      attr_tag: '',
      tags: [],
      folder: {},
      dialogImageUrl: '',
      dialogVisible: false,
      flag: [],
      form: {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        goalTitle: '',
        onlineState: 0,
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
    catalogAttr () {
      let arr = []
      if (this.version && this.contentTags) {
        // let courseType = this.version.selCourseType
        // let type = 'catalog'
        // if (courseType === 3) {
        //   type = 'kidCatalog'
        // }
        arr = this.contentTags.filter(item => {
          return item.type.toLowerCase() !== 'kid' && item.type.toLowerCase() !== 'pro'
        })
      }
      if (arr.length) {
        arr = arr.sort((a, b) => {
          return a.list_order - b.list_order
        })
      }
      return arr
    },
    selfContentTags () {
      let arr = []
      if (this.contentTags) {
        arr = this.contentTags.filter(item => {
          return item.type.toLowerCase() === 'kid' || item.type.toLowerCase() === 'pro'
        })
      }
      return arr
    }
  },
  methods: {
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
        this.attr_tag = folder.attr_tag
        this.tags = folder.tags ? folder.tags : []
        this.form.name = folder.name
        this.form.title = folder.title
        this.form.goalTitle = folder.goalTitle
        this.form.onlineState = folder.onlineState
        this.form.desc = folder.desc
        this.form.flag = folder.flag
        this.form.cover = folder.cover
        this.form.is_show = folder.is_show
        this.form.content_model = folder.content_model
        this.form.type = folder.type
        this.form.list_order = folder.list_order
        this.changeAttrTag()
      }
      this.drawer = true
    },
    onSubmit () {
      console.log('submit!', this.form)
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          // 获取上传图片token
          let resToken = await getInfoToken()
          this.token = resToken.data.token
          let flag = []
          for (let i = 0; i < this.flag.length; i++) {
            const item = this.flag[i]
            if (item.raw) {
              let i = item.raw.name.lastIndexOf('.')
              let ext = item.raw.name.substring(i + 1)
              let date = moment(new Date()).format('YYYYMMDD')
              let url = 'course/content/catalog/flag/' + date + '/' + item.uid + '.' + ext
              let res = await uploadQiniu(item.raw, this.token, url)
              flag.push(res.key)
            } else {
              flag.push(item.name)
            }
          }
          this.form.flag = flag
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
                onlineState: this.form.onlineState,
                type: this.form.type
              },
              num: this.form.num
            }
            addCatalog(obj1).then(res => {
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
                  this.$emit('resetTrackData', { pUUID: this.form.parent_uuid, trackNum: this.trackNum, curUUID: res.data.catalog[0].uuid })
                }
                this.drawer = false
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
                onlineState: this.form.onlineState,
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
      this.attr_tag = ''
      this.flag = []
      this.form = {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        goalTitle: '',
        onlineState: 0,
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
      console.log(fileList)
      this.flag = fileList
      // this.form.flag = []
      // let ext = file.raw.name.split('.')[1]
      // let url = 'course/content/catalog/flag/' + file.uid + '.' + ext
      // let res = await uploadQiniu(file.raw, this.token, url)
      // this.form.flag.push(res.key)
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
      this.drawer = false
    },
    cropperImage (url) {
      this.$bus.$emit('showCropperDialog', { url: url, token: this.token })
    },
    delImage (flag, index) {
      this.form[flag].splice(index, 1)
    },
    changeAttrTag () {
      let flag = []
      if (this.attr_tag) {
        let attr = this.catalogAttr.find(item => {
          return item.key === this.attr_tag
        })
        console.log(attr)
        if (attr) {
          this.form.title = attr.title ? attr.title : {}
          this.form.desc = attr.desc ? attr.desc : {}
          this.form.cover = attr.cover
          attr.flag.map(item => {
            flag.push({ name: item, url: this.assetsDomain + item })
          })
          this.flag = flag
        } else {
          this.form.title = {}
          this.form.desc = {}
          this.form.cover = ''
          this.form.flag = []
        }
      } else {
        if (this.handler === 'edit') {
          this.form.title = this.folder.title
          this.form.desc = this.folder.desc
          this.form.cover = this.folder.cover
          this.folder.flag.map(item => {
            flag.push({ name: item, url: this.assetsDomain + item })
          })
          this.flag = flag
        } else {
          this.form.title = {}
          this.form.desc = {}
          this.form.cover = []
          this.form.flag = []
        }
      }
    },
    handleRemove (file, fileList) {
      this.flag = fileList
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  },
  destroyed () {
    this.$bus.$off('uploadCopperImages')
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
