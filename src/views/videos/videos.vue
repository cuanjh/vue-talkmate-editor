<template>
  <div id="photo-gallery">
    <el-select class="mr10" v-model="selTag"
      filterable
      default-first-option
      placeholder="请选择标签"
      @change="search">
      <el-option
        v-for="item in videoTagList"
        :key="item['uuid']"
        :label="item.title"
        :value="item.uuid">
      </el-option>
    </el-select>
    <el-input style="width: 500px" placeholder="请输入要查找的内容" v-model="searchKey" @change="search" class="input-with-select mr10"></el-input>
    <el-button type="primary" @click="showEditTags">新建标签</el-button>
    <el-button v-if="false" type="primary" @click="reset">重置</el-button>
    <el-button type="primary" :disabled="!(videoTagList && videoTagList.length > 0)" @click="upload">上传视频</el-button>
    <el-button v-if="false" type="primary" @click="download">下载</el-button>
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
    <edit-tags ref="editTags" @loadTags="loadTags"/>
    <edit-picture ref="editPicture" @closeEditImage="loadData"/>
    <upload ref="upload" @closeLoad="loadData"/>
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
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  getVideoList,
  getInfoToken
  // downloadImageExcel
} from '@/api/course'

import VideoPlayer from '@/components/common/videoPlayer'
import EditTags from './editTags'
import PhotoItem from './photoItem'
import EditPicture from './editPicture'
import Upload from './upload'

export default {
  data () {
    return {
      searchKey: '',
      tags: [],
      selTag: '',
      activeTag: '',
      list: [],
      showPicData: [],
      page: 1,
      pageSize: 12,
      isExpand: false,
      token: '',
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
    EditTags,
    EditPicture,
    PhotoItem,
    Upload
  },
  mounted () {
    this.loadTags()
    // 获取上传图片token
    getInfoToken().then(res => {
      this.token = res.data.token
    })
    this.search()
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      videoTagList: state => state.course.videoTagList,
      pageSizes: state => state.pageSizes
    }),
    rotate180 () {
      return this.isExpand ? 'rotate(180deg)' : 'rotate(0)'
    }
  },
  methods: {
    ...mapActions({
      getVideoTagList: 'course/getVideoTagList'
    }),
    loadTags () {
      this.getVideoTagList({ pageNo: 1, pageSize: 99 })
    },
    search () {
      this.handleCurrentChange(1)
    },
    showEditTags () {
      this.$refs['editTags'].show()
    },
    showEditPicture (item) {
      this.$refs['upload'].show({ flag: 'edit', form: item })
    },
    loadData () {
      let obj = {
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize,
        tagUuid: this.selTag,
        searchKey: this.searchKey
        // searchType: this.searchType ? 1 : 0
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
    upload () {
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
      this.activeTag = ''
      this.list = []
      this.search()
    },
    download () {
      if (!this.activeTag) {
        this.$message({
          type: 'warning',
          message: '请先选择要下载的图片分类'
        })
        return false
      }
      window.location.href = process.env.VUE_APP_BASE_API + '/editor/image/download?tagKey=' + this.activeTag
      // downloadImageExcel({ tagKey: this.activeTag })
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

.tags {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  font-size: 17px;
  padding-top: 20px;
  span {
    width: 66px;
  }
  ul {
    // flex-grow: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // max-height: 50px;
    overflow: hidden;
    transition: max-height .5s;
    -webkit-transition: max-height .5s;
    -moz-transition: max-height .5s;
    -o-transition: max-height .5s;
    li {
      min-width: 80px;
      margin-right: 10px;
      line-height: 30px;
      a {
        display: contents;
        color: rgba(0, 0, 0, .6);
        text-decoration: none;
        &:hover{
          color: #EE2759;
        }
      }
      .active {
        color: #EE2759;
      }
    }
  }
  .expand {
    max-height: 1000px;
    transition: max-height .5s;
    -webkit-transition: max-height .5s;
    -moz-transition: max-height .5s;
    -o-transition: max-height .5s;
  }
  a {
    width: 30px;
    margin-top: 20px;
    margin-right: 29px;
    i {
      display: inline-block;
      width: 19px;
      height: 11px;
      // background-image: url('../assets/images/icon-down.svg');
      background-repeat: no-repeat;
      background-size: cover;
      transition: transform .5s;
      -webkit-transition: transform .5s;
      -moz-transition: transform .5s;
      -o-transition: transform .5s;
    }
  }
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
