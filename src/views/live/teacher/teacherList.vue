<template>
  <div class="teacher-container">
    <div class="top-bar">
      <div class="left">
        <el-select v-model="selLang" filterable placeholder="请选择语种" @change="loadData">
          <el-option
            v-for="item in langs"
            :key="item.lan_code"
            :label="item.title['zh-CN']"
            :value="item.lan_code">
          </el-option>
        </el-select>
        <el-select v-model="selStatus" filterable placeholder="请选择认证状态" @change="loadData">
          <el-option
            v-for="item in status"
            :key="item.val"
            :label="item.label"
            :value="item.val">
          </el-option>
        </el-select>
        <el-input v-model="liveTeacherName" placeholder="请输入教师姓名" @change="loadData"></el-input>
      </div>
      <div class="right">
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
    </div>
    <el-table
      :data="teacherList"
      stripe
      style="width: 100%">
      <el-table-column
        label="头像">
        <template slot-scope="scope">
          <el-avatar :size="44" :src="scope.row.photo.indexOf('http') > -1 ? scope.row.photo : uploadfileDomain + scope.row.photo" fit="cover"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="real_name"
        label="真实姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="talkmate_id"
        label="全球说ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lan_code"
        label="语种"
        :formatter="formatterGender"
        width="180">
      </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        :formatter="formatterRole">
      </el-table-column>
      <el-table-column
        prop="own_langs"
        label="主修语言">
      </el-table-column>
      <el-table-column
        prop="course_number"
        label="课程数量">
      </el-table-column>
      <el-table-column
        prop="status"
        label="认证状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">待认证</el-tag>
          <el-tag type="warning" v-else-if="scope.row.status == 2">未通过</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 3">已认证</el-tag>
          <el-tag type="danger" v-else-if="scope.row.status == 4">已冻结</el-tag>
          <el-tag type="info" v-else>已创建</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button @click="handleApprove(scope.row)" type="text" size="small">审核</el-button>
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageRequest.pageNo"
        :page-sizes="pageSizes"
        :page-size="pageRequest.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageRequest.total">
      </el-pagination>
    </div>
    <approve-comp ref="approve" :langs="langs" @loadData="loadData" />
    <edit-teacher ref="edit" @loadData="loadData"/>
  </div>
</template>

<script>
import {
  getLangList,
  getTeacherList
} from '@/api/course'

import ApproveComp from './approve'
import EditTeacher from './editTeacher'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      langs: [],
      status: [
        { label: '未认证', val: 1 },
        { label: '未通过', val: 2 },
        { label: '已认证', val: 3 },
        { label: '已冻结', val: 4 }
      ],
      selLang: '',
      selStatus: '',
      liveTeacherName: '',
      teacherList: [],
      currentPage: 1,
      pageSize: 10,
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    ApproveComp,
    EditTeacher
  },
  mounted () {
    getLangList({ pageNo: 1, pageSize: 999 }).then(res => {
      console.log(res)
      if (res.success && res.data) {
        this.langs = res.data.list
      }
    })
    this.loadData()
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain,
      pageSizes: state => state.pageSizes
    })
  },
  methods: {
    formatterGender (row, column, cellValue, index) {
      let langs = []
      if (cellValue.length && this.langs.length) {
        cellValue.forEach(item => {
          let lang = this.langs.find(l => {
            return l.lan_code === item
          })
          langs.push(lang.title['zh-CN'])
        })
      }
      return langs.length ? langs.join('、') : ''
    },
    formatterRole (row, column, cellValue, index) {
      let roles = []
      if (cellValue && cellValue.split(',').length) {
        cellValue.split(',').forEach(item => {
          let desc = '直播'
          if (item === '2') {
            desc = '值班'
          }
          roles.push(desc)
        })
      }
      return roles.length ? roles.join('，') : ''
    },
    loadData () {
      getTeacherList({
        lan_code: this.selLang,
        real_name: this.liveTeacherName,
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize,
        status: this.selStatus ? this.selStatus : 0
      }).then(res => {
        console.log(res)
        if (res.success && res.data) {
          this.teacherList = res.data.list
          this.pageRequest.total = res.data.total
        } else {
          this.teacherList = []
          this.pageRequest.total = 0
          this.pageRequest.pageNo = 1
        }
      })
    },
    reset () {
      this.selLang = ''
      this.selStatus = ''
      this.liveTeacherName = ''
      this.loadData()
    },
    handleApprove (data) {
      this.$refs['approve'].show(data)
    },
    handleEdit (data) {
      this.$refs['edit'].show(data)
    },
    handleSizeChange (val) {
      this.pageRequest.pageSize = val
      this.loadData()
    },
    handleCurrentChange (val) {
      this.pageRequest.pageNo = val
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher-container {
  padding: 20px;
  flex: 1;
}

.el-select {
  width: 260px;
}

.top-bar {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  .left {
    display: flex;
    flex-direction: row;
  }
  .right {
    flex: 1;
    text-align: right;
  }
}
</style>
