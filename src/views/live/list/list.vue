<template>
  <div class="live-container">
    <div class="top-bar">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加直播间</el-button>
    </div>
    <el-table
      :data="rooms"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
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
              v-show="scope.row.cover_v2"
              style="width: 157px; height: 88px"
              :src="domain + scope.row.cover_v2"
              lazy
              fit="cover">
            </el-image>
            <div class="right">
              <div class="title">
                 {{ scope.row.module_name }}
              </div>
              <div class="date">
                {{ scope.row.liveInfo.startDate + ' 至 ' + scope.row.liveInfo.endDate + ' 共' + scope.row.courses.length + '课' }}
              </div>
              <div class="time">
                <span>每周</span>
                <span v-for="(w, index) in scope.row.liveInfo.weekDays" :key="w">{{ liveRate[w] + ((index != scope.row.liveInfo.weekDays.length - 1) ? '、' : '') }}</span>
                <span>{{ ' ' + scope.row.liveInfo.startTime.slice(0, 5) + ' - '  + scope.row.liveInfo.endTime.slice(0, 5)}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="进度">
        <template slot-scope="scope">
          {{ '0课' + '/' +  scope.row.courses.length + '课'}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.published === 'N' ? 'primary' : 'success'">
            {{ scope.row.published === 'N' ? '未上架' : '已上架'}}
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
// import moment from 'moment'
import {
  getConfigInfo,
  getLiveList,
  onlineLive,
  offlineLive,
  delLive
} from '@/api/course'

export default {
  data () {
    return {
      domain: '',
      rooms: [],
      liveRate: {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
        '0': '日'
      }
    }
  },
  created () {
    getConfigInfo().then(res => {
      this.domain = res.data.assetsDomain + '/'
    })
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      getLiveList({ pageNo: 0, pageSize: 9999 }).then(res => {
        this.rooms = res.data.rooms
        localStorage.setItem('storage_liveRooms', JSON.stringify(this.rooms))
      })
    },
    // 添加直播间路由跳转
    add () {
      this.$router.push({ name: 'live-edit', query: { flag: 'add' } })
    },
    // 编辑直播间路由跳转
    handleEdit (index, row) {
      this.$router.push({ name: 'live-edit', query: { flag: 'edit', code: row.code } })
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

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
