<template>
  <el-dialog
    :visible.sync="showEdit"
    width="50%"
    @close="close">
    <div class="edit-content">
      <div class="course-content">
        <el-form ref="form" :model="form">
          <el-form-item label="编码：" prop="codePend" :rules="[
            { required: true, message: '编码不能为空', trigger: 'blur' },
            { pattern: /^[a-zA-Z-]+$/, message: '只允许输入字母！' }
          ]">
            <el-input v-model="form.codePend" maxlength="20" placeholder="AAA" show-word-limit :disabled="type == 'edit'">
              <template slot="prepend">{{ lang + '-' }}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="名称：" prop="name" :rules="[
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ]">
            <el-input v-model="form.name" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="分类：" prop="course_type" :rules="[
            { required: true, message: '请选择分类', trigger: 'blur' }
          ]">
            <el-select v-model="form.course_type"
              placeholder="请选择课程分类"
              @change="changeType">
              <el-option
                v-for="item in courseTypes"
                :key="item.name"
                :label="item.name"
                :value="item.type"
                :disabled="item.disabled ? item.disabled : false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题：" class="desc" required>
            <!-- <div class="input-box" v-for="l in langInfos" :key="'title' + l.langKey">
              <el-input v-model="form.title[l.langKey]" maxlength="30" show-word-limit></el-input>
              <span>{{'(' + l.name + ')'}}</span>
            </div> -->
            <el-row v-for="l in langInfos" :key="'title' + l.langKey">
              <el-form-item  class="input-box" :prop="'title.' + l.langKey"
                :rules="[{required: true, message: '名称不能为空', trigger: 'blur'}]">
                <el-input type="textarea" v-model="form.title[l.langKey]" maxlength="100" show-word-limit></el-input>
                <span>{{'(' + l.name + ')'}}</span>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="描述：" class="desc">
            <div class="input-box" v-for="l in langInfos" :key="'desc' + l.langKey">
              <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
              <span>{{'(' + l.name + ')'}}</span>
            </div>
          </el-form-item>
          <el-form-item label="大图：" prop="flag[0]" :rules="[
            { required: true, message: '大图标不能为空', trigger: 'change' }
          ]">
            <div class="img-box big-img-box">
              <div class="img">
                <img :src="bigImgUrl" alt="">
              </div>
              <el-upload
                action="#"
                :http-request="uploadBig"
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
          <el-form-item label="小图：" prop="flag[0]" :rules="[
            { required: true, message: '小图标不能为空', trigger: 'change' }
          ]">
            <div class="img-box small-img-box">
              <div class="img">
                <img :src="smlImgUrl" alt="">
              </div>
              <el-upload
                action="#"
                :http-request="uploadSml"
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
          <el-form-item label="是否显示：" class="flex-class">
            <el-radio-group v-model="form.is_show">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否显示词典：" class="flex-class">
            <el-radio-group v-model="form.has_dict">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="默认声优：" class="flex-class">
            <el-select v-model="form.default_actor">
              <el-option v-for="item in voiceActors" :key="item.uuid" :value="item.uuid" :label="item.name + (item.gender === 1 ? '（男）' : '（女）')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="声优：">
            <el-checkbox-group v-model="checkVoiceActors">
              <el-checkbox v-for="item in voiceActors" :key="item.uuid" :label="item.uuid">{{item.name + (item.gender === 1 ? '（男）' : '（女）')}}</el-checkbox>
            </el-checkbox-group>
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
  </el-dialog>
</template>

<script>
import { addCourse, courseEdit, getInfoToken } from '@/api/course'
import { mapState } from 'vuex'
import { uploadQiniu } from '@/utils/uploadQiniu'

export default {
  props: ['courseTypes'],
  data () {
    return {
      showEdit: false,
      lang: '',
      form: {
        codePend: '',
        code: '',
        course_type: '', // 课程分类
        cover: [], // 大图标
        desc: {}, // 描述
        flag: [], // 小图标
        is_show: true, // 是否上线
        has_dict: false, // 是否显示词典
        lan_code: '', // 语种的编码
        tags: [],
        sound_actors: [],
        default_actor: '',
        name: '',
        title: {} // 标题
      },
      bigImgUrl: '',
      bigFileRaw: {},
      smlImgUrl: '',
      smlFileRaw: {},
      type: '',
      checkVoiceActors: []
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
      voiceActors: state => state.course.voiceActors
    }),
    groupVoiceActors () {
      if (this.voiceActors && this.voiceActors.length > 0) {
        let result = []
        this.voiceActors.forEach(item => {
          if (item.role.indexOf(',') === -1) {
            let findex = result.findIndex(r => {
              return r.role === item.role
            })
            if (findex > -1) {
              result[findex]['data'].push(item)
            } else {
              result.push({
                data: [item],
                role: item.role
              })
            }
          } else {
            const roles = item.role.split(',')
            roles.forEach(r => {
              let findex = result.findIndex(ret => {
                return ret.role === r
              })
              if (findex > -1) {
                result[findex]['data'].push(item)
              } else {
                result.push({
                  data: [item],
                  role: r
                })
              }
            })
          }
        })
        console.log(result)
        return result.sort((a, b) => {
          if (a.role < b.role) {
            return -1
          } else if (a.role > b.role) {
            return 1
          } else {
            return 0
          }
        })
      }
      return []
    }
  },
  mounted () {
  },
  methods: {
    show (params) {
      console.log(params)
      this.type = params.type
      this.showEdit = true
      this.checkVoiceActors = []
      if (this.type === 'add') {
        this.lang = params.selLang
        let obj = {
          code: '',
          codePend: '',
          course_type: '', // 课程分类
          cover: [], // 大图标
          desc: {}, // 描述
          flag: [], // 小图标
          is_show: true, // 是否上线
          has_dict: false,
          lan_code: params.selLang, // 语种的编码
          tags: [],
          sound_actors: [],
          default_actor: '',
          name: '',
          title: {} // 标题
        }
        this.form = obj
        this.bigImgUrl = ''
        this.smlImgUrl = ''
        // this.$refs.form.resetFields()
      } else if (this.type === 'edit') {
        this.lang = params.form.code.split('-')[0]
        this.form = params.form
        if (params.form.sound_actors && params.form.sound_actors.length > 0) {
          params.form.sound_actors.forEach(item => {
            this.checkVoiceActors.push(item.role)
          })
        }
        this.form.codePend = params.form.code.split('-').slice(1).join('-')
        this.bigImgUrl = this.assetsDomain + '/' + params.form.cover[0]
        this.smlImgUrl = this.assetsDomain + '/' + params.form.flag[0]
      }
    },
    close () {
      this.showEdit = false
    },
    async uploadBig () {
      if (Object.keys(this.bigFileRaw).length === 0) {
        return false // 如果为空,返回false
      }
      let res1 = await getInfoToken()
      let token = res1.data.token
      let arr = this.bigFileRaw.name.split('.')
      let filename = this.bigFileRaw.uid + '.' + arr[1]
      let url = 'course/coversV2/' + filename
      let res2 = await uploadQiniu(this.bigFileRaw.raw, token, url)
      this.form.cover = [res2.key]
      // console.log(res1, url, res2)
      // if (this.type === 'add') {
      //   this.form.cover.push(res2.key)
      // } else {
      //   this.form.cover.unshift(res2.key)
      // }
    },
    bigFileChange (file, fileList) {
      console.log(file)
      this.bigImgUrl = URL.createObjectURL(file.raw)
      // this.form.cover.unshift(URL.createObjectURL(file.raw))
      console.log(this.bigImgUrl)
      this.bigFileRaw = file
      this.uploadBig()
    },
    handleBigSuccess (res, file) {
      console.log(res, file)
      this.bigImgUrl = URL.createObjectURL(file.raw)
    },
    async uploadSml () {
      if (Object.keys(this.smlFileRaw).length === 0) {
        return false // 如果为空,返回false
      }
      let res1 = await getInfoToken()
      let token = res1.data.token
      let arr = this.smlFileRaw.name.split('.')
      let filename = this.smlFileRaw.uid + '.' + arr[1]
      let url = 'course/icons/' + filename
      let res2 = await uploadQiniu(this.smlFileRaw.raw, token, url)
      console.log(res1, url, res2)
      this.form.flag = [res2.key]
      // if (this.type === 'add') {
      //   this.form.flag.push(res2.key)
      // } else {
      //   this.form.flag.unshift(res2.key)
      // }
    },
    smlFileChange (file, fileList) {
      console.log(file)
      this.smlImgUrl = URL.createObjectURL(file.raw)
      // this.form.flag.unshift(URL.createObjectURL(file.raw))
      console.log(this.smlImgUrl)
      this.smlFileRaw = file
      this.uploadSml()
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form)
          let soundActors = []
          if (this.checkVoiceActors.length > 0) {
            this.checkVoiceActors.forEach(item => {
              // const find = this.groupVoiceActors.find(f => {
              //   return f.role === item
              // })
              // if (find) {
              //   let actors = []
              //   if (find.data && find.data.length > 0) {
              //     find.data.forEach(d => {
              //       actors.push({
              //         gender: d.gender,
              //         name: d.name,
              //         photo: d.photo,
              //         sound: d.sound
              //       })
              //     })
              //   }
              //   let obj = {
              //     actors: actors,
              //     role: find.role
              //   }
              //   soundActors.push(obj)
              // }

              const find = this.voiceActors.find(f => {
                return f.uuid === item
              })
              if (find) {
                soundActors.push({
                  gender: find.gender,
                  name: find.name,
                  photo: find.photo,
                  role: find.uuid,
                  sound: find.sound,
                  city: find.city,
                  desc: find.desc
                })
              }
            })
          }
          if (this.type === 'add') {
            let obj = {
              code: this.lang + '-' + this.form.codePend,
              course_type: this.form.course_type, // 课程分类
              cover: this.form.cover, // 大图标
              desc: this.form.desc, // 描述
              flag: this.form.flag, // 小图标
              is_show: this.form.is_show, // 是否上线
              has_dict: this.form.has_dict,
              default_actor: this.form.default_actor,
              sound_actors: soundActors,
              lan_code: this.form.lan_code, // 语种的编码
              tags: this.form.tags,
              name: this.form.name,
              title: this.form.title // 标题
            }
            addCourse(obj).then(res => {
              console.log(res)
              if (res.success) {
                this.close()
                this.$emit('addNewCourse')
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
                has_dict: this.form.has_dict,
                default_actor: this.form.default_actor,
                sound_actors: soundActors,
                tags: [],
                name: this.form.name,
                title: this.form.title
              },
              uuid: this.form.uuid
            }
            console.log(obj)
            courseEdit(obj).then(res => {
              console.log(res)
              if (res.success) {
                this.close()
                this.$emit('addNewCourse')
              }
            })
          }
        }
      })
    },
    changeType () {
      console.log(this.form)
    },
    getGroupVAs (data) {
      let ret = []
      if (data && data.length > 0) {
        data.forEach(item => {
          ret.push(item.name)
        })
      }
      return ret.length > 0 ? `（${ret.join('、')}）` : ''
    }
  }
}
</script>

<style lang="scss" scoped>

.edit-content .course-content {
  width: 100%;
  height: 100%;
  // max-height:500px;
  // overflow-y: auto;

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
.course-content .el-input__inner {
  padding: 0 44px 0 10px;
}
.course-content .el-input {
  /* width: 200px!important; */
  margin-right: 10px;
}
.course-content .name .el-input {
  width: 360px!important;
}
.course-content .desc .el-input {
  width: 360px!important;
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
  width: 500px!important;
  min-height: 80px!important;
}
.course-content .el-row .el-form-item__content {
  display: flex!important;
  flex-direction: row;
}
.course-content .el-form-item__label {
  width: 110px;
}
</style>
