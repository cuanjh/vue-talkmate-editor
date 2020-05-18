<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="course-content">
        <el-form ref="form" :model="form">
          <el-form-item label="名称：">
            <el-input v-model="form.name" maxlength="25" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="版本描述：">
            <div class="input-box" v-for="l in langInfos.filter(item => {return item.langKey == 'zh-CN'})" :key="'desc' + l.langKey">
              <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
            </div>
          </el-form-item>
          <!-- <el-form-item label="版本号：">
            <el-input v-model="form.version" :disabled="true"></el-input>
          </el-form-item> -->
          <el-form-item label="内容分类：" class="flex-class">
            <el-radio-group v-model="form.module">
              <el-radio v-for="item in modules" :key="item.val" :label="item.val">{{ item.text }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="背景：" v-show="false">
            <div class="img-box">
              <div class="img">
                <img :src="imgUrl ? imgUrl : ''" alt="">
              </div>
              <el-upload
                action="#"
                :http-request="upload"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="fileChange"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                :show-file-list="false"
                :auto-upload="false">
                <div id="upload-btn">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="是否展示：" class="flex-class">
            <el-radio-group v-model="form.is_show">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限设置：" v-if="authorities.length">
            <div class="user-item" v-for="item in authorityUsers" :key="item.uuid">
              <div class="name">{{ item.nickName }}</div>
              <el-radio-group v-model="authorities.find(a => { return a['user_uuid'] == item.uuid })['authority']">
                <el-radio label="">无</el-radio>
                <el-radio label="r">只读</el-radio>
                <el-radio label="rw">可读可编辑</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>
        <div class="btns">
          <a class="cancel" @click="close">取消</a>
          <a class="determine active" @click="save">确定</a>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import { addCourseVersion, editCourseVersion, getInfoToken, setAuthority } from '@/api/course'
import { mapState } from 'vuex'
import { uploadQiniu } from '@/utils/uploadQiniu'

export default {
  props: ['authorityUsers'],
  data () {
    return {
      showEdit: false,
      versions: [],
      versionDesc: '',
      form: {
        cover: [],
        desc: {},
        flag: [],
        module: 'basic',
        has_changed: true,
        has_del: true,
        is_show: false,
        name: '',
        parent_uuid: '',
        tags: [],
        title: {},
        update_time: 0,
        uuid: '',
        version: ''
      },
      modules: [
        {
          val: 'basic',
          text: '基础内容'
        },
        {
          val: 'levelGrade',
          text: '等级测试内容'
        }
      ],
      imgUrl: '',
      fileRaw: {},
      type: '',
      authorities: []
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos,
      userInfo: state => state.user.userInfo
    })
  },
  mounted () {
  },
  methods: {
    show (params) {
      console.log(params)
      console.log(this.authorityList)
      this.type = params.type
      this.authorities = []
      if (this.authorityUsers && this.authorityUsers.length) {
        this.authorityUsers.forEach(item => {
          let auth = ''
          if (this.type === 'edit' && params.obj.authorities) {
            let a = params.obj.authorities.find(i => {
              return i.user_uuid === item.uuid
            })
            if (a) {
              auth = a['auth']
            }
          }
          let obj = {
            authority: auth,
            user_uuid: item.uuid
          }
          this.authorities.push(obj)
        })
      }
      if (this.type === 'add') {
        this.form.name = params.obj.name
        this.form.parent_uuid = params.obj.parent_uuid
        this.versions = params.versions
        // this.form.version = params.obj.name
        this.cover = []
        this.form.desc = {}
        this.form.flag = []
        this.form.has_changed = true
        this.form.has_del = true
        this.form.is_show = false
        this.form.module = 'basic'
        this.form.tags = []
        this.form.title = {}
        this.form.update_time = 0
        this.form.uuid = ''
        this.imgUrl = ''
      } else if (this.type === 'edit') {
        this.form = params.obj
        console.log(this.form)
        this.imgUrl = params.obj.cover[0] ? this.assetsDomain + '/' + params.obj.cover[0] : ''
      }
      this.showEdit = true
    },
    close () {
      this.showEdit = false
      this.$emit('newEditVersion')
    },
    async upload () {
      if (Object.keys(this.fileRaw).length === 0) {
        return false // 如果为空,返回false
      }
      console.log(this.fileRaw)
      let res1 = await getInfoToken()
      let token = res1.data.token
      let url = 'course/coversV2/' + this.fileRaw.name
      console.log(token, url, this.fileRaw.raw)
      let res2 = await uploadQiniu(this.fileRaw.raw, token, url)
      console.log(res1, url, res2)
      if (this.type === 'add') {
        this.form.cover.push(res2.key)
      } else {
        this.form.cover.unshift(res2.key)
      }
    },
    fileChange (file, fileList) {
      console.log(file)
      this.imgUrl = URL.createObjectURL(file.raw)
      console.log(this.bigImgUrl)
      this.fileRaw = file
    },
    handleSuccess (res, file) {
      console.log(res, file)
      this.imgUrl = URL.createObjectURL(file.raw)
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
    async save () {
      console.log(this.form)
      await this.upload()
      if (this.type === 'add') {
        let versionNum = 0
        if (this.versions.length) {
          let arr = this.versions.filter(item => {
            return item.module === this.form.module
          })
          if (arr && arr.length) {
            versionNum = arr.length
          }
        }
        this.form.version = 'V' + (versionNum + 1)
        let res = await addCourseVersion(this.form)
        console.log(res)
        if (res.success) {
          let obj = {
            authority: 'rw',
            user_uuid: this.userInfo.uuid
          }
          this.authorities.push(obj)
          this.setVersionAuthority(res.data.uuid)
          this.showEdit = false
        }
      } else {
        console.log(this.form)
        let obj = {
          uuid: this.form.uuid,
          content_info: {
            cover: this.form.cover ? this.form.cover : [],
            desc: this.form.desc ? this.form.desc : {},
            flag: this.form.flag ? this.form.flag : [],
            has_changed: this.form.has_changed ? this.form.has_changed : true,
            is_show: this.form.is_show,
            name: this.form.name ? this.form.name : '',
            tags: [],
            title: this.form.title ? this.form.title : {},
            update_time: this.form.update_time ? this.form.update_time : 0
          }
        }
        editCourseVersion(obj).then(res => {
          console.log(res)
          if (res.success) {
            this.setVersionAuthority(this.form.uuid)
            this.showEdit = false
          }
        })
      }
    },
    async setVersionAuthority (uuid) {
      let obj = {
        authorities: (this.authorities && this.authorities.length) ? this.authorities : null,
        type: 'content_version',
        uuid: uuid
      }
      console.log(obj)
      await setAuthority(obj)
      this.$emit('newEditVersion')
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
  .img {
    width:280px;
    height:240px;
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

.user-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #DCDFE6;
  .name {
    width: 100px;
    color: #000;
  }
}

.input-box {
  width: 500px;
}
</style>
