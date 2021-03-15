<template>
  <div class="model-container">
    <div class="model-content">
      <div class="top-bar">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addModel()">添加</el-button>
      </div>
      <el-table
        height="700"
        :data="modelList"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+(pageRequest.pageNo - 1) * pageRequest.pageSize + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="300"
          label="model_key">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.model_key" width="300" placement="top" effect="light">
              <span>{{ scope.row.model_key }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="名称">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name" width="300" placement="top" effect="light">
              <span>{{ scope.row.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              @click="editModel(scope.row)">编辑</el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteModel(scope.row.model_key)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageRequest.pageNo"
          :page-sizes="pageSizes"
          :page-size="pageRequest.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageRequest.total">
        </el-pagination>
      </div>
    </div>
    <edit-comp ref="modelEdit" @editModel="initData"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  delModel,
  getModelList
} from '@/api/course'
import EditComp from './editModel'

export default {
  data () {
    return {
      modelList: [],
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created () {
    this.initData()
  },
  components: {
    EditComp
  },
  computed: {
    ...mapState({
      pageSizes: state => state.pageSizes
    })
  },
  methods: {
    initData () {
      getModelList({
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize
      }).then(res => {
        console.log(res)
        this.modelList = res.data.models
        this.pageRequest.total = res.data.total
        setTimeout(() => {
          document.querySelector('.admin-box').scrollTop = 0
          const scrollTblEle = document.querySelector('.el-table--scrollable-y .el-table__body-wrapper')
          if (scrollTblEle) {
            scrollTblEle.scrollTop = 0
          }
        }, 100)
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageRequest.pageSize = val
      this.initData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageRequest.pageNo = val
      this.initData()
    },
    addModel () {
      let obj = {
        type: 'add'
      }
      this.$refs.modelEdit.show(obj)
    },
    // 编辑
    editModel (params) {
      console.log(params)
      let sortFeilds = params.feilds.sort((a, b) => {
        return a.list_order - b.list_order
      })
      params.feilds = sortFeilds
      console.log(params)
      let obj = {
        data: params,
        type: 'edit'
      }
      this.$refs.modelEdit.show(obj)
    },
    // 删除
    deleteModel (key) {
      console.log(key)
      this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delModel({ model_key: key }).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bar {
  padding: 20px 0px 0;
  text-align: right;
}

</style>
<style>
.model-container .el-table td, .el-table th {
  padding: 14px 0!important;
}
.model-container .el-table td div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 46px;
}
</style>
