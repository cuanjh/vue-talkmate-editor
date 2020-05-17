<template>
  <el-dialog title="评论列表" :visible.sync="dialogTableVisible" width="70%">
    <el-table :data="comments" height="500">
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
        :filters="[{ text: '是', value: true }, { text: '否', value: false }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isMajia ? 'primary' : 'success'"
            disable-transitions>{{ scope.row.isMajia ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="coins" label="打赏金币"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import {
  getChartroomComments
} from '@/api/course'
import moment from 'moment'
export default {
  data () {
    return {
      comments: [],
      dialogTableVisible: false
    }
  },
  methods: {
    show (c) {
      console.log(c)
      getChartroomComments({ uuid: c.uuid }).then(res => {
        this.comments = res.data.comments
        console.log(res)
      })
      this.dialogTableVisible = true
    },
    formatDate (row, column, cellValue, index) {
      return moment(new Date(cellValue * 1000)).format('YYYY-MM-DD HH:mm:ss')
    },
    filterTag (value, row) {
      return row.isMajia === value
    }
  }
}
</script>
