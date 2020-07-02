<template>
  <el-dialog title="评论列表" :visible.sync="dialogTableVisible" width="70%">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入要查找的内容"
          prefix-icon="el-icon-search"
          @change="search"
          v-model="searchKey">
        </el-input>
      </el-col>
      <el-col :span="9" :offset="3">
        <el-button type="primary" @click="addGag">添加禁言</el-button>
        <el-button type="primary" @click="removeGag">移除禁言</el-button>
      </el-col>
    </el-row>
    <el-table :data="comments" height="500" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="用户头像" width="80">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 50px; border-radius: 50%" :src="scope.row.photo.indexOf('http') > -1 ? scope.row.photo : ('https://uploadfile1.talkmate.com/' + scope.row.photo)" fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="姓名"></el-table-column>
      <el-table-column prop="comment" label="评论内容" width="250"></el-table-column>
      <el-table-column prop="comment_time" :formatter="formatDate" label="评论时间" width="180"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="isMajia" label="是否马甲"
        width="90"
        :filters="[{ text: '是', value: true }, { text: '否', value: false }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isMajia ? 'primary' : 'success'"
            disable-transitions>{{ scope.row.isMajia ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isGag" label="是否禁言">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isGag ? 'warning' : 'success'"
            disable-transitions>{{ scope.row.isGag ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="coins" label="打赏金币"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {
  getChartroomComments,
  addLiveGag,
  removeLiveGag
} from '@/api/course'
import moment from 'moment'
export default {
  data () {
    return {
      uuid: '',
      comments: [],
      copyComments: [],
      searchKey: '',
      multipleSelection: [],
      userIds: [],
      dialogTableVisible: false
    }
  },
  methods: {
    show (c) {
      console.log(c)
      this.uuid = c.uuid
      this.searchKey = ''
      this.multipleSelection = []
      this.userIds = []
      this.initData()
      this.dialogTableVisible = true
    },
    initData () {
      getChartroomComments({ uuid: this.uuid }).then(res => {
        this.copyComments = res.data.comments
        if (this.searchKey) {
          this.comments = this.copyComments.filter(item => {
            return item.nickname.indexOf(this.searchKey) > -1 || item.comment.indexOf(this.searchKey) > -1
          })
        } else {
          this.comments = this.copyComments
        }
        console.log(res)
      })
    },
    formatDate (row, column, cellValue, index) {
      let val = ''
      if ((cellValue + '').length === 19) {
        val = cellValue / 1000000
      } else {
        val = cellValue * 1000
      }
      return moment(new Date(val)).format('YYYY-MM-DD HH:mm:ss')
    },
    filterTag (value, row) {
      return row.isMajia === value
    },
    search () {
      if (this.searchKey) {
        this.comments = this.copyComments.filter(item => {
          return item.nickname.indexOf(this.searchKey) > -1 || item.comment.indexOf(this.searchKey) > -1
        })
      } else {
        this.comments = this.copyComments
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.userIds = []
      val.forEach(item => {
        this.userIds.push(item.user_id)
      })
      this.userIds = [...new Set(this.userIds)]
      console.log(this.multipleSelection)
      console.log(this.userIds)
    },
    addGag () {
      if (this.userIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择评论列表'
        })
        return false
      }
      addLiveGag({
        courseUUID: this.uuid,
        userIds: this.userIds
      }).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.initData()
        }
      })
    },
    removeGag () {
      if (this.userIds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择评论列表'
        })
        return false
      }
      removeLiveGag({
        courseUUID: this.uuid,
        userIds: this.userIds
      }).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.initData()
        }
      })
    }
  }
}
</script>
