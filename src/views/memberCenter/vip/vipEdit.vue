<template>
<transition name="fade">
  <div class="channel-edit-container" v-if="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="content">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="名称: " prop="name" :rules="{ required: true, message: '名称不能为空', trigger: 'blur'}">
            <el-row v-for="l in langInfos" :key="'name' + l.langKey">
              <el-form-item  class="input-box" :prop="'name.' + l.langKey"
                :rules="[{required: true, message: '名称不能为空', trigger: 'blur'}]">
                <el-input v-model="form.name[l.langKey]" maxlength="30" show-word-limit></el-input>
                <span>{{'(' + l.name + ')'}}</span>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item label="普通会员？" prop="isCommon"
            :rules="[
              { required: true, message: '请选择是否普通会员', trigger: 'change' }
            ]
          ">
            <el-select v-model="form.isCommon"
              placeholder="请选择...">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员PLUS？" prop="isVip"
            :rules="[
              { required: true, message: '请选择是否会员PLUS', trigger: 'change' }
            ]
          ">
            <el-select v-model="form.isVip"
              placeholder="请选择...">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态: " prop="status"
            :rules="[
              { required: true, message: '请选择状态', trigger: 'change' }
            ]
          ">
            <el-select v-model="form.status"
              placeholder="请选择...">
              <el-option label="正常" :value="1"></el-option>
              <el-option label="即将上线" :value="2"></el-option>
            </el-select>
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
  updateAdvantage,
  addAdvantage
} from '@/api/course'
import { mapState } from 'vuex'

export default {
  props: ['tagTypes'],
  data () {
    return {
      showEdit: false,
      form: {
        uuid: '',
        listOrder: 0,
        name: {},
        isCommon: 0,
        isVip: 1,
        status: 1,
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
      if (this.type === 'edit') {
        this.form = params.params
      } else {
        this.form = {
          uuid: '',
          listOrder: params.listOrder,
          name: {},
          isCommon: 0,
          isVip: 1,
          status: 1
        }
      }
    },
    close () {
      this.showEdit = false
    },
    determine () {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            updateAdvantage(this.form).then(res => {
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
            addAdvantage(this.form).then(res => {
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
