<template>
  <div class="version-container" id="version-container" @contextmenu="contentmenu">
    <div class="top-bar">
      <el-select
        v-model="selLang"
        filterable
        default-first-option
        placeholder="请选择语种"
        @change="initCourseVersionList">
        <el-option
          v-for="item in langList"
          :key="item['lan_code']"
          :label="item.title['' + locale + '']"
          :value="item['lan_code']">
        </el-option>
      </el-select>
      <!-- <el-select v-show="false" v-model="selCourseType" filterable placeholder="请选择课程分类"  @change="initCourseVersionList">
        <el-option
          v-for="item in courseTypes"
          :key="item.type"
          :label="item.name"
          :value="item.type">
        </el-option>
      </el-select> -->
      <el-select class="select-course" v-model="selCourseUUID" filterable placeholder="请选择课程"  @change="changeCourse">
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
      <el-select v-model="selModule" @change="initCourseVersionList">
        <el-option label="全部内容" value=""></el-option>
        <el-option label="基础内容" value="basic"></el-option>
        <el-option label="等级测试内容" value="levelGrade"></el-option>
      </el-select>
      <el-button type="primary" v-show="isHaveAuthority" @click="addVersion">创建新版本</el-button>
      <div class="tips" v-if="false">
        <el-tooltip class="item" effect="dark" content="课程数据下载列表" placement="top">
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
        </el-tooltip>
      </div>
    </div>
    <div class="tabs-wrap">
      <div class="tabs" v-for="tab in tabs" :key="tab.value">
        <div class="tabs-header" v-show="(versions.filter(f => { return f.module === tab.value }).length > 0 && !selModule) || (versions.filter(f => { return f.module === tab.value }).length > 0 && selModule && selModule === tab.value)">
          <div class="nav">
            <div class="item">{{ tab.label }}</div>
          </div>
        </div>
        <div class="tabs-content" v-show="(versions.filter(f => { return f.module === tab.value }).length > 0 && !selModule) || (versions.filter(f => { return f.module === tab.value }).length > 0 && selModule && selModule === tab.value)">
          <div class="tab-panel">
            <div class="version-list">
              <div class="version-item" v-for="item in versions.filter(f => { return f.module === tab.value })" :key="item.uuid">
                <div class="online-flag" v-show="item['is_show'] && false">
                  <span>线上</span>
                </div>
                <more-btns
                  class="more-btns"
                  :handlers="handlers"
                  :dataObj="item"
                  v-show="isHaveAuthority"/>
                <div class="content">
                  <el-tooltip effect="dark" :content="item.name" placement="top">
                    <div :class="['title', item.is_show ? '' : 'red']" v-text="item.name + ((item.module == 'levelGrade') ? '（等级测试）' : '') "></div>
                  </el-tooltip>
                  <ul>
                    <li>版本：{{ item.version }}</li>
                    <!-- <li>版本描述：{{ Object.keys(item.desc).length ? item.desc['zh-CN'] : '' }}</li> -->
                    <li>最后编辑时间：{{ item.update_time | formatDate('YYYY年MM月DD日') }}</li>
                    <li>是否展示：{{ item.is_show ? '是' : '否' }}</li>
                  </ul>
                </div>
                <div class="operate">
                  <el-button size="small" plain v-show="isHaveAuthority" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" @click="editVersion(item)">设置</el-button>
                  <el-tooltip class="item" effect="dark" content="复制" placement="top">
                    <el-button type="info" v-show="false" icon="el-icon-document-copy" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" circle @click="copyVersion(item)"></el-button>
                  </el-tooltip>
                  <el-button size="small" type="success" v-show="false" :disabled="!item.has_changed || (userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" @click="onlineJob(item)">上线</el-button>
                  <el-tooltip class="item" effect="dark" content="下线" placement="top">
                    <el-button type="warning" v-show="false" icon="el-icon-minus" circle :disabled="!item.is_show || (userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" @click="editShow(item)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button type="danger" v-show="false" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" icon="el-icon-delete" circle @click="delVerdion(item)"></el-button>
                  </el-tooltip>
                  <el-button size="small" type="primary" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" @click="courseContent(item)">编辑课程</el-button>
                  <div v-show="!lowerRoleUser">
                    <el-button
                      size="small"
                      plain
                      type="primary"
                      :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" @click="clickUpload(item)">上传内容</el-button>
                    <el-upload
                      :ref="'upload-' + item.uuid"
                      class="upload-demo"
                      accept=".xls,.xlsx"
                      :data="{
                        parent_uuid: item.uuid
                      }"
                      :headers="{
                        'x-token': token
                      }"
                      :action="api + '/editor/content/import'"
                      :show-file-list="false"
                      :before-upload="beforeUpload"
                      :on-success="uploadSuccess">
                    </el-upload>
                  </div>
                  <el-tooltip class="item" effect="dark" content="下载课程统计数据" placement="top" v-if="false">
                    <el-button type="primary" icon="el-icon-download" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" circle @click="download(item)"></el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="version-wrap">
      <div class="version-item create" v-show="isHaveAuthority" @click="addVersion">
        <i class="el-icon-plus"></i>
        <span>创建新版本</span>
      </div>
      <div class="version-item" v-for="item in versions" :key="item.uuid">
        <div class="online-flag" v-show="item['is_show'] && false">
          <span>线上</span>
        </div>
        <div class="content">
          <el-tooltip effect="dark" :content="item.name" placement="top">
            <div :class="['title', item.is_show ? '' : 'red']" v-text="item.name + ((item.module == 'levelGrade') ? '（等级测试）' : '') "></div>
          </el-tooltip>
          <ul>
            <li>版本：{{ item.version }}</li>
            <li>版本描述：{{ Object.keys(item.desc).length ? item.desc['zh-CN'] : '' }}</li>
            <li>最后修改时间：{{ item.update_time | formatDate('YYYY年MM月DD日') }}</li>
            <li>是否展示：{{ item.is_show ? '是' : '否' }}</li>
          </ul>
        </div>
        <div class="operate">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" v-show="isHaveAuthority" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" icon="el-icon-setting" circle @click="editVersion(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <el-button type="info" v-show="isHaveAuthority" icon="el-icon-document-copy" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" circle @click="copyVersion(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="上线" placement="top">
            <el-button type="success" v-show="false" :disabled="!item.has_changed || (userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" icon="el-icon-check" circle @click="onlineJob(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下线" placement="top">
            <el-button type="warning" v-show="false" icon="el-icon-minus" circle :disabled="!item.is_show || (userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" @click="editShow(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" v-show="isHaveAuthority" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" icon="el-icon-delete" circle @click="delVerdion(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑课程内容" placement="top">
            <el-button type="primary" icon="el-icon-edit" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" circle @click="courseContent(item)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="上传模板数据" placement="top">
            <div v-show="!lowerRoleUser">
            <el-button
              type="primary" icon="el-icon-upload2"
              :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" circle @click="clickUpload(item)"></el-button>
            <el-upload
              :ref="'upload-' + item.uuid"
              class="upload-demo"
              accept=".xls,.xlsx"
              :data="{
                parent_uuid: item.uuid
              }"
              :headers="{
                'x-token': token
              }"
              :action="api + '/editor/content/import'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="uploadSuccess">
            </el-upload></div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下载课程统计数据" placement="top" v-if="false">
            <el-button type="primary" icon="el-icon-download" :disabled="(userInfo.authorityId !== '1' && item.curUserAuth['auth'] == 'r')" circle @click="download(item)"></el-button>
          </el-tooltip>
        </div>
      </div>
    </div> -->
    <edit-comp ref="edit" :authorityUsers="authorityUsers" @newEditVersion="initCourseVersionList"/>
    <right-menu
      ref="rightMenu"
      @paste="paste"
    />
    <dialog-online ref="dialogOnline" @confirm="confirm" />
    <!-- <add-version ref="addVersion"/> -->
    <!-- <course-content :langList="langList" :courseTypes="courseTypes" :contents="contents" ref="content" /> -->
  </div>
</template>

<script>
// import AddVersion from './add'
// import CourseContent from '../content/content'
import moment from 'moment'

import editComp from './edit'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { addCourseVersion, delCourseVersion, editCourseVersion, addOnlineJob, setAuthority } from '@/api/course'
import { getAuthorityList } from '@/api/authority'
import { getUserList } from '@/api/user'
import RightMenu from './rightMenu'
import DialogOnline from '@/components/dialogOnline'
import MoreBtns from '@/components/moreBtns'

export default {
  data () {
    return {
      selLang: 'ENG',
      selCourseType: '',
      selCourseUUID: '',
      selModule: '',
      contents: [],
      api: process.env.VUE_APP_BASE_API,
      authorityList: [],
      copyAuthorityList: [],
      authorityUsers: [],
      copyAuthorities: [],
      loading: null,
      showExportList: false,
      exportList: [],
      exportNum: 0,
      tabs: [
        { value: 'basic', label: '基础内容' },
        { value: 'levelGrade', label: '等级测试内容' }
      ],
      handlers: [
        { key: 'copy', text: '复制', cls: '' },
        { key: 'del', text: '删除', cls: 'error' }
      ]
    }
  },
  components: {
    // AddVersion
    // CourseContent
    editComp,
    RightMenu,
    DialogOnline,
    MoreBtns
  },
  created () {
    this.getAuthorityUsers()
    this.getLangList({ 'pageNo': 0, 'pageSize': 999 })
    this.getCourseTypes()
    this.$bus.on('handlerClick', (params) => {
      this.handlerClick(params)
    })
  },
  mounted () {
    if (!this.lowerRoleUser) {
      let el = document.getElementById('version-container')
      el.oncontextmenu = (e) => {
        e.preventDefault()
      }
      el.onclick = () => {
        if (this.$refs['rightMenu']) {
          this.$refs['rightMenu'].hide()
        }
      }
    }
    if (this.version) {
      this.selLang = this.version.selLang
    }
    if (this.version && this.version.selCourse) {
      // this.selCourseType = this.version.selCourseType
      this.selCourseUUID = this.version.selCourse.uuid
    }
    this.initCourseVersionList()
  },
  watch: {
    'version.selCourse' (newVal, oldVal) {
      this.selCourseUUID = newVal.uuid
    }
  },
  computed: {
    ...mapGetters({
      token: 'user/token'
    }),
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      locale: state => state.course.locale,
      langList: state => state.course.langList,
      courseTypes: state => state.course.courseTypes,
      version: state => state.course.version,
      userInfo: state => state.user.userInfo,
      lowerRoleUser: state => state.user.lowerRoleUser
    }),
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
      // 排序规则有后端处理
      // if (arr && arr.length) {
      //   arr = arr.sort((a, b) => {
      //     let pre = a.module ? a.module : 'basic'
      //     let next = b.module ? b.module : 'basic'
      //     let flag = 0
      //     if (pre > next) {
      //       flag = 1
      //     }
      //     if (pre < next) {
      //       flag = -1
      //     }
      //     return flag
      //   })
      // }
      return arr
    },
    isHaveAuthority () {
      let flag = false
      if (this.userInfo.authorityId === '1') {
        flag = true
      } else {
        if (!this.copyAuthorityList.length) {
          return
        }
        let arr = this.copyAuthorityList.find(item => {
          return item.authorityId === '1'
        })
        if (arr.children) {
          for (let i = 0; i < arr.children.length; i++) {
            let obj = arr.children[i]
            if (obj.authorityId === this.userInfo.authorityId) {
              flag = true
              break
            }
          }
        }
      }
      return flag
    }
  },
  methods: {
    ...mapMutations({
      updateVersion: 'course/updateVersion'
    }),
    ...mapActions({
      getLangList: 'course/getLangList',
      getCourseTypes: 'course/getCourseTypes',
      getCourseList: 'course/getCourseList',
      getCourseVersions: 'course/getCourseVersions'
    }),
    initCourseVersionList () {
      this.updateVersion({ key: 'selLang', val: this.selLang })
      // this.updateVersion({ key: 'selCourseType', val: this.selCourseType })
      this.getCourseList({ 'lan_code': this.selLang, 'pageNo': 0, 'pageSize': 0 })
    },
    changeCourse () {
      let selCourse = this.version.courseList.find(f => {
        return f.uuid === this.selCourseUUID
      })
      this.updateVersion({ key: 'selCourse', val: selCourse })
      this.getCourseVersions({ 'pageNo': 0, 'pageSize': 0, 'parent_uuid': selCourse.uuid })
    },
    // 添加版本
    addVersion () {
      let version = 'V' + (this.version.versions.length + 1)
      let pUUID = ''
      if (this.version.selCourse) {
        pUUID = this.version.selCourse.uuid
      }
      let obj = {
        'name': version,
        'parent_uuid': pUUID
      }
      let params = {
        obj: obj,
        type: 'add',
        versions: this.version.versions
      }
      console.log(obj, version)
      this.$refs.edit.show(params)
      // let version = 'V' + (this.version.versions.length + 1)
      // let pUUID = ''
      // if (this.version.selCourse) {
      //   pUUID = this.version.selCourse.uuid
      // }
      // let obj = {
      //   'name': version,
      //   'parent_uuid': pUUID
      // }
      // console.log(obj)
      // await addCourseVersion(obj)
      // this.initCourseVersionList()
      // this.$refs['addVersion'].show({ version: version })
    },
    // 编辑版本
    editVersion (item) {
      console.log(item)
      let params = {
        obj: item,
        type: 'edit'
      }
      this.$refs.edit.show(params)
    },
    confirm (item) {
      let envDesc = '测试环境'
      if (item.dbEnv === 'online') {
        envDesc = '正式环境'
      }
      this.$confirm(`确定要上线${envDesc}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addOnlineJob({ db_env: item.dbEnv, jobName: item.name, online_type: 'content_version', online_uuid: item.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '上线成功'
            })
            this.initCourseVersionList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上线'
        })
      })
    },
    onlineJob (item) {
      this.$refs['dialogOnline'].show(item)
    },
    // 下线上线
    editShow (item) {
      console.log(item)
      let obj = {
        uuid: item.uuid,
        content_info: {
          cover: item.cover ? item.cover : [],
          desc: item.desc ? item.desc : {},
          flag: item.flag ? item.flag : [],
          has_changed: item.has_changed ? item.has_changed : true,
          is_show: !item.is_show,
          name: item.name ? item.name : '',
          tags: [],
          title: item.title ? item.title : {},
          update_time: item.update_time ? item.update_time : 0
        }
      }
      editCourseVersion(obj).then(res => {
        this.initCourseVersionList()
      })
    },
    // 删除版本
    delVerdion (item) {
      let uid = item.uuid
      console.log(item, uid)
      this.$confirm('此操作将永久删除该版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCourseVersion({ uuid: uid }).then(res => {
          if (res.success) {
            this.initCourseVersionList()
          } else {
            this.$message({
              type: 'warning',
              message: res.msg
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 课程内容
    courseContent (item) {
      this.updateVersion({ key: 'selVersion', val: item.uuid })
      this.updateVersion({ key: 'uuid', val: item.uuid })
      this.$router.push({ path: '/course-content' })
      // this.$refs['content'].show({ lang: this.selLang, courseType: this.selCourseType, version: item.version, uuid: item.uuid })
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
      let userList = res1.data.userList
      let res = await getAuthorityList({ page: 1, pageSize: 999 })
      this.copyAuthorityList = res.data.list
      this.getAuthOptions(res.data.list)
      let arr = this.authorityList.find(item => {
        return item.authorityId === this.userInfo.authorityId
      })
      if (arr.children.length) {
        arr.children.forEach(a => {
          let aUsers = userList.filter(u => {
            return u.authorityId === a.authorityId
          })
          this.authorityUsers = [...this.authorityUsers, ...aUsers]
        })
      }
      console.log(this.authorityUsers)
    },
    cascaderFilterMethod (node, keyWord) {
      console.log(node, keyWord)
    },
    // form区域右键菜单
    contentmenu (ev) {
      if (this.lowerRoleUser) {
        return false
      }
      this.$refs['rightMenu'].show(ev)
    },
    // 复制版本
    copyVersion (item) {
      this.$message({
        type: 'success',
        message: '复制成功'
      })
      let obj = {
        selLang: this.selLang,
        selCourseType: this.version.selCourse.course_type,
        version: item
      }
      localStorage.setItem('copyVersion', JSON.stringify(obj))
    },
    // 粘贴
    async paste () {
      let pUUID = ''
      if (this.version.selCourse) {
        pUUID = this.version.selCourse.uuid
      } else {
        this.$message({
          type: 'warning',
          message: '请选择课程'
        })
        return false
      }
      let copy = localStorage.getItem('copyVersion') ? JSON.parse(localStorage.getItem('copyVersion')) : ''
      if (!copy) {
        this.$message({
          type: 'warning',
          message: '请先复制要粘贴的版本'
        })
        return false
      }
      if (copy.selCourseType !== this.version.selCourse.course_type) {
        this.$message({
          type: 'warning',
          message: '请选择相同的课程分类再粘贴'
        })
        return false
      }
      let copySameLang = false
      if (this.selLang === copy.selLang) {
        copySameLang = true
      }
      let obj = {
        copy_from_uuid: copy.version.uuid,
        copy_same_lang: copySameLang,
        cover: copy.version.cover,
        desc: copy.version.desc,
        flag: copy.version.flag,
        has_changed: true,
        is_show: true,
        module: copy.version.module,
        name: '复制-' + copy.version.name,
        parent_uuid: pUUID,
        tags: copy.version.tags,
        title: copy.version.title
      }
      let res = await addCourseVersion(obj)
      if (res.success) {
        let copyAuthorities = {
          authorities: [{
            authority: 'rw',
            user_uuid: this.userInfo.uuid
          }],
          type: 'content_version',
          uuid: res.data.uuid
        }
        await setAuthority(copyAuthorities)
        this.initCourseVersionList()
        localStorage.removeItem('copyVersion')
        this.$refs['rightMenu'].hide()
      }
    },
    clickUpload (item) {
      console.log(this.$refs['upload-' + item.uuid][0].$refs['upload-inner'])
      const uploadInner = this.$refs['upload-' + item.uuid][0].$refs['upload-inner']
      this.$confirm('确定要上传吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        uploadInner.handleClick()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        })
      })
    },
    beforeUpload (file) {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    // 上传
    uploadSuccess (res, file, fileList) {
      this.loading.close()
      console.log(res)
      if (res.success) {
        this.$message({
          type: 'success',
          message: res.msg
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.err
        })
      }
    },
    formatDate (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm')
    },
    download (item) {
      console.log(item)
      // exportCourseContent({ id: item.uuid }).then(res => {
      //   if (res.success) {
      //     this.$message({
      //       type: 'success',
      //       message: '请求已发送，请到下载任务列表中下载'
      //     })
      //   }
      // })
    },
    handlerClick (params) {
      console.log(params)
      const data = params.data
      switch (params.type) {
        case 'copy':
          this.copyVersion(data)
          break
        case 'del':
          this.delVerdion(data)
          break
        default:
          break
      }
    }
  },
  destroyed () {
    this.$bus.off('handlerClick')
  }
}
</script>

<style lang="scss" scoped>
.version-container {
  position: relative;
  flex: 1;
  .top-bar{
    margin-top: 20px;
    display: flex;
    flex-direction: row;
  }
  .version-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 20px 0;
  }
  .version-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .version-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 280px;
    // height: 240px;
    background: rgba($color: #000000, $alpha: 0.05);
    border-radius: 4px;
    margin: 15px;
    transition: all .3s ease;
    -webkit-transition: all ease .3s;
    -moz-transition: all ease .3s;
    -o-transition: all ease .3s;
    // cursor: pointer;
    // &:hover {
    //   box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    // }
    // &:active {
    //   box-shadow: 0px 9px 24px 0px rgba(0,0,0,0.12);
    // }
  }
  .create {
    text-align: center;
    display: flex;
    flex-direction: column;
    min-height: 250px;
    cursor: pointer;
    i {
      margin-top: 88px;
      font-size: 24px;
      color: #007AFF;
    }
    span {
      color: #000000;
      font-size: 16px;
      font-weight: 400;
      margin-top: 10px;
    }
  }
  .online-flag {
    position: absolute;
    border: 45px solid;
    border-color: transparent transparent #007AFF transparent;
    transform: rotate(-45deg) translateY(-70px) translateX(0px);
    -webkit-transform: rotate(-45deg) translateY(-70px) translateX(0px);
    -moz-transform: rotate(-45deg) translateY(-70px) translateX(0px);
    -ms-transform: rotate(-45deg) translateY(-70px) translateX(0px);
    span {
      position: absolute;
      width: 100px;
      margin-top: 23px;
      margin-left: -13px;
      font-size: 12px;
      font-weight: 400;
      color: #fff;
    }
  }
  .content {
    position: relative;
    min-height: 174px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
    .title {
      padding-top: 16px;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      line-height:22px;
      color: #000;
      width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ul {
      padding-top: 10px;
      padding-left: 30px;
      li {
        font-size: 12px;
        line-height:17px;
        font-weight: 400;
        color: #000;
        padding-top: 13px;
        &:nth-child(2) {
          max-height: 50px;
          overflow: hidden;
        }
      }
    }
  }
  .operate {
    // height: 100%;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 5px 15px;
    .el-button {
      margin: 5px;
    }
    // transition: all .3s ease;
    // cursor: pointer;
    // &:hover {
    //   background: rgba(0,122,255,.05);
    // }
    // &:active {
    //   background: rgba(0,122,255,1);
    //   span {
    //     color: #fff;
    //   }
    // }
    // span {
    //   font-size: 14px;
    //   font-weight: 400;
    //   color: #007AFF;
    //   line-height: 20px;
    // }
  }

  .upload-demo {
    position: absolute;
  }
  .operate-shade {
    position: absolute;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.7);
    top: 0;
    .desc {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      line-height: 22px;
    }
    .btns {
      margin-top: 28px;
      .cancel {
        display: inline-block;
        width: 90px;
        height: 30px;
        background: #fff;
        border-radius: 4px;
        color: #007AFF;
        font-size: 14px;
        font-weight: 400;
        margin: 0 20px;
        line-height: 30px;
      }
      .ok {
        display: inline-block;
        width: 90px;
        height: 30px;
        background: #007AFF;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        margin: 0 20px;
        line-height: 30px;
      }
    }
  }
}

.el-select {
  margin-right: 20px;
}

.course {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.select-course {
  width: 400px;
}

.tips {
  position: absolute;
  right: 50px;
}

.red {
  color: red !important;
}

.el-tabs {
  margin: 20px 0;
}

.el-tabs__header {
  margin: 0;
}
.el-tab-pane {
  background: #f6f7fa;
}

.tabs {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
}

.tabs-header {
  position: relative;
  .nav {
    background: #d1d8ed;
    white-space: nowrap;
    position: relative;
    transition: -webkit-transform .3s;
    -webkit-transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    float: left;
    z-index: 2;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .item {
      padding: 0 20px;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      position: relative;
    }
  }
}

.tabs-content {
  overflow: hidden;
  position: relative;
  .tab-panel {
    background: #f6f7fa;
    min-height: 200px;
    width: 100%;
  }
}

.more-btns {
  right: 10px;
  top: 5px;
}
</style>
