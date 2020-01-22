<template>
  <div class="model-pro-container">
    <div class="top-bar">
      <el-button type="text">新增</el-button>
      <el-button type="text">预览</el-button>
    </div>
    <div class="forms">
      <form-comp
        :class="{'active': curForm.uuid == content.uuid}"
        v-for="content in contents"
        :key="content.uuid"
        :form="content"
        @switchForm="switchForm"/>
    </div>
    <el-form ref="form" :model="curForm" label-width="80px">
      <el-form-item v-for="f in feilds" :key="f.feild" :label="f.name">
        <el-input v-if="f.type != 'array' && f.data_from == ''" v-model="curForm['' + f.feild + '']" :disabled="f.feild == 'list_order' || f.type == 'template'"></el-input>
        <el-select v-if="f.data_from == 'content_types'" v-model="curForm['' + f.feild + '']" placeholder="请选择">
          <el-option
            v-for="item in contentTypes"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
        <div class="form-sound" v-if="f.feild == 'sound' || f.feild == 'image'">
          <el-input v-model="curForm['' + f.feild + '']" disabled></el-input>
          <el-button type="text">查找</el-button>
          <el-button type="text">本地上传</el-button>
        </div>
      </el-form-item>
      <!-- <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送">
        <el-switch v-model="form.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FormComp from './form'
import { mapState } from 'vuex'
export default {
  props: ['contents', 'feilds'],
  data () {
    return {
      curForm: this.contents[0],
      form: {}
    }
  },
  components: {
    FormComp
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    switchForm (content) {
      this.curForm = content
    },
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang="scss" scoped>
.model-pro-container {
  overflow: auto;
}
.top-bar {
  text-align: right;
  padding-right: 20px;
  height: 40px;
  background: #fff;
}
.forms {
  background: #E5E6E5;
  // width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 30px;
  // width: 200px;
  // overflow-x: auto;
}
.el-form {
  padding: 20px;
}
.form-image {
  .el-image {
    margin-top: 15px;
    border-radius: 4px;
    margin-right: 10px;
  }
}
</style>
