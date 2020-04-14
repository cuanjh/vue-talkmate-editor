<template>
  <div class="live-container">
    <div class="top-bar">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加直播间</el-button>
    </div>
    <el-table
      :data="rooms"
      :row-key="getRowKey"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="live-courses">
            <div :class="['course', { 'notStarted': props.row.courses[index].state == 0, 'inClass': props.row.courses[index].state == 1 }]" v-for="(c, index) in props.row.courses" :key="c.uuid">
              <div class="course-column">{{ '第' + (index + 1) + '课'}}</div>
              <div class="course-column">{{ c.title }}</div>
              <div class="course-column">{{ formatCourseDate(c) }}</div>
              <div class="course-column">
                <el-select size="small" :disabled="props.row.courses[index].state == -1" v-model="props.row.courses[index].state" placeholder="请选择..." @change="changeCourseState(c)">
                  <el-option :label="'未开始'" :disabled="props.row.courses[index].state == 1" :value="0"></el-option>
                  <el-option :label="'上课中'" :value="1"></el-option>
                  <el-option :label="'已下课'" :disabled="props.row.courses[index].state == 0" :value="-1"></el-option>
                </el-select>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        width="450"
        label="直播间">
        <template slot-scope="scope">
          <div class="room-info">
            <el-image
              v-show="scope.row.room.cover_v2"
              style="width: 157px; height: 88px"
              :src="uploadfileDomain + scope.row.room.cover_v2"
              lazy
              fit="cover">
            </el-image>
            <div class="right">
              <div class="title">
                 {{ scope.row.room.module_name }}
              </div>
               <div class="date">
                {{ scope.row.room.liveInfo.startDate + ' 至 ' + scope.row.room.liveInfo.endDate + ' 共 ' + scope.row.courses.length + ' 课' }}
              </div>
              <div class="time">
                <span>每周</span>
                <span v-for="(w, index) in scope.row.room.liveInfo.weekDays" :key="w">{{ liveRate[w] + ((index != scope.row.room.liveInfo.weekDays.length - 1) ? '、' : '') }}</span>
                <span>{{ ' ' + scope.row.room.liveInfo.startTime.slice(0, 5) + ' - '  + scope.row.room.liveInfo.endTime.slice(0, 5)}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="进度">
        <template slot-scope="scope">
          {{ scope.row.courses.filter(item => {return item.state == -1 }).length + '课' + '/' +  scope.row.courses.length + '课'}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.room.published === 'N' ? 'primary' : 'success'">
            {{ scope.row.room.published === 'N' ? '未上架' : '已上架'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleOnline(scope.$index, scope.row)">上架</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleOffline(scope.$index, scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from 'moment'
import {
  getLiveList,
  onlineLive,
  offlineLive,
  delLive,
  onlineLiveCourse,
  offlineLiveCourse
} from '@/api/course'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      rooms: [],
      liveRate: {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
        '0': '日'
      },
      getRowKey (row) {
        return row.room.code
      },
      expandRowKeys: []
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    })
  },
  methods: {
    initData () {
      getLiveList({ pageNo: 0, pageSize: 9999 }).then(res => {
        this.rooms = res.data.rooms
      })
    },
    // 添加直播间路由跳转
    add () {
      this.$router.push({ name: 'live-edit', query: { flag: 'add' } })
    },
    // 编辑直播间路由跳转
    handleEdit (index, row) {
      localStorage.setItem('storage_liveRooms', JSON.stringify(row))
      this.$router.push({ name: 'live-edit', query: { flag: 'edit' } })
    },
    // 删除
    handleDelete (index, row) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delLive({ code: row.code }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: res.msg
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
    },
    // 上架
    handleOnline (index, row) {
      this.$confirm('确认要上架吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlineLive({ code: row.code }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        })
      })
    },
    // 下架
    handleOffline (index, row) {
      this.$confirm('确认要下架吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        offlineLive({ code: row.code }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })
      })
    },
    formatCourseDate (item) {
      let result = ''
      if (item.state === -1) {
        result += '上课时间'
      } else {
        result += '开始时间'
      }
      result += moment(new Date(item.date)).format('MM月DD日') + ' '
      let startTime = moment(new Date(item.startTime * 1000)).format('HH:mm')
      let endTime = moment(new Date(item.EndTime * 1000)).format('HH:mm')
      if (item.state === 1 || item.state === -1) {
        startTime = moment(new Date(item.realStartTime * 1000)).format('HH:mm')
      }
      if (item.state === -1) {
        endTime = moment(new Date(item.realEndTime * 1000)).format('HH:mm')
      }
      result += startTime + '—' + endTime
      return result
    },
    changeCourseState (course) {
      console.log(course)
      switch (course.state) {
        // 上课中
        case 1:
          onlineLiveCourse({ uuid: course.uuid }).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '设置成功'
              })
              this.initData()
            }
          })
          break
        // 已下课
        case -1:
          offlineLiveCourse({ uuid: course.uuid }).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '设置成功'
              })
              this.initData()
            }
          })
          break
        default:
          break
      }
    },
    expandChange (row, expandedRows) {
      this.expandChange = []
      expandedRows.forEach(item => {
        this.expandChange.push(item.room.code)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.live-container {
  flex: 1;
  overflow: auto;
}
.top-bar {
  margin: 20px 0;
  text-align: right;
}

.room-info {
  display: flex;
  flex-direction: row;
  .right {
    margin-left: 13px;
    display: flex;
    flex-direction: column;
    width: 217px;
    .title {
      font-size: 14px;
      color: #000000;
      font-weight: 500;
    }
    .date {
      margin-top: 7px;
      color: rgba(0, 0, 0, .6);
      font-size: 12px;
    }
    .time {
      color: rgba(0, 0, 0, .6);
      font-size: 12px;
    }
  }
}

.live-courses {
  display: flex;
  flex-direction: column;
  .course {
    display: flex;
    flex-direction: row;
    color: #000000;
    font-weight: 400;
    font-size: 12px;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    .course-column {
      &:nth-child(1) {
        font-size: 13px;
      }
      &:nth-child(2) {
        font-size: 14px;
      }
      &:nth-child(3) {
        font-size: 12px;
      }
      &:nth-child(4) {
        font-size: 14px;
      }
    }
  }
  .notStarted {
    color: rgba(0, 0, 0, .6);
  }
  .inClass {
    color:rgba(218,72,116,1);
  }
}
</style>
