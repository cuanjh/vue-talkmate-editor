<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="编码">
          <el-input v-model="form.lan_code"></el-input>
        </el-form-item>
        <el-form-item label="名称" v-for="(value, key, index) in title" :key="index">
          <span>{{value}}-{{key}}-{{index}}</span>
          <!-- <el-input>{{value}}-{{key}}-{{index}}</el-input> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      showEdit: false,
      form: {
        desc: [], // 描述
        flag: [], // 小图标
        is_hot: false, // 是否热门
        is_show: false, // 是否上线
        lan_code: '', // 语种的编码
        list_order: 0, // 排序号
        title: [], // 名称
        word_direction: '', // 从左到右还是相反
        langInfos: []
      }
    }
  },
  created () {
    this.langInfos = JSON.parse(localStorage.getItem('vuex')).course.langInfos
    console.log(this.langInfos)
    let obj = {}
    this.langInfos.forEach((item, index) => {
      obj['additionalProp' + (index + 1)] = ''
    })
    this.title = obj
    this.desc = obj
    console.log(this.title, this.desc)
  },
  mounted () {
  },
  methods: {
    show () {
      this.showEdit = true
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 999;
}
.edit-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:860px;
  max-height:530px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  overflow-y: auto;
}
</style>
