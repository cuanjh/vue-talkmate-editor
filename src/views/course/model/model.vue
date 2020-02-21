<template>
  <div class="model-container">
    <div class="model-content">
      <div class="top-bar">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addModel()">添加</el-button>
      </div>
      <el-table
        :data="modelList"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          type="index">
        </el-table-column>
        <el-table-column
          width="300"
          label="model_key"
          prop="model_key">
        </el-table-column>
        <el-table-column
          width="300"
          label="名称"
          prop="name">
        </el-table-column>
        <el-table-column
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
    </div>
    <edit-comp ref="modelEdit" @editModel="initData"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  delModel
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
      modelList: state => state.course.modelList
    })
  },
  methods: {
    ...mapActions({
      getModelList: 'course/getModelList'
    }),
    initData () {
      this.getModelList({ pageNo: 0, pageSize: 0 })
      console.log('initData')
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
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delModel({ model_key: key }).then(res => {
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
.top-bar {
  padding: 20px 0px 0;
  text-align: right;
}

</style>
<style>
.model-container .el-table td, .el-table th {
  padding: 14px 0!important;
}
</style>
