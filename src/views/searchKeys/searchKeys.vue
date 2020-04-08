<template>
  <div class="search-container">
    <div class="search-content">
      <div class="top-bar">
        <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的名称"></el-input>
        <div class="right">
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="addWord">添加</el-button>
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="sortWord">排序</el-button>
        </div>
      </div>
      <el-table
        :data="wordList"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          type="index"
          align="center">
        </el-table-column>
        <el-table-column
          label="关键词"
          prop="word">
        </el-table-column>
        <el-table-column
          fixed="right"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="editChannel(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteWord(scope.row.uuid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-comp ref="wordEdit" @refresh="initData"/>
    <sort-comp ref="wordSort" @refresh="initData"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  delSearchWord,
  getSearchWords
} from '@/api/course'
import EditComp from './wordEdit'
import SortComp from './wordSort'

export default {
  data () {
    return {
      searchKey: '',
      allWords: [],
      wordList: []
    }
  },
  components: {
    EditComp,
    SortComp
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos
    })
  },
  mounted () {
  },
  methods: {
    async initData () {
      let res = await getSearchWords()
      this.allWords = res.data.words.sort((a, b) => {
        return b.listOrder - a.listOrder
      })
      this.wordList = this.allWords.filter(item => {
        return item.word.indexOf(this.searchKey) > -1
      })
    },
    // 模糊搜索
    search () {
      let _this = this
      console.log(_this.searchKey)
      this.wordList = this.allWords.filter(item => {
        return item.word.indexOf(this.searchKey) > -1
      })
    },
    // 添加
    addWord () {
      let obj = {
        type: 'add'
      }
      this.$refs.wordEdit.show(obj)
    },
    // 添加
    sortWord () {
      this.$refs.wordSort.show({ allWords: this.allWords })
    },
    // 编辑
    editChannel (row) {
      let obj = {
        type: 'edit',
        params: row
      }
      this.$refs.wordEdit.show(obj)
    },
    // 删除
    deleteWord (uuid) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delSearchWord({ uuid: uuid }).then(res => {
          if (res.success) {
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    sortPos (a, b) {
      if (a.showPos > b.showPos) {
        return 1
      } else if (a.showPos < b.showPos) {
        return -1
      } else {
        return 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-container {
  overflow: auto;
  flex: 1;
  padding-bottom: 50px;
}
.pagination-box {
  text-align: center;
  padding-top: 20px;
}
.top-bar {
  padding: 20px 0px 0;
  display: flex;
  justify-content: space-between;
}
.el-input {
  width: 300px;
}

</style>
<style>
.search-container .el-table td, .el-table th {
  padding: 14px 0!important;
}

.search-container .el-table td div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 46px;
}
</style>
