<template>
  <el-dialog
    title="课件"
    :visible.sync="dialogVisible"
    width="80%">
    <div class="operate">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="changeUploadFile"
        :auto-upload="false"
        :show-file-list="false"
        :multiple="false">
        <el-button type="primary" icon="el-icon-upload" size="small">上传课件</el-button>
      </el-upload>
    </div>
    <el-table
      :data="courseFiles"
      style="width: 100%">
      <el-table-column
        label="文件名称"
        width="250">
        <template slot-scope="scope">
          <span class="file-title"><i :class="{'ppt': scope.row.title.indexOf('ppt') > -1, 'word': scope.row.title.indexOf('doc') > -1, 'mp4': scope.row.title.indexOf('mp4') > -1}"></i>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="页数">
        <template slot-scope="scope">
          {{ scope.row.event_data ? scope.row.event_data.pages : 0 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        :formatter="formatterFileSize">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="delFile(scope.row)">删除</el-button>
          <el-button type="text" :disabled="!(scope.row.event_data && scope.row.event_data.result_url)" @click="preview(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import {
  getInfoTokenUploadFile,
  getCourseFiles,
  createFileTranscode,
  describeFileTranscode,
  delCourseFile
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'
import {
  formateFileSize
} from '@/utils/formatFileSize'

export default {
  data () {
    return {
      dialogVisible: false,
      token: '',
      liveUUID: '',
      courseFiles: []
    }
  },
  methods: {
    show (row) {
      console.log(row)
      this.liveUUID = row.uuid
      getInfoTokenUploadFile().then(res => {
        this.token = res.data.token
      })
      this.loadCourseFiles()
      this.dialogVisible = true
    },
    loadCourseFiles () {
      this.courseFiles = []
      getCourseFiles({ live_uuid: this.liveUUID }).then(res => {
        if (res.success && res.data) {
          this.courseFiles = res.data
        }
      })
    },
    changeUploadFile (file, fileList) {
      console.log(file)
      let date = new Date()
      let dateStr = moment(date).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let name = file.name.substring(0, i)
      let ext = file.name.substring(i + 1)
      let url = 'liveroom/files/' + this.liveUUID + '/' + dateStr + '/' + name + '_' + this.getRandom(2) + '.' + ext
      let fileType = ''
      switch (ext.toLowerCase()) {
        case 'ppt':
        case 'pptx':
          fileType = 'ppt'
          break
        case 'doc':
        case 'docx':
          fileType = 'word'
          break
        case 'pdf':
          fileType = 'pdf'
          break
        case 'mp4':
          fileType = 'video'
          break
        case 'mp3':
          fileType = 'audio'
          break
        default:
          fileType = 'image'
          break
      }

      uploadQiniu(file.raw, this.token, url).then(res => {
        let obj = {
          file_url: url,
          live_uuid: this.liveUUID,
          size: file.size,
          title: file.name,
          type: fileType
        }
        console.log(obj)
        createFileTranscode(obj).then(r => {
          this.loadCourseFiles()
          if (r.success && r.data) {
            let timerFiles = setInterval(() => {
              describeFileTranscode({ task_id: r.data.TaskId }).then(r1 => {
                if (r1.success && r1.data) {
                  if (r1.data.Progress === 100) {
                    clearInterval(timerFiles)
                    this.loadCourseFiles()
                  }
                }
              })
              console.log('timerFiles')
            }, 5000)
          } else {
            this.$message({
              type: 'warning',
              message: r.msg
            })
          }
        })
      })
    },
    delFile (row) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCourseFile({ live_uuid: row.live_uuid, uuid: row.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.loadCourseFiles()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    preview (row) {
      console.log(row)
      if (row.event_data && row.event_data.result_url) {
        window.open(row.event_data.result_url)
      }
    },
    formatterFileSize (row, column, cellValue, index) {
      return formateFileSize(cellValue)
    },
    getRandom (num) {
      return Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1))
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  text-align: right;
}
</style>
