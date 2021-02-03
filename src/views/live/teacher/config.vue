<template>
  <el-dialog
    title="配置项"
    :visible.sync="dialogVisible"
    width="730px">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="会员标题: " prop="memberLiveTitle" :rules="{ required: true, message: '会员标题不能为空', trigger: 'blur'}">
        <el-row v-for="l in langInfos" :key="'memberLiveTitle' + l.langKey">
          <el-form-item  class="input-box" :prop="'memberLiveTitle.' + l.langKey"
            :rules="[{required: true, message: '会员标题不能为空', trigger: 'blur'}]">
            <el-input v-model="form.memberLiveTitle[l.langKey]" maxlength="30" show-word-limit></el-input>
            <span>{{'(' + l.name + ')'}}</span>
          </el-form-item>
        </el-row>
      </el-form-item>
      <el-form-item label="非会员标题: " prop="noMemberLiveTitle" :rules="{ required: true, message: '非会员标题不能为空', trigger: 'blur'}">
        <el-row v-for="l in langInfos" :key="'noMemberLiveTitle' + l.langKey">
          <el-form-item  class="input-box" :prop="'noMemberLiveTitle.' + l.langKey"
            :rules="[{required: true, message: '非会员标题不能为空', trigger: 'blur'}]">
            <el-input v-model="form.noMemberLiveTitle[l.langKey]" maxlength="30" show-word-limit></el-input>
            <span>{{'(' + l.name + ')'}}</span>
          </el-form-item>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="save">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

import {
  getLiveTitle,
  updateLiveTitle
} from '@/api/course'

export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        memberLiveTitle: {},
        noMemberLiveTitle: {}
      }
    }
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos
    })
  },
  methods: {
    show () {
      getLiveTitle().then(res => {
        this.form.memberLiveTitle = res.data.title.memberLiveTitle ? res.data.title.memberLiveTitle : {}
        this.form.noMemberLiveTitle = res.data.title.noMemberLiveTitle ? res.data.title.noMemberLiveTitle : {}
      })
      this.dialogVisible = true
    },
    async save () {
      console.log(this.form)
      updateLiveTitle(this.form).then(res => {
        console.log(res)
        if (res.success) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogVisible = false
        }
      })
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

.list {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
    .left {
      display: flex;
      flex-direction: row;
    }
    .right {}
  }
}

.icon-plus-sub-fields {
  font-size: 12px;
  margin-left: 5px;
}

.dialog-footer {
  display: block;
  text-align: center;
}

.input-box {
  margin-bottom: 25px;
  .el-input {
    width: 80%;
    margin-right: 20px;
  }
}
</style>
