<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="course-content">
        <el-form ref="form" :model="form">
          <el-form-item label="编码：">
            <el-input v-model="form.code" :disabled="type == 'edit'">
            </el-input>
          </el-form-item>
          <el-form-item label="分类：">
            <el-select v-model="form.course_type"
              placeholder="请选择课程分类"
              @change="changeType">
              <el-option
                v-for="item in courseTypes"
                :key="item.name"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
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
          <el-form-item label="大图：">
            <div class="img-box big-img-box">
              <div class="img">
                <img :src="form.cover ? assetsDomain + form.cover[0] : ''" alt="">
              </div>
              <el-upload
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="bigFileChange"
                :on-success="handleBigSuccess"
                :before-upload="handleBeforeUpload"
                :show-file-list="false"
                :auto-upload="false">
                <div id="upload-btn">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="小图：">
            <div class="img-box small-img-box">
              <div class="img">
                <img :src="form.flag ? assetsDomain + form.flag[0] : ''" alt="">
              </div>
              <el-upload
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="smlFileChange"
                :on-success="handleSmlSuccess"
                :before-upload="handleBeforeUpload"
                :show-file-list="false"
                :auto-upload="false">
                <div id="upload-btn">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </div>
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
import { addCourse, courseEdit } from '@/api/course'
import { mapState } from 'vuex'

export default {
  props: ['courseTypes'],
  data () {
    return {
      showEdit: false,
      form: {
        code: '',
        course_type: '', // 课程分类
        cover: ['course/icons/SUN-3x.webp?v=4'], // 大图标
        desc: {}, // 描述
        flag: ['course/icons/SUN-3x.webp?v=4'], // 小图标
        is_show: false, // 是否上线
        lan_code: '', // 语种的编码
        tags: [],
        title: {} // 名称
      },
      bigImgUrl: '',
      bigFileRaw: {},
      smlImgUrl: '',
      smlFileRaw: {},
      type: ''
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos
    })
  },
  mounted () {
  },
  methods: {
    show (params) {
      console.log(params)
      this.type = params.type
      if (this.type === 'add') {
        this.form.code = ''
        this.form.course_type = ''
        this.form.cover = ['course/icons/SUN-3x.webp?v=4']
        this.form.desc = {}
        this.form.flag = ['course/icons/SUN-3x.webp?v=4']
        this.form.is_show = false
        this.form.lan_code = params.selLang
        this.form.tags = []
        this.form.title = {}
      } else if (this.type === 'edit') {
        this.form = params.form
      }
      this.showEdit = true
    },
    close () {
      this.showEdit = false
    },
    bigFileChange (file, fileList) {
      console.log(file)
      // this.bigImgUrl = URL.createObjectURL(file.raw)
      this.form.cover.unshift(URL.createObjectURL(file.raw))
      console.log(this.bigImgUrl)
      this.bigFileRaw = file
    },
    handleBigSuccess (res, file) {
      console.log(res, file)
      this.bigImgUrl = URL.createObjectURL(file.raw)
    },
    smlFileChange (file, fileList) {
      console.log(file)
      // this.smlImgUrl = URL.createObjectURL(file.raw)
      this.form.flag.unshift(URL.createObjectURL(file.raw))
      console.log(this.smlImgUrl)
      this.smlFileRaw = file
    },
    handleSmlSuccess (res, file) {
      console.log(res, file)
      this.smlImgUrl = URL.createObjectURL(file.raw)
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
    determine () {
      console.log(this.form)
      if (this.type === 'add') {
        this.form.code = this.form.code + '-Basic'
        addCourse(this.form).then(res => {
          console.log(res)
          if (res.success) {
            this.showEdit = false
          }
        })
      } else {
        let obj = {
          editInfo: {
            course_type: this.form.course_type,
            cover: this.form.cover,
            desc: this.form.desc,
            flag: this.form.flag,
            is_show: this.form.is_show,
            tags: [],
            title: this.form.title
          },
          uuid: this.form.uuid
        }
        console.log(obj)
        courseEdit(obj).then(res => {
          console.log(res)
          if (res.success) {
            this.showEdit = false
          }
        })
      }
      this.$emit('addNewCourse')
    },
    changeType () {
      console.log(this.form)
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
.edit-content .course-content {
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
  .big-img-box .img {
    width:400px;
    height:120px;
    background:rgba(239,239,239,1);
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
.edit-content .course-content::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.edit-content .course-content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.edit-content .course-content::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
<style>
.course-content .el-input {
  width: 200px!important;
  margin-right: 10px;
}
.course-content .name .el-input {
  width: 300px!important;
}
.course-content .desc .el-input {
  width: 360px!important;
}
.course-content .el-form label {
  width: 90px;
}
.course-content .el-form .el-form-item {
  display: flex;
}
.course-content .el-form .flex-class {
  align-items: center;
}
.course-content .el-form-item__content {
  display: flex!important;
  flex-direction: column;
}
.course-content .input-box .el-input {
  margin-bottom: 10px;
}
.course-content .desc .input-box {
  display: flex;
  align-items: center;
}
.course-content .desc .el-textarea {
  width: auto!important;
  margin-right: 10px;
  margin-bottom: 20px;
}
.course-content .desc .el-textarea textarea{
  width: 400px!important;
  min-height: 130px!important;
}
</style>
