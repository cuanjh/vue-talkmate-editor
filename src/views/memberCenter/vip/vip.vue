<template>
  <div class="vip-container">
    <div class="vip-content">
      <div class="top-bar">
        <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的名称"></el-input>
        <div class="right">
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="add()">添加</el-button>
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="sort()">排序</el-button>
        </div>
      </div>
      <el-table
        :data="list"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          type="index"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          width="300"
          label="uuid"
          prop="uuid">
        </el-table-column> -->
        <el-table-column
          label="名称">
          <template slot-scope="scope" v-if="Object.keys(scope.row.name).length">
            <div v-for="l in langInfos" :key="l.langKey">
              <span>{{ l.name + ': ' +  (scope.row.name['' + l.langKey + ''] ? scope.row.name['' + l.langKey + ''] : '') + ' ' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="普通会员？">
          <template slot-scope="scope">
            {{ scope.row.isShow ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="会员PLUS？">
          <template slot-scope="scope">
            {{ scope.row.isVip ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'primary'">{{ scope.row.status == 1 ? '正常' : '即将上线' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row.uuid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-comp ref="edit" @refresh="initData"/>
    <sort-comp ref="sort" @refresh="initData"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  delAdvantage,
  getAdvantageList
} from '@/api/course'
import EditComp from './vipEdit'
import SortComp from './vipSort'

export default {
  data () {
    return {
      searchKey: '',
      allList: [],
      list: []
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
      let res = await getAdvantageList({ page_index: 1, page_size: 100 })
      console.log(res)
      if (res.success && res.data) {
        this.allList = res.data
      }
      this.list = this.allList.filter(item => {
        let flag = false
        this.langInfos.forEach(i => {
          flag = flag || (item.name['' + i.langKey + ''] && (item.name['' + i.langKey + ''].indexOf(this.searchKey) > -1))
        })
        return flag
      })
      this.sortList()
    },
    // 模糊搜索
    search () {
      let _this = this
      console.log(_this.searchKey)
      this.list = this.allList.filter(item => {
        let flag = false
        this.langInfos.forEach(i => {
          flag = flag || (item.name['' + i.langKey + ''] && (item.name['' + i.langKey + ''].indexOf(this.searchKey) > -1))
        })
        if (item.uuid.indexOf(this.searchKey) > -1) {
          flag = true
        }
        return flag
      })
      this.sortList()
    },
    sortList () {
      let arr = this.list
      arr.sort((a, b) => {
        return a.listOrder - b.listOrder
      })
      return arr
    },
    // 添加
    add () {
      let obj = {
        type: 'add',
        listOrder: (this.allList.length + 1) * 10
      }
      this.$refs.edit.show(obj)
    },
    // 添加
    sort () {
      this.$refs.sort.show(this.allList)
    },
    // 编辑
    edit (row) {
      let obj = {
        type: 'edit',
        params: row
      }
      this.$refs.edit.show(obj)
    },
    // 删除
    del (uuid) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delAdvantage({ uuid: uuid }).then(res => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
.vip-container {
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
.vip-container .el-table td, .el-table th {
  padding: 14px 0!important;
}

.vip-container .el-table td div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 46px;
}
</style>
