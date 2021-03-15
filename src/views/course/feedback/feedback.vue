<template>
  <div class="main-content course" ref="content">
    <div class="top-bar">
      <div class="left">
        <el-select
          v-model="selLang"
          filterable
          default-first-option
          placeholder="请选择语种"
          @change="changeSelLang">
          <el-option
            v-for="item in langList"
            :key="item['lan_code']"
            :label="item.title['' + locale + '']"
            :value="item['lan_code']">
          </el-option>
        </el-select>
        <el-select class="select-course" v-model="selCourseUUID" filterable placeholder="请选择课程"  @change="initData">
          <el-option
            v-for="item in version.courseList"
            :key="item.uuid"
            :label="item.name ? item.name : '(' + courseTypes.find(i => { return i.type == item.course_type})['name'] + ') ' + item.title['zh-CN'] + '/' + item.title['en']"
            :value="item.uuid">
            <div class="course">
              <el-image style="width: 24px; height: 24px; border-radius: 4px; margin-right: 4px;" :src="assetsDomain + item.flag[0]" fit="cover"></el-image>
              <span>{{item.name ? item.name : '(' + courseTypes.find(i => { return i.type == item.course_type})['name'] + ') ' + item.title['zh-CN'] + '/' + item.title['en']}}</span>
            </div>
          </el-option>
        </el-select>
        <el-input placeholder="请输入要查找的描述" class="mr10" v-model="searchKey" @keyup.enter.native="handlerSearch"></el-input>
        <el-input placeholder="请输入要查找的标签" v-model="searchTag" @keyup.enter.native="handlerSearch"></el-input>
      </div>
      <div class="right">
        <el-button v-show="false"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="addCourse">添加</el-button>
      </div>
    </div>
    <el-table
      height="700"
      :data="list"
      style="width: 100%;">
      <el-table-column
        width="60"
        label="序号"
        type="index">
      </el-table-column>
      <el-table-column
        label="更新时间"
        width="140px"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="desc">
      </el-table-column>
      <el-table-column
        width="300px"
        label="标签">
        <template slot-scope="props">
          <div class="tags">
            <div class="tag" v-for="item in props.row.tags.split('/')" :key="item">
              <el-tag type="info" size="small" v-if="item">{{ item }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="100px"
        :filters="[{ text: '未处理', value: 0 }, { text: '已处理', value: 1 }]"
        :filter-method="filterStatus"
        label="状态">
        <template slot-scope="props">
          <el-button size="small" :type="props.row.status == '0' ? 'warning' : 'success'" @click="handleStatus(props)">{{ props.row.status == '0' ? '未处理' : '已处理' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="160px">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            :disabled="scope.row.status == '1'"
            size="mini"
            @click="feedback(scope.row)">纠错</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="del(scope.row, scope.$index)">删除</el-button>
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
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

import {
  getContentReports,
  updateContentReport,
  delOneContentReport
} from '@/api/course'

// let onlyOne = true
export default {
  data () {
    return {
      selLang: 'ENG',
      selCourseUUID: '',
      searchKey: '',
      searchTag: '',
      list: [],
      isShow: false,
      scrollTop: 0,
      isShowPagination: false,
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
  },
  created () {
    this.$store.dispatch('course/getLangList', { 'pageNo': 1, 'pageSize': 999 })
    this.$store.dispatch('course/getCourseTypes')
    this.initData()
  },
  mounted () {
    if (this.version) {
      this.selLang = this.version.selLang
    }
    if (this.version && this.version.selCourse) {
      this.selCourseUUID = this.version.selCourse.uuid
    }
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      locale: state => state.course.locale,
      langList: state => state.course.langList,
      courseTypes: state => state.course.courseTypes,
      version: state => state.course.version,
      pageSizes: state => state.pageSizes
    })
  },
  watch: {
    'version.selCourse' (newVal, oldVal) {
      this.selCourseUUID = newVal.uuid
      this.initData()
    }
  },
  methods: {
    changeSelLang (e) {
      this.$store.commit('course/updateVersion', { key: 'selLang', val: this.selLang })
      this.$store.dispatch('course/getCourseList', { 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
    },
    changeCourse () {
      let selCourse = this.version.courseList.find(f => {
        return f.uuid === this.selCourseUUID
      })
      this.updateVersion({ key: 'selCourse', val: selCourse })
      this.$store.dispatch('course/getCourseVersions', { 'pageNo': 0, 'pageSize': 0, 'parent_uuid': selCourse.uuid })
    },
    handlerScroll (e) {
      // if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight && onlyOne) {
      //   this.scrollTop = e.target.scrollHeight - e.target.offsetHeight
      //   onlyOne = false
      //   this.currentPage++
      //   this.initData()
      // }
    },
    handlerSearch () {
      this.handleCurrentChange(1)
    },
    async initData () {
      let res = await getContentReports({
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize,
        langCode: this.selLang,
        code: this.version.selCourse.code,
        desc: this.searchKey,
        tags: this.searchTag,
        sort_type: -1,
        text_field: 'createdTime'
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
    feedback (row) {
      console.log(row)
      const parentUuids = row.parentUuids
      if (this.version.selCourse.uuid !== parentUuids[parentUuids.length - 1]) {
        this.$message({
          type: 'warning',
          message: '此条数据为垃圾数据'
        })
        return false
      }
      const uuid = parentUuids[parentUuids.length - 2]
      this.$store.commit('course/updateVersion', { key: 'selVersion', val: uuid })
      this.$store.commit('course/updateVersion', { key: 'uuid', val: uuid })
      // localStorage.setItem('courseContentPath', parentUuids.slice(0, parentUuids.length - 2).join('/'))
      this.$store.commit('course/updateCourseContentPath', parentUuids.slice(0, parentUuids.length - 2).reverse().join('/') + '/')
      this.$store.commit('course/updateSelCourseFormUUID', row.uuid)
      this.$router.push({ path: '/course-content' })
    },
    handleStatus (props) {
      const row = props.row
      this.$confirm('确认是否已经处理过该条纠错记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row['status'] = props.row.status === 1 ? 0 : 1
        updateContentReport(row).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.list[props.$index]['status'] = row['status']
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addCourse () {
      let obj = {
        type: 'add',
        fromLang: this.fromLang
      }
      this.$refs.edit.show(obj)
    },
    del (row, index) {
      console.log(row)
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOneContentReport({ id: row.id }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.list.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    formatterDate (obj) {
      return obj && obj.createdTime ? moment(obj.createdTime).format('YYYY-MM-DD HH:mm') : ''
    },
    filterRepType (value, row) {
      return row.repType === value
    },
    filterStatus (value, row) {
      return row.status === value
    }
  }
}
</script>

<style scoped lang="scss">
  .el-table {
    margin-top: 20px;
  }

  .top-bar {
    display: flex;
    flex-direction: row;
    .left {
      flex: 1;
      display: flex;
      flex-direction: row;
      padding-right: 20px;
    }
    .right {
      width: 120px;
    }
  }
  .select-course {
    width: 300px;
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

  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .tag {
    margin: 5px;
  }
</style>
