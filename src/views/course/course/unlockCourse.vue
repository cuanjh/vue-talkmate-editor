<template>
  <el-dialog
    title="解锁课程"
    :visible.sync="dialogVisible"
    @closed="closed"
    width="50%">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="全球说ID" prop="talkmateID">
        <el-input v-model="form.talkmateID"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  unlockCourse
} from '@/api/course'

export default {
  data () {
    return {
      dialogVisible: false,
      disabled: false,
      course: {},
      form: {
        talkmateID: ''
      },
      rules: {
        talkmateID: [
          { required: true, message: '请输入全球说ID', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    async show (row) {
      console.log(row)
      this.course = row
      this.form.talkmateID = ''
      this.dialogVisible = true
    },
    onSubmit () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          let obj = {
            course_code: this.course.code,
            talkmate_id: this.form.talkmateID
          }
          let res = await unlockCourse(obj)
          if (res.success) {
            this.$message({
              type: 'success',
              message: '解锁成功'
            })
            this.dialogVisible = false
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closed () {
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
