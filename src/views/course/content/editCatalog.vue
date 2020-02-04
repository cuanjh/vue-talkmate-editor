<template>
  <el-drawer
    :visible.sync="drawer"
    :with-header="false"
    size="50%"
    direction="rtl">
    <div class="edit-catalog-container" :style="{height: height + 'px'}">
      <div class="path">{{ '路径: ' + pathDesc }}</div>
      <div class="title" v-text="title"></div>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
            <el-input v-model="form.title[l.langKey]"></el-input>
            <div class="text" v-text="'(' + l.name + ')'"></div>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <div class="lang-input" v-for="l in langInfos" :key="l.langKey">
            <el-input type="textarea" v-model="form.desc[l.langKey]"></el-input>
            <div class="text" v-text="'(' + l.name + ')'"></div>
          </div>
        </el-form-item>
        <el-form-item label="图标">
          <div class="flag">
            <div class="flag-image">
              <el-image v-if="form.flag && form.flag[0]" :src="assetsDomain + form.flag[0]" fit="cover"></el-image>
            </div>
            <el-button icon="el-icon-plus" circle></el-button>
          </div>
        </el-form-item>
        <el-form-item label="封面">
          <div class="cover">
            <div class="cover-image">
              <el-image v-if="form.cover && form.cover[0]" :src="assetsDomain + form.cover[0]" fit="cover"></el-image>
            </div>
            <el-button icon="el-icon-plus" circle></el-button>
          </div>
        </el-form-item>
        <el-form-item label="是否展示">
          <el-radio-group v-model="form.is_show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div class="handler">
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      height: 0,
      title: '',
      drawer: false,
      pathDesc: '',
      form: {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        desc: {},
        is_show: true,
        flag: [],
        cover: [],
        list_order: 0,
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos,
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    show (params) {
      this.resetFormData()
      this.pathDesc = params.pathDesc
      console.log(params)
      if (params.handler === 'add' && params.type === 'catalog') {
        this.title = '添加目录'
      }
      if (params.handler === 'add' && params.type === 'content') {
        this.title = '添加文件'
      }
      if (params.handler === 'edit' && params.type === 'catalog') {
        this.title = '编辑目录'
      }
      if (params.handler === 'edit' && params.type === 'content') {
        this.title = '编辑文件'
      }
      this.form.parent_uuid = params.uuid
      if (params.handler === 'edit') {
        let folder = params.folder
        this.form.uuid = folder.uuid
        this.form.name = folder.name
        this.form.title = folder.title
        this.form.desc = folder.desc
        this.form.flag = folder.flag
        this.form.cover = folder.cover
        this.form.is_show = folder.is_show
      }
      this.drawer = true
    },
    onSubmit () {
      console.log('submit!', this.form)
    },
    resetFormData () {
      let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      this.height = h - 2
      this.pathDesc = ''
      this.form = {
        parent_uuid: '',
        uuid: '',
        name: '',
        title: {},
        desc: {},
        is_show: true,
        flag: [],
        cover: [],
        list_order: 0,
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-catalog-container {
  widows: 100%;
  height: 100%;
  padding: 10px;
  overflow: auto;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  text-align: center;
  margin: 20px 0;
}
.lang-input {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  .el-input {
    width: 80%;
    margin-right: 10px;
  }
  .el-textarea {
    width: 80%;
    margin-right: 10px;
  }
}
.flag {
  position: relative;
  .flag-image {
    display: inline-block;
    width: 80px;
    height: 80px;
    background: #EFEFEF;
    border-radius: 4px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .el-button {
    position: absolute;
    margin: 40px 0 0 20px;
  }
}

.cover {
  position: relative;
  .cover-image {
    display: inline-block;
    width: 169px;
    height: 113px;
    background: #EFEFEF;
    border-radius: 4px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .el-button {
    position: absolute;
    margin: 70px 0 0 20px;
  }
}

.handler {
  margin: 20px 0;
  text-align: center;
}
</style>
