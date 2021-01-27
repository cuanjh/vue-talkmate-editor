<template>
  <el-dialog
    title="请确定要上线的环境"
    :visible.sync="dialogVisible"
    width="500px">
    <el-radio-group v-model="dbEnv">
      <el-radio label="test">测试环境</el-radio>
      <el-radio label="online">线上环境</el-radio>
    </el-radio-group>
    <el-tag type="warning">注：测试环境地址选择这两个无效，都上线的是测试，仅线上环境做区分。</el-tag>
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
</style>
