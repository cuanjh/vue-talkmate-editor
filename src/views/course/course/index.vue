<template>
  <div class="course-manage">
    <div class="top-bar">
      <el-select v-model="version.selLang"
        filterable
        default-first-option
        placeholder="请选择语种"
        @change="curCourse">
        <el-option label="所有语种" value="">
        </el-option>
        <el-option
          v-for="item in langList"
          :key="item['lan_code']"
          :label="item.title[locale]"
          :value="item['lan_code']">
        </el-option>
      </el-select>
      <div class="right">
        <el-tooltip class="item" effect="dark" content="课程数据下载列表" placement="top">
          <el-popover
            class="tips"
            placement="bottom"
            width="400"
            @show="showExportList"
            trigger="click">
            <el-tag type="warning">显示最新 5 条可下载的数据</el-tag>
            <el-table :data="exportList">
              <el-table-column property="created_on" label="创建日期" :formatter="formatDate"></el-table-column>
              <el-table-column property="name" label="标题"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="handleDownload(scope.row)" :disabled="scope.row.status !== 2" type="text" size="small">{{scope.row.status === 2 ? '下载' : '文件生成中...' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-badge slot="reference" :value="exportNum" :hidden="exportNum == 0" class="item" type="warning">
              <el-button size="small" icon="el-icon-message-solid" type="primary" circle></el-button>
            </el-badge>
          </el-popover>
        </el-tooltip>
        <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="addCourse">添加</el-button>
        <el-button
          v-show="false"
          style="outline:none;"
          type="success"
          class="btnOnline"
          @click="onlineCourse">批量上线</el-button>
      </div>
    </div>
    <el-table
      class="course-table"
      :data="courseList"
      @select="select"
      @select-all="selectAll"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        width="60"
        label="序号"
        type="index">
      </el-table-column>
      <el-table-column
        width="140"
        label="名称"
        prop="name">
      </el-table-column>
      <el-table-column
        width="120"
        label="课程分类"
        :formatter="formatterCourseType">
      </el-table-column>
      <el-table-column
        width="140"
        label="课程编码"
        prop="code">
      </el-table-column>
      <el-table-column
        width="180"
        label="课程标题">
        <template slot-scope="scope">
          <div v-for="l in langInfos" :key="l.langKey">{{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="图标">
        <template slot-scope="scope">
          <el-image
            class="course-flag"
            :src="imageUrl(scope.row.flag[scope.row.flag.length - 1]) | urlFix('imageView2/1/format/jpg')"
            fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="封面"
        width="170px">
        <template slot-scope="scope">
          <el-image
            class="course-cover"
            :src="imageUrl(scope.row.cover[scope.row.cover.length - 1]) | urlFix('imageView2/1/format/jpg')"
            fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示">
        <template slot-scope="scope">
          {{scope.row.is_show ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        label="是否显示词典">
        <template slot-scope="scope">
          {{scope.row.has_dict ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            @click="editCourse(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">{{scope.row.is_show ? '隐藏' : '显示'}}</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="deleteCourse(scope.row.uuid)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="classGroup(scope.row)">班级群</el-button>
          <br><br>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="addDetail(scope.row)">添加详情</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="unlockCourse(scope.row)">解锁</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="handleStatistic(scope.row)">统计</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-comp ref="edit"
      :courseTypes="courseTypes"
      @addNewCourse="initData"/>
    <class-group ref="classGroup" />
    <course-detail ref="courseDetail" />
    <unlock-course ref="unlockCourse" />
    <statistic ref="statistic" @refreshDownloadList="refreshDownloadList"/>
    <dialog-online ref="dialogOnline" @confirm="confirm" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment'

import {
  getCourseList,
  courseEdit,
  courseDel,
  exportCourseContentList,
  onlineCourses,
  getVoiceActorList
} from '@/api/course'
import DialogOnline from '@/components/dialogOnline'
import EditComp from './editCourse'
import ClassGroup from './classGroup'
import CourseDetail from './editCourseDetail'
import UnlockCourse from './unlockCourse'
import Statistic from './statistic'

export default {
  data () {
    return {
      exportList: [],
      exportNum: 0,
      courseList: [],
      selCourseList: [],
      isShow: false
    }
  },
  components: {
    EditComp,
    ClassGroup,
    CourseDetail,
    UnlockCourse,
    Statistic,
    DialogOnline
  },
  created () {
    this.getLangList({ 'pageNo': 0, 'pageSize': 999 }).then(() => {
      this.initData()
    })
    this.getCourseTypes()
    // this.refreshDownloadList()
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langList: state => state.course.langList,
      langInfos: state => state.course.langInfos,
      locale: state => state.course.locale,
      courseTypes: state => state.course.courseTypes,
      version: state => state.course.version
    })
  },
  methods: {
    ...mapActions({
      getLangList: 'course/getLangList',
      getCourseTypes: 'course/getCourseTypes'
    }),
    async initData () {
      // 初始化声优列表信息
      this.initVoiceActors()
      let courseListInfo = await getCourseList({ 'lan_code': this.version.selLang, 'pageNo': 1, 'pageSize': 9999 })
      if (courseListInfo.success) {
        this.courseList = courseListInfo.data.courses
      }
    },
    initVoiceActors () {
      getVoiceActorList({
        lang: this.version.selLang,
        page_index: 1,
        page_size: 999
        // ,
        // text_field: 'gender',
        // sort_type: -1
      }).then(res => {
        console.log(res)
        if (res.success) {
          this.$store.commit('course/updateVoiceActors', res.data)
        }
      })
    },
    editCourse (row) {
      console.log(this.courseList)
      let obj = {
        type: 'edit',
        selLang: this.version.selLang,
        form: row
      }
      this.$refs.edit.show(obj)
    },
    handleEdit (row) {
      console.log(row)
      let obj = {
        editInfo: {
          course_type: row.course_type,
          cover: row.cover,
          desc: row.desc ? row.desc : '',
          flag: row.flag ? row.flag : '',
          is_show: !row.is_show,
          tags: [],
          title: row.title ? row.title : ''
        },
        uuid: row.uuid
      }
      console.log(obj)
      courseEdit(obj).then(res => {
        console.log(res)
        if (res.success) {
          this.initData()
        }
      })
    },
    addCourse () {
      console.log(this.courseList)
      if (this.version.selLang === '') {
        this.$message({
          type: 'info',
          message: '请选择语种！'
        })
        return false
      }
      let obj = {
        type: 'add',
        selLang: this.version.selLang
      }
      this.$refs.edit.show(obj)
    },
    deleteCourse (id) {
      console.log(id)
      this.$confirm('此操作将永久删除该课程分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseDel({ uuid: id }).then(res => {
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
        let arr = []
        if (this.selCourseList.length) {
          this.selCourseList.forEach(i => {
            arr.push(i.code)
          })
        }
        onlineCourses({ onlineType: item.dbEnv, hasCourse: true, hasTags: false, courseCodes: arr }).then(res => {
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
    curCourse () {
      console.log(this.version.selLang)
      this.initData()
    },
    imageUrl (image) {
      let url = this.assetsDomain + image
      return url
    },
    select (selection, row) {
      this.selCourseList = selection
    },
    selectAll (selection) {
      this.selCourseList = selection
    },
    formatterCourseType (obj) {
      let desc = ''
      let ct = this.courseTypes.find(item => {
        return item.type === obj.course_type
      })
      if (ct) {
        desc = ct.name
      }
      return desc
    },
    classGroup (row) {
      this.$refs['classGroup'].show(row)
    },
    addDetail (row) {
      this.$refs['courseDetail'].show(row)
    },
    unlockCourse (row) {
      this.$refs['unlockCourse'].show(row)
    },
    handleStatistic (row) {
      this.$refs['statistic'].show(row)
    },
    refreshDownloadList () {
      this.showExportList()
      let timer = setInterval(() => {
        this.showExportList()
        if (this.exportNum === 0) {
          clearInterval(timer)
        }
      }, 5000)
    },
    formatDate (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm')
    },
    showExportList () {
      this.exportList = []
      exportCourseContentList({ code: this.version.selLang, pageNo: 0, pageSize: 999 }).then(res => {
        console.log(res)
        this.exportList = res.data.data.slice(0, 5)
        this.exportNum = this.exportList.filter(item => {
          return item.status !== 2
        }).length
      })
    },
    async handleDownload (row) {
      // window.location.href = process.env.VUE_APP_BASE_API + row.url
      let a = document.createElement('a')
      // 地址
      a.href = process.env.VUE_APP_BASE_API + row.url
      // 修改文件名
      a.download = row.url.slice(row.url.lastIndexOf('/') + 1)
      // 触发点击
      document.body.appendChild(a)
      a.click()
      // 移除
      setTimeout(() => {
        document.body.removeChild(a)
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  .course-manage {
    padding: 20px;
    overflow: auto;
  }
  .el-table {
    margin-top: 20px;
  }

  .right {
    float: right;
  }
  .btnAdd {
    width: 100px;
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
</style>
<style>
.course-table.el-table th>.cell {
  /* width: 100px!important; */
}
</style>
