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
        <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="addCourse">添加</el-button>
        <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
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
        label="课程名称">
        <template slot-scope="scope">
          <div v-for="l in langInfos" :key="l.langKey">{{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="图标">
        <template slot-scope="scope">
          <el-image
            class="course-flag"
            :src="imageUrl(scope.row.flag[0]) | urlFix('imageView2/1/format/jpg')"
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
            :src="imageUrl(scope.row.cover[0]) | urlFix('imageView2/1/format/jpg')"
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
      <el-table-column label="操作" fixed="right" width="260px">
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
          <br><br>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="classGroup(scope.row)">班级群</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="addDetail(scope.row)">添加详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-comp ref="edit"
      :courseTypes="courseTypes"
      @addNewCourse="initData"/>
    <class-group ref="classGroup" />
    <course-detail ref="courseDetail" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import {
  getCourseList,
  courseEdit,
  courseDel,
  onlineCourses
} from '@/api/course'
import EditComp from './edit'
import ClassGroup from './classGroup'
import CourseDetail from './editCourseDetail'

export default {
  data () {
    return {
      courseList: [],
      selCourseList: [],
      isShow: false
    }
  },
  components: {
    EditComp,
    ClassGroup,
    CourseDetail
  },
  created () {
    this.getLangList({ 'pageNo': 0, 'pageSize': 999 }).then(() => {
      this.initData()
    })
    this.getCourseTypes()
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
      let courseListInfo = await getCourseList({ 'lan_code': this.version.selLang, 'pageNo': 0, 'pageSize': 0 })
      if (courseListInfo.success) {
        this.courseList = courseListInfo.data.courses
      }
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
    onlineCourse (id) {
      console.log(id)
      this.$confirm('确定要上线吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arr = []
        if (this.selCourseList.length) {
          this.selCourseList.forEach(item => {
            arr.push(item.code)
          })
        }
        onlineCourses(arr).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '上线成功!'
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
</style>
<style>
.course-table.el-table th>.cell {
  /* width: 100px!important; */
}
</style>
