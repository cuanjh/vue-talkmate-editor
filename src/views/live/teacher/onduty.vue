<template>
  <div class="onduty-container">
    <div class="top-bar">
      <div class="left">
        <el-select v-model="selTeacher" filterable placeholder="请选择值班老师" @change="loadData">
          <el-option
            v-for="item in teachers"
            :key="item.user_id"
            :label="item.live_nickname"
            :value="item.user_id">
          </el-option>
        </el-select>
      </div>
      <div class="right">
        <el-button type="primary" @click="add">添加</el-button>
      </div>
    </div>
    <el-calendar v-model="calendarVal">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template
        slot="dateCell"
        slot-scope="{date, data}">
        <p>{{date.getDate()}}</p>
        <div class="item" v-for="item in calendarData[data.day]" :key="item.uuid">
          <img :src="item.url" @click="edit(item)" />
          <div @click="edit(item)">
            <p>{{item.liveNickname}}</p>
            <p>{{item.range }}</p>
          </div>
          <i class="el-icon-circle-close" @click="del(item.uuid)"></i>
        </div>
      </template>
    </el-calendar>
    <add-comp ref="add" @loadData="loadData"/>
  </div>
</template>

<script>
import moment from 'moment'
import {
  getTeacherList,
  getAttendances,
  delAttendance
} from '@/api/course'
import AddComp from './addOnduty'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selTeacher: '',
      calendarVal: new Date(),
      teachers: [],
      list: []
    }
  },
  components: {
    AddComp
  },
  mounted () {
    this.teachers = []
    getTeacherList({
      page_index: 1,
      page_size: 1000
    }).then(res => {
      console.log(res)
      if (res.data && res.data.length > 0) {
        res.data.forEach(item => {
          if ((item.role + ',').indexOf('2,') > -1) {
            this.teachers.push(item)
          }
        })
      }
    })
    this.loadData()
  },
  watch: {
    calendarVal (newVal, oldVal) {
      this.loadData()
    }
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    }),
    calendarData () {
      let obj = {}
      this.list.forEach(item => {
        obj[item.date] = this.dayOndutys(item.date)
      })
      return obj
    }
  },
  methods: {
    loadData () {
      this.list = []
      let year = this.calendarVal.getFullYear()
      let month = this.calendarVal.getMonth() + 1
      let days = new Date(year, month, 0).getDate()
      console.log(year, month, days)
      getAttendances({
        userId: this.selTeacher,
        startDate: `${year}-${month < 9 ? '0' + month : month}-01`,
        endDate: `${year}-${month < 9 ? '0' + month : month}-${days}`
      }).then(res => {
        if (res.success && res.data && res.data.length > 0) {
          this.list = res.data
        }
      })
    },
    add () {
      this.$refs['add'].show({
        flag: 'add',
        teachers: this.teachers
      })
    },
    edit (item) {
      let f = this.list.find(i => {
        return i.uuid === item.uuid
      })
      this.$refs['add'].show({
        flag: 'edit',
        info: f,
        teachers: this.teachers
      })
    },
    del (uuid) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAttendance({ uuid: uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.loadData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    dayOndutys (day) {
      let arr = []
      if (this.list && this.list.length > 0) {
        let result = this.list.filter(item => {
          return item.date === day
        })
        if (result && result.length > 0) {
          result.forEach(r => {
            if (r.userId && this.teachers.length > 0) {
              let teacher = this.teachers.find(t => {
                return t.user_id === r.userId
              })
              if (teacher) {
                console.log(r)
                arr.push({
                  url: this.uploadfileDomain + teacher.photo,
                  liveNickname: teacher.live_nickname,
                  range: moment(r.startTime * 1000).format('HH:mm:ss').slice(0, 5) + ' - ' + moment(r.EndTime * 1000).format('HH:mm:ss').slice(0, 5),
                  uuid: r.uuid
                })
              }
            }
          })
        }
      }
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.onduty-container {
  padding: 20px;
  flex: 1;
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

.is-selected {
  color: #1989FA;
}
</style>

<style lang="scss">
.el-calendar-day {
  .item {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px;
    margin: 4px;
    border: 1px solid rgba($color: #000000, $alpha: .1);
    border-radius: 4px;
    img {
      width: 30px;
      height: 30px;
      object-fit: cover;
      border-radius: 50%;
      margin-right: 5px;
    }
    p {
      font-size: 12px !important;
    }
    i {
      position: absolute;
      right: 3px;
      top: 3px;
      margin-left: 5px;
      &:hover {
        color: red;
      }
    }
  }
}

.el-calendar-table .el-calendar-day {
  min-height: 85px;
  height: auto;
}
</style>
