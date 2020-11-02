<template>
  <div class="main-content sentence" ref="content" @scroll="handlerScroll">
    <div class="top-bar">
      <div class="left">
        <el-input placeholder="请输入内容" v-model="searchKey" @keyup.enter.native="handlerSearch" class="input-with-select">
          <el-select v-model="selLang" slot="prepend" placeholder="请选择" @change="handlerSearch">
            <el-option label="英汉" value="ENG-CHI"></el-option>
          </el-select>
          <el-radio-group slot="append" v-model="searchType" @change="handlerSearch">
            <el-radio :label="0">精确搜索</el-radio>
            <el-radio :label="1">模糊搜索</el-radio>
          </el-radio-group>
        </el-input>
      </div>
      <div class="right">
        <el-button v-show="false"
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="addCourse">添加</el-button>
        <el-button
          style="outline:none;"
          type="success"
          class="btnAdd"
          @click="multipleHandler('online')">上线</el-button>
        <el-button
          style="outline:none;"
          type="warning"
          class="btnAdd"
          @click="multipleHandler('offline')">下线</el-button>
        <el-button
          style="outline:none;"
          type="danger"
          class="btnAdd"
          @click="multipleHandler('del')">删除</el-button>
      </div>
    </div>
    <el-table
      :data="list"
      @selection-change="handleSelectionChange"
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
        label="句子"
        prop="sentence">
      </el-table-column>
      <el-table-column
        label="更新时间"
        :formatter="formatterDate">
      </el-table-column>
      <el-table-column
        label="状态"
        prop="content">
        <template slot-scope="scope">
          <el-tag :type="scope.row.done ? 'success' : 'primary'">{{scope.row.done ? '已上线' : '未上线'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            @click="edit(scope.row)">编辑</el-button>
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            :type="scope.row.done ? 'warning' : 'success'"
            size="mini"
            plain
            @click="setState(scope.row, scope.$index)">{{scope.row.done ? '下线' : '上线'}}</el-button>
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            size="mini"
            type="danger"
            plain
            @click="deleteDict(scope.row, scope.$index)">删除</el-button>
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
  getSentenceDetail,
  dictOnline,
  dictOffline,
  dictDel
} from '@/api/course'
import EditSentence from './editSentence'

let onlyOne = true
export default {
  data () {
    return {
      searchKey: '',
      searchType: 1,
      selLang: 'ENG-CHI',
      multipleSelection: [],
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
        sentence: this.searchKey,
        from: this.fromLang,
        to: this.toLang,
        page_index: this.currentPage,
        page_size: this.pageSize,
        searchType: this.searchType,
        text_field: 'content',
        sort_type: 1
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
    edit (row) {
      getSentenceDetail({ uuid: row.uuid, from: this.fromLang, to: this.toLang }).then(res => {
        if (!res.data.uuid) {
          this.$message({
            type: 'warning',
            message: '此条数据为垃圾数据'
          })
          return false
        }
        let obj = {
          type: 'edit',
          fromLang: this.fromLang,
          toLang: this.toLang,
          form: res.data
        }
        this.$refs.edit.show(obj)
      })
    },
    addCourse () {
      let obj = {
        type: 'add',
        fromLang: this.fromLang
      }
      this.$refs.edit.show(obj)
    },
    formatterDate (obj) {
      return obj && obj.updatedOn ? moment(obj.updatedOn).format('YYYY-MM-DD HH:mm') : ''
    },
    setState (row, index) {
      const obj = {
        ctype: 'sentence',
        from: this.fromLang,
        to: this.toLang,
        uuids: [
          row.uuid
        ]
      }
      if (row.done) {
        // 下线操作
        dictOffline(obj).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '下线成功'
            })
            this.$set(this.list[index], 'done', !row.done)
          }
        })
      } else {
        // 上线操作
        dictOnline(obj).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '上线成功'
            })
            this.$set(this.list[index], 'done', !row.done)
          }
        })
      }
    },
    deleteDict (row, index) {
      this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dictDel({
          ctype: 'sentence',
          from: this.fromLang,
          to: this.toLang,
          uuid: [
            row.uuid
          ]
        }).then(res => {
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
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    multipleHandler (action) {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择列表'
        })
        return false
      }
      let uuids = []
      this.multipleSelection.map(item => {
        uuids.push(item.uuid)
      })
      console.log(uuids)
      const obj = {
        ctype: 'sentence',
        from: this.fromLang,
        to: this.toLang,
        uuids: uuids
      }
      switch (action) {
        case 'online':
          dictOnline(obj).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '上线成功'
              })
              this.initData()
            }
          })
          break
        case 'offline':
          dictOffline(obj).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '下线成功'
              })
              this.initData()
            }
          })
          break
        case 'del':
          this.$confirm('确认要删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            dictDel(obj).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
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
          break
        default:
          break
      }
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
      // width: 120px;
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
