<template>
  <div id="photo-gallery">
    <el-row>
      <el-col :span="14">
        <el-input placeholder="请输入要查找的内容" v-model="searchKey" @change="changeSearchKey" class="input-with-select">
          <el-switch slot="append"
            v-model="searchType"
            @change="changeSearchKey"
            active-text="精确搜索"
            inactive-text="模糊搜索">
          </el-switch>
        </el-input>
      </el-col>
      <el-col :span="4" :offset="6">
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button type="primary" @click="upload">上传</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="tags">
          <span>分类：</span>
          <ul :class="{'expand': isExpand}">
            <li v-for="item in tags" :key="item.TagKey">
              <a href="javascript:;" :class="{'active': activeTag == item.TagKey}" @click="selOneTag(item)">{{ item.TagKey }}</a>
            </li>
            <li>
              <el-button icon="el-icon-plus" @click="showEditTags()" size="small"></el-button>
            </li>
          </ul>
          <a href="javascript:;" v-show="tags.length >= 8" @click="toggleExpand()"><i :style="{'transform': rotate180}"></i></a>
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="24">
        <div class="picture-container">
          <div class="picture-wrap">
            <div class="picture-list">
              <photo-item
                v-for="(item, index) in pictures"
                :key="item._id + index"
                :picture="item"
                :domain="assetsDomain"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  searchImages,
  imagesTags,
  getInfoToken
} from '@/api/course'

import EditTags from './editTags'
import PhotoItem from './photoItem'
import EditPicture from './editPicture'
import Upload from './upload'

export default {
  data () {
    return {
      searchKey: '',
      tags: [],
      activeTag: '',
      pictures: [],
      showPicData: [],
      page: 1,
      pageSize: 12,
      isExpand: false,
      token: '',
      searchType: 0
    }
  },
  components: {
    EditTags,
    EditPicture,
    PhotoItem,
    Upload
  },
  mounted () {
    document.getElementById('photo-gallery').addEventListener('scroll', (e) => {
      this.scroll(e)
    })
    this.loadTags()
    // 获取上传图片token
    getInfoToken().then(res => {
      this.token = res.data.token
    })
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    }),
    rotate180 () {
      return this.isExpand ? 'rotate(180deg)' : 'rotate(0)'
    }
  },
  methods: {
    changeSearchKey () {
      this.page = 1
      this.pictures = []
      this.search()
    },
    loadTags () {
      imagesTags().then(res => {
        if (res.success && res.data.tags && res.data.tags.length > 0) {
          this.tags = res.data.tags
        }
      })
    },
    search () {
      let obj = {
        page: this.page,
        pageSize: this.pageSize,
        tagKey: this.activeTag,
        words: this.searchKey,
        searchType: this.searchType ? 1 : 0
      }
      searchImages(obj).then(res => {
        console.log(res)
        if (res.data.images && res.data.images.length > 0) {
          this.pictures = this.pictures.concat(res.data.images)
        } else {
          this.page = -1
        }
      })
    },
    selOneTag (item) {
      this.activeTag = item.TagKey
      this.page = 1
      this.pictures = []
      this.search()
    },
    showEditTags () {
      this.$refs['editTags'].show()
    },
    toggleExpand () {},
    showEditPicture (picture) {
      let src = this.assetsDomain + picture.image_url
      this.$refs['editPicture'].show({ 'picture': picture, 'src': src, 'tags': this.tags })
    },
    loadData () {
      this.loadTags()
      this.pictures = []
      this.page = 1
      this.search()
    },
    upload () {
      this.$refs['upload'].show({ tags: this.tags, token: this.token })
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
      this.activeTag = ''
      this.pictures = []
      this.search()
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
    max-height: 50px;
    overflow: hidden;
    transition: max-height .5s;
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
