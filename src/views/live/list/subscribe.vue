<template>
  <el-dialog width="50%" title="订阅" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="全球说ID" prop="talkmateID">
        <el-input v-model="form.talkmateID" placeholder=""></el-input>
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
  subLiveCourse
} from '@/api/course'
export default {
  data () {
    return {
      dialogFormVisible: false,
      form: {
        courseCode: '',
        talkmateID: ''
      },
      rules: {
        talkmateID: [
          { required: true, message: '请填写全球说ID', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show (params) {
      console.log(params)
      this.form.talkmateID = ''
      this.form.courseCode = params.room.code
      this.dialogFormVisible = true
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let obj = {
            course_code: this.form.courseCode,
            talkmate_id: this.form.talkmateID
          }
          subLiveCourse(obj).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '订阅成功'
              })
              this.dialogFormVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
