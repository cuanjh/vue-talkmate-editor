<template>
  <div class="course-manage">
    <div class="top-bar">
      <el-select v-model="selLang"
        filterable placeholder="请选择语种"
        @change="curCourse">
        <el-option
          v-for="item in langList"
          :key="item['lan_code']"
          :label="item.title[locale]"
          :value="item['lan_code']">
        </el-option>
      </el-select>
      <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
        style="outline:none;"
        type="primary"
        class="btnAdd"
        :disabled="courseList && courseList.length == 2"
        @click="addCourse">添加</el-button>
    </div>
    <el-table
      class="course-table"
      :data="courseList"
      style="width: 100%;">
      <el-table-column
        label="序号"
        type="index">
      </el-table-column>
      <el-table-column
        label="课程分类">
        <template slot-scope="scope">
          {{scope.row.course_type == 0 ? 'PRO' : 'KID'}}
        </template>
      </el-table-column>
      <el-table-column
        label="课程编码"
        prop="code">
      </el-table-column>
      <el-table-column
        label="课程名称">
        <template slot-scope="scope">
          <div v-for="l in langInfos" :key="l.langKey">{{ l.name + ': ' +  scope.row.title['' + l.langKey + ''] + ' ' }}</div>
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
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            @click="editCourse(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.row)">{{scope.row.is_show ? '隐藏' : '显示'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-comp ref="edit"
      :courseTypes="courseTypes"
      @addNewCourse="addNewCourse"/>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import {
  getLangList,
  getCourseList,
  courseEdit
} from '@/api/course'
import EditComp from './edit'

export default {
  data () {
    return {
      langList: [],
      selLang: 'ENG',
      courseList: [],
      isShow: false
    }
  },
  components: {
    EditComp
  },
  created () {
    this.getConfigInfo()
    this.getCourseTypes()
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos,
      locale: state => state.course.locale,
      courseTypes: state => state.course.courseTypes
    })
  },
  methods: {
    ...mapActions({
      getConfigInfo: 'course/getConfigInfo',
      getCourseTypes: 'course/getCourseTypes'
    }),
    addNewCourse () {
      this.initData()
    },
    async initData () {
      let langInfo = await getLangList({ 'pageNo': 0, 'pageSize': 999 })
      if (langInfo.success) {
        this.langList = langInfo.data.langs
      }

      let courseListInfo = await getCourseList({ 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
      if (courseListInfo.success) {
        this.courseList = courseListInfo.data.courses
      }
    },
    editCourse (row) {
      console.log(this.courseList)
      let obj = {
        type: 'edit',
        selLang: this.selLang,
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
      let obj = {
        type: 'add',
        selLang: this.selLang
      }
      this.$refs.edit.show(obj)
    },
    curCourse () {
      console.log(this.selLang)
      this.initData()
    },
    imageUrl (image) {
      let url = this.assetsDomain + image
      return url
    }
  }
}
</script>

<style scoped lang="scss">
  .course-manage {
    padding: 20px;
  }
  .el-table {
    margin-top: 20px;
  }

  .btnAdd {
    float: right;
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
  width: 100px!important;
}
</style>
