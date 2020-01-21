<template>
  <div class="version-container">
    <div class="top-bar">
      <el-select v-model="selLang" filterable placeholder="请选择语种" @change="initCourseContentList">
        <el-option
          v-for="item in langList"
          :key="item['lan_code']"
          :label="item.title[locale]"
          :value="item['lan_code']">
        </el-option>
      </el-select>
      <el-select v-model="selCourseType" filterable placeholder="请选择课程分类"  @change="initCourseContentList">
        <el-option
          v-for="item in courseTypes"
          :key="item.type"
          :label="item.name"
          :value="item.type">
        </el-option>
      </el-select>
    </div>
    <div class="version-wrap">
      <div class="version-item create" @click="addVersion">
        <i class="el-icon-plus"></i>
        <span>创建新版本</span>
      </div>
      <div class="version-item" v-for="item in contents" :key="item.uuid" @click="switchVersion(item)">
        <div class="online-flag" v-show="item['is_show']">
          <span>线上</span>
        </div>
        <div class="content">
          <div class="title" v-text="item.name"></div>
          <ul>
            <!-- <li>创建时间：2018年6月1日</li> -->
            <li>最后修改时间：{{ item.update_time | formatDate('YYYY年MM月DD日') }}</li>
          </ul>
        </div>
        <div class="operate">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" circle @click="edit(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="上线" placement="top">
            <el-button type="success" :disabled="item.is_show" icon="el-icon-check" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下线" placement="top">
            <el-button type="warning" icon="el-icon-minus" circle></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" :disabled="item.is_show" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </div>
        <div class="operate-shade" v-show="false">
          <div class="desc">确定下架该版本吗？</div>
          <div class="btns">
            <span class="cancel">取消</span>
            <span class="ok">确定</span>
          </div>
        </div>
      </div>
    </div>
    <add-version ref="addVersion"/>
    <course-content :langList="langList" :courseTypes="courseTypes" :contents="contents" ref="content" />
  </div>
</template>

<script>
import AddVersion from './add'
import CourseContent from '../content/content'
import {
  getLangList,
  getCourseTypes,
  getCourseList,
  getCourseContentList
} from '@/api/course'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      langList: [],
      selLang: 'ENG',
      courseTypes: [],
      selCourseType: '',
      selCourse: null,
      contents: []
    }
  },
  components: {
    AddVersion,
    CourseContent
  },
  created () {
    this.getConfigInfo()
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale
    })
  },
  methods: {
    ...mapActions({
      getConfigInfo: 'course/getConfigInfo'
    }),
    async initData () {
      let langInfo = await getLangList({ 'pageNo': 0, 'pageSize': 999 })
      if (langInfo.success) {
        this.langList = langInfo.data.langs
      }
      let courseTypesInfo = await getCourseTypes()
      if (courseTypesInfo.success) {
        this.courseTypes = courseTypesInfo.data.types
        this.selCourseType = 0
      }
      this.initCourseContentList()
    },
    async initCourseContentList () {
      let courseListInfo = await getCourseList({ 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
      if (courseListInfo.success) {
        let courses = courseListInfo.data.courses
        this.selCourse = courses.find(item => {
          return item.course_type === this.selCourseType
        })
        console.log(this.selCourse)
      }
      if (this.selCourse) {
        let uuid = this.selCourse.uuid
        let courseContentInfo = await getCourseContentList({ 'pageNo': 0, 'pageSize': 0, 'parent_uuid': uuid })
        this.contents = courseContentInfo.data.contents.sort((a, b) => {
          return b['update_time'] - a['update_time']
        })
        console.log(this.contents)
      } else {
        this.contents = []
      }
    },
    switchVersion (version) {
    },
    addVersion () {
      this.$refs['addVersion'].show()
    },
    edit (item) {
      // this.$router.push({ path: '/course-content', query: { lang: 'ENG', project: 'pro', version: 1 } })
      this.$refs['content'].show({ lang: this.selLang, courseType: this.selCourseType, version: item.version, uuid: item.uuid })
    }
  }
}
</script>

<style lang="scss" scoped>
.version-container {
  .top-bar{
    margin-top: 20px;
  }
  .version-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  .version-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 240px;
    background: rgba($color: #000000, $alpha: 0.05);
    border-radius: 4px;
    margin: 15px;
    overflow: hidden;
    transition: all .3s ease;
    // cursor: pointer;
    // &:hover {
    //   box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    // }
    // &:active {
    //   box-shadow: 0px 9px 24px 0px rgba(0,0,0,0.12);
    // }
  }
  .create {
    text-align: center;
    display: flex;
    flex-direction: column;
    i {
      margin-top: 88px;
      font-size: 24px;
      color: #007AFF;
    }
    span {
      color: #000000;
      font-size: 16px;
      font-weight: 400;
      margin-top: 10px;
    }
  }
  .online-flag {
    position: absolute;
    border: 45px solid;
    border-color: transparent transparent #007AFF transparent;
    transform: rotate(-45deg) translateY(-70px) translateX(0px);
    span {
      position: absolute;
      width: 100px;
      margin-top: 23px;
      margin-left: -13px;
      font-size: 12px;
      font-weight: 400;
      color: #fff;
    }
  }
  .content {
    min-height: 174px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
    .title {
      padding-top: 16px;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      line-height:22px;
      color: #000;
    }
    ul {
      padding-top: 10px;
      padding-left: 30px;
      li {
        font-size: 12px;
        line-height:17px;
        font-weight: 400;
        color: #000;
        padding-top: 13px;
      }
    }
  }
  .operate {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    // transition: all .3s ease;
    // cursor: pointer;
    // &:hover {
    //   background: rgba(0,122,255,.05);
    // }
    // &:active {
    //   background: rgba(0,122,255,1);
    //   span {
    //     color: #fff;
    //   }
    // }
    // span {
    //   font-size: 14px;
    //   font-weight: 400;
    //   color: #007AFF;
    //   line-height: 20px;
    // }
  }
  .operate-shade {
    position: absolute;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.7);
    top: 0;
    .desc {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      line-height: 22px;
    }
    .btns {
      margin-top: 28px;
      .cancel {
        display: inline-block;
        width: 90px;
        height: 30px;
        background: #fff;
        border-radius: 4px;
        color: #007AFF;
        font-size: 14px;
        font-weight: 400;
        margin: 0 20px;
        line-height: 30px;
      }
      .ok {
        display: inline-block;
        width: 90px;
        height: 30px;
        background: #007AFF;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        margin: 0 20px;
        line-height: 30px;
      }
    }
  }
}

.el-select {
  margin-right: 20px;
}
</style>
