<template>
  <el-container class="content-container" v-show="isShow">
    <el-header height="70px">
      <div class="top-bar">
        <div class="left">
          <div class="icon-logo"></div>
          <el-select v-model="selLang" size="small" placeholder="请选择语言" @change="initCourseVersionList">
            <el-option
              v-for="item in langList"
              :key="item['lan_code']"
              :label="item.title[locale]"
              :value="item['lan_code']">
            </el-option>
          </el-select>
          <el-select v-model="selCourseType" size="small" placeholder="请选择项目" @change="initCourseVersionList">
            <el-option
              v-for="item in courseTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
          <el-select v-model="selVersion" size="small" placeholder="请选择版本" @change="initCourseVersionList(3)">
            <el-option
              v-for="item in version.versions"
              :key="item.uuid"
              :label="item.version"
              :value="item.version">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <div class="back">
            <el-button type="text" @click="back">返回主页</el-button>
          </div>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="track-container">
        <div class="track-wrap" id="track-wrap">
          <div class="track-item" v-for="(item,index) in tracks" :key="index">
            <div class="list">
              <folder
                :ref="'folder-' + f.uuid"
                v-for="f in item"
                :key="f.uuid"
                :folder="f"
                :trackNum="index"
                :name="f.name"
                :class="{
                  'active': path.indexOf(f.uuid) > -1,
                  'cur-active': uuid == f.uuid,
                  'right-active': rightUUID == f.uuid
                }"
                @clickFolder="clickFolder"
                @contentMenu="contentMenu"
              />
            </div>
            <div class="other" @contextmenu="otherContextMenu($event, item[0])"></div>
          </div>
        </div>
        <div class="track-content" v-show="false">
          <div class="add-slide">新建Slide</div>
          <div class="slide-list" :style="{'height': slideHeight + 'px'}">
            <slide />
          </div>
          <div class="track-form" v-show="false">
            <div class="form">
              <div class="type">听句子选图片</div>
              <img src="https://course-assets1.talkmate.com/course/images/common/Basic/Level2/Unit1/Chapter1/A0/1-4.webp?imageMogr2/thumbnail/460x258!/q/80" alt="" srcset="">
              <div class="text">a notebook</div>
              <div class="voice"></div>
            </div>
            <div class="form">
              <div class="type">听句子选图片</div>
              <img src="https://course-assets1.talkmate.com/course/images/common/Basic/Level2/Unit1/Chapter1/A0/1-4.webp?imageMogr2/thumbnail/460x258!/q/80" alt="" srcset="">
              <div class="text">a book</div>
              <div class="voice"></div>
            </div>
            <div class="form">
              <div class="type">听句子选图片</div>
              <img src="https://course-assets1.talkmate.com/course/images/common/Basic/Level2/Unit1/Chapter1/A0/1-1.webp?imageMogr2/thumbnail/460x258!/q/80" alt="" srcset="">
              <div class="text">a pen</div>
              <div class="voice"></div>
            </div>
            <div class="form">
              <div class="type">听句子选图片</div>
              <img src="https://course-assets1.talkmate.com/course/images/common/Basic/Level2/Unit1/Chapter1/A0/1-2.webp?imageMogr2/thumbnail/460x258!/q/80" alt="" srcset="">
              <div class="text">a pencil</div>
              <div class="voice"></div>
            </div>
          </div>
          <div class="track-form" v-show="false">
            <div class="form">
              <div class="type">自动读</div>
              <img src="https://course-assets1.talkmate.com/course/images/common/Basic/Level1/Unit1/Chapter1/A0/1-1.webp?imageMogr2/thumbnail/460x258!/q/80" alt="" srcset="">
              <div class="text">Hello</div>
              <div class="voice"></div>
            </div>
            <div class="form">
              <div class="type">跟读</div>
              <img src="https://course-assets1.talkmate.com/course/images/common/Basic/Level1/Unit1/Chapter1/A0/1-2.webp?imageMogr2/thumbnail/460x258!/q/80" alt="" srcset="">
              <div class="text">Hello</div>
              <div class="voice"></div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>请先创建课程版本</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="$router.back()">确 定</el-button>
      </span>
    </el-dialog>
    <right-menu
      ref="rightMenu"
      @rename="rename"
      @editCatalog="editCatalog"
    />
    <edit-catalog ref="editCatalog"/>
  </el-container>
</template>

<script>
import Folder from './folder'
import Slide from './slide'
import RightMenu from './rightMenu'
import EditCatalog from './editCatalog'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  getCatalogList
} from '@/api/course'
export default {
  data () {
    return {
      isShow: true,
      selLang: 'ENG',
      selCourseType: 0,
      selVersion: 1,
      selSlide: '1',
      slideHeight: 0,
      uuid: '',
      rightUUID: '',
      tracks: [],
      selFolder: '',
      path: '',
      dialogVisible: false
    }
  },
  components: {
    Folder,
    Slide,
    RightMenu,
    EditCatalog
  },
  mounted () {
    if (this.version) {
      console.log(this.version)
      this.selLang = this.version.selLang
      this.selCourseType = this.version.selCourseType
      this.selVersion = this.version.selVersion
      this.uuid = this.version.uuid
    }
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.slideHeight = h - 130
    document.oncontextmenu = (e) => {
      e.preventDefault()
    }
    document.onclick = () => {
      this.rightUUID = ''
      if (this.$refs['rightMenu']) {
        this.$refs['rightMenu'].hide()
      }
    }
    this.initData(0)
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale,
      langList: state => state.course.langList,
      courseTypes: state => state.course.courseTypes,
      version: state => state.course.version
    })
  },
  methods: {
    ...mapMutations({
      updateVersion: 'course/updateVersion'
    }),
    ...mapActions({
      getCourseList: 'course/getCourseList'
    }),
    initCourseVersionList (flag) {
      this.updateVersion({ key: 'selLang', val: this.selLang })
      this.updateVersion({ key: 'selCourseType', val: this.selCourseType })
      this.getCourseList({ 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
      setTimeout(() => {
        if (this.version.versions.length) {
          this.updateVersion({ key: 'versions', val: this.version.versions })
          if (flag !== 3) {
            let item = this.version.versions[0]
            this.selVersion = item.version
            this.updateVersion({ key: 'selVersion', val: item.version })
            this.updateVersion({ key: 'uuid', val: item.uuid })
            this.uuid = item.uuid
          } else {
            let curVersion = this.version.versions.find(v => {
              return v.version === this.selVersion
            })
            this.updateVersion({ key: 'selVersion', val: this.selVersion })
            this.updateVersion({ key: 'uuid', val: curVersion.uuid })
            this.uuid = curVersion.uuid
          }
          this.initData(0)
        } else {
          this.updateVersion({ key: 'versions', val: [] })
          this.updateVersion({ key: 'selVersion', val: '' })
          this.updateVersion({ key: 'uuid', val: '' })
          this.versions = []
          this.uuid = ''
          this.dialogVisible = true
        }
      }, 300)
    },
    show (params) {
      console.log(params)
      this.selLang = params.lang
      this.selCouresType = params.courseType
      this.selVersion = params.version
      this.uuid = params.uuid
      this.initData(0)
      this.isShow = true
    },
    back () {
      // this.isShow = false
      this.$router.back()
    },
    switchSlide (num) {
      this.selSlide = num
    },
    async initData (num) {
      if (num === 0) {
        this.tracks = []
      }
      let res = await getCatalogList({ 'parent_uuid': this.uuid })
      if (res.success) {
        let catalogs = res.data.catalogs.sort((a, b) => {
          return a.list_order - b.list_order
        })
        if (this.tracks[num]) {
          this.tracks[num] = catalogs
        } else {
          this.tracks.push(catalogs)
        }
        setTimeout(() => {
          var scrollDom = document.getElementById('track-wrap')
          scrollDom.scrollLeft = scrollDom.scrollWidth
        }, 100)
      }
    },
    clickFolder (params) {
      this.path = ''
      this.uuid = params.folder.uuid
      let copy = this.tracks.slice(0, params.trackNum + 1)
      this.tracks = this.tracks.slice(0, params.trackNum + 1)
      this.getPath(copy, this.uuid)
      if (params.folder.type === 'catalog') {
        this.initData(params.trackNum + 1)
      }
    },
    getPath (tracks, uuid) {
      let catalogs = tracks.pop()
      let folder = catalogs.find(item => {
        return item.uuid === uuid
      })
      let puuid = folder.parent_uuid
      this.path = uuid + '/' + this.path
      // console.log(this.path)
      if (tracks.length > 0) {
        this.getPath(tracks, puuid)
      }
    },
    // 显示右键菜单
    contentMenu (params) {
      this.rightUUID = params.folder.uuid
      params['type'] = 'folder'
      this.$refs['rightMenu'].show(params)
    },
    // 任意位置右键菜单
    otherContextMenu (ev, item) {
      let params = {}
      params['event'] = ev
      params['type'] = 'other'
      if (item && item.parent_uuid) {
        params['pUUID'] = item.parent_uuid
      } else {
        params['pUUID'] = this.version.uuid
      }
      this.$refs['rightMenu'].show(params)
    },
    contentMenuHide () {
      this.$refs['rightMenu'].hide()
    },
    // 重命名
    rename (uuid) {
      this.$refs['rightMenu'].hide()
      this.$refs['folder-' + uuid][0].dblclickFolder()
    },
    // 编辑目录
    editCatalog (params) {
      this.$refs['editCatalog'].show(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.content-container {
  // position: fixed;
  // left: 0;
  // top: 0;
  // right: 0;
  // bottom: 0;
  // background: #fff;
  // z-index: 999;
  width: 100%;
  height: 100%;
}
.top-bar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.el-header {
  padding: 0;
  background: #002742;
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1)
}
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon-logo {
    width: 175px;
    height: 20px;
    margin-left: 20px;
    margin-right: 40px;
    background-image: url('../../../assets/images/course/icon-logo.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.back {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  color: rgba($color: #FFFFFF, $alpha: 0.8);
  margin-right: 30px;
  i {
    font-size: 22px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
  }
}

.el-main {
  padding: 0;
}

.track-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .track-wrap {
    // max-width: 50%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    .track-item {
      width: 200px;
      background: #FAFAFA;
      border-right: 1px solid rgba($color: #000000, $alpha: 0.1);
      box-shadow:1px 0px 0px 0px rgba(183,183,183,0.29);
      padding: 10px 0;
      flex:none;
      display: flex;
      flex-direction: column;
      .list {
        width: 100%;
      }
      .other {
        flex: 1;
      }
      ul {
        width: 100%;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;
          .name {
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon {
              width: 15px;
              height: 15px;
              border-radius: 50%;
              margin: 0 5px 0 10px;
              background: red;
            }
          }
          .arror {
            margin-right: 18px;
            i {}
          }
        }
      }
      .el-image {
        width: 15px;
        height: 15px;
        border-radius: 50%;
      }
    }
  }
  .track-content {
    width: auto;
    background: #F5F6FA;
    padding: 10px;
    .add-slide {
      font-size: 14px;
      font-weight: 400;
      margin-left: 28px;
      color: #007AFF;
      cursor: pointer;
    }
    .slide-list {
      margin-top: 15px;
      padding: 0 10px;
      overflow-y: auto;
    }
  }
}

.track-form {
  width: 50%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 10px;
  .form {
    position: relative;
    margin: 5px;
    width: 200px;
    height: 170px;
    border-radius: 4px;
    background: rgba($color: #aeaeae, $alpha: 0.1);
    overflow: hidden;
    .type {
      padding: 10px;
      text-align: center;
    }
    img {
      width: 100%;
      height: 100px;
      object-fit: cover;
    }
    .text {
      margin-left: 5px;
      margin-top: 5px;
    }
    .voice {
      position: absolute;
      top: 146px;
      right: 10px;
      width: 13px;
      height: 13px;
      // background-image: url('../../../assets/course/icon-voice.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
.slide-list::-webkit-scrollbar {
  width: 2px;
  background: rgba($color: #D8D8D8, $alpha: 0.1)
}

.slide-list::-webkit-scrollbar-thumb {
  background: rgba($color: #000000, $alpha: 0.4);
}
.back {
  .el-button {
    color: rgba($color: #ffffff, $alpha: 0.6);
    &:hover {
      color: rgba($color: #409eff, $alpha: 1);
    }
  }
}
</style>
