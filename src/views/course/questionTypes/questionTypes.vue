<template>
  <div class="question-container">
    <div class="question-content">
      <div class="top-bar">
        <el-select v-model="selModel" placeholder="请选择文件类型" @change="changeModel()">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in modelList"
            :key="item.model_key"
            :label="item.name"
            :value="item.model_key">
          </el-option>
        </el-select>
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addType()">添加</el-button>
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="sortType()">排序</el-button>
      </div>
      <el-table
        height="700"
        :data="contentTypeList"
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
          width="200"
          label="提示语">
          <template slot-scope="scope" v-if="scope.row.title && Object.keys(scope.row.title).length">
            <div v-for="l in langInfos" :key="l.langKey">
              <el-tooltip :content="l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' '" width="300" placement="top" effect="light">
                <span>{{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}</span>
              </el-tooltip>
            </div>
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
          width="180px"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editType(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="delType(scope.row.type)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <edit-question ref="contentTypeEdit" @addContentType="initData"/>
    <sort-question ref="sortQuestion" @initData="initData"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  getContentTypeList,
  delContentType
} from '@/api/course'
import EditQuestion from './editQuestion'
import SortQuestion from './sortQuestion'

export default {
  data () {
    return {
      contentTypeList: [],
      selModel: '',
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created () {
    this.getModelList({ pageNo: 1, pageSize: 99 })
    this.initData()
  },
  components: {
    EditQuestion,
    SortQuestion
  },
  computed: {
    ...mapState({
      modelList: state => state.course.modelList,
      langInfos: state => state.course.langInfos,
      pageSizes: state => state.pageSizes
    })
  },
  methods: {
    ...mapActions({
      getModelList: 'course/getModelList'
    }),
    async initData () {
      getContentTypeList({
        modelKey: this.selModel,
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize
      }).then(res => {
        if (res.success) {
          this.contentTypeList = res.data.types
          this.pageRequest.total = res.data.total
        } else {
          this.contentTypeList = []
          this.pageRequest.total = 0
        }
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
    addType () {
      this.$refs.contentTypeEdit.show({ flag: 'add' })
    },
    editType (row) {
      this.$refs.contentTypeEdit.show({ flag: 'edit', data: row })
    },
    sortType () {
      this.$refs['sortQuestion'].show(this.contentTypeList)
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
