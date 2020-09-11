<template>
  <div class="teacher-container">
    <div class="top-bar">
      <div class="left">
        <el-input v-model="title" placeholder="请输入活动主题" @change="loadData"></el-input>
      </div>
      <div class="right">
        <el-button type="primary" @click="createQRCode">创建</el-button>
      </div>
    </div>
    <el-table
      :data="list"
      stripe
      style="width: 100%">
      <el-table-column
        prop="created_on"
        :formatter="formatterDate"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="title"
        label="活动主题">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="160">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handlePreview(scope.row)" type="text" size="small">预览</el-button>
          <el-button @click="handleDownload(scope.row)" type="text" size="small">下载</el-button>
          <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :hide-on-single-page="isShowPagination"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <qrcode-add ref="qrcode" @loadData="loadData" />
    <el-dialog
      class="qrcode-dialog"
      title=""
      :visible.sync="dialogVisible"
      width="50%">
      <el-image :src="qrcodeUrl" fit="cover"></el-image>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="download">下载</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

import {
  qrCodeList,
  qrCodeDel,
  qrCodeImage
} from '@/api/course'

import QrcodeAdd from './qrCodeAdd'
export default {
  data () {
    return {
      title: '',
      list: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      isShowPagination: true,
      mp: 'http://dev.api.talkmate.com:82/qrcode/index.html',
      qrcodeUrl: '',
      dialogVisible: false
    }
  },
  components: {
    QrcodeAdd
  },
  mounted () {
    this.loadData()
  },
  methods: {
    formatterDate (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:ss')
    },
    loadData () {
      qrCodeList({
        page_index: this.currentPage,
        page_size: this.pageSize
      }).then(res => {
        console.log(res)
        if (res.success && res.data) {
          this.list = res.data
          this.total = this.list.length
          if (this.pageSize > this.total) {
            this.isShowPagination = true
          }
        } else {
          this.list = []
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.loadData()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.loadData()
    },
    createQRCode () {
      this.$refs['qrcode'].show({ flag: 'add' })
    },
    handleDownload (data) {
      qrCodeImage({ size: data.size, url: `${this.mp}?uuid=${data.uuid}` }).then(res => {
        console.log(res)
        this.qrcodeUrl = process.env.VUE_APP_BASE_API + '/' + res.data
        this.download()
      })
    },
    handlePreview (data) {
      console.log(process.env)
      console.log(process.env.VUE_APP_BASE_API)
      qrCodeImage({ size: data.size, url: `${this.mp}?uuid=${data.uuid}` }).then(res => {
        this.qrcodeUrl = process.env.VUE_APP_BASE_API + '/' + res.data
        this.dialogVisible = true
      })
    },
    download () {
      let a = document.createElement('a')
      // 地址
      a.href = this.qrcodeUrl
      // 修改文件名
      a.download = this.qrcodeUrl.slice(this.qrcodeUrl.lastIndexOf('/') + 1)
      // 触发点击
      document.body.appendChild(a)
      a.click()
      // 移除
      setTimeout(() => {
        document.body.removeChild(a)
      }, 1000)
    },
    handleEdit (data) {
      this.$refs['qrcode'].show({ flag: 'edit', data })
    },
    handleDel (data) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        qrCodeDel({ uuid: data.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: res.msg
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

.el-pagination {
  text-align: center;
  margin-top: 30px;
}

.dialog-footer {
  text-align: center;
}
</style>

<style>
.qrcode-dialog .el-dialog__body {
  text-align: center;
}
</style>
