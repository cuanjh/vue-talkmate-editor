<template>
  <div class="mylevel-container">
    <div class="top-bar">
      <el-select v-model="selLevelType"
        filterable
        default-first-option
        placeholder="请选择等级分类"
        @change="search">
        <el-option
          v-for="item in levelTypeList"
          :key="item['uuid']"
          :label="item.title"
          :value="item.uuid">
        </el-option>
      </el-select>
      <div class="right">
        <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="addLevelType">新建等级分类</el-button>
        <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          :disabled="!(levelTypeList && levelTypeList.length > 0)"
          @click="addLevel">新建等级</el-button>
      </div>
    </div>
    <el-table
      class="course-table"
      height="700"
      :data="list"
      @select="select"
      @select-all="selectAll"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageRequest.pageNo - 1) * pageRequest.pageSize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        label="等级"
        prop="levelCode">
      </el-table-column>
      <el-table-column
        width="180"
        label="标签">
        <template slot-scope="scope">
          <div v-for="l in langInfos" :key="l.langKey">{{ l.name + ': ' +  (scope.row.tag['' + l.langKey + ''] ? scope.row.tag['' + l.langKey + ''] : '') + ' ' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="能力级别">
        <template slot-scope="scope">
          <div v-for="l in langInfos" :key="l.langKey">{{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="数据">
        <template slot-scope="scope">
          <span v-for="(item, i) in scope.row.statistics" :key="i">
            {{ item.num + item['zh-CN'] + (item['en'] ? '（'+ item['en'] + '）' : '') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            @click="editLevel(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="deleteLevel(scope.row.uuid)">删除</el-button>
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
    <level-type ref="levelType" />
    <edit-comp ref="edit"
      @close="initData"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

import {
  getLevelList,
  delLearnLevel
} from '@/api/course'
import LevelType from './editLevelType'
import EditComp from './editLevel'

export default {
  data () {
    return {
      selLevelType: '',
      exportList: [],
      exportNum: 0,
      list: [],
      selCourseList: [],
      isShow: false,
      handlers: [
        { key: 'group', text: '班级群', cls: '' },
        { key: 'detail', text: '添加详情', cls: '' },
        { key: 'unlock', text: '解锁', cls: '' },
        { key: 'statistic', text: '统计', cls: '' },
        { key: 'del', text: '删除', cls: 'error' }
      ],
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    LevelType,
    EditComp
  },
  created () {
    this.getLevelTypeList({ pageNo: 1, pageSize: 999 })
  },
  mounted () {
    if (this.levelTypeList && this.levelTypeList.length > 0) {
      this.selLevelType = this.levelTypeList[0].uuid
    }
    this.initData()
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      levelTypeList: state => state.course.levelTypeList,
      langInfos: state => state.course.langInfos,
      locale: state => state.course.locale,
      pageSizes: state => state.pageSizes
    })
  },
  methods: {
    ...mapActions({
      getLevelTypeList: 'course/getLevelTypeList'
    }),
    search () {
      this.handleCurrentChange(1)
    },
    async initData () {
      let res = await getLevelList({
        levelCatUuid: this.selLevelType,
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize
      })
      this.list = res.data.list
      this.pageRequest.total = res.data.total
      setTimeout(() => {
        document.querySelector('.admin-box').scrollTop = 0
        const scrollTblEle = document.querySelector('.el-table--scrollable-y .el-table__body-wrapper')
        if (scrollTblEle) {
          scrollTblEle.scrollTop = 0
        }
      }, 100)
    },
    editLevel (row) {
      let obj = {
        type: 'edit',
        form: row
      }
      this.$refs.edit.show(obj)
    },
    addLevelType () {
      this.$refs.levelType.show()
    },
    addLevel () {
      let obj = {
        type: 'add'
      }
      this.$refs.edit.show(obj)
    },
    deleteLevel (id) {
      console.log(id)
      this.$confirm('此操作将永久删除选择内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLearnLevel({ uuid: id }).then(res => {
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
    select (selection, row) {
      this.selCourseList = selection
    },
    selectAll (selection) {
      this.selCourseList = selection
    },
    handleSizeChange (val) {
      this.pageRequest.pageSize = val
      this.initData()
    },
    handleCurrentChange (val) {
      this.pageRequest.pageNo = val
      this.initData()
    }
  }
}
</script>

<style scoped lang="scss">
  .el-table {
    margin-top: 20px;
  }

  .right {
    float: right;
  }

  .btnOnline {
    width: 100px;
  }

  .course-list {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .course-flag {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    object-fit: cover;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .course-cover {
    width: 132px;
    height: 66px;
    border-radius: 4px;
    object-fit: cover;
  }

  .tips {
    margin-right: 30px;
  }
  .more-btns {
    top: 26px;
    right: 30px;
  }
</style>
