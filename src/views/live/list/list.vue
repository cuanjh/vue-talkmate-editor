<template>
  <div class="live-container">
    <div class="top-bar">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加直播间</el-button>
    </div>
    <el-table
      :data="rooms.filter(data => !search || data.room.module_name.toLowerCase().includes(search.toLowerCase()))"
      :row-key="getRowKey"
      :expand-row-keys="expandRowKeys"
      @expand-change="expandChange"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="live-courses">
            <el-row :gutter="5" :class="['course', { 'notStarted': props.row.courses[index].state == 0, 'inClass': props.row.courses[index].state == 1 }]" v-for="(c, index) in props.row.courses" :key="c.uuid">
              <el-col :span="1" class="course-column">{{ '第' + (index + 1) + '课'}}</el-col>
              <el-col :span="5" class="course-column">{{ c.title }}</el-col>
              <el-col :span="4" class="course-column">{{ formatCourseDate(c) }}</el-col>
              <el-col :span="4" class="course-column">
                <el-select size="small" :disabled="props.row.courses[index].state == -1" v-model="props.row.courses[index].state" placeholder="请选择..." @change="changeCourseState(c, props.row.courses, props.row, index)">
                  <el-option :label="'未开始'" :disabled="props.row.courses[index].state == 1" :value="0"></el-option>
                  <el-option :label="'上课中'" :value="1"></el-option>
                  <el-option :label="'已下课'" :disabled="props.row.courses[index].state == 0" :value="-1"></el-option>
                </el-select>
              </el-col>
              <el-col :span="10" class="course-column">
                <el-row>
                  <el-button type="primary" size="small" :disabled="props.row.courses[index].state !== 1" class="btnPushLink" @click="publishComment(c)">发表评论</el-button>
                  <el-button type="primary" size="small" :disabled="props.row.courses[index].state === 0" class="btnPushLink" @click="getComments(c)">评论列表</el-button>
                  <el-button type="primary" size="small" :disabled="props.row.courses[index].state == -1" class="btnPushLink" @click="refreshLink(c)">刷新推流</el-button>
                  <el-tooltip class="item" effect="dark" :content="c.livePushUrl" placement="top">
                    <el-button type="primary" size="small" :disabled="c.livePushUrl == '' || props.row.courses[index].state == -1" class="btnPushLink" @click="copyLink(c)">复制推流</el-button>
                  </el-tooltip>
                  <el-button type="primary" size="small" class="btnPushLink" @click="editLiveCourse(c)">编辑</el-button>
                </el-row>
              </el-col>
            </el-row>
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
              style="width: 157px; height: 88px; border-radius: 5px;"
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
      <el-table-column label="操作" width="380" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索" :data-scope="scope"/>
        </template>
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
          <el-button
            size="mini"
            type="primary"
            @click="handleShare(scope.$index, scope.row)">分享海报</el-button>
        </template>
      </el-table-column>
    </el-table>
    <share ref="share" @initData="initData" />
    <comment ref="comment" @initData="initData" />
    <comment-list ref="commentList" />
    <edit-course ref="editCourse" @initData="initData"  />
  </div>
</template>

<script>
import moment from 'moment'
import Clipboard from 'clipboard'
import Share from './share'
import Comment from './comment'
import CommentList from './commentList'
import EditCourse from './editCourse'

import {
  getLiveList,
  onlineLive,
  offlineLive,
  delLive,
  onlineLiveCourse,
  offlineLiveCourse,
  getLivePushUrl
} from '@/api/course'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      rooms: [],
      search: '',
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
  components: {
    Share,
    Comment,
    CommentList,
    EditCourse
  },
  mounted () {
    this.getMajia()
    this.initData()
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    })
  },
  methods: {
    ...mapActions({
      getMajia: 'course/getMajia'
    }),
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
        delLive({ code: row.room.code }).then(res => {
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
        onlineLive({ code: row.room.code }).then(res => {
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
        offlineLive({ code: row.room.code }).then(res => {
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
    // 分享海报
    handleShare (index, row) {
      this.$refs['share'].show(row)
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
    changeCourseState (course, courses, row, index) {
      switch (course.state) {
        // 上课中
        case 1:
          let rowIndex = this.rooms.findIndex(r => {
            return r.room.code === course.courseCode
          })
          let arr = courses.filter(item => {
            return item.state === 1
          })
          if (arr.length >= 2) {
            this.$message({
              type: 'warning',
              message: '请先设置该直播间其他课程为已下课状态，再设置该课程'
            })
            this.rooms[rowIndex].courses[index].state = 0
            return false
          }
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
    },
    // 刷新推流链接
    refreshLink (c) {
      getLivePushUrl({ uuid: c.uuid }).then(res => {
        if (res.success) {
          this.initData()
        }
      })
    },
    // 复制推流链接
    copyLink (c) {
      let url = c.livePushUrl
      let clipboard = new Clipboard('.btnPushLink', {
        text: () => {
          return url
        }
      })
      clipboard.on('success', e => {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      })
      clipboard.on('error', e => {
        this.$message({
          type: 'error',
          message: '复制失败'
        })
        clipboard.destroy()
      })
    },
    // 发表评论
    publishComment (c) {
      this.$refs['comment'].show(c)
    },
    getComments (c) {
      this.$refs['commentList'].show(c)
    },
    editLiveCourse (c) {
      console.log(c)
      this.$refs['editCourse'].show(c)
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
    // justify-content: space-between;
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
