<template>
  <div class="course-manage">
    <div class="top-bar">
      <el-select v-model="selLang" filterable placeholder="请选择语言">
        <el-option
          v-for="item in langList"
          :key="item.code"
          :label="item.text"
          :value="item.code">
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
        label="语言编码"
        prop="langCode">
      </el-table-column>
      <el-table-column
        label="课程分类">
        <template slot-scope="scope">
          {{scope.row.courseType == 0 ? 'PRO' : 'KID'}}
        </template>
      </el-table-column>
      <el-table-column
        label="课程编码"
        prop="courseCode">
      </el-table-column>
      <el-table-column
        label="课程名称">
        <template slot-scope="scope">
          <div v-for="l in interfaceLangs" :key="l.code">{{ l.text + ': ' +  scope.row.langObj[l.code] + ' ' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="图标">
        <template slot-scope="scope">
          <el-image
            class="course-flag"
            :src="scope.row.flag"
            fit="fit">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="封面">
        <template slot-scope="scope">
          <el-image
            class="course-cover"
            :src="scope.row.cover"
            fit="fit">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="是否上线">
        <template slot-scope="scope">
          {{scope.row.isShow ? '是' : '否'}}
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
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      langList: [
        {
          code: 'ENG',
          text: '英语'
        },
        {
          code: 'KOR',
          text: '韩语'
        }
      ],
      selLang: 'ENG',
      courseList: [{
        courseCode: 'ENG-Basic',
        langCode: 'ENG',
        courseType: 0,
        flag: 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4',
        cover: 'https://course-assets1.talkmate.com/course/covers/ENG-Basic-2x.webp?v=123',
        langObj: {
          'zh-cn': 'Pro课程',
          'en': 'Course Pro'
        },
        isShow: true
      },
      {
        courseCode: 'KEN-Basic',
        langCode: 'ENG',
        courseType: 3,
        flag: 'http://course-assets.talkmate.com/course/icons/KEN-3x.webp?v=4',
        cover: 'http://dev-assets.talkmate.com/course/coversV2/KEN-Basic-2x.webp?v=123',
        langObj: {
          'zh-cn': 'Mini课程',
          'en': 'Course Mini'
        },
        isShow: true
      }],
      isShow: false
    }
  },
  components: {
  },
  mounted () {
  },
  computed: {
    ...mapGetters('course', ['interfaceLangs']),
    ...mapGetters('user', ['userInfo'])
  },
  methods: {
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
