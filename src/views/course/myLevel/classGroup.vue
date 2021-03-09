<template>
  <el-dialog
    title="班级群"
    :visible.sync="dialogVisible"
    width="50%">
    <el-table
      :data="classWXList"
      style="width: 100%">
      <el-table-column
        prop="weixinNo"
        label="微信号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="weixinCode"
        label="验证码">
      </el-table-column>
      <el-table-column
        prop="isShow"
        :formatter="formatterIsShow"
        label="是否展示">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="30%"
      :title="title"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
        <el-form-item label="微信号" prop="weixinNo">
          <el-input v-model="ruleForm.weixinNo" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="weixinCode">
          <el-input v-model="ruleForm.weixinCode" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="是否展示" prop="isShow">
          <el-radio-group v-model="ruleForm.isShow">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="add">添加</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getClassWXList,
  addClassWX,
  editClassWX,
  delClassWX
} from '@/api/course'
export default {
  data () {
    return {
      dialogVisible: false,
      innerVisible: false,
      flag: '',
      title: '',
      classWXList: [],
      ruleForm: {
        id: '',
        courseCode: '',
        weixinNo: '',
        isShow: true,
        weixinCode: ''
      },
      rules: {
        weixinNo: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ],
        weixinCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show (params) {
      this.ruleForm.courseCode = params.code
      this.loadClassWXList()
      this.dialogVisible = true
    },
    async loadClassWXList () {
      const res = await getClassWXList({ courseCode: this.ruleForm.courseCode, pageNo: 0, pageSize: 0 })
      console.log(res)
      if (res.success) {
        this.classWXList = res.data.class_weixin
      }
    },
    formatterIsShow (row) {
      return row.isShow ? '是' : '否'
    },
    add () {
      this.title = '添加'
      this.flag = 'add'
      let courseCode = this.ruleForm.courseCode
      this.ruleForm = {
        id: '',
        courseCode: courseCode,
        weixinNo: '',
        isShow: true,
        weixinCode: ''
      }
      this.innerVisible = true
    },
    edit (row) {
      console.log(row)
      this.title = '编辑'
      this.flag = 'edit'
      this.ruleForm.courseCode = row.courseCode
      this.ruleForm.id = row.id
      this.ruleForm.weixinNo = row.weixinNo
      this.ruleForm.weixinCode = row.weixinCode
      this.ruleForm.isShow = row.isShow
      this.innerVisible = true
    },
    del (row) {
      this.$confirm('此操作将永久删除该微信群, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delClassWX({ id: row.id }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.loadClassWXList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.flag === 'add') {
            let obj = {
              courseCode: this.ruleForm.courseCode,
              weixinNo: this.ruleForm.weixinNo,
              isShow: this.ruleForm.isShow,
              weixinCode: this.ruleForm.weixinCode
            }
            addClassWX(obj).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.innerVisible = false
                this.loadClassWXList()
              }
            })
          } else {
            editClassWX(this.ruleForm).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.innerVisible = false
                this.loadClassWXList()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
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
