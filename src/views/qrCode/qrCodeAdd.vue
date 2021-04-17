<template>
  <el-dialog
    title="创建二维码"
    :visible.sync="dialogVisible"
    width="50%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item>
        <el-radio-group v-model="form.type">
          <el-radio label="1">运维专用</el-radio>
          <el-radio label="2">技术专用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动主题" prop="title" :rules="[
        { required: true, message: '活动主题不能为空'}
      ]">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="二维码尺寸" prop="size" :rules="[
        { required: true, message: '二维码尺寸不能为空'}
      ]">
        <el-input v-model.number="form.size"></el-input>
      </el-form-item>
      <el-form-item label="跳转网址" v-if="form.type == '1'">
        <el-input v-model="form.website" placeholder="https://www.baidu.com"></el-input>
      </el-form-item>
      <el-form-item v-else>
        <vue-json-editor v-model="form.json" :show-btns="false" :expandedOnStart="true" @json-change="onJsonChange"></vue-json-editor>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import {
  qrCodeAdd,
  qrCodeUpdate
} from '@/api/course'

export default {
  data () {
    return {
      dialogVisible: false,
      qrcodeInfo: null,
      flag: '',
      form: {
        type: '1',
        title: '',
        size: 400,
        website: '',
        json: {
          website: ''
        }
      }
    }
  },
  components: {
    vueJsonEditor
  },
  methods: {
    show (params) {
      this.flag = params.flag
      if (params.flag === 'add') {
        this.form = {
          type: '1',
          title: '',
          website: '',
          size: 400,
          json: {
            website: ''
          }
        }
      } else {
        this.qrcodeInfo = params.data
        this.form.type = '1'
        this.form.title = this.qrcodeInfo.title
        this.form.size = this.qrcodeInfo.size
        this.form.website = ''
        if (this.qrcodeInfo.info) {
          const info = JSON.parse(this.qrcodeInfo.info)
          if (info.website) {
            this.form.website = info.website
          }
          this.form.json = info
        } else {
          this.form.json = {
            website: ''
          }
        }
      }
      this.dialogVisible = true
    },
    onJsonChange (value) {
      console.log('value:', value)
    },
    save () {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.form.type === '1') {
            this.form.json.website = this.form.website
          }
          let msg = '添加成功'
          if (this.flag === 'add') {
            await qrCodeAdd({ title: this.form.title, size: this.form.size, info: JSON.stringify(this.form.json) })
          } else {
            await qrCodeUpdate({ title: this.form.title, size: this.form.size, info: JSON.stringify(this.form.json), uuid: this.qrcodeInfo.uuid })
            msg = '更新成功'
          }
          this.$message({
            type: 'success',
            message: msg
          })
          this.$emit('loadData')
          this.dialogVisible = false
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
