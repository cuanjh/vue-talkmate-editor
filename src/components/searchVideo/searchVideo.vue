<template>
  <el-dialog
    title="搜索视频"
    :visible.sync="dialogVisible"
    @closed="close"
    append-to-body>
    <div id="container">
      <el-input
        style="width: 500px"
        placeholder="请输入要查找的内容"
        v-model="searchKey"
        @change="search"
        class="input-with-select mr10">
      </el-input>
      <el-button type="primary" @click="save">确定</el-button>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="24">
          <div class="picture-container">
            <div class="picture-wrap">
              <div class="picture-list">
                <video-item
                  v-for="item in list"
                  :key="item.uuid"
                  :picture="item"
                  :checked-uuid="checkedUuid"
                  :domain="assetsDomain"
                  @playVideo="playVideo"
                  @checked="checked"/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <video-player ref="videoPlayer" />
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
    </div>
  </el-dialog>
</template>

<script>
import VideoPlayer from '@/components/common/videoPlayer'
import { mapState } from 'vuex'
import {
  getVideoList
} from '@/api/course'
import VideoItem from './videoItem'

export default {
  data () {
    return {
      dialogVisible: false,
      searchKey: '',
      list: [],
      checkedUuid: '',
      checkedItem: null,
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    VideoPlayer,
    VideoItem
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      pageSizes: state => state.pageSizes
    })
  },
  methods: {
    show () {
      this.dialogVisible = true
    },
    save () {
      this.dialogVisible = false
    },
    reset () {
      this.searchKey = ''
      this.list = []
      this.checkedUuid = ''
      this.checkedItem = null
      // 分页信息
      this.pageRequest = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    },
    close () {
      this.$emit('checkedVideo', this.checkedItem)
      this.reset()
    },
    checked (item) {
      if (item.uuid === this.checkedUuid) {
        this.checkedUuid = ''
        this.checkedItem = null
      } else {
        this.checkedUuid = item.uuid
        this.checkedItem = item
      }
    },
    search () {
      this.handleCurrentChange(1)
    },
    loadData () {
      let obj = {
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize,
        searchKey: this.searchKey
      }
      getVideoList(obj).then(res => {
        console.log(res)
        if (res.data.list && res.data.list.length > 0) {
          this.list = res.data.list
          this.pageRequest.total = res.data.total
        } else {
          this.list = []
          this.pageRequest.total = 0
        }
      })
    },
    playVideo (video) {
      this.$refs['videoPlayer'].show(video)
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
.picture-wrap {
  display: flex;
  flex-direction: column;
  padding-bottom: 60px;
  .picture-list {
    margin-bottom: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
