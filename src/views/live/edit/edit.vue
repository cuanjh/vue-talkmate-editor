<template>
  <div class="edit-container">
    <el-form ref="form" :model="form" label-width="80px">
      <div class="basic-info">
        <div class="title">基础信息</div>
        <el-form-item label="专辑名称" prop="moduleName"
          :rules="[
            { required: true, message: '专辑名称不能为空'}
          ]">
          <el-input v-model="form.moduleName" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="定级" prop="level"
          :rules="[
            { required: true, message: '请选择定级'}
          ]">
          <el-select v-model="form.level" filterable placeholder="请选择定级">
            <el-option label="无" :value="0"></el-option>
            <el-option label="1级" :value="1"></el-option>
            <el-option label="2级" :value="2"></el-option>
            <el-option label="3级" :value="3"></el-option>
          </el-select>
          <br>
          <el-tag type="warning">1级（全球说官方、签约大V、知名学者等）、2级（网红小V、兼职教师等）、3级（其他）</el-tag>
        </el-form-item>
        <el-form-item label="所属语种">
          <el-select v-model="form.lanCode" filterable placeholder="请选择所属语种" @change="changeLangCode">
            <el-option v-for="lang in langList" :key="lang.lan_key" :label="lang.title['' + locale + '']" :value="lang.lan_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="官方课程">
          <el-select v-model="form.basicCourseCode" filterable @change="changeBasicCourse">
            <el-option v-for="item in basicCourses" :key="item.code" :label="item.title['' + locale + '']" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程级别">
          <el-select v-model="form.basicContentLevel" filterable placeholder="请选择课程级别">
            <el-option label="无" value=""></el-option>
            <el-option label="L1" value="L1"></el-option>
            <el-option label="L2" value="L2"></el-option>
            <el-option label="L3" value="L3"></el-option>
            <el-option label="L4" value="L4"></el-option>
            <el-option label="L5" value="L5"></el-option>
            <el-option label="L6" value="L6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="首页封面">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,basicChapterCover')">
              <img v-if="form.basicChapterCover" :src="uploadfileDomain + form.basicChapterCover" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </div>
          </el-upload>
          <el-tag type="warning">注：直播跟官方课程相关，需要在学习首页展示</el-tag>
        </el-form-item>
        <el-form-item label="学习结束页头像">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,basicProfilePhoto')">
              <img v-if="form.basicProfilePhoto" :src="uploadfileDomain + form.basicProfilePhoto" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </div>
          </el-upload>
          <el-tag type="warning">注：直播跟官方课程相关，需要在学习结束页展示</el-tag>
        </el-form-item>
        <el-form-item label="发现频道" prop="tagKeys"
          :rules="[
            {type: 'array', required: true, message: '频道至少选择一个', trigger: 'change'}
          ]">
          <el-checkbox-group v-model="form.tagKeys">
            <el-checkbox v-for="(item, index) in disChannels" :key="item.uuid + index" :label="item.uuid" name="tagKeys">{{ item.title['zh-CN'] + ' (' + (item.showPos == 'index' ? '发现首页' : '列表页') + ')' }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="专辑封面" prop="coverV2"
          :rules="[
            { required: true, message: '专辑封面不能为空'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,coverV2')">
              <img v-if="form.coverV2" :src="uploadfileDomain + form.coverV2" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </div>
          </el-upload>
          <el-tag type="warning">注：专辑封面将在发现页大图、课程详情页上方播放器和课程列表处展示</el-tag>
        </el-form-item>
        <el-form-item label="专辑价格">
          <div class="price-item">
            <el-form-item label="原价：" prop="money"
              :rules="[
                { required: true, message: '原价不能为空'}
              ]">
              <el-select v-model="form.money" filterable>
                <el-option v-for="item in livePrices" :key="'money-' + item.value" :label="item.text" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="price-item">
            <el-form-item label="折后价：" prop="moneyDiscount"
              :rules="[
                { required: true, message: '折后价不能为空'}
              ]">
              <el-select v-model="form.moneyDiscount" filterable>
                <el-option v-for="item in livePrices" :key="'moneyDiscount-' + item.value" :label="item.text" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-tag type="warning">注：折后价必须小于等于原价，折后价等于原价说明”不打折“，折后价等于0说明”0元限免“</el-tag>
        </el-form-item>
        <el-form-item label="讲师照片" prop="teacherPhoto"
          :rules="[
            { required: true, message: '讲师照片不能为空'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,teacherPhoto')">
              <img v-if="form.teacherPhoto" :src="uploadfileDomain + form.teacherPhoto" class="teacher">
              <i v-else class="el-icon-plus teacher-uploader-icon"></i>
            </div>
          </el-upload>
          <el-tag type="warning">注：讲师照片将在发现页小图和分类课程-直播处展示</el-tag>
        </el-form-item>
        <el-form-item label="直播老师" prop="selTeacher" v-show="false">
          <el-select v-model="form.selTeacher" filterable placeholder="请选择直播老师">
            <el-option
              v-for="item in teacherList"
              :key="item.user_id"
              :label="item.live_nickname"
              :value="item.user_id">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="讲师姓名" prop="teacherName"
          :rules="[
            { required: true, message: '讲师姓名不能为空'}
          ]">
          <el-input v-model="form.teacherName" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="讲师简介" prop="teacherDesc"
          :rules="[
            { required: true, message: '讲师简介不能为空'}
          ]">
          <el-input style="width: 600px" type="textarea" v-model="form.teacherDesc" maxlength="500" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="微信号" prop="weixinNo"
          :rules="[
            { required: true, message: '微信号不能为空'}
          ]">
          <el-input v-model="form.weixinNo" maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="结束标题" prop="finishTitle"
          :rules="[
            { required: true, message: '结束标题不能为空'}
          ]">
          <el-input v-model="form.finishTitle" maxlength="12" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="结束通知" prop="finishInfo"
          :rules="[
            { required: true, message: '结束通知不能为空' }
          ]">
          <el-input style="width: 600px" type="textarea" v-model="form.finishInfo" maxlength="90" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="宣传视频" prop="videoUrl">
          <div class="video" v-if="form.videoUrl">
            <video :src="uploadfileDomain + form.videoUrl" controls></video>
          </div>
          <el-upload
            action="#"
            accept="video/mp4"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button type="primary" icon="el-icon-upload" @click="setUploadField('video,videoUrl')">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频封面" prop="videoCoverUrl">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,videoCoverUrl')">
              <img v-if="form.videoCoverUrl" :src="uploadfileDomain + form.videoCoverUrl" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程海报" prop=""
          :rules="[
            { required: true, message: '请上传课程海报'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="#"
            list-type="picture-card"
            accept="image/png,image/jpg,image/jpeg"
            :on-preview="handlePictureCardPreview"
            :on-change="uploadOnchange"
            :on-remove="handleRemove"
            :file-list="form.posters"
            :show-file-list="true"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,posters')">
              <i class="el-icon-plus"></i>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="直播日期" prop="date"
          :rules="[
            {type: 'array', required: true, message: '请选择直播日期', trigger: 'change'}
          ]">
          <el-date-picker
            v-model="form.date"
            @change="changeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排除日期">
          <el-date-picker
            type="dates"
            v-model="excludeDates"
            @change="changeExcludeDates"
            placeholder="请选择要排除掉的日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="直播时间" prop="time"
          :rules="[
            {type: 'array', required: true, message: '请选择直播时间', trigger: 'change'}
          ]">
          <el-time-picker
            is-range
            v-model="form.time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="直播频率">
          <div class="live-rate">
            <div
              :class="['item', {'active': item.selected}]"
              v-for="item in form.liveRate"
              :key="item.id"
              @click="selLiveRate(item)"
              v-text="item.text"></div>
          </div>
        </el-form-item>
        <el-form-item label="日期描述">
          <el-input style="width: 500px" type="textarea" v-model="form.dateNotice" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </div>
      <div class="course-info">
        <div class="title">课程信息</div>
        <!-- <el-form-item
          label-width="200px"
          :label="course.date + ' 周' + form.liveRate.find(item => { return item.id == course.week })['text'] + ' 第' + (index + 1) + '课'"
          v-for="(course, index) in form.courses.slice(0, form.courseSlice)"
          :key="'course' + index">
          <el-input :disabled="form.courses[index].state === -1" v-model="form.courses[index].title"></el-input>
        </el-form-item> -->
        <div class="course-list" id="course-list">
          <div class="course-item" v-for="(course, index) in form.courses" :data-id="index" :key="index">
            <div class="course-item-column">{{ '第' + (index + 1) + '课 周' + form.liveRate.find(item => { return item.id === (new Date(course.date)).getDay() + '' })['text'] }}</div>
            <div class="course-item-column">
              <div>
                <el-date-picker
                  class="date-picker"
                  :disabled="form.courses[index].state === -1"
                  size="small"
                  v-model="course.date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-picker
                  is-range
                  :disabled="form.courses[index].state === -1"
                  size="small"
                  v-model="course.times"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
              </div>
              <div class="course-title">
                <el-input size="small" v-model="form.courses[index].title"></el-input>
              </div>
            </div>
            <div class="course-item-column">
              <el-button type="primary" icon="el-icon-minus" plain @click="minusCourse(index)"></el-button>
            </div>
          </div>
        </div>
        <div class="btn-plus-course">
          <el-button type="primary" icon="el-icon-plus" plain @click="plusCourse"></el-button>
        </div>
      </div>
      <el-form-item class="btn-area">
        <el-button type="primary" @click="onSubmit" :disabled="form.courses.length == 0 || isDoubleHit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import Sortable from 'sortablejs'
import { uploadQiniu } from '@/utils/uploadQiniu'
import {
  getLangList,
  getCourseList,
  getInfoTokenUploadFile,
  getDisChannelList,
  addLive,
  editLive
  // ,
  // getTeacherList
} from '@/api/course'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      flag: '',
      code: '',
      roomInfo: {},
      langList: [],
      disChannels: [],
      uploadField: '',
      token: '',
      dialogImageUrl: '',
      dialogVisible: false,
      isDoubleHit: false,
      published: 'N',
      excludeDates: [],
      basicCourses: [],
      teacherList: [],
      form: {
        moduleName: '',
        level: 0,
        basicContentLevel: '',
        basicCourseCode: '',
        basicChapterCover: '',
        basicProfilePhoto: '',
        dateNotice: '',
        coverV2: '', // 大图
        lanCode: 'ALL',
        money: 0,
        moneyDiscount: 0,
        teacherPhoto: '',
        selTeacher: '',
        teacherName: '',
        teacherDesc: '',
        finishTitle: '',
        finishInfo: '',
        weixinNo: '',
        videoUrl: '',
        videoCoverUrl: '',
        shareBgUrl: '',
        shareTitle: '',
        shareDesc: '',
        sharePoster: [],
        posters: [],
        date: [],
        exclude_dates: [],
        time: [
          new Date(),
          new Date()
        ],
        liveRate: [
          {
            id: '1',
            text: '一',
            selected: false
          },
          {
            id: '2',
            text: '二',
            selected: false
          },
          {
            id: '3',
            text: '三',
            selected: false
          },
          {
            id: '4',
            text: '四',
            selected: false
          },
          {
            id: '5',
            text: '五',
            selected: false
          },
          {
            id: '6',
            text: '六',
            selected: false
          },
          {
            id: '0',
            text: '日',
            selected: false
          }
        ],
        courses: [],
        courseSlice: 0,
        tagKeys: ['course_listLive']
      }
    }
  },
  mounted () {
    console.log(this.$route)
    getInfoTokenUploadFile().then(res => {
      console.log(res)
      this.token = res.data.token
    })
    getDisChannelList().then(res => {
      console.log(res)
      this.disChannels = res.data.channels.filter(c => {
        return c.uuid.toLowerCase().indexOf('live') > -1
      })
    })
    this.langList = []
    getLangList({ 'pageNo': 0, 'pageSize': 999 }).then(res => {
      console.log(res)
      let langs = res.data.langs
      langs = langs.sort((a, b) => {
        if (a.is_hot > b.is_hot) {
          return -1
        } else if (a.is_hot < b.is_hot) {
          return 1
        } else {
          return 0
        }
      })
      this.langList.push({
        lan_code: 'ALL',
        title: {
          'en': 'All',
          'zh-CN': '所有语种'
        }
      })
      this.langList = [...this.langList, ...langs]
    })

    // getTeacherList({
    //   page_index: 1,
    //   page_size: 100,
    //   status: 3
    // }).then(res => {
    //   if (res.success && res.data) {
    //     this.teacherList = res.data
    //     console.log(this.teacherList)
    //   }
    // })
    this.flag = this.$route.query.flag
    if (this.flag === 'edit') {
      this.initEditInfo()
    }
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale,
      livePrices: state => state.course.livePrices,
      uploadfileDomain: state => state.course.uploadfileDomain
    })
  },
  methods: {
    initEditInfo () {
      let liveRooms = localStorage.getItem('storage_liveRooms')
      if (liveRooms) {
        liveRooms = JSON.parse(liveRooms)
        console.log(liveRooms)
        this.roomInfo = liveRooms.room
        this.published = this.roomInfo.published
        this.code = this.roomInfo.code
        this.form.moduleName = this.roomInfo.module_name
        this.form.lanCode = this.roomInfo.lan_code
        this.form.tagKeys = this.roomInfo.tag_keys
        this.form.coverV2 = this.roomInfo.cover_v2
        this.form.money = this.roomInfo.money
        this.form.moneyDiscount = this.roomInfo.moneyDiscount
        this.form.level = this.roomInfo.liveInfo.level
        this.form.basicCourseCode = this.roomInfo.liveInfo.basicCourseCode
        this.form.basicContentLevel = this.roomInfo.liveInfo.basicContentLevel
        this.form.basicChapterCover = this.roomInfo.liveInfo.basicChapterCover
        this.form.basicProfilePhoto = this.roomInfo.liveInfo.basicProfilePhoto
        this.form.dateNotice = this.roomInfo.liveInfo.dateNotice
        this.form.teacherPhoto = this.roomInfo.liveInfo.tech_photo
        this.form.selTeacher = this.roomInfo.user_id
        this.form.teacherName = this.roomInfo.liveInfo.tech_name
        this.form.teacherDesc = this.roomInfo.liveInfo.tech_desc
        this.form.weixinNo = this.roomInfo.liveInfo.weixinNo
        this.form.finishTitle = this.roomInfo.liveInfo.finishTitle
        this.form.finishInfo = this.roomInfo.liveInfo.finishInfo
        this.form.videoUrl = this.roomInfo.liveInfo.videoUrl
        this.form.videoCoverUrl = this.roomInfo.liveInfo.videoCoverUrl
        this.form.shareBgUrl = this.roomInfo.liveInfo.shareBgUrl
        this.form.shareTitle = this.roomInfo.liveInfo.shareTitle
        this.form.shareDesc = this.roomInfo.liveInfo.shareDesc
        this.form.sharePoster = this.roomInfo.liveInfo.sharePoster
        let posters = []
        this.roomInfo.liveInfo.posters.forEach(item => {
          posters.push({
            name: item,
            url: this.uploadfileDomain + item
          })
        })
        this.form.posters = posters
        this.form.date.push(this.roomInfo.liveInfo.startDate)
        this.form.date.push(this.roomInfo.liveInfo.endDate)
        this.excludeDates = []
        if (this.roomInfo.liveInfo.exclude_dates && this.roomInfo.liveInfo.exclude_dates.length > 0) {
          this.roomInfo.liveInfo.exclude_dates.forEach(d => {
            this.excludeDates.push(new Date(d))
          })
        }
        this.form.time = []
        let startTime = new Date(this.roomInfo.liveInfo.startDate + ' ' + this.roomInfo.liveInfo.startTime)
        this.form.time[0] = this.isValidDate(startTime) ? startTime : new Date()
        let endTime = new Date(this.roomInfo.liveInfo.startDate + ' ' + this.roomInfo.liveInfo.endTime)
        this.form.time[1] = this.isValidDate(endTime) ? endTime : new Date()
        if (this.roomInfo.liveInfo.weekDays && this.roomInfo.liveInfo.weekDays.length) {
          this.roomInfo.liveInfo.weekDays.forEach(w => {
            let index = this.form.liveRate.findIndex(r => {
              return r.id === w
            })
            this.form.liveRate[index].selected = true
          })
        }
        this.form.courses = []
        liveRooms.courses.forEach(c => {
          let obj = c
          let st = c.state === -1 ? c.realStartTime : c.startTime
          let et = c.state === -1 ? c.realEndTime : c.EndTime
          obj['times'] = [
            new Date(st * 1000),
            new Date(et * 1000)
          ]
          obj['week'] = this.form.liveRate.find(item => { return item.id === moment(new Date(c.date)).day() + '' })['text']
          this.form.courses.push(obj)
          this.form.courses = this.form.courses.sort((a, b) => {
            return a.listOrder - b.listOrder
          })
        })
        // this.generateCourses()
        console.log(this.roomInfo)
      }
      this.loadBasicCourses()
      this.sortCourses()
    },
    async loadBasicCourses () {
      if (this.form.lanCode !== 'ALL') {
        const res = await getCourseList({ lan_code: this.form.lanCode, pageNo: 0, pageSize: 0 })
        if (res.success) {
          this.basicCourses = []
          this.basicCourses.push({
            code: '',
            title: {
              'en': 'NONE',
              'zh-CN': '无'
            }
          })
          this.basicCourses = [...this.basicCourses, ...res.data.courses]
        }
      } else {
        this.form.basicCourseCode = ''
        this.form.basicContentLevel = ''
        this.form.basicChapterCover = ''
        this.form.basicProfilePhoto = ''
        this.basicCourses = []
      }
    },
    onSubmit () {
      let message = ''
      if (message === '' && this.form.level === 0) {
        message = '请选择定级'
      }
      if (this.form.basicCourseCode !== '') {
        if (message === '' && this.form.basicContentLevel === '') {
          message = '请选择课程级别'
        }

        if (message === '' && this.form.basicChapterCover === '') {
          message = '请上传首页封面'
        }

        if (message === '' && this.form.basicProfilePhoto === '') {
          message = '请上传结束页头像'
        }
      } else {
        if (message === '' && this.form.date.length === 0) {
          message = '请选择直播日期'
        }
        if (message === '' && this.form.time.length === 0) {
          message = '请选择直播时间'
        }
      }
      if (message === '' && this.form.videoUrl !== '' && this.form.videoCoverUrl === '') {
        message = '请上传视频封面'
      }
      if (message === '' && this.form.videoUrl === '' && this.form.videoCoverUrl !== '') {
        message = '请上传宣传视频'
      }
      if (message === '' && this.form.courses.filter(item => {
        return item.title === ''
      }).length > 0) {
        message = '请完善课程信息'
      }
      if (message !== '') {
        this.$message({
          type: 'warning',
          message: message
        })
        return false
      }
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.flag === 'add') {
            this.isDoubleHit = true
            setTimeout(() => {
              this.isDoubleHit = false
            }, 2000)
          }
          let courses = []
          this.form.courses.forEach(item => {
            let startTime = (new Date(moment(item.date).format('YYYY-MM-DD') + ' ' + moment(item.times[0]).format('HH:mm:ss'))).getTime() / 1000
            let endTime = (new Date(moment(item.date).format('YYYY-MM-DD') + ' ' + moment(item.times[1]).format('HH:mm:ss'))).getTime() / 1000
            // let state = 0
            // if (typeof item.state !== 'undefined') {
            //   state = item.state
            // }
            let obj = {
              EndTime: endTime,
              courseCode: this.code,
              cover: this.form.coverV2,
              date: moment(item.date).format('YYYY-MM-DD'),
              lanCode: this.form.lanCode,
              listOrder: item.listOrder,
              livePullUrl: item.livePullUrl ? item.livePullUrl : '',
              livePushUrl: item.livePushUrl ? item.livePushUrl : '',
              realEndTime: item.realEndTime ? item.realEndTime : 0,
              realStartTime: item.realStartTime ? item.realStartTime : 0,
              startTime: startTime,
              finishTitle: item.finishTitle ? item.finishTitle : '',
              finishInfo: item.finishInfo ? item.finishInfo : '',
              weixinNo: item.weixinNo ? item.weixinNo : '',
              title: item.title,
              uuid: item.uuid,
              state: item.state
            }
            courses.push(obj)
          })
          let weekDays = []
          this.form.liveRate.forEach(item => {
            if (item.selected) {
              weekDays.push(item.id)
            }
          })
          let posters = []
          for (let i = 0; i < this.form.posters.length; i++) {
            let p = this.form.posters[i]
            if (p.raw) {
              let date = moment(new Date()).format('YYYY/MM/DD')
              let i = p.name.lastIndexOf('.')
              let ext = p.name.substring(i + 1)
              let url = 'live/images/' + date + '/' + p.uid + '.' + ext
              let res = await uploadQiniu(p.raw, this.token, url)
              posters.push(res.key)
            } else {
              posters.push(p.name)
            }
          }
          // 同步获取图片宽和高
          for (let j = 0; j < posters.length; j++) {
            let url = posters[j]
            if (url.indexOf('?') > -1) {
              url = url.split('?')[0]
            }
            let img = await this.imgOnload(url)
            url += '?w=' + img.width + '&h=' + img.height
            posters[j] = url
          }
          let excludeDates = []
          if (this.excludeDates && this.excludeDates.length > 0) {
            this.excludeDates.forEach(d => {
              excludeDates.push(moment(d).format('YYYY-MM-DD HH:mm:ss'))
            })
          }
          let params = {
            courses: courses,
            room: {
              code: this.code,
              course_type: 6,
              cover: this.form.teacherPhoto,
              cover_v2: this.form.coverV2,
              lan_code: this.form.lanCode,
              liveInfo: {
                endDate: moment(this.form.date[1]).format('YYYY-MM-DD'),
                endTime: moment(this.form.time[1]).format('HH:mm:ss'),
                posters: posters,
                startDate: moment(this.form.date[0]).format('YYYY-MM-DD'),
                startTime: moment(this.form.time[0]).format('HH:mm:ss'),
                exclude_dates: excludeDates,
                tech_desc: this.form.teacherDesc,
                tech_name: this.form.teacherName,
                tech_photo: this.form.teacherPhoto,
                weixinNo: this.form.weixinNo,
                finishTitle: this.form.finishTitle,
                finishInfo: this.form.finishInfo,
                videoUrl: this.form.videoUrl,
                videoCoverUrl: this.form.videoCoverUrl,
                shareBgUrl: this.form.shareBgUrl,
                shareTitle: this.form.shareTitle,
                shareDesc: this.form.shareDesc,
                sharePoster: this.form.sharePoster,
                weekDays: weekDays,
                level: this.form.level,
                basicCourseCode: this.form.basicCourseCode,
                basicContentLevel: this.form.basicContentLevel,
                basicChapterCover: this.form.basicChapterCover,
                basicProfilePhoto: this.form.basicProfilePhoto,
                dateNotice: this.form.dateNotice
              },
              module_name: this.form.moduleName,
              money: this.form.money,
              moneyDiscount: this.form.moneyDiscount,
              money_type: 'CNY',
              tag_keys: this.form.tagKeys,
              user_id: this.form.selTeacher
            }
          }
          console.log(params)
          if (this.flag === 'add') {
            this.isDoubleHit = true
            setTimeout(() => {
              this.isDoubleHit = false
            }, 2000)
            addLive(params).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$router.push({ name: 'live-list' })
              }
            })
          } else {
            editLive(params).then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$router.push({ name: 'live-list' })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selLiveRate (item) {
      if (this.form.courses.length && this.form.courses.filter(c => c.state === 1 || c.state === -1).length) {
        this.$message({
          type: 'warning',
          message: '直播课程已经开始，不能调整直播频率！'
        })
        return false
      }
      let index = parseInt(item.id)
      let selected = item.selected
      if (index === 0) {
        index = 7
      }
      this.form.liveRate[index - 1].selected = !selected
      // this.generateCourses()
    },
    changeDate () {
      console.log(this.form.date)
      // this.generateCourses()
    },
    generateCourses () {
      if (this.form.date.length && this.form.liveRate.filter(item => { return item.selected }).length) {
        let startDate = new Date(this.form.date[0]).getTime()
        let endDate = new Date(this.form.date[1]).getTime()
        let count = 0
        let excludeDs = ''
        if (this.excludeDates && this.excludeDates.length > 0) {
          this.excludeDates.forEach((d, index) => {
            excludeDs += moment(d).format('YYYY-MM-DD')
            if (this.excludeDates.length - 1 !== index) {
              excludeDs += ','
            }
          })
        }
        for (let i = startDate; i <= endDate;) {
          console.log(moment(i).format('YYYY-MM-DD'), moment(i).day())
          if (this.form.liveRate.filter(item => { return item.selected && item.id === moment(i).day() + '' }).length) {
            if (this.form.courses.length > count) {
              if (excludeDs && excludeDs.indexOf(moment(i).format('YYYY-MM-DD')) > -1) {
                let fIndex = this.form.courses.findIndex(item => item.date === moment(i).format('YYYY-MM-DD'))
                console.log(this.form.courses)
                if (fIndex > -1) {
                  this.form.courses.splice(fIndex, 1)
                }
              } else {
                this.form.courses[count].date = moment(i).format('YYYY-MM-DD')
                this.form.courses[count].week = moment(i).day()
                count++
              }
            } else {
              let obj = {
                date: moment(i).format('YYYY-MM-DD'),
                week: moment(i).day(),
                title: '',
                uuid: ''
              }
              if (excludeDs === '' || excludeDs.indexOf(moment(i).format('YYYY-MM-DD')) === -1) {
                this.form.courses.push(obj)
                count++
              }
            }
          }
          i += 24 * 60 * 60 * 1000
        }
        this.form.courseSlice = count
        console.log(this.form.courses)
      }
    },
    setUploadField (name) {
      this.uploadField = name
    },
    async uploadOnchange (file, fileList) {
      let uploadIndexArr = this.uploadField.split(',')
      let dataFrom = uploadIndexArr[0]
      let feild = uploadIndexArr[1]
      let date = moment(new Date()).format('YYYY/MM/DD')
      let i = file.name.lastIndexOf('.')
      let ext = file.name.substring(i + 1)
      let url = ''
      if (dataFrom === 'audio') {
        url = 'live/sounds/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'image') {
        url = 'live/images/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'video') {
        url = 'live/videos/' + date + '/' + file.uid + '.' + ext
      }

      if (feild === 'posters') {
        this.form.posters = fileList
        return false
      }
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.form, feild, res.key)
    },
    isValidDate (date) {
      return date instanceof Date && !isNaN(date.getTime())
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove (file, fileList) {
      this.form.posters = this.form.posters.filter(f => {
        return f.name !== file.name
      })
    },
    imgOnload (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = this.uploadfileDomain + url
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          reject(new Error('图片加载失败'))
        }
      })
    },
    changeExcludeDates () {
      console.log(this.excludeDates)
      // this.generateCourses()
    },
    changeLangCode () {
      this.loadBasicCourses()
    },
    changeBasicCourse () {
      if (this.form.basicCourseCode === '') {
        this.form.basicContentLevel = ''
        this.form.basicChapterCover = ''
        this.form.basicProfilePhoto = ''
      }
    },
    minusCourse (index) {
      this.form.courses.splice(index, 1)
    },
    plusCourse () {
      let st = (this.flag === 'add') ? moment(new Date()).format('YYYY-MM-DD') + ' ' + moment(this.form.time[0]).format('HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD') + ' ' + this.roomInfo.liveInfo.startTime
      let et = (this.flag === 'add') ? moment(new Date()).format('YYYY-MM-DD') + ' ' + moment(this.form.time[1]).format('HH:mm:ss') : moment(new Date()).format('YYYY-MM-DD') + ' ' + this.roomInfo.liveInfo.endTime
      let obj = {
        EndTime: (new Date(et)).getTime() / 1000,
        date: moment(new Date()).format('YYYY-MM-DD'),
        startTime: (new Date(st)).getTime() / 1000,
        listOrder: this.form.courses.length + 1,
        state: 0,
        title: '',
        uuid: ''
      }

      obj['times'] = [
        new Date(st),
        new Date(et)
      ]
      // obj['week'] = this.form.liveRate.find(item => { return item.id === moment(new Date(obj.date)).day() + '' })['text']
      this.form.courses.push(obj)
    },
    sortCourses () {
      let el = document.getElementById('course-list')
      let sortable = new Sortable(el, {
        animation: 150,
        onEnd: (evt) => {
          let newCourses = []
          let copyCourses = this.form.courses
          let indexArr = sortable.toArray()
          console.log(indexArr)
          indexArr.forEach((item, index) => {
            let obj = copyCourses[parseInt(item)]
            obj['listOrder'] = index + 1
            newCourses.push(obj)
          })
          console.log(this.form.courses)
          console.log(newCourses)
          this.form.courses = []
          setTimeout(() => {
            this.$set(this.form, 'courses', newCourses)
          }, 0)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
  overflow: auto;
}
.title {
  font-size: 18px;
  font-weight: 500;
  color: #000000;
  margin: 20px 0;
}

.video {
  width: 300px;
  height: 200px;
  display: inline-block;
  video {
    width: 100%;
    height: 100%;
  }
}

.avatar {
  width: 378px;
  height: 178px;
  display: block;
}

.price-item {
  margin: 20px;
  label {
    width: 60px;
    display: inline-block;
    text-align: right;
  }
  .el-input-number {
    margin-right: 10px;
  }
}

.live-rate {
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  .item {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #007AFF;
    font-size: 15px;
    color: #597384;
    font-weight: 500;
    text-align: center;
    line-height: 30px;
    margin-right: 30px;
    transition: all linear .3s;
    cursor: pointer;
  }
  .active {
    background: #007AFF;
    color: #FFFFFF;
  }
}

.course-info {
  margin-top: 60px;
}

.btn-area {
  margin: 80px 0;
  text-align: center;
}
.el-form-item {
  .el-input {
    width: 600px;
  }
}

.course-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, .1)
}

.course-item-column {
  padding-right: 10px;
}

.date-picker {
  margin-right: 10px;
}

.course-title {
  margin-top: 5px;
}

.btn-plus-course {
  padding: 10px;
  text-align: right;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 343px;
  height: 192px;
  line-height: 192px;
  text-align: center;
}
.cover {
  width: 343px;
  height: 192px;
  object-fit: cover;
}

.teacher-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.teacher {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
</style>
