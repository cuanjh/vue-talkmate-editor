<template>
  <div class="lang-manage">
    <div class="top-bar">
      <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的语言"></el-input>
      <div class="btn-area">
        <el-button style="outline:none;" type="primary" class="btnAdd">添加</el-button>
        <el-button style="outline:none;" type="primary" class="btnSort">预览排序</el-button>
      </div>
    </div>
    <el-table
      :data="langList"
      style="width: 100%;">
      <!-- <el-table-column
        label="序号"
        type="index">
      </el-table-column> -->
      <el-table-column
        label="序号"
        width="80"
        prop="list_order">
      </el-table-column>
      <el-table-column
        label="编码"
        width="80"
        prop="lan_code">
      </el-table-column>
      <el-table-column
        width="200"
        label="名称">
        <template slot-scope="scope">
          <div v-for="l in interfaceLangs" :key="l.code">{{ l.text + ': ' +  scope.row.title['' + l.code + ''] + ' ' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="描述">
        <template slot-scope="scope" v-if="Object.keys(scope.row.desc).length">
          <div v-for="l in interfaceLangs" :key="l.code">{{ l.text + ': ' +  scope.row.desc['' + l.code + ''] + ' ' }}</div>
        </template>
        <template v-else>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="图标">
        <template slot-scope="scope">
          <el-image
            class="lang-img"
            :src="assetsUrl + scope.row.flag[0]"
            fit="fit">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="书写顺序">
        <template slot-scope="scope">
          {{scope.row.word_direction == 'l2r' ? '从左到右' : '从右到左'}}
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="是否热门">
        <template slot-scope="scope">
          {{scope.row.is_hot ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="是否已上线">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_show">是</el-tag>
          <el-tag type="dange" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="250" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            :disabled="scope.row.is_show"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            plain
            type="success"
            :disabled="scope.row.is_show"
            @click="handleEdit(scope.$index, scope.row)">上线</el-button>
          <el-button
            size="mini"
            plain
            type="warning"
            @click="handleEdit(scope.$index, scope.row)">下线</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  getLangList
} from '@/api/course'
export default {
  data () {
    return {
      allLangs: [],
      langList: [],
      assetsUrl: '',
      searchKey: ''
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      interfaceLangs: state => state.course.interfaceLangs
    })
  },
  methods: {
    async initData () {
      let res = await getLangList({ 'pageNo': 0, 'pageSize': 999 })
      if (res.success) {
        let sortLangs = res.data.langs.sort((a, b) => {
          return a.list_order - b.list_order
        })
        this.allLangs = sortLangs
        this.langList = sortLangs
        this.assetsUrl = res.data.assetsUrl
      }
    },
    search () {
      console.log(this.searchKey)
      this.langList = this.allLangs.filter(item => {
        let flag = false
        this.interfaceLangs.forEach(i => {
          flag = flag || item.title['' + i.code + ''].indexOf(this.searchKey) > -1
        })
        return flag
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped lang="scss">
  .lang-manage {
    padding: 20px;
  }
  .el-table {
    margin-top: 20px;
  }
  .el-input {
    width: 300px;
  }
  .btn-area {
    float: right;
  }
  .btnAdd {
    width: 100px;
    margin-right: 10px;
  }
  .btnSort {
    width: 100px;
    margin-right: 10px;
  }
  .lang-img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
  }
</style>
