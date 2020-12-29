<template>
  <div class="main-content word" ref="content" @scroll="handlerScroll">
    <div class="top-bar">
      <div class="left">
        <el-input placeholder="请输入内容" v-model="searchKey" @keyup.enter.native="handlerSearch" class="input-with-select">
          <el-select v-model="selLang" slot="prepend" placeholder="请选择" @change="handlerSearch" filterable>
            <el-option v-for="lang in langList" :key="lang.lan_code" :label="lang.title['zh-CN']" :value="lang.lan_code"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handlerSearch"></el-button>
        </el-input>
      </div>
      <div class="right">
        <el-button
          style="outline:none;"
          type="primary"
          class="btnAdd"
          @click="add">添加</el-button>
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
        label="头像">
        <template slot-scope="scope">
          <el-avatar shape="circle" fit="cover" :src="assetsDomain + scope.row.photo"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="声优名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="分组"
        prop="role">
      </el-table-column>
      <el-table-column
        label="国籍"
        prop="country">
      </el-table-column>
      <el-table-column
        label="城市"
        prop="city">
      </el-table-column>
      <el-table-column
        label="性别"
        :formatter="formatterGender">
      </el-table-column>
      <el-table-column
        label="语言"
        :formatter="formatterLang">
      </el-table-column>
      <el-table-column
        label="声音特点"
        prop="feature">
      </el-table-column>
      <!-- <el-table-column
        label="状态"
        prop="content">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'primary' : 'success' ">{{scope.row.status === 0 ? '未上线' : '已上线'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="240px" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            :disabled="scope.row.status === 1 ? true : false"
            size="mini"
            type="info"
            plain
            @click="edit(scope.row)">编辑</el-button>
          <el-button
            v-show="false"
            :type="scope.row.status ? 'warning' : 'success'"
            size="mini"
            plain
            @click="setState(scope.row, scope.$index)">{{scope.row.status ? '下线' : '上线'}}</el-button>
          <el-button
            v-show="userInfo.authority.authorityId == '1' || userInfo.authority.authorityId == '2'"
            :disabled="scope.row.status === 1 ? true : false"
            size="mini"
            type="danger"
            plain
            @click="deleteDict(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-comp ref="edit" @initData="handlerSearch"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import {
  getLangList,
  getVoiceActorList,
  findOneVoiceActor,
  updateVoiceActor,
  delVoiceActor
} from '@/api/course'
import EditComp from './vaEdit'

let onlyOne = true
export default {
  data () {
    return {
      searchKey: '',
      searchType: 0,
      selLang: 'ENG',
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
    EditComp
  },
  created () {
    getLangList({ 'pageNo': 0, 'pageSize': 999 }).then(res => {
      const langList = res.data.langs.sort((a, b) => {
        return b.is_hot - a.is_hot
      })
      this.$store.commit('course/updateLangList', langList)
    })
    this.initData()
  },
  mounted () {
  },
  computed: {
    ...mapGetters('user', ['userInfo']),
    ...mapState({
      langList: state => state.course.langList,
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
      let res = await getVoiceActorList({
        name: this.searchKey,
        lang: this.selLang,
        page_index: this.currentPage,
        page_size: this.pageSize
        // ,
        // text_field: 'role',
        // sort_type: 1
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
      findOneVoiceActor({ uuid: row.uuid }).then(res => {
        let obj = {
          type: 'edit',
          form: res.data
        }
        this.$refs.edit.show(obj)
      })
    },
    setState (row, index) {
      let obj = row
      obj['status'] = row.status ? 0 : 1
      updateVoiceActor(obj).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: obj.status === 1 ? '上线成功' : '下线成功'
          })
          this.$set(this.list[index], 'status', obj['status'])
        }
      })
    },
    add () {
      let obj = {
        type: 'add'
      }
      this.$refs.edit.show(obj)
    },
    deleteDict (row, index) {
      this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delVoiceActor({
          uuid: row.uuid
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
    formatterGender (obj) {
      return obj.gender === 1 ? '男' : '女'
    },
    formatterLang (obj) {
      const langObj = this.langList.find(item => {
        return item.lan_code === obj.lang
      })
      return langObj['title']['zh-CN']
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
.word {
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
