<template>
  <div class="tags-container">
    <div class="tags-content">
      <div class="top-bar">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addTags()">添加</el-button>
      </div>
      <el-table
        :data="showTableData"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+(pageRequest.pageNum - 1) * pageRequest.pageSize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          label="key">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.key" width="300" placement="top" effect="light">
              <span>{{ scope.row.key }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="400"
          label="名称">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name" width="300" placement="top" effect="light">
              <span>{{ scope.row.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteTag(scope.row.key)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          background layout="prev, pager, next"
          :current-page="pageRequest.pageNum"
          :page-size="pageRequest.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="contentTags.length"
          >
        </el-pagination>
      </div>
    </div>
    <edit-comp ref="tagEdit" @addTag="initData"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  delTags
} from '@/api/course'
import EditComp from './edit'

export default {
  data () {
    return {
      showTableData: [],
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  components: {
    EditComp
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      contentTags: state => state.course.contentTags
    })
  },
  mounted () {
    console.log(this.contentTags)
  },
  methods: {
    ...mapActions({
      getContentTags: 'course/getContentTags'
    }),
    initData () {
      this.getContentTags({ pageNo: 0, pageSize: 0 })
      console.log('initData')
      this.handleCurrentChange(this.pageRequest.pageNum)
    },
    addTags () {
      this.$refs.tagEdit.show()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageRequest.pageSize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageRequest.pageNum = val
      let starNum = (val - 1) * this.pageRequest.pageSize
      let endNum = val * this.pageRequest.pageSize
      this.showTableData = this.contentTags.slice(starNum, endNum)
    },
    deleteTag (key) {
      console.log(key)
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delTags({ key: key }).then(res => {
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
.pagination-box {
  text-align: center;
  padding-top: 20px;
}
.top-bar {
  padding: 20px 0px 0;
  text-align: right;
}

</style>
<style>
.tags-container .el-table td, .el-table th {
  padding: 14px 0!important;
}
.tags-container .el-table td div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 46px;
}
</style>
