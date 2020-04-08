<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户名：" prop="username">
      <el-input v-model="ruleForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input type="password" v-model="ruleForm.password"></el-input>
    </el-form-item>
    <el-form-item label="新密码：" prop="newPassword">
      <el-input type="password" v-model="ruleForm.newPassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import {
  userChangePwd
} from '@/api/user'
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: '',
        newPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.ruleForm.username = this.userInfo.userName
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          userChangePwd(this.ruleForm).then(res => {
            console.log(res)
            if (res.success) {
              this.$message({
                type: 'success',
                message: '密码修改成功。'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.username = this.userInfo.userName
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  margin-top: 40px;
}
.el-input {
  width: 300px;
}
</style>
