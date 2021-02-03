<template>
<transition name="fade">
  <div class="channel-edit-container" v-if="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="content">
        <el-form ref="form" :model="form" label-width="100px">
          <!-- <el-form-item label="uuid: " prop="uuid" :rules="[
            { required: true, message: 'uuid不能为空', trigger: 'blur'},
            {pattern: /^[1-9a-zA-Z_]{1,}$/, message: '只允许输入字母或下划线！'}
          ]">
            <el-input v-model="form.uuid" maxlength="30" show-word-limit :disabled="type == 'edit'"></el-input>
          </el-form-item> -->
          <el-form-item label="名称: " prop="title" :rules="{ required: true, message: '名称不能为空', trigger: 'blur'}">
            <el-row v-for="l in langInfos" :key="'title' + l.langKey">
              <el-form-item  class="input-box" :prop="'title.' + l.langKey"
                :rules="[{required: true, message: '名称不能为空', trigger: 'blur'}]">
                <el-input v-model="form.title[l.langKey]" maxlength="30" show-word-limit></el-input>
                <span>{{'(' + l.name + ')'}}</span>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="是否展示: " prop="isShow"
            :rules="[
              { required: true, message: '请选择是否展示', trigger: 'change' }
            ]
          ">
            <el-select v-model="form.isShow"
              placeholder="请选择...">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="展示位置: " prop="isShow"
            :rules="[
              { required: true, message: '请选择展示位置', trigger: 'change' }
            ]
          ">
            <el-select v-model="form.showPos"
              placeholder="请选择...">
              <el-option label="发现首页" value="index"></el-option>
              <el-option label="列表页" value="list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标: ">
            <div class="img-box small-img-box">
              <div class="img">
                <img v-if="form.icon" :src="assetsDomain + form.icon" fit="cover" />
              </div>
              <el-upload
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="uploadOnchange"
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
import {
  editDisChannel,
  addDisChannel,
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
      form: {
        uuid: '',
        listOrder: 0,
        title: {},
        isShow: false,
        showPos: 'index',
        icon: ''
      },
      type: ''
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos
    })
  },
  created () {
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
        this.form = {
          uuid: '',
          listOrder: params.listOrder,
          title: {},
          isShow: false,
          showPos: 'index',
          icon: ''
        }
      }
    },
    close () {
      this.showEdit = false
    },
    async uploadOnchange (file, fileList) {
      this.form.icon = ''
      let ext = file.raw.name.split('.')[1]
      let url = 'discovery/channel/images/' + file.uid + '.' + ext
      let res = await uploadQiniu(file.raw, this.token, url)
      this.form.icon = res.key
    },
    determine () {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            editDisChannel(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
                this.$emit('refresh')
                this.close()
              }
            })
          } else {
            addDisChannel(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$emit('refresh')
                this.close()
              }
            })
          }
        }
      })
    }
  },
  destroyed () {
  }
}
</script>

<style lang="scss" scoped>
.channel-edit-container {
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
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
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
  padding: 20px;
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

.input-box {
  margin-bottom: 25px;
  .el-input {
    width: 80%;
    margin-right: 20px;
  }
}
</style>
<style>
/* .channel-edit-container .el-input {
  width: 80%;
  margin-right: 10px;
}
.channel-edit-container .el-form-item {
  display: flex;
  width: 100%;
}
.channel-edit-container .el-form-item__content {
  width: 90%;
}
.channel-edit-container .el-textarea {
  width: 80%;
  margin-right: 10px;
}
.channel-edit-container .el-form-item__label {
  width: 60px;
}
.channel-edit-container .el-select {
  width: 30%;
} */
</style>
