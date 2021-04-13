<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <div class="content">
        <el-form ref="form" :model="form">
          <el-form-item label="key: " prop="type"  :rules="[
            { required: true, message: 'key不能为空', trigger: 'blur'},
            {pattern: /^[1-9a-zA-Z_]{1,}$/, message: '只允许输入字母或下划线！'}
          ]">
            <el-input :disabled="flag == 'edit'" v-model="form.type" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="名称: " prop="name"  :rules="{ required: true, message: '名称不能为空', trigger: 'blur'}">
            <el-input v-model="form.name" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="提示语：" class="name" required>
            <el-row v-for="l in langInfos" :key="'title' + l.langKey">
              <el-form-item  class="input-box" :prop="'title.' + l.langKey"
                :rules="[{required: true, message: '提示语不能为空', trigger: 'blur'}]">
                <el-input v-model="form.title[l.langKey]" maxlength="100" show-word-limit></el-input>
                <span>{{'(' + l.name + ')'}}</span>
              </el-form-item>
            </el-row>
          </el-form-item>
          <el-form-item v-show="false" label="文件类型: ">
            <el-select v-model="form.model_key" placeholder="请选择">
              <el-option
                v-for="item in modelList"
                :key="item.model_key"
                :label="item.name"
                :value="item.model_key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件类型: " prop="model_keys" :rules="{ required: true, message: '请选择文件类型', trigger: 'blur'}">
            <el-checkbox-group v-model="form.model_keys">
              <el-checkbox v-for="item in modelList" :key="item.model_key" :label="item.model_key">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="描述: " prop="desc"  :rules="{ required: true, message: '描述不能为空', trigger: 'blur'}">
            <el-input type="textarea" rows="4" v-model="form.desc" maxlength="500" show-word-limit></el-input>
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
  addContentType,
  editContentType
} from '@/api/course'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      showEdit: false,
      flag: '',
      form: {
        type: '',
        name: '',
        title: {},
        desc: '',
        list_order: 0,
        model_key: '',
        model_keys: []
      }
    }
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos,
      modelList: state => state.course.modelList
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.flag = params.flag
      if (params.flag === 'edit') {
        let data = params.data
        this.form = {
          type: data.type,
          name: data.name,
          desc: data.desc,
          title: data.title ? data.title : {},
          model_key: data.model_key,
          model_keys: data.model_keys ? data.model_keys : [],
          list_order: data.list_order
        }
      }
      this.showEdit = true
    },
    close () {
      this.showEdit = false
      this.form.type = ''
      this.form.name = ''
      this.form.desc = ''
      this.form.model_key = ''
      this.form.model_keys = []
      this.$refs.form.resetFields()
      this.$emit('addContentType')
    },
    determine () {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.flag === 'add') {
            addContentType(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.close()
              }
            })
          } else {
            editContentType(this.form).then(res => {
              console.log(res)
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                this.close()
              }
            })
          }
        }
      })
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
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  width:600px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 50px 0px 40px;
  box-sizing: border-box;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  .content {
    max-height: 500px;
    overflow-y: auto;
    padding: 0 30px;
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
.el-select {
  width: 100%;
}
</style>
<style>
.el-input__count {
  line-height: 10px;
}

/* .input-box .el-input {
  margin-bottom: 10px;
}
.input-box {
  display: flex;
  align-items: center;
} */
</style>
