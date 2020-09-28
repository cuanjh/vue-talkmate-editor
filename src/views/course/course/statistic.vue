<template>
  <el-dialog
    title="统计"
    :visible.sync="dialogVisible"
    @closed="closed"
    width="50%">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="起止时间" prop="range">
        <el-date-picker
          v-model="form.range"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import {
  getStatisticPart
} from '@/api/course'

export default {
  data () {
    return {
      dialogVisible: false,
      disabled: false,
      course: {},
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      form: {
        range: ''
      },
      rules: {
        range: [
          { required: true, message: '请输入起止时间', trigger: 'blur' }
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
      this.form.range = ''
      this.dialogVisible = true
    },
    onSubmit () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          getStatisticPart({
            code: this.course.lan_code,
            courseCode: this.course.code,
            startDate: moment(this.form.range[0]).format('YYYY-MM-DD'),
            endDate: moment(this.form.range[1]).format('YYYY-MM-DD')
          }).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '请求已发送，请到下载任务列表中下载'
              })
              this.$emit('refreshDownloadList')
              this.dialogVisible = false
            }
          })
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
