<template>
  <div class="tags-container">
    <div class="tags-content">
      <div class="top-bar">
        <div class="left">
          <el-input v-model="searchKey" @change="initData" clearable placeholder="请输入要查找的key或名称"></el-input>
          &nbsp;
          <el-select v-model="type"
            placeholder="请选择分类"
            @change="initData">
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="item in tagTypes"
              :key="item.name"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="addTags()">添加</el-button>
          <el-button
            v-show="false"
            style="outline:none;"
            type="success"
            class="btnOnline"
            @click="onlineCourse">上线</el-button>
        </div>
      </div>
      <el-table
        height="700"
        :data="allTags"
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
    <edit-comp ref="tagEdit" @addTagItem="initData"/>
    <cropper-dialog ></cropper-dialog>
    <dialog-online ref="dialogOnline" @confirm="confirm" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  getContentTags,
  delTags,
  onlineCourses
} from '@/api/course'
import DialogOnline from '@/components/dialogOnline'
import EditComp from './editTag'
import CropperDialog from '../../../components/common/cropper'

export default {
  data () {
    return {
      searchKey: '',
      showTableData: [],
      type: '',
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      allTags: [],
      tagsLists: []
    }
  },
  components: {
    EditComp,
    CropperDialog,
    DialogOnline
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      tagTypes: state => state.course.tagTypes,
      contentTags: state => state.course.contentTags,
      userInfo: state => state.user.userInfo,
      pageSizes: state => state.pageSizes
    })
  },
  mounted () {
    this.getTagTypes()
  },
  methods: {
    ...mapActions({
      getTagTypes: 'course/getTagTypes'
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
    initData () {
      getContentTags({
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize,
        name: this.searchKey,
        type: this.type
      }).then(res => {
        if (res.success) {
          this.allTags = res.data.tags
          this.pageRequest.total = res.data.total
          setTimeout(() => {
            document.querySelector('.admin-box').scrollTop = 0
            const scrollTblEle = document.querySelector('.el-table--scrollable-y .el-table__body-wrapper')
            if (scrollTblEle) {
              scrollTblEle.scrollTop = 0
            }
          }, 100)
        }
      })
    },
    // 模糊搜索
    search () {
      this.handleCurrentChange(1)
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
    },
    confirm (item) {
      let envDesc = '测试环境'
      if (item.dbEnv === 'online') {
        envDesc = '正式环境'
      }
      this.$confirm(`确定要上线${envDesc}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlineCourses({ onlineType: item.dbEnv, hasCourse: false, hasTags: true, tagKeys: [] }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '上线成功'
            })
            this.selCourseList = []
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上线'
        })
      })
    },
    onlineCourse () {
      this.$refs['dialogOnline'].show()
    },
    changeType () {}
  }
}
</script>
<style lang="scss" scoped>
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
