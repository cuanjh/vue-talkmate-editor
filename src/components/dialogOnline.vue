<template>
  <el-dialog
    title="请确定要上线的环境"
    :visible.sync="dialogVisible"
    width="600px">
    <el-radio-group v-model="dbEnv">
      <el-radio label="test">测试环境</el-radio>
      <el-radio label="online"><span class="danger">线上环境</span></el-radio>
    </el-radio-group>
    <div class="danger">注：选择测试环境上线到测试，选择线上环境上线到正式。<br/>选择线上环境一定要确认修改内容无误后再上线，切记！切记！切记！</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dbEnv: 'test',
      params: {},
      dialogVisible: false
    }
  },
  methods: {
    show (params) {
      if (params) {
        this.params = params
      }
      this.dbEnv = 'test'
      this.dialogVisible = true
    },
    confirm () {
      this.params['dbEnv'] = this.dbEnv
      this.$emit('confirm', this.params)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: center;
}
.danger {
  color: #F56C6C;
  font-size: 18px;
}
</style>
