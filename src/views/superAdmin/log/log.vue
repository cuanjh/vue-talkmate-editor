<template>
  <div class="operate-log" id="operate-log">
    <el-row class="operate-params">
      <el-col :span="20">
        <el-date-picker
          v-model="operateDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        &nbsp;&nbsp;
        <el-select v-model="userUUID" filterable placeholder="请选择">
          <el-option
            v-for="item in userList"
            :key="item.uuid"
            :label="item.nickName"
            :value="item.uuid">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4" class="self-btns">
        <el-button type="primary" @click="search">查找</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="operateLogs"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="operate_date"
        label="操作日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="language"
        label="语言"
        width="180">
      </el-table-column>
      <el-table-column
        prop="course"
        width="150"
        label="课程">
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本">
      </el-table-column>
      <el-table-column
        width="250"
        prop="catalogs"
        label="目录">
      </el-table-column>
      <el-table-column
        prop="pattern"
        :formatter="formatPattern"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="mold"
        :formatter="formatMold"
        label="操作">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100px"
      >
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="detail(scope.row)"
            type="text"
            size="small">
            详情
          </el-button>
          <el-button
            @click.native.prevent="rollback(scope.row)"
            type="text"
            size="small">
            回滚
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <detail ref="detail" />
  </div>
</template>

<script>
import moment from 'moment'

import Detail from './detail'

import { getUserList } from '@/api/user'
import { findOperateLogList, rollbackOperateLog } from '@/api/course'
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      operateDate: '',
      userUUID: '',
      userList: [],
      pageNO: 1,
      pageSize: 15,
      operateLogs: []
    }
  },
  components: {
    Detail
  },
  mounted () {
    document.getElementById('operate-log').addEventListener('scroll', (e) => {
      this.scroll(e)
    })
    this.getContentTypeList({ pageNo: 0, pageSize: 0 })
    getUserList({ page: 1, pageSize: 999 }).then(res => {
      if (res.success) {
        this.userList = res.data.userList
      }
    })
  },
  computed: {
    ...mapState({
      courseOperateLogs: state => state.course.courseOperateLogs
    })
  },
  methods: {
    ...mapActions({
      getContentTypeList: 'course/getContentTypeList'
    }),
    search () {
      this.operateLogs = []
      this.pageNO = 1
      this.findLog()
    },
    findLog () {
      let message = ''
      if (!message && !this.operateDate) {
        message = '请选择要查找的日期区间'
      }
      if (!message && !this.userUUID) {
        message = '请选择用户'
      }
      if (message) {
        this.$message({
          type: 'warning',
          message: message
        })
        return false
      }
      let obj = {
        page_no: this.pageNO,
        page_size: this.pageSize,
        user_id: this.userUUID,
        operate_date: {
          start: moment(this.operateDate[0]).format('YYYY-MM-DD') + ' 00:00:00',
          end: moment(this.operateDate[1]).format('YYYY-MM-DD') + ' 23:59:59'
        }
      }
      findOperateLogList(obj).then(res => {
        if (res.success && res.data.operate_log && res.data.operate_log.length) {
          this.operateLogs = this.operateLogs.concat(res.data.operate_log)
        } else {
          this.pageNO = -1
        }
      })
    },
    formatPattern (row, column, cellValue, index) {
      let ret = ''
      switch (row.pattern) {
        case 1:
          ret = '内容'
          break
        default:
          ret = '目录'
          break
      }
      return ret
    },
    formatMold (row, column, cellValue, index) {
      let ret = ''
      let obj = this.courseOperateLogs.find(ol => {
        return ol.key === row.mold
      })
      if (obj) {
        ret = obj['name']
      }
      return ret
    },
    detail (row) {
      this.$refs['detail'].show(row)
    },
    scroll (e) {
      let scrollHeight = e.target.scrollHeight
      let offsetHeight = e.target.offsetHeight
      let scrollTop = e.target.scrollTop
      if (offsetHeight + scrollTop + 10 > scrollHeight && this.pageNO !== -1) {
        this.pageNO++
        this.findLog()
      }
    },
    rollback (row) {
      console.log(row)
      this.$confirm('确认要回滚吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await rollbackOperateLog({ uuid: row.uuid })
        if (res.success) {
          this.$message({ type: 'success', message: '回滚成功' })
          // this.search()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回滚'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.operate-log {
  overflow-y: auto;
}
.operate-params {
  padding-top: 10px;
  padding-bottom: 20px;
}

.self-btns {
  text-align: right;
}
</style>
