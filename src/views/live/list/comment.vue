<template>
  <el-dialog width="70%" title="发表评论" :visible.sync="dialogFormVisible" @close="close">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="昵称" prop="user_id">
          <el-select v-model="form.user_id" filterable placeholder="请选择">
            <el-option
              v-for="item in majia"
              :key="item.user_id"
              :label="item.nickname"
              :value="item.user_id">
            </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-radio-group v-model="form.role">
          <el-radio label="student">学生</el-radio>
          <el-radio label="teacher">老师</el-radio>
          <el-radio label="admin">管理员</el-radio>
        </el-radio-group>
      </el-form-item>
       <el-form-item label="打赏金币">
        <el-radio-group v-model="form.coins">
          <el-radio :label="0">无</el-radio>
          <el-radio :label="1000">1000</el-radio>
          <el-radio :label="2000">2000</el-radio>
          <el-radio :label="3000">3000</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" v-model="form.content"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  liveSendMsg
} from '@/api/course'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogVisible: false,
      form: {
        coins: 0,
        content: '',
        role: 'student',
        user_id: '',
        uuid: ''
      },
      rules: {
        user_id: [
          { required: true, message: '请选择一个马甲', trigger: 'change' }
        ],
        content: [
          { required: true, message: '评论内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      majia: state => state.course.majia
    })
  },
  methods: {
    show (params) {
      console.log(params)
      console.log(this.majia)
      this.resetForm()
      this.form.uuid = params.uuid
      this.dialogFormVisible = true
    },
    resetForm () {
      this.form = {
        coins: 0,
        content: '',
        role: 'student',
        user_id: '',
        uuid: ''
      }
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // let rNum = Math.floor(Math.random() * this.majia.length)
          // console.log(rNum)
          // this.form.user_id = this.majia[rNum]['user_id']
          console.log(this.form)
          liveSendMsg(this.form).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '发表成功'
              })
            }
          })
        }
      })
    },
    close () {
      this.$emit('initData')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 80%;
}
.qrcodePoster {
  width: 250px;
  height: 445px;
  background: #E8E8E8;
  color: rgba(0, 0, 0, .4);
  line-height: 445px;
  margin: 0 auto;
  text-align: center;
}
.dialog-footer {
  text-align: center;
}
</style>
