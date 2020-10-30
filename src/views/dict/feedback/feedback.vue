<template>
  <div class="main-content sentence" ref="content" @scroll="handlerScroll">
    <div class="top-bar">
      <div class="left">
        <el-input placeholder="请输入描述" v-model="searchKey" @keyup.enter.native="handlerSearch" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
        </el-input>
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
        label="内容"
        prop="content"
        width="140px">
      </el-table-column>
      <el-table-column
        :filters="[{ text: '单词', value: 'word' }, { text: '句子', value: 'sentence' }]"
        :filter-method="filterRepType"
        label="分类">
        <template slot-scope="props">
          <el-tag v-if="props.row.repType == 'word'">单词</el-tag>
          <el-tag type="success" v-if="props.row.repType == 'sentence'">句子</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="300px"
        prop="desc">
      </el-table-column>
      <el-table-column
        width="300px"
        label="标签">
        <template slot-scope="props">
          <div class="tags">
            <div class="tag" v-for="item in props.row.tags.split('|')" :key="item">
              <el-tag type="info" size="small" v-if="item">{{ item }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="100px"
        :filters="[{ text: '未处理', value: 0 }, { text: '已处理', value: 1 }]"
        :filter-method="filterState"
        label="状态">
        <template slot-scope="props">
          <el-button size="small" :type="props.row.state == '0' ? 'warning' : 'success'" @click="handleState(props)">{{ props.row.state == '0' ? '未处理' : '已处理' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100px">
        <template slot-scope="scope">
          <el-button
            v-show="false"
            size="mini"
            @click="editCourse(scope.row)">编辑</el-button>
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            :disabled="scope.row.state == '1'"
            size="mini"
            @click="feedback(scope.row)">纠错</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-sentence ref="editSentence" />
    <edit-word ref="editWord" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

import {
  getFeedbackList,
  updateFeedback,
  getDictDetail,
  getSentenceDetail
} from '@/api/course'
import EditSentence from '../sentence/editSentence'
import EditWord from '../word/editWord'

let onlyOne = true
export default {
  data () {
    return {
      searchKey: '',
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
    EditSentence,
    EditWord
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
    })
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
      let res = await getFeedbackList({
        page_index: this.currentPage,
        page_size: this.pageSize,
        desc: this.searchKey,
        sort_type: -1,
        text_field: 'created_time'
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
      getSentenceDetail({ uuid: row.uuid, from: this.fromLang, to: this.toLang }).then(res => {
        let obj = {
          type: 'edit',
          fromLang: this.fromLang,
          form: res.data
        }
        this.$refs.edit.show(obj)
      })
    },
    feedback (row) {
      console.log(row)
      let fromLang = row.fromLang
      let toLang = row.toLang
      if (!row.repType) {
        this.$message({
          type: 'warning',
          message: '请先设置纠错分类'
        })
        return
      }

      if (!row.fromLang || !row.toLang) {
        this.$message({
          type: 'warning',
          message: '此条数据为垃圾数据'
        })
        return
      }

      if (row.repType === 'sentence') {
        getSentenceDetail({ uuid: row.conId, from: fromLang, to: toLang }).then(res => {
          let obj = {
            type: 'edit',
            fromLang: fromLang,
            toLang: toLang,
            form: res.data
          }
          this.$refs.editSentence.show(obj)
        })
      } else {
        getDictDetail({ uuid: row.conId, from: fromLang, to: toLang }).then(res => {
          let obj = {
            type: 'edit',
            fromLang: fromLang,
            toLang: toLang,
            form: res.data
          }
          this.$refs.editWord.show(obj)
        })
      }
    },
    handleState (props) {
      const row = props.row
      if (row.state === 0) {
        this.$confirm('确认是否已经处理过该条纠错记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateFeedback({ id: row.id, state: 1 }).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '更新成功'
              })
              this.list[props.$index]['state'] = 1
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    addCourse () {
      let obj = {
        type: 'add',
        fromLang: this.fromLang
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
      return obj && obj.createdTime ? moment(obj.createdTime).format('YYYY-MM-DD HH:mm') : ''
    },
    filterRepType (value, row) {
      return row.repType === value
    },
    filterState (value, row) {
      return row.state === value
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

  .tags {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .tag {
    margin: 5px;
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
