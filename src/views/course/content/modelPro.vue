<template>
  <div class="model-pro-container">
    <div class="top-bar">
      <el-button type="text">新增</el-button>
      <el-button type="text">预览</el-button>
    </div>
    <div class="forms">
      <div class="list">
        <form-comp
          :class="{'active': curForm.uuid == content.uuid}"
          v-for="content in contents"
          :key="content.uuid"
          :form="content"
          @switchForm="switchForm"/>
      </div>
    </div>
    <el-form ref="form" :model="curForm" label-width="80px">
      <div class="item" v-for="f in feilds" :key="f.feild">
        <el-form-item :label="f.name" v-show="(f.feild !== 'list_order' && f.feild !== 'options' && f.type !== 'template' && f.type !== 'templateArray' && f.feild !== 'sentence_phoneticize' && f.feild !== 'options_phoneticize') || ((f.type == 'template' || f.type == 'templateArray') && curForm['' + f.feild + '']) || (version['selLang'] == 'JPN' && (f.feild == 'sentence_phoneticize' || f.feild == 'options_phoneticize')) || (f.feild === 'options' && (curForm['type'] == 'makeSentence' || curForm['type'] == 'fillGap'))">
          <el-input v-if="f.type != 'array' && f.data_from == '' && f.type !== 'templateArray'" v-model="curForm['' + f.feild + '']" :disabled="f.feild == 'list_order' || f.type == 'template'"></el-input>
          <el-select v-if="f.data_from == 'content_types'" v-model="curForm['' + f.feild + '']" placeholder="请选择">
            <el-option
              v-for="item in contentTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
          <div class="template-options" v-show="f.type == 'templateArray'">
            <el-tag
              v-for="(item, index) in curForm['' + f.feild + '']"
              :key="'templateArray' + index"
              type="info"
              effect="plain">
              {{ item }}
            </el-tag>
          </div>
          <div class="options" v-if="f.feild === 'options' && (curForm['type'] == 'makeSentence' || curForm['type'] == 'fillGap')">
            <div class="option-list">
              <div class="option-item" v-for="(item, index) in curForm['' + f.feild + '']" :key="index">
                <input type="text" :value="item">
                <i class="el-icon-circle-close"></i>
              </div>
            </div>
            <div class="add-option">
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <div class="form-sound" v-if="f.feild == 'sound' || f.feild == 'image'">
            <el-input v-model="curForm['' + f.feild + '']" disabled></el-input>
            <el-button type="text">内容查找</el-button>
            <el-button v-show="f.feild == 'image'" type="text">图库查找</el-button>
            <el-button type="text">本地上传</el-button>
            <look-image v-show="f.feild == 'image'"/>
          </div>
        </el-form-item>
      </div>
      <el-form-item class="btn-handler">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import FormComp from './form'
import LookImage from './lookImage'
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
    FormComp,
    LookImage
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain,
      version: state => state.course.version
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
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 30px;
  // width: 400px;
  // overflow-x: auto;
  // .list {
  //   width: 400px;
  //   overflow-x: auto;
  //   background: red;
  // }
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
.options {
  display: flex;
  flex-direction: row;
  .option-list {
    display: flex;
    flex-direction: row;
    .option-item {
      margin-right: 10px;
      position: relative;
      input {
        padding: 3px;
        text-align: center;
        width: 100px;
        border: 0;
        border-bottom: 1px solid #DCDFE6;
      }
      i {
        position: absolute;
        top: 6px;
        right: 0;
        cursor: pointer;
      }
    }
  }
  .add-option {
    width: 30px;
    height: 30px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
    i {
      color: #DCDFE6;
      font-size: 20px;
    }
  }
}

.template-options {
  .el-tag {
    margin-right: 10px;
  }
}

.btn-handler {
  text-align: center;
}
</style>
