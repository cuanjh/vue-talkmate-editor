<template>
  <el-dialog
    title="审核信息"
    :visible.sync="dialogVisible"
    @close="close"
    width="50%">
    <el-form :model="form" ref="form" size="small" label-width="84px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="真实姓名：">
            {{ form.real_name }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="form.certificate_type == '1' ? '身份证号：' : '护照编号'">
            {{ form.identity_card }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <label for="nationality" slot="label">昵 称：</label>
            {{ form.nickname }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <label for="nationality" slot="label">手机号：</label>
            {{ form.phonenumber }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <label for="nationality" slot="label">国 籍：</label>
            {{ form.nationality }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <label for="nationality" slot="label">性 别：</label>
            {{ form.gender }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item>
            <label for="nationality" slot="label">年 龄：</label>
            {{ form.birth_date }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="现居住地：">
            {{ form.address }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="直播昵称：">
            {{ form.live_nickname }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="直播语种：">
            {{ form.lan_code }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="个人简介：">
        {{ form.introduction }}
      </el-form-item>
      <el-form-item class="identify-photo" label="证件照：">
        <el-image v-show="form.certificate_front" :src="uploadfileDomain + form.certificate_front" fit="cover"></el-image>
        <el-image v-show="form.certificate_back" :src="uploadfileDomain + form.certificate_back" fit="cover"></el-image>
      </el-form-item>
      <el-form-item label="审核状态：">
        <el-radio-group v-model="form.status">
          <!-- <el-radio :label="1">待认证</el-radio> -->
          <el-radio :label="2">不通过</el-radio>
          <el-radio :label="3">通过</el-radio>
          <el-radio :label="4">冻结</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见：">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入审核意见"
          v-model="content">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleApprove()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import {
  getAge
} from '@/utils/toAge'
import {
  approveTeacher
} from '@/api/course'
export default {
  props: ['langs'],
  data () {
    return {
      dialogVisible: false,
      content: '',
      form: {
        user_id: '',
        photo: '',
        nickname: '',
        phonenumber: '',
        real_name: '',
        certificate_type: '1',
        identity_card: '',
        nationality: '',
        gender: '',
        birth_date: '',
        address: '',
        live_nickname: '',
        lan_code: '',
        introduction: '',
        certificate_front: '',
        certificate_back: '',
        status: 0
      }
    }
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.dialogVisible = true

      this.content = ''
      this.form.user_id = params.user_id
      this.form.photo = params.photo
      this.form.nickname = params.nickname
      this.form.phonenumber = params.phonenumber
      this.form.real_name = params.real_name
      this.form.certificate_type = params.certificate_type ? params.certificate_type : '1'
      this.form.identity_card = params.identity_card
      this.form.nationality = params.nationality
      this.form.gender = params.gender === '1' ? '男' : '女'
      this.form.birth_date = getAge(params.birth_date)
      this.form.address = params.address
      this.form.live_nickname = params.live_nickname
      this.form.status = params.status
      let langs = []
      if (params.lan_code.length && this.langs.length) {
        params.lan_code.forEach(item => {
          let lang = this.langs.find(l => {
            return l.lan_code === item
          })
          langs.push(lang.title['zh-CN'])
        })
      }
      this.form.lan_code = langs.length ? langs.join('、') : ''
      this.form.introduction = params.introduction
      this.form.certificate_front = params.certificate_front
      this.form.certificate_back = params.certificate_back
      console.log(this.form)
    },
    handleApprove () {
      let status = this.form.status
      if ((status === 2 || status === 4) && !this.content) {
        this.$message({
          type: 'warning',
          message: '请填写审核意见！'
        })
        return false
      }

      approveTeacher({ content: this.content, status: status, user_id: this.form.user_id }).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'warning',
            message: res.msg
          })
        }
      })
    },
    close () {
      this.$emit('loadData')
    }
  }
}
</script>

<style lang="scss" scoped>
.identify-photo {
  .el-image {
    width: 160px;
    height: 90px;
    border-radius: 4px;
    margin-right: 20px;
  }
}

.dialog-footer {
  display: block;
  text-align: center;
}
</style>
