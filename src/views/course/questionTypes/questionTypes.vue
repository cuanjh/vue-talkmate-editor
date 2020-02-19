<template>
  <div class="question-container">
    <div class="question-content">
      <div class="top-bar">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addType()">添加</el-button>
      </div>
      <el-table
        :data="contentTypeList"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          type="index">
        </el-table-column>
        <el-table-column
          width="200"
          label="类型"
          prop="type">
        </el-table-column>
        <el-table-column
          width="200"
          label="名称"
          prop="name">
        </el-table-column>
        <el-table-column
          width="300"
          label="描述"
          prop="desc">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="delType(scope.row.type)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      contentTypeList: state => state.course.contentTypeList
    })
  },
  methods: {
    ...mapActions({
      getContentTypeList: 'course/getContentTypeList'
    }),
    initData () {
      this.getContentTypeList({ pageNo: 0, pageSize: 0 })
      console.log('initData')
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
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delContentType({ type: type }).then(res => {
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
.question-content {
  padding-bottom: 50px;
}
.top-bar {
  padding: 20px 0px 0;
  text-align: right;
}
</style>
<style>
.question-container .el-table .cell {
  padding-right: 30px;
}
</style>
