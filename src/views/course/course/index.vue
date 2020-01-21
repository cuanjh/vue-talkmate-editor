<template>
  <div class="course-manage">
    <div class="top-bar">
      <el-select v-model="selLang" filterable placeholder="请选择语种">
        <el-option
          v-for="item in langList"
          :key="item['lan_code']"
          :label="item.title[locale]"
          :value="item['lan_code']">
        </el-option>
      </el-select>
      <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'" style="outline:none;" type="primary" class="btnAdd">添加</el-button>
    </div>
    <el-table
      :data="courseList"
      style="width: 100%;">
      <el-table-column
        label="序号"
        type="index">
      </el-table-column>
      <el-table-column
        label="课程分类">
        <template slot-scope="scope">
          {{scope.row.courseType == 0 ? 'PRO' : 'KID'}}
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
            :src="assetsDomain + scope.row.flag[0]"
            fit="fit">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="封面">
        <template slot-scope="scope">
          <el-image
            class="course-cover"
            :src="assetsDomain + scope.row.cover[0]"
            fit="fit">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="是否上线">
        <template slot-scope="scope">
          {{scope.row.is_show ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleEditContent(scope.$index, scope.row)">编辑课程内容</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import {
  getLangList,
  getCourseList
} from '@/api/course'

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
    handleEditContent (i, row) {
      console.log(i)
      console.log(row)
      this.$refs['content'].show(row)
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
  }

  .course-cover {
    width: 132px;
    height: 66px;
    border-radius: 4px;
  }
</style>
