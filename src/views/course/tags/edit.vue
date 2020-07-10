<template>
<transition name="fade">
  <div class="tags-edit-container" v-if="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="content">
        <el-form ref="form" :model="form">
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
          <el-form-item label="封面: ">
            <el-tag type="warning">第一张图为课程列表封面，第二张图为学习首页课程封面，第三张图为课程列表宝贝作品封面</el-tag>
            <div class="img-box big-img-box">
              <div class="img" id="cover-sort" v-if="form.cover.length > 0">
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
  </div>
</transition>
</template>

<script>
import Sortable from 'sortablejs'
import {
  editTags,
  addTags,
  getInfoToken
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import { mapState } from 'vuex'

export default {
  props: ['tagTypes'],
  data () {
    return {
      token: '',
      showEdit: false,
      sortable: null,
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
      type: ''
    }
  },
  computed: {
    ...mapState({
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
        this.form = obj
      }
      setTimeout(() => {
        if (this.form.cover.length > 0) {
          this.resetSortable()
        }
      }, 0)
    },
    close () {
      this.showEdit = false
      this.$emit('addTagItem')
    },
    cropperImage (url) {
      this.$bus.$emit('showCropperDialog', { url: url, token: this.token })
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
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
        animation: 150,
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
    }
  },
  destroyed () {
    this.$bus.$off('uploadCopperImages')
  }
}
</script>

<style lang="scss" scoped>
.tags-edit-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 999;
}
.edit-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:870px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 50px 30px 40px;
  box-sizing: border-box;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
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
  max-height:500px;
  overflow-y: auto;
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
/*滚动条样式*/
.content::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.content::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
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
</style>
