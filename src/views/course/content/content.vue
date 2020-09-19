<template>
  <el-container id="content-container" class="content-container" v-show="isShow">
    <el-header height="90px">
      <div class="top-bar">
        <div class="left">
          <div class="icon-logo" @click="back"></div>
          <el-select
            v-model="selLang"
            size="small"
            filterable
            default-first-option
            placeholder="请选择语言"
            @change="changLang">
            <el-option
              v-for="item in langList"
              :key="item['lan_code']"
              :label="item.title[locale]"
              :value="item['lan_code']">
            </el-option>
          </el-select>
          <el-select v-show="false" v-model="selCourseType" size="small" placeholder="请选择项目" @change="initCourseVersionList(2)">
            <el-option
              v-for="item in courseTypes"
              :key="item.type"
              :label="item.name"
              :value="item.type">
            </el-option>
          </el-select>
          <el-select class="select-course" v-model="selCourseUUID" filterable  size="small" placeholder="请选择课程"  @change="changeCourse">
            <el-option
              v-for="item in version.courseList"
              :key="item.uuid"
              :label="item.name ? item.name : '(' + courseTypes.find(i => { return i.type == item.course_type})['name'] + ') ' + item.title['zh-CN'] + '/' + item.title['en']"
              :value="item.uuid">
              <div class="course">
                <el-image style="width: 24px; height: 24px; border-radius: 4px; margin-right: 4px;" :src="assetsDomain + item.flag[0]" fit="cover"></el-image>
                <span>{{item.name ? item.name : '(' + courseTypes.find(i => { return i.type == item.course_type})['name'] + ') ' + item.title['zh-CN'] + '/' + item.title['en']}}</span>
              </div>
            </el-option>
          </el-select>
          <el-select v-model="selVersion" size="small" placeholder="请选择版本" @change="changeVersion">
            <el-option
              v-for="item in versions"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <div class="back">
            <el-button type="text" @click="back">返回主页</el-button>
          </div>
        </div>
      </div>
      <div class="tips">
        <span class="desc">(ALT + “↑、↓、←、→” 组合键，能够切换课程目录)</span>
        <el-popover
          placement="right"
          width="400"
          @show="showExportList"
          trigger="click">
          <el-tag type="warning">显示最新 5 条可下载的数据</el-tag>
          <el-table :data="exportList">
            <el-table-column property="created_on" label="创建日期" :formatter="formatDate"></el-table-column>
            <el-table-column property="name" label="标题"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="handleDownload(scope.row)" :disabled="scope.row.status !== 2" type="text" size="small">{{scope.row.status === 2 ? '下载' : '文件生成中...' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-badge slot="reference" :value="exportNum" :hidden="exportNum == 0" class="item" type="warning">
            <el-button size="small" icon="el-icon-message-solid" type="primary" circle></el-button>
          </el-badge>
        </el-popover>
      </div>
    </el-header>
    <el-main>
      <div id="track-container" class="track-container">
        <!-- :style="{width: (isShowEditFile && tracks.length > 1) ? '401px' : (tracks.length > 2 ? '602px' : 'auto'), maxWidth: '600px'}" -->
        <div
          class="track-wrap"
          style="width: 602px"
          id="track-wrap">
          <div class="track-item" data-intro='右键点击空白区域可操作右键菜单' v-for="index in 5" :key="index">
            <div class="list" :id="'track-item-' + index">
              <folder
                :ref="'folder-' + f.uuid"
                v-for="f in tracks[index - 1]"
                :key="f.uuid"
                :folder="f"
                :trackNum="index - 1"
                :name="f.name"
                :class="{
                  'active': path.indexOf(f.uuid) > -1,
                  'cur-active': curUUID == f.uuid,
                  'right-active': rightUUID == f.uuid
                }"
                @clickFolder="clickFolder"
                @contentMenu="contentMenu"
                @resetTrackData="resetTrackData"
              />
            </div>
            <div class="other" @contextmenu="otherContextMenu($event, tracks[index - 1][0], index)"></div>
          </div>
        </div>
        <edit-file ref="editFile" v-show="isShowEditFile"/>
        <edit-catalog1
          class="edit-catalog"
          ref="editCatalog1"
          v-show="!isShowEditFile && tracks.length > 1"
          @resetTrackData="resetTrackData"
          @hideCatalog1="hideCatalog1"/>
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
      :userList="userList"
      :authorityUsers="authorityUsers"
      :authorityList="authorityList"
      @rename="rename"
      @copy="copy"
      @paste="paste"
      @del="del"
      @editCatalog="editCatalogFn"
      @resetTrackData="resetTrackData"
      @lookPreview="previewContent"
      @setIsShow="setIsShow"
      @refreshDownloadList="refreshDownloadList"
    />
    <edit-catalog ref="editCatalog" @resetTrackData="resetTrackData"/>
    <edit-form ref="editForm"/>
    <preview-comp ref="preview"/>
    <cropper-dialog ref="cropperDialog"></cropper-dialog>
  </el-container>
</template>

<script>
import Sortable from 'sortablejs'
import moment from 'moment'

import Folder from './folder'
// import Slide from './slide'
import RightMenu from './rightMenu'
// 弹框形式
import EditCatalog from './editCatalog'
// 内嵌形式
import EditCatalog1 from './editCatalog1'
import EditForm from './editForm'
import EditFile from './editFile'
import PreviewComp from '../preview/pro/index'
import CropperDialog from '../../../components/common/cropper'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  getUserList
} from '@/api/user'
import { getAuthorityList } from '@/api/authority'
import {
  getCatalogList,
  getContent,
  editCatalog,
  copyCatalog,
  delCatalog,
  moveCatalog,
  exportCourseContentList
} from '@/api/course'
const introJs = require('intro.js')
export default {
  data () {
    return {
      exportList: [],
      exportNum: 0,
      isHideCatalog1: true,
      isShow: true,
      isShowEditFile: false,
      selLang: 'ENG',
      selCourseUUID: '',
      selCourseType: 0,
      selVersion: '',
      selSlide: '1',
      slideHeight: 0,
      curUUID: '',
      uuid: '',
      rightUUID: '',
      copyUUID: '',
      copySelLang: '',
      tracks: [],
      path: '',
      pathDesc: '',
      dialogVisible: false,
      userList: [],
      authorityList: [],
      copyAuthorityList: [],
      authorityUsers: [],
      courseContentPath: ''
    }
  },
  components: {
    Folder,
    // Slide,
    RightMenu,
    EditCatalog,
    EditCatalog1,
    EditForm,
    EditFile,
    PreviewComp,
    CropperDialog
  },
  created () {
    this.getModelList({ pageNo: 0, pageSize: 0 })
    this.getContentTypes()
    this.getContentTags({ pageNo: 0, pageSize: 0 })
    this.getAuthorityUsers()
  },
  mounted () {
    if (this.version) {
      console.log(this.version)
      this.selLang = this.version.selLang
      // this.selCourseType = this.version.selCourseType
      this.selVersion = this.version.selVersion
      this.uuid = this.version.uuid
      this.selCourseUUID = this.version.selCourse.uuid
    }
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.slideHeight = h - 130
    let contentWrapEl = document.getElementById('track-wrap')
    contentWrapEl.oncontextmenu = (e) => {
      e.preventDefault()
    }
    let contentEl = document.getElementById('track-wrap')
    contentEl.onclick = () => {
      this.rightUUID = ''
      if (this.$refs['rightMenu']) {
        this.$refs['rightMenu'].hide()
      }
    }
    // 键盘上下左右键控制目录操作
    document.onkeydown = (event) => {
      let e = event || window.event
      if (!e.altKey) return
      if (!this.path) return
      let arr = this.path.split('/')
      arr.pop()
      let trackNum = arr.length - 1
      let track = this.tracks[trackNum]
      let folderIndex = track.findIndex(item => {
        return item.uuid === arr[arr.length - 1]
      })
      let folder = null
      // 左键
      if (e && e.keyCode === 37 && e.altKey) {
        if (trackNum === 0) return
        trackNum--
        folderIndex = 0
        track = this.tracks[trackNum]
      }
      // 上键
      if (e && e.keyCode === 38 && e.altKey) {
        if (folderIndex === 0) return
        folderIndex--
      }
      // 右键
      if (e && e.keyCode === 39 && e.altKey) {
        if (trackNum === this.tracks.length - 1) return
        trackNum++
        folderIndex = 0
        track = this.tracks[trackNum]
      }
      // 下键
      if (e && e.keyCode === 40 && e.altKey) {
        if (folderIndex === track.length - 1) return
        folderIndex++
      }
      folder = track[folderIndex]
      if (folder && (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40)) {
        this.clickFolder({ folder: folder, trackNum: trackNum })
      }
    }
    this.initData(0)
  },
  destroyed () {
    document.onkeydown = null
  },
  watch: {
    'version.selCourse' (newVal, oldVal) {
      this.selCourseUUID = newVal.uuid
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      locale: state => state.course.locale,
      langList: state => state.course.langList,
      courseTypes: state => state.course.courseTypes,
      version: state => state.course.version,
      modelList: state => state.course.modelList,
      userInfo: state => state.user.userInfo,
      lowerRoleUser: state => state.user.lowerRoleUser
    }),
    settingWidth () {
      let width = ''
      if (!this.isHideCatalog1 && !this.isShowEditFile) {
        width = '97%'
      } else {
        width = this.tracks.length < 3 ? '401px' : (this.tracks.length > 2 ? '602px' : 'auto')
      }
      return width
    },
    versions () {
      let arr = []
      if (this.userInfo.authorityId === '1') {
        arr = this.version.versions
      } else {
        this.version.versions.forEach(item => {
          if (item.authorities && item.authorities.find(a => { return a.user_uuid === this.userInfo.uuid && a.auth })) {
            let obj = item
            obj['curUserAuth'] = item.authorities.find(a => { return a.user_uuid === this.userInfo.uuid && a.auth })
            arr.push(obj)
          }
        })
      }
      return arr
    }
  },
  methods: {
    ...mapMutations({
      updateVersion: 'course/updateVersion'
    }),
    ...mapActions({
      getCourseList: 'course/getCourseList',
      getModelList: 'course/getModelList',
      getContentTypes: 'course/getContentTypes',
      getContentTags: 'course/getContentTags',
      getCourseVersions: 'course/getCourseVersions'
    }),
    hideCatalog1 (type) {
      console.log(type)
      this.isHideCatalog1 = type
    },
    initCourseVersionList (flag) {
      this.updateVersion({ key: 'selLang', val: this.selLang })
      // this.updateVersion({ key: 'selCourseType', val: this.selCourseType })
      this.getCourseList({ 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
      setTimeout(() => {
        if (this.version.versions.length) {
          this.updateVersion({ key: 'versions', val: this.version.versions })
          if (flag !== 3) {
            this.updateVersion({ key: 'selVersion', val: '' })
            this.updateVersion({ key: 'uuid', val: '' })
            this.selVersion = ''
            this.uuid = ''
          } else {
            let curVersion = this.version.versions.find(v => {
              return v.uuid === this.selVersion
            })
            this.updateVersion({ key: 'selVersion', val: this.selVersion })
            if (curVersion && curVersion.uuid) {
              this.updateVersion({ key: 'uuid', val: curVersion.uuid })
              this.uuid = curVersion.uuid
            } else {
              this.updateVersion({ key: 'uuid', val: '' })
              this.uuid = ''
            }
          }
          this.initData(0)
        } else {
          this.updateVersion({ key: 'versions', val: [] })
          this.updateVersion({ key: 'selVersion', val: '' })
          this.updateVersion({ key: 'uuid', val: '' })
          this.uuid = ''
          this.dialogVisible = true
        }
        this.isShowEditFile = false
      }, 300)
    },
    changLang () {
      this.updateVersion({ key: 'selLang', val: this.selLang })
      this.getCourseList({ 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
      this.updateVersion({ key: 'selVersion', val: '' })
      this.updateVersion({ key: 'uuid', val: '' })
      this.selVersion = ''
      this.uuid = ''
      this.initData(0)
      this.isShowEditFile = false
    },
    changeCourse () {
      let selCourse = this.version.courseList.find(f => {
        return f.uuid === this.selCourseUUID
      })
      this.updateVersion({ key: 'selCourse', val: selCourse })
      this.getCourseVersions({ 'pageNo': 0, 'pageSize': 0, 'parent_uuid': selCourse.uuid })
      this.updateVersion({ key: 'selVersion', val: '' })
      this.updateVersion({ key: 'uuid', val: '' })
      this.selVersion = ''
      this.uuid = ''
      this.initData(0)
      this.isShowEditFile = false
    },
    changeVersion () {
      let curVersion = this.version.versions.find(v => {
        return v.uuid === this.selVersion
      })
      this.updateVersion({ key: 'selVersion', val: this.selVersion })
      if (curVersion && curVersion.uuid) {
        this.updateVersion({ key: 'uuid', val: curVersion.uuid })
        this.uuid = curVersion.uuid
      } else {
        this.updateVersion({ key: 'uuid', val: '' })
        this.uuid = ''
      }
      this.initData(0)
      this.isShowEditFile = false
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
      // this.$router.back()
      this.$router.push({ path: '/layout/course/version' })
    },
    switchSlide (num) {
      this.selSlide = num
    },
    async initData (num) {
      this.contentMenuHide()
      if (num === 0) {
        this.tracks = []
      }
      let res = await getCatalogList({ 'parent_uuid': this.uuid })
      if (res.success) {
        let catalogs = res.data.catalogs.sort((a, b) => {
          return a.list_order - b.list_order
        })
        let copyCatalogs = []
        if (num > 0) {
          let authorities = null
          if (catalogs[0] && catalogs[0].parent_uuid) {
            authorities = this.getParentAuthorities(catalogs[0].parent_uuid, num - 1)
          } else {
            authorities = this.getParentAuthorities(this.uuid, num - 1)
          }
          catalogs.forEach(c => {
            let obj = c
            obj['copyAuthorities'] = authorities
            copyCatalogs.push(obj)
          })
          catalogs = copyCatalogs
        }

        if (this.userInfo.authorityId !== '1') {
          catalogs = catalogs.filter(item => {
            let flag = false
            let authority = null
            if (item.authorities && item.authorities.length) {
              authority = item.authorities.find(a => { return a.user_uuid === this.userInfo.uuid })
              if (authority && authority['auth']) {
                flag = true
              }
            } else if (item.copyAuthorities && item.copyAuthorities.length) {
              authority = item.copyAuthorities.find(a => { return a.user_uuid === this.userInfo.uuid })
              if (authority && authority['auth']) {
                flag = true
              }
            }
            return flag
          })
          if (!catalogs) {
            catalogs = []
          }
        }

        if (this.tracks[num]) {
          this.tracks[num] = catalogs
        } else {
          this.tracks.push(catalogs)
        }
        this.$set(this.tracks, num, catalogs)
        console.log('courseContentPath', this.courseContentPath)
        if (this.courseContentPath === '') {
          this.courseContentPath = localStorage.getItem('courseContentPath')
        }
        if (this.courseContentPath && this.tracks[num]) {
          let arr = this.courseContentPath.split('/')
          let fIndex = this.tracks[num].findIndex(item => {
            return item.uuid === arr[num]
          })
          if (fIndex === -1) {
            this.courseContentPath = ''
            setTimeout(() => {
              this.trackLeftScroll()
            }, 800)
          } else {
            this.clickFolder({ folder: this.tracks[num][fIndex], trackNum: num })
            if (arr.length === num + 2) {
              this.courseContentPath = ''
              setTimeout(() => {
                this.trackLeftScroll()
              }, 800)
            }
          }
        }
        setTimeout(() => {
          if (this.version.selVersion && num === 0 && this.tracks[0].length === 0) {
            introJs().start()
          }
          if (this.tracks.length) {
            this.setTrackSortable()
          }
        }, 500)
      }
    },
    trackLeftScroll () {
      let num = this.tracks.length - 1
      if (num === 0) {
        num = 1
      }
      let itemDom = document.getElementById('track-item-' + num)
      if (!itemDom) {
        return
      }
      var scrollDom = document.getElementById('track-wrap')
      let sl = scrollDom.scrollLeft
      let itemOL = itemDom.offsetLeft
      let si = setInterval(() => {
        if (sl > 0 && sl < itemOL - 200) {
          scrollDom.scrollLeft = sl++
          if (sl > itemOL - 200) {
            clearInterval(si)
            scrollDom.scrollLeft = itemOL - 200
          }
        } else {
          scrollDom.scrollLeft = sl--
          if (sl < itemOL - 200) {
            clearInterval(si)
            scrollDom.scrollLeft = itemOL - 200
          }
        }
      }, 1)
    },
    setTrackSortable () {
      // if (this.lowerRoleUser) {
      //   return false
      // }
      for (let i = 0; i < this.tracks.length; i++) {
        if (this.tracks[i].length === 0) {
          break
        }
        let $trackItem = document.getElementById('track-item-' + (i + 1))
        /* eslint-disable */
        new Sortable($trackItem, {
          group: 'shared',
          animation: 0,
          setData: () => {
            console.log(33)
          },
          onAdd: (evt) => {
            console.log(evt)
            console.log(1)
            let fromId = evt.from.id
            let toId = evt.to.id

            // 左右拖拽
            let fromTrackNum = parseInt(fromId.split('-').pop()) - 1
            let toTrackNum = parseInt(toId.split('-').pop()) - 1
            let fromTrack = this.tracks[fromTrackNum][evt.oldIndex]
            let toTrack = this.tracks[toTrackNum]
            let toPUUID = this.uuid
            if (toTrack && toTrack[0]) {
              toPUUID = toTrack[0].parent_uuid
            }

            let moveObj = {
              from_uuid: fromTrack.parent_uuid,
              to_uuid: toPUUID,
              uuid: fromTrack.uuid
            }
            moveCatalog(moveObj).then(r => {
              this.resetTrackData({ pUUID: fromTrack.parent_uuid, trackNum: fromTrackNum })
              this.resetTrackData({ pUUID: toPUUID, trackNum: toTrackNum })
            })
          },
          onUpdate: (evt) => {
            console.log(2)
            let fromId = evt.from.id
            let toId = evt.to.id
            // 上下拖拽
            let trackNum = parseInt(toId.split('-').pop()) - 1
            let track = this.tracks[trackNum]
            let dragObj = track[evt.oldIndex]
            let newOrder = dragObj.list_order
            let pUUID = track[0]['parent_uuid']
            let listOrder = track[evt.newIndex].list_order
            
            if (evt.newIndex < evt.oldIndex) {
              // 向上拖拽
              let preListOrder = 0
              if (evt.newIndex !== 0) {
                preListOrder = track[evt.newIndex - 1].list_order
              }
              newOrder = parseInt((listOrder + preListOrder) / 2)
            } else {
              // 向下拖拽
              let nextListOrder = 0
              if (evt.newIndex + 1 !== track.length) {
                nextListOrder = track[evt.newIndex + 1].list_order
                newOrder = parseInt((listOrder + nextListOrder) / 2)
              } else {
                newOrder = listOrder + 10
              }
            }
            let obj = {
              catalog_info: {
                cover: dragObj.cover,
                desc: dragObj.desc,
                flag: dragObj.flag,
                has_changed: true,
                list_order: newOrder,
                name: dragObj.name,
                tags: dragObj.tags,
                title: dragObj.title,
                is_show: dragObj.is_show
              },
              uuid: dragObj.uuid
            }
            console.log('dragObj', dragObj)
            editCatalog(obj).then(res => {
              this.clickFolder({ folder: dragObj, trackNum: trackNum })
              this.resetTrackData({ pUUID: pUUID, trackNum: trackNum })
            })
          }
        })
        /* eslint-enable */
      }
    },
    setIsShow (obj) {
      console.log(obj)
      editCatalog(obj).then(res => {
        console.log(res)
        if (res.success) {
          this.resetTrackData({ pUUID: obj.catalog_info.parent_uuid, trackNum: obj.trackNum })
          this.$refs.rightMenu.hide()
        }
      })
    },
    clickFolder (params) {
      console.log('===>', params)
      this.$bus.emit('closeImage')
      this.$bus.emit('closeContent')
      this.path = ''
      this.uuid = params.folder.uuid
      this.curUUID = params.folder.uuid
      let copy = this.tracks.slice(0, params.trackNum + 1)
      this.tracks = this.tracks.slice(0, params.trackNum + 1)
      this.getPath(copy, this.uuid)
      if (params.folder.type === 'catalog') {
        this.initData(params.trackNum + 1)
        this.editCatalogFn1(params)
        this.isShowEditFile = false
      } else {
        let model = this.modelList.find(item => {
          return item.model_key === params.folder.content_model
        })
        console.log(model)
        getContent({ 'content_model': params.folder.content_model, 'parent_uuid': params.folder.uuid }).then(res => {
          console.log(res)
          this.pathDesc = ''
          let copy = this.tracks.slice(0, params.trackNum + 1)
          if (copy.length) {
            this.getPathDesc(copy, this.uuid)
          }
          let contents = res.data.contents
          // this.$refs['editForm'].show({ contents: contents, model: model, folder: params.folder, pathDesc: this.pathDesc })
          this.isShowEditFile = true
          this.$refs['editFile'].show({ contents: contents, model: model, folder: params.folder, pathDesc: this.pathDesc })
        })
      }
    },
    // 预览
    async previewContent (params) {
      console.log(params)
      let obj = {
        contents: [],
        contentModel: ''
      }
      let res = await getContent({ 'content_model': params.content_model, 'parent_uuid': params.uuid })
      obj.contents = res.data.contents
      obj.contentModel = params.content_model
      console.log(res)
      this.$bus.emit('showPreviewModel', obj)
    },
    getPath (tracks, uuid) {
      let catalogs = tracks.pop()
      let folder = catalogs.find(item => {
        return item.uuid === uuid
      })
      let puuid = folder.parent_uuid
      this.path = uuid + '/' + this.path
      console.log(this.path)
      localStorage.setItem('courseContentPath', this.path)
      if (tracks.length > 0) {
        this.getPath(tracks, puuid)
      }
    },
    getPathDesc (tracks, uuid) {
      let catalogs = tracks.pop()
      let folder = catalogs.find(item => {
        return item.uuid === uuid
      })
      let puuid = uuid
      if (folder) {
        puuid = folder.parent_uuid
        this.pathDesc = folder.name + ' > ' + this.pathDesc
      }
      if (tracks.length > 0) {
        this.getPathDesc(tracks, puuid)
      }
    },
    // 显示右键菜单
    contentMenu (params) {
      // if (this.lowerRoleUser) {
      //   return false
      // }
      console.log(params)
      this.$refs['rightMenu'].hide()
      this.rightUUID = params.folder.uuid
      params['type'] = 'folder'
      let authorities = params.folder.authorities
      if (!authorities || !authorities.length) {
        authorities = this.getParentAuthorities(params.folder.parent_uuid, params.trackNum - 1)
      }
      let auth = ''
      if (authorities && authorities.length) {
        let obj = authorities.find(item => {
          return item.user_uuid === this.userInfo.uuid
        })
        if (obj) {
          auth = obj['auth']
        }
      }
      if (this.userInfo.authorityId === '1' || auth === 'rw') {
        this.$refs['rightMenu'].show(params)
      }
    },
    // 任意位置右键菜单
    otherContextMenu (ev, item, index) {
      // if (this.lowerRoleUser) {
      //   return false
      // }
      console.log(index)
      this.uuid = ''
      this.curUUID = ''
      let params = {}
      params['event'] = ev
      params['type'] = 'other'
      if (item && item.parent_uuid) {
        params['pUUID'] = item.parent_uuid
      } else {
        if (index > 0 && this.tracks[index - 1].length) {
          let uuidArr = this.path.split('/')
          this.uuid = uuidArr[uuidArr.length - 2]
          params['pUUID'] = this.uuid
        } else {
          params['pUUID'] = this.version.uuid
        }
      }
      params['trackNum'] = index - 1
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
    // 复制
    copy (uuid) {
      this.copyUUID = uuid
      this.copySelLang = this.version.selLang
      let copy = {
        copyUUID: this.copyUUID,
        copySelLang: this.copySelLang
      }
      localStorage.setItem('copyCatalog', JSON.stringify(copy))
      this.contentMenuHide()
    },
    // 粘贴
    async paste (params) {
      console.log(params)
      let copy = JSON.parse(localStorage.getItem('copyCatalog'))
      if (copy) {
        this.copyUUID = copy.copyUUID
        this.copySelLang = copy.copySelLang
      }
      if (!this.copyUUID) {
        this.$message({
          type: 'warning',
          message: '先选择要复制的内容，再粘贴'
        })
        return false
      }
      let trackNum = params.trackNum
      let track = this.tracks[params.trackNum]
      let pUUID = ''
      if (track && track[0] && track[0].parent_uuid) {
        pUUID = track[0].parent_uuid
      } else {
        pUUID = this.uuid
      }
      let obj = {
        same_lang: this.copySelLang === this.version.selLang,
        to_uuid: pUUID,
        uuids: [
          this.copyUUID
        ]
      }
      console.log(obj)
      let res = await copyCatalog(obj)
      if (res.success) {
        this.resetTrackData({ pUUID: pUUID, trackNum: trackNum })
      }
      this.copyUUID = ''
      this.copySelLang = ''
      localStorage.removeItem('copyCatalog')
      this.contentMenuHide()
    },
    // 删除目录(文件)
    del (params) {
      console.log(params)
      this.$confirm('确认要删除吗? 删除后果可能很严重哦', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCatalog({ uuid: params.folder.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.resetTrackData({ pUUID: params.folder.parent_uuid, trackNum: params.trackNum })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 编辑目录
    editCatalogFn (params) {
      console.log(params)
      let tracks = this.tracks
      this.pathDesc = ''
      // 获取当前轨道内所有文件的最大顺序号
      params['maxOrder'] = 0
      let num = params.trackNum
      let curTrack = tracks[num]
      if (curTrack && curTrack.length) {
        let arr = []
        arr = curTrack.sort((a, b) => {
          return a.list_order - b.list_order
        })
        let last = arr[arr.length - 1]
        params['maxOrder'] = last.list_order
      }

      let copy = tracks.slice(0, params.trackNum + 1)
      if (copy.length) {
        this.getPathDesc(copy, params['uuid'])
      }
      params['pathDesc'] = this.pathDesc

      this.$refs['editCatalog'].show(params)
      this.$refs['rightMenu'].hide()
    },
    // 编辑目录1
    editCatalogFn1 (params) {
      console.log(params)
      let tracks = this.tracks
      this.pathDesc = ''
      let copy = tracks.slice(0, params.trackNum + 1)
      if (copy.length) {
        this.getPathDesc(copy, params.folder.uuid)
      }
      params['pathDesc'] = this.pathDesc
      params['handler'] = 'edit'
      params['type'] = params.folder.type
      params['uuid'] = params.folder.uuid
      setTimeout(() => {
        this.$refs['editCatalog1'].show(params)
      }, 0)
    },
    // 编辑目录完成后拉取数据重置当前轨道的数据
    resetTrackData (params) {
      this.contentMenuHide()
      if (params.curUUID) {
        this.curUUID = params.curUUID
      }
      this.uuid = params.pUUID
      this.initData(params.trackNum)
      // getCatalogList({ parent_uuid: params.pUUID }).then(res => {
      //   if (res.success) {
      //     let catalogs = res.data.catalogs
      //     this.$set(this.tracks, params.trackNum, catalogs)
      //   }
      // })
    },
    getParentAuthorities (pUUID, trackNum) {
      if (trackNum === -1 || !this.tracks[trackNum]) {
        return
      }
      let folder = this.tracks[trackNum].find(item => {
        return item.uuid === pUUID
      })
      if (!folder) {
        return
      }
      let authorities = folder.authorities
      if (authorities && authorities.length) {
        return authorities
      } else {
        return this.getParentAuthorities(folder.parent_uuid, trackNum - 1)
      }
    },
    getAuthOptions (list) {
      if (list && list.length > 0) {
        list.forEach(l => {
          let obj = l
          if (obj.children.length === 0) {
            this.authorityList.push(obj)
          } else {
            let children = obj.children
            this.authorityList.push(obj)
            this.getAuthOptions(children)
          }
        })
      }
    },
    // 获取需要授权的用户列表
    async getAuthorityUsers () {
      this.authorityList = []
      this.authorityUsers = []
      let res1 = await getUserList({ page: 1, pageSize: 999 })
      this.userList = res1.data.userList
      let res = await getAuthorityList({ page: 1, pageSize: 999 })
      this.copyAuthorityList = res.data.list
      this.getAuthOptions(res.data.list)
      let arr = this.authorityList.find(item => {
        return item.authorityId === this.userInfo.authorityId
      })
      if (arr.children.length) {
        arr.children.forEach(a => {
          let aUsers = this.userList.filter(u => {
            return u.authorityId === a.authorityId
          })
          this.authorityUsers = [...this.authorityUsers, ...aUsers]
        })
      }
      console.log(this.authorityUsers)
    },
    showExportList () {
      this.exportList = []
      exportCourseContentList({ code: this.version.selCourse.uuid, pageNo: 0, pageSize: 999 }).then(res => {
        console.log(res)
        this.exportList = res.data.data.slice(0, 5)
        this.exportNum = this.exportList.filter(item => {
          return item.status !== 2
        }).length
      })
    },
    formatDate (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm')
    },
    refreshDownloadList () {
      this.showExportList()
      let timer = setInterval(() => {
        this.showExportList()
        if (this.exportNum === 0) {
          clearInterval(timer)
        }
      }, 5000)
    },
    async handleDownload (row) {
      // window.location.href = process.env.VUE_APP_BASE_API + row.url
      let a = document.createElement('a')
      // 地址
      a.href = process.env.VUE_APP_BASE_API + row.url
      // 修改文件名
      a.download = row.url.slice(row.url.lastIndexOf('/') + 1)
      // 触发点击
      document.body.appendChild(a)
      a.click()
      // 移除
      setTimeout(() => {
        document.body.removeChild(a)
      }, 1000)
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
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
  display: flex;
  flex-direction: column;
}

.tips {
  padding-left: 30px;
  padding-bottom: 10px;
  .desc {
    color: #FFFFFF;
    font-size: 12px;
    margin-right: 30px;
  }
}
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon-logo {
    cursor: pointer;
    width: 175px;
    height: 20px;
    margin-left: 20px;
    margin-right: 40px;
    background-image: url('../../../assets/images/course/icon-logo.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
  span {
    color: #FFFFFF;
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
  height: 100%;
}

.track-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  .track-wrap {
    display: flex;
    flex-direction: row;
    width: auto;
    height: 100%;
    background: #FAFAFA;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    // &::-webkit-scrollbar {
    //   width: 100%;
    //   height: 16px;
    //   border-top: 1px solid rgba($color: #333333, $alpha: .1);
    //   border-bottom: 1px solid rgba($color: #333333, $alpha: .1);
    // }
    // &::-webkit-scrollbar-thumb {
    //   border: 4px solid #FAFAFA;
    //   background: rgba($color: #000000, $alpha: 0.2);
    //   border-radius: 8px;
    // }
    // transition: width, scrollLeft ease-in .5s;
    // -moz-transition: width, scrollLeft ease-in .5s; /* Firefox 4 */
    // -webkit-transition: width, scrollLeft ease-in .5s; /* Safari 和 Chrome */
    // -o-transition: width, scrollLeft ease-in .5s; /* Opera */
    .track-item {
      vertical-align: top;
      height: 100%;
      width: 200px;
      min-width: 200px;
      background: #FAFAFA;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      // &::-webkit-scrollbar {
      //   width: 16px;
      //   height: 100%;
      //   border-left: 1px solid rgba($color: #333333, $alpha: .1);
      //   border-right: 1px solid rgba($color: #333333, $alpha: .1);
      // }
      .list {
        width: 100%;
      }
      .other {
        flex: 1;
      }
      .list {
      }
    }
  }
  // .track-wrap-width {
  //   width: 401px;
  // }
}

.back {
  .el-button {
    color: rgba($color: #ffffff, $alpha: 0.6);
    &:hover {
      color: rgba($color: #409eff, $alpha: 1);
    }
  }
}

.course {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.select-course {
  width: 400px;
}
</style>
