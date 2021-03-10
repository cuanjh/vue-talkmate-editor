<template>
  <el-dialog class="tags-edit-container" width="70%" :visible.sync="showEdit" @close="close">
    <div class="edit-content">
      <div class="content">
        <el-form ref="form" :model="form" size="small">
          <el-form-item label="key: " prop="key" :rules="[
            { required: true, message: 'key不能为空', trigger: 'blur'}
          ]">
            <el-input v-model="form.key" maxlength="30" show-word-limit :disabled="type == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="名称: " prop="name" :rules="{ required: true, message: '名称不能为空', trigger: 'blur'}">
            <el-input v-model="form.name" maxlength="25" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="tag-types" label="分类: " prop="type" :rules="[
            { required: true, message: '请选择分类', trigger: 'change' }
          ]">
            <el-select v-model="form.type"
              placeholder="请选择分类"
              @change="changeType">
              <el-option
                v-for="item in tagTypes"
                :key="item.name"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
            <el-button size="small" type="primary" round @click="addTagType">添加分类</el-button>
          </el-form-item>
          <el-form-item label="标题: ">
            <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
              <el-input v-model="form.title[l.langKey]"></el-input>
              <div class="text" v-text="'(' + l.name + ')'"></div>
            </div>
          </el-form-item>
          <el-form-item label="描述: ">
            <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
              <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
              <div class="text" v-text="'(' + l.name + ')'"></div>
            </div>
          </el-form-item>
          <el-form-item label="图标: ">
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
          <el-form-item label="封面: ">
            <el-tag type="warning">请上传webp格式的图片，第一张图为课程列表封面，第二张图为学习首页课程封面，第三张图为课程列表宝贝作品封面</el-tag>
            <div class="img-box big-img-box">
              <div class="img" id="cover-sort" v-if="form.cover && form.cover.length > 0">
                <div
                  class="block"
                  v-for="(cover, index) in form.cover"
                  :data-id="index"
                  :key="'cover' + index">
                  <span>{{ cover.split('/')[cover.split('/').length - 2]}}</span>
                  <el-image
                    lazy
                    :src="assetsDomain + cover"
                    :preview-src-list="[assetsDomain + cover]"
                    fit="cover">
                  </el-image>
                  <div class="btn-handler">
                    <el-button round size="small" @click="cropperImage(assetsDomain + cover)">裁剪</el-button>
                    <el-button round plain type="danger" size="small" @click="delImage('cover', index)">删除</el-button>
                  </div>
                </div>
                <div class="block" data-id="99">
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
        </el-form>
        <div class="btns">
          <el-button
            class="cancel"
            @click="close()">取消</el-button>
          <el-button
            class="determine active"
            type="primary"
            @click="determine()" >确定</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      width="30%"
      title="添加标签分类"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form ref="innerForm" label-width="80px" :model="innerForm" inline>
        <el-form-item label="type" prop="type" :rules="[
            { required: true, message: 'type不能为空', trigger: 'blur'}
          ]">
          <el-input v-model="innerForm.type" autocomplete="off" placeholder="请输入字母组合"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur'}
          ]">
          <el-input v-model="innerForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <div class="btns">
          <el-button
            class="determine active"
            type="primary"
            @click="addType()">添加</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import {
  editTags,
  addTags,
  addTagType,
  getInfoToken
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import { mapState, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      token: '',
      showEdit: false,
      innerVisible: false,
      sortable: null,
      dialogImageUrl: '',
      dialogVisible: false,
      flag: [],
      form: {
        cover: [],
        desc: {},
        flag: [],
        key: '',
        list_order: 0,
        name: '',
        title: {},
        type: ''
      },
      innerForm: {
        type: '',
        name: ''
      },
      type: ''
    }
  },
  computed: {
    ...mapState({
      tagTypes: state => state.course.tagTypes,
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos
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
  created () {
    this.$bus.$on('uploadCopperImages', (data) => {
      console.log(data)
      this.form.cover = [...this.form.cover, ...data]
      console.log(this.form.cover)
    })
  },
  methods: {
    ...mapActions({
      getTagTypes: 'course/getTagTypes'
    }),
    show (params) {
      console.log(params)
      this.type = params.type
      this.showEdit = true
      // 获取上传图片token
      getInfoToken().then(res => {
        this.token = res.data.token
      })
      if (this.type === 'edit') {
        this.form = params.params
        this.form.title = this.form.title ? this.form.title : {}
        this.form.desc = this.form.desc ? this.form.desc : {}
        let flag = []
        if (params.params.flag && params.params.flag.length > 0) {
          params.params.flag.map(item => {
            flag.push({ name: item, url: this.assetsDomain + item })
          })
        }
        this.flag = flag
      } else {
        let obj = {
          cover: [],
          desc: {},
          flag: [],
          key: '',
          list_order: 0,
          name: '',
          title: {},
          type: ''
        }
        this.flag = []
        this.form = obj
      }
      setTimeout(() => {
        if (this.form.cover && this.form.cover.length > 0) {
          this.resetSortable()
        }
      }, 0)
    },
    close () {
      this.showEdit = false
      this.flag = []
      this.form.flag = []
      this.$emit('addTagItem')
    },
    cropperImage (url) {
      this.$bus.$emit('showCropperDialog', { url: url, token: this.token })
    },
    async uploadFlagOnchange (file, fileList) {
      console.log(fileList)
      this.flag = fileList
      // let i = file.raw.name.lastIndexOf('.')
      // let ext = file.raw.name.substring(i + 1)
      // let url = 'course/content/catalog/flag/' + file.uid + '.' + ext
      // let res = await uploadQiniu(file.raw, this.token, url)
      // this.form.flag.push({ name: url, url: this.assetsDomain + res.key })
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
          let i = file.raw.name.lastIndexOf('.')
          let ext = file.raw.name.substring(i + 1)
          let url = 'course/images/icon/' + width + '*' + height + '/' + file.uid + '.' + ext
          uploadQiniu(file.raw, this.token, url).then(res => {
            this.form.cover.push(res.key)
            setTimeout(() => {
              this.resetSortable()
            }, 100)
          })
        }
        image.src = data
      }
      reader.readAsDataURL(file.raw)
    },
    changeType () {
      console.log(this.form)
    },
    determine () {
      console.log(this.form)
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
          if (this.type === 'edit') {
            editTags(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.$emit('addTagItem')
                this.close()
              }
            })
          } else {
            addTags(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.$emit('addTagItem')
                this.close()
              }
            })
          }
        }
      })
    },
    delImage (flag, index) {
      this.form[flag].splice(index, 1)
    },
    resetSortable () {
      let el = document.getElementById('cover-sort')
      this.sortable = new Sortable(el, {
        animation: 0,
        onEnd: (evt) => {
          console.log(this.sortable.toArray())
          let arr = []
          let indexArr = this.sortable.toArray()
          indexArr = indexArr.filter(id => {
            return id !== '99'
          })
          indexArr.forEach((item, index) => {
            arr.push(this.form.cover[parseInt(item)])
          })
          this.form.cover = []
          setTimeout(() => {
            this.form.cover = arr
          }, 0)
        }
      })
    },
    addTagType () {
      this.innerForm.type = ''
      this.innerForm.name = ''
      this.innerVisible = true
    },
    addType () {
      this.$refs['innerForm'].validate((valid) => {
        if (valid) {
          console.log(this.innerForm)
          addTagType(this.innerForm).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.getTagTypes()
              this.innerVisible = false
            }
          })
        }
      })
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
.edit-content {
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    button {
      cursor: pointer;
      display: inline-block;
      width:150px;
      height:40px;
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
        opacity: .8;
      }
      &.active {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
      &.is-disabled {
        cursor: not-allowed;
        border: none;
        background-color: #a0cfff;
      }
    }
  }
}
.edit-content .content {
  width: 100%;
  height: 100%;
}
.lang-input {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  width: 100%;
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
  // border: 1px solid #EFEFEF;
  min-height: 100px;
  min-width: 300px;
  // background:#EFEFEF;
  display: flex;
  flex-wrap: wrap;
  .block {
    padding: 5px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    min-height: 182px;
    padding: 10px;
    margin: 5px;
    border: 1px solid #EFEFEF;
    background:#EFEFEF;
    span {
    }
    .el-image {
      width: 200px;
      height: 100px;
      background:#EFEFEF;
      border-radius: 4px;
    }
    .el-button {
      margin-top: 10px;
      width: 80px;
    }
  }
}

.small-img-box {
  margin-top: 10px;
}

.small-img-box .img {
  width:120px;
  height:120px;
  background: #EFEFEF;
  border-radius:4px;
  border: 1px solid #EFEFEF;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin-bottom: 20px;
  }
}
</style>
<style>
.tags-edit-container .el-input {
  width: 80%;
  margin-right: 10px;
}
.tags-edit-container .el-form-item {
  display: flex;
  width: 100%;
}
.tags-edit-container .el-form-item__content {
  width: 90%;
}
.tags-edit-container .el-textarea {
  width: 80%;
  margin-right: 10px;
}
.tags-edit-container .el-form-item__label {
  width: 60px;
}
.tags-edit-container .tag-types .el-select {
  width: 30%;
}
.tags-edit-container .el-upload-list__item-thumbnail {
  background: #e3e3e3;
}
</style>
