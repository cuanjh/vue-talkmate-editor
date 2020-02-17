<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="lang-content">
        <el-form ref="form" :model="form">
          <el-form-item label="编码：">
            <el-input v-model="form.lan_code" :disabled="type == 'edit'"></el-input>
          </el-form-item>
          <el-form-item label="名称：" class="name">
            <div class="input-box" v-for="l in langInfos" :key="'title' + l.langKey">
              <el-input v-model="form.title[l.langKey]"></el-input>
              <span>{{'(' + l.name + ')'}}</span>
            </div>
          </el-form-item>
          <el-form-item label="描述：" class="desc">
            <div class="input-box" v-for="l in langInfos" :key="'desc' + l.langKey">
              <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
              <span>{{'(' + l.name + ')'}}</span>
            </div>
          </el-form-item>
          <el-form-item label="图标：">
            <div class="img-box">
              <div class="img">
                <img :src="imageUrl" alt="">
              </div>
              <el-upload
                action="#"
                :http-request="upload"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="fileChange"
                :on-success="handleAvatarSuccess"
                :before-upload="handleBeforeUpload"
                :show-file-list="false"
                :auto-upload="false">
                <div id="upload-btn">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="书写顺序：" class="flex-class">
            <el-radio-group v-model="form.word_direction">
              <el-radio :label="'l2r'">从左到右</el-radio>
              <el-radio :label="'r2l'">从右到左</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否热门：" class="flex-class">
            <el-radio-group v-model="form.is_hot">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示" class="flex-class">
            <el-radio-group v-model="form.is_show">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="btns">
          <a class="cancel" @click="close()">取消</a>
          <a class="determine active" @click="determine()">确定</a>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import {
  addLang,
  editLang,
  getInfoToken
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import { mapState } from 'vuex'

export default {
  props: ['langInfos', 'langList'],
  data () {
    return {
      showEdit: false,
      form: {
        desc: {}, // 描述
        flag: [], // 小图标
        is_hot: false, // 是否热门
        is_show: false, // 是否上线
        lan_code: '', // 语种的编码
        list_order: 0, // 排序号
        title: {}, // 名称
        word_direction: 'l2r' // 从左到右还是相反
      },
      imageUrl: '',
      fileRaw: {},
      type: ''
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  mounted () {
  },
  methods: {
    show (type, params) {
      console.log(type, params)
      this.showEdit = true
      this.type = type
      if (type === 'edit' && params) {
        this.form = params
        this.imageUrl = this.assetsDomain + '/' + params.flag[0]
      } else if (type === 'add') {
        this.form.desc = {}
        this.form.flag = []
        this.form.is_hot = false
        this.form.is_show = false
        this.form.lan_code = ''
        this.form.title = {}
        this.form.word_direction = 'l2r'
        this.form.list_order = this.langList.pop().list_order + 10
        this.imageUrl = ''
      }
    },
    close () {
      this.showEdit = false
      this.$emit('addNewLang')
    },
    async upload () {
      if (Object.keys(this.fileRaw).length === 0) {
        return false // 如果为空,返回false
      }
      let res1 = await getInfoToken()
      let token = res1.data.token
      let url = 'course/icons/' + this.fileRaw.name
      console.log(token, url, this.fileRaw.raw)
      let res2 = await uploadQiniu(this.fileRaw.raw, token, url)
      console.log(res1, url, res2)
      if (this.type === 'add') {
        this.form.flag.push(res2.key)
      } else {
        this.form.flag.unshift(res2.key)
      }
    },
    fileChange (file, fileList) {
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(this.imageUrl)
      this.fileRaw = file
    },
    handleAvatarSuccess (res, file) {
      console.log(res, file)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传图片前的过滤
    handleBeforeUpload (file) {
      if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$alert(`请上传正确的图片格式`, '温馨提示!', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return false
      }
    },
    // 添加
    async determine () {
      if (!this.form.lan_code) {
        this.$message({
          showClose: true,
          message: '请输入语种编码',
          type: 'error'
        })
        return false
      }
      await this.upload()
      console.log(this.form)
      if (this.type === 'edit') {
        let obj = {
          'lang_info': {}
        }
        obj['lan_code'] = this.form.lan_code
        obj.lang_info['desc'] = this.form.desc
        obj.lang_info['flag'] = this.form.flag
        obj.lang_info['is_hot'] = this.form.is_hot
        obj.lang_info['is_show'] = this.form.is_show
        obj.lang_info['list_order'] = this.form.list_order
        obj.lang_info['title'] = this.form.title
        obj.lang_info['word_direction'] = this.form.word_direction
        console.log(obj)
        await editLang(obj).then(res => {
          console.log(res)
          if (res.success) {
            this.showEdit = false
          }
        })
      } else if (this.type === 'add') {
        await addLang(this.form).then(res => {
          console.log(res)
          if (res.success) {
            this.showEdit = false
          }
        })
      }
      this.$emit('addNewLang')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
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
  width:800px;
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
}
.edit-content .lang-content {
  width: 100%;
  height: 100%;
  max-height:560px;
  overflow-y: auto;

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
  .img {
    width:210px;
    height:210px;
    background:rgba(239,239,239,1);
    border-radius:4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin-bottom: 20px;
    }
  }
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
}
/*滚动条样式*/
.edit-content .lang-content::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.edit-content .lang-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.edit-content .lang-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
<style>
.lang-content .el-input {
  width: 200px!important;
  margin-right: 10px;
}
.lang-content .name .el-input {
  width: 300px!important;
}
.lang-content .desc .el-input {
  width: 360px!important;
}
.lang-content .el-form label {
  width: 90px;
}
.lang-content .el-form .el-form-item {
  display: flex;
}
.lang-content .el-form .flex-class {
  align-items: center;
}
.lang-content .el-form-item__content {
  display: flex!important;
  flex-direction: column;
}
.lang-content .input-box .el-input {
  margin-bottom: 10px;
}
.lang-content .desc .input-box {
  display: flex;
  align-items: center;
}
.lang-content .desc .el-textarea {
  width: auto!important;
  margin-right: 10px;
  margin-bottom: 20px;
}
.lang-content .desc .el-textarea textarea{
  width: 400px!important;
  min-height: 130px!important;
}
</style>
