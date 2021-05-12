<template>
  <div id="photo-gallery">
    <el-select
      class="mr10"
      v-model="selType"
      filterable
      default-first-option
      placeholder="请选择分类"
      @change="search">
      <el-option label="所有分类" value="">
      </el-option>
      <el-option
        v-for="item in typeList"
        :key="item.key"
        :label="item.val"
        :value="item.key">
      </el-option>
    </el-select>
    <el-input
      style="width: 500px"
      placeholder="请输入要查找的内容"
      v-model="searchKey"
      @change="search"
      class="input-with-select mr10">
    </el-input>
    <el-button type="primary" @click="add">添加</el-button>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="24">
        <div class="picture-container">
          <div class="picture-wrap">
            <div class="picture-list">
              <photo-item
                v-for="item in list"
                :key="item.uuid"
                :picture="item"
                :domain="assetsDomain"
                @playVideo="playVideo"
                @loadData="loadData"
                @showEditPicture="showEditPicture"/>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <upload ref="upload" @closeLoad="loadData"/>
    <video-player ref="videoPlayer"/>
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
</template>

<script>
import { mapState } from 'vuex'
import {
  listKindResources
} from '@/api/kindResources'

import VideoPlayer from '@/components/common/videoPlayer'
import PhotoItem from './photoItem'
import Upload from './upload'

export default {
  data () {
    return {
      selType: '',
      typeList: [
        { key: '1', val: '看得见的进步' },
        { key: '2', val: '园长讲话' },
        { key: '3', val: '课堂融合' },
        { key: '4', val: '园所挂牌' }
      ],
      searchKey: '',
      list: [],
      showPicData: [],
      page: 1,
      pageSize: 12,
      isExpand: false,
      searchType: 0,
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
    PhotoItem,
    Upload
  },
  mounted () {
    this.search()
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      pageSizes: state => state.pageSizes
    }),
    rotate180 () {
      return this.isExpand ? 'rotate(180deg)' : 'rotate(0)'
    }
  },
  methods: {
    search () {
      this.handleCurrentChange(1)
    },
    showEditPicture (item) {
      this.$refs['upload'].show({ flag: 'edit', form: item })
    },
    loadData () {
      let obj = {
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize,
        category: this.selType,
        searchKey: this.searchKey,
        sortType: 0,
        textField: 'list_order'
      }
      listKindResources(obj).then(res => {
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
    add () {
      this.$refs['upload'].show({ flag: 'add' })
    },
    scroll (e) {
      let scrollHeight = e.target.scrollHeight
      let offsetHeight = e.target.offsetHeight
      let scrollTop = e.target.scrollTop
      if (offsetHeight + scrollTop + 10 > scrollHeight && this.page !== -1) {
        this.page++
        this.search()
      }
    },
    reset () {
      this.page = 1
      this.list = []
      this.search()
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
#photo-gallery {
  overflow: auto;
}

.picture-wrap {
  display: flex;
  flex-direction: column;
  // align-items: center;
  // width: 1080px;
  // margin: 0 auto;
  padding-bottom: 60px;
  .picture-list {
    margin-bottom: 50px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
