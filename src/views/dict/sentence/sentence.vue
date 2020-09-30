<template>
  <div class="main-content sentence" ref="content" @scroll="handlerScroll">
    <div class="top-bar">
      <div class="left">
        <el-input placeholder="请输入内容" v-model="searchKey" @keyup.enter.native="handlerSearch" class="input-with-select">
          <el-select v-model="selLang" slot="prepend" placeholder="请选择" @change="handlerSearch">
            <el-option label="英汉" value="ENG-CHI"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
        </el-input>
      </div>
      <div class="right">
        <el-button v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="addCourse">添加</el-button>
      </div>
    </div>
    <el-table
      :data="list"
      style="width: 100%;">
      <el-table-column
        width="60"
        label="序号"
        type="index">
      </el-table-column>
      <el-table-column
        label="单词"
        prop="content">
      </el-table-column>
      <el-table-column
        label="更新时间"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            @click="editCourse(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-sentence ref="edit" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

import {
  getSentenceList,
  getDictDetail
} from '@/api/course'
import EditSentence from './editSentence'

let onlyOne = true
export default {
  data () {
    return {
      searchKey: '',
      selLang: 'ENG-CHI',
      list: [],
      isShow: false,
      currentPage: 1,
      total: 0,
      pageSize: 50,
      scrollTop: 0,
      isShowPagination: false
    }
  },
  components: {
    EditSentence
    // CourseDetail,
    // UnlockCourse
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    }),
    fromLang () {
      return this.selLang.split('-')[0]
    },
    toLang () {
      return this.selLang.split('-')[1]
    }
  },
  methods: {
    handlerScroll (e) {
      if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight && onlyOne) {
        this.scrollTop = e.target.scrollHeight - e.target.offsetHeight
        onlyOne = false
        this.currentPage++
        this.initData()
      }
    },
    handlerSearch () {
      this.currentPage = 1
      this.initData()
    },
    async initData () {
      if (this.currentPage === 1) {
        this.list = []
      }
      let res = await getSentenceList({
        content: this.searchKey,
        from: this.fromLang,
        to: this.toLang,
        page_index: this.currentPage,
        page_size: this.pageSize
      })
      if (res.success && res.data) {
        let copy = this.list.slice()
        this.list = copy.concat(res.data)
        setTimeout(() => {
          this.$refs['content'].scrollTop = this.scrollTop
          onlyOne = true
        }, 0)
      }
    },
    editCourse (row) {
      getDictDetail({ uuid: row.uuid, from: this.fromLang, to: this.toLang }).then(res => {
        let obj = {
          type: 'edit',
          selFromLang: this.fromLang,
          form: res.data
        }
        this.$refs.edit.show(obj)
      })
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
    },
    addCourse () {
      let obj = {
        type: 'add',
        selFromLang: this.fromLang
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    curCourse () {
      this.initData()
    },
    imageUrl (image) {
      let url = this.assetsDomain + image
      return url
    },
    formatterDate (obj) {
      return obj && obj.updatedOn ? moment(obj.updatedOn).format('YYYY-MM-DD HH:mm') : ''
    },
    addDetail (row) {
      this.$refs['courseDetail'].show(row)
    },
    unlockCourse (row) {
      this.$refs['unlockCourse'].show(row)
    }
  }
}
</script>

<style scoped lang="scss">
  .main-content {
    padding: 20px;
    overflow: auto;
  }
  .el-table {
    margin-top: 20px;
  }

  .top-bar {
    display: flex;
    flex-direction: row;
    .left {
      flex: 1;
      padding-right: 20px;
    }
    .right {
      width: 120px;
    }
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
  .el-select .el-input {
    width: 130px;
  }

  .el-pagination {
    text-align: center;
    margin-top: 30px;
  }
</style>
<style lang="scss">
.sentence {
  .top-bar {
    .el-select .el-input {
      width: 130px;
    }
  }
}

.input-with-select {
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
