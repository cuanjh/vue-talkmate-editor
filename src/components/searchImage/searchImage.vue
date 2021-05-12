<template>
  <el-dialog
    title="搜索图库"
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
                <image-item
                  v-for="item in list"
                  :key="item.uuid"
                  :picture="item"
                  :checked-uuid="checkedUuid"
                  :domain="assetsDomain"
                  @checked="checked"/>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <video-player ref="videoPlayer" />
    </div>
  </el-dialog>
</template>

<script>
import VideoPlayer from '@/components/common/videoPlayer'
import { mapState } from 'vuex'
import {
  searchImages
} from '@/api/course'
import ImageItem from './imageItem'

export default {
  props: [ 'tag' ],
  data () {
    return {
      dialogVisible: false,
      searchKey: '',
      list: [],
      checkedUuid: '',
      checkedItem: null
    }
  },
  components: {
    VideoPlayer,
    ImageItem
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
    },
    close () {
      this.$emit('checked', this.checkedItem)
      this.reset()
    },
    checked (item) {
      if (item._id === this.checkedUuid) {
        this.checkedUuid = ''
        this.checkedItem = null
      } else {
        this.checkedUuid = item._id
        this.checkedItem = item
      }
    },
    search () {
      this.loadData()
    },
    loadData () {
      let obj = {
        page: 1,
        pageSize: 9999,
        tagKey: this.tag,
        words: this.searchKey,
        searchType: 0
      }
      searchImages(obj).then(res => {
        console.log(res)
        if (res.data.images && res.data.images.length > 0) {
          this.list = res.data.images
        } else {
          this.list = []
        }
      })
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
