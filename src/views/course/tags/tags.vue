<template>
  <div class="tags-container">
    <div class="tags-content">
      <div class="top-bar">
        <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的key或名称"></el-input>
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
            <el-tooltip :content="scope.row.key" placement="top" effect="light">
              <span>{{ scope.row.key }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="名称">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name" placement="top" effect="light">
              <span>{{ scope.row.name }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="type">
          <template slot-scope="scope">
            <el-tooltip :content="typeName(scope.row.type)" placement="top" effect="light">
              <span>{{ typeName(scope.row.type) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="editTag(scope.row)">编辑</el-button>
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
          :total="tagsLists.length"
          >
        </el-pagination>
      </div>
    </div>
    <edit-comp ref="tagEdit" :tagTypes="tagTypes" @addTagItem="initData"/>
    <cropper-dialog ></cropper-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  delTags
} from '@/api/course'
import EditComp from './edit'
import CropperDialog from '../../../components/common/cropper'

export default {
  data () {
    return {
      searchKey: '',
      showTableData: [],
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 5
      },
      allTags: [],
      tagsLists: []
    }
  },
  components: {
    EditComp,
    CropperDialog
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      tagTypes: state => state.course.tagTypes,
      contentTags: state => state.course.contentTags
    })
  },
  mounted () {
    this.getTagTypes()
    // this.tagsLists = this.contentTags
    // this.allTags = this.contentTags
    // console.log(this.contentTags, this.allTags)
  },
  methods: {
    ...mapActions({
      getTagTypes: 'course/getTagTypes',
      getContentTags: 'course/getContentTags'
    }),
    typeName (key) {
      let obj = {}
      this.tagTypes.forEach(element => {
        if (element.type.toLowerCase() === key.toLowerCase()) {
          obj = element
        }
      })
      return obj.name
    },
    async initData () {
      await this.getContentTags({ pageNo: 0, pageSize: 0 })
      console.log('initData')
      this.tagsLists = this.contentTags
      this.allTags = this.contentTags
      // console.log(this.contentTags, this.allTags)
      this.tagsLists = this.allTags.filter(item => {
        let res = item.name.indexOf(this.searchKey) > -1 || item.key.indexOf(this.searchKey) > -1
        return res
      })
      this.handleCurrentChange(this.pageRequest.pageNum)
    },
    // 模糊搜索
    search () {
      let _this = this
      console.log(_this.searchKey)
      this.tagsLists = this.allTags.filter(item => {
        let res = item.name.indexOf(this.searchKey) > -1 || item.key.indexOf(this.searchKey) > -1
        return res
      })
      // console.log(this.tagsLists)
      // console.log(this.showTableData)
      this.handleCurrentChange(1)
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
      this.showTableData = this.tagsLists.slice(starNum, endNum)
    },
    // 添加
    addTags () {
      let obj = {
        type: 'add'
      }
      this.$refs.tagEdit.show(obj)
    },
    // 编辑
    editTag (row) {
      let obj = {
        type: 'edit',
        params: row
      }
      console.log(obj)
      this.$refs.tagEdit.show(obj)
    },
    // 删除
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
  display: flex;
  justify-content: space-between;
}
.el-input {
  width: 300px;
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
