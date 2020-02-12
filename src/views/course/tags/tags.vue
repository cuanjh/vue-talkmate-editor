<template>
  <div class="tags-container">
    <div class="tags-content">
      <div class="top-bar">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addTags()">添加</el-button>
      </div>
      <el-table
        :data="contentTags"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          type="index">
        </el-table-column>
        <el-table-column
          width="300"
          label="key"
          prop="key">
        </el-table-column>
        <el-table-column
          width="400"
          label="名称"
          prop="name">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteTag(scope.row.key)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    },
    addTags () {
      this.$refs.tagEdit.show()
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
.top-bar {
  padding: 0 100px;
  text-align: right;
}

</style>
<style>
.tags-container .el-table td, .el-table th {
  padding: 14px 0!important;
}
</style>
