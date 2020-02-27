<template>
  <div class="question-container">
    <div class="question-content">
      <div class="top-bar">
        <el-select v-model="selModel" placeholder="请选择文件类型" @change="changeModel()">
          <!-- <el-option value="" label="全部"></el-option> -->
          <el-option
            v-for="item in modelList"
            :key="item.model_key"
            :label="item.name"
            :value="item.model_key">
          </el-option>
        </el-select>
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addType()">添加</el-button>
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
          width="200"
          label="类型">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.type" width="300" placement="top" effect="light">
              <span>{{ scope.row.type }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="名称">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name" width="300" placement="top" effect="light">
              <span>{{ scope.row.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          label="描述">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.desc" width="300" placement="top" effect="light">
              <span>{{ scope.row.desc }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delType(scope.row.type)">删除</el-button>
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
          :total="filterContentTypeList.length"
          >
        </el-pagination>
      </div>
    </div>
    <edit-comp ref="contentTypeEdit" @addContentType="initData"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  delContentType
} from '@/api/course'
import EditComp from './edit'

export default {
  data () {
    return {
      showTableData: [],
      selModel: '',
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created () {
    this.getModelList({ pageNo: 0, pageSize: 0 })
    this.initData()
  },
  components: {
    EditComp
  },
  computed: {
    ...mapState({
      contentTypeList: state => state.course.contentTypeList,
      modelList: state => state.course.modelList
    }),
    filterContentTypeList () {
      if (this.selModel) {
        return this.contentTypeList.filter(item => {
          return item.model_key === this.selModel
        })
      }
      return this.contentTypeList
    }
  },
  methods: {
    ...mapActions({
      getContentTypeList: 'course/getContentTypeList',
      getModelList: 'course/getModelList'
    }),
    async initData () {
      await this.getContentTypeList({ pageNo: 0, pageSize: 0 })
      console.log('initData')
      this.handleCurrentChange(this.pageRequest.pageNum)
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
      this.showTableData = this.filterContentTypeList.slice(starNum, endNum)
    },
    addType () {
      this.$refs.contentTypeEdit.show()
    },
    delType (type) {
      console.log(type)
      this.$confirm('此操作将永久删除该类型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delContentType({ type: type }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
    changeModel () {
      this.handleCurrentChange(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-box {
  text-align: center;
  padding-top: 20px;
}
.question-content {
  padding-bottom: 50px;
}
.top-bar {
  padding: 20px 0px 0;
  text-align: right;
  .el-select {
    float: left;
  }
}
</style>
<style>
.question-container .el-table .cell {
  padding-right: 30px;
}
.question-container .el-table td div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 46px;
}
</style>
