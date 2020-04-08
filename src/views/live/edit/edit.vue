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
        <el-form-item label="所属语种">
          <el-select v-model="form.lanCode" filterable placeholder="请选择所属语种">
            <el-option v-for="lang in langList" :key="lang.lan_key" :label="lang.title['' + locale + '']" :value="lang.lan_code"></el-option>
          </el-select>
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
              <img v-if="form.coverV2" :src="assetsUrl + form.coverV2" class="cover">
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
                <el-option v-for="item in livePrices" :key="item.value" :label="item.text" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="price-item">
            <el-form-item label="折后价：" prop="moneyDiscount"
              :rules="[
                { required: true, message: '折后价不能为空'}
              ]">
              <el-select v-model="form.moneyDiscount" filterable>
                <el-option v-for="item in livePrices" :key="item.value" :label="item.text" :value="item.value"></el-option>
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
              <img v-if="form.teacherPhoto" :src="assetsUrl + form.teacherPhoto" class="teacher">
              <i v-else class="el-icon-plus teacher-uploader-icon"></i>
            </div>
          </el-upload>
          <el-tag type="warning">注：讲师照片将在发现页小图和分类课程-直播处展示</el-tag>
        </el-form-item>
        <el-form-item label="讲师姓名" prop="teacherName"
          :rules="[
            { required: true, message: '讲师姓名不能为空'}
          ]">
          <el-input v-model="form.teacherName" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="讲师简介" prop="teacherDesc"
          :rules="[
            { required: true, message: '讲师简介不能为空'}
          ]">
          <el-input style="width: 600px" type="textarea" v-model="form.teacherDesc" maxlength="120" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="宣传视频" prop="videoUrl"
          :rules="[
            { required: true, message: '请上传宣传视频'}
          ]">
          <div class="video" v-if="form.videoUrl">
            <video :src="assetsUrl + form.videoUrl" controls></video>
          </div>
          <el-upload
            action="#"
            accept="video/mp4"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <el-button type="primary" icon="el-icon-upload" @click="setUploadField('image,videoUrl')">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="视频封面" prop="videoCoverUrl"
          :rules="[
            { required: true, message: '请上传课程海报'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,videoCoverUrl')">
              <img v-if="form.videoCoverUrl" :src="assetsUrl + form.videoCoverUrl" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程海报" prop="posterUrl"
          :rules="[
            { required: true, message: '请上传课程海报'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="#"
            accept="image/png,image/jpg,image/jpeg"
            :on-change="uploadOnchange"
            :show-file-list="false"
            :auto-upload="false">
            <div class="upload-area" @click="setUploadField('image,posterUrl')">
              <img v-if="form.posterUrl" :src="assetsUrl + form.posterUrl" class="cover">
              <i v-else class="el-icon-plus cover-uploader-icon"></i>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="直播日期" prop="date"
          :rules="[
            {type: 'array', required: true, message: '请选择直播日期', trigger: 'change'}
          ]">
          <el-date-picker
            v-model="form.date"
            @change="changeDate"
            :disabled="form.courses.slice(0, form.courseSlice).filter(c => { return c.state === 0 || c.state === -1 }).length > 0"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
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
      </div>
      <div class="course-info" v-show="form.date && form.liveRate.filter(item => {return item.selected === true}).length">
        <div class="title">课程信息</div>
        <el-form-item
          label-width="200px"
          :label="course.date + ' 周' + form.liveRate.find(item => { return item.id == course.week })['text'] + ' 第' + (index + 1) + '课'"
          v-for="(course, index) in form.courses.slice(0, form.courseSlice)"
          :key="'course' + index">
          <el-input :disabled="form.courses[index].state === -1" v-model="form.courses[index].title"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="btn-area">
        <el-button type="primary" @click="onSubmit" :disabled="form.courses.length == 0">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { uploadQiniu } from '@/utils/uploadQiniu'
import {
  getLangList,
  getInfoToken,
  getDisChannelList,
  addLive,
  editLive
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
      assetsUrl: '',
      token: '',
      form: {
        moduleName: '',
        coverV2: '', // 大图
        lanCode: 'ALL',
        money: 0,
        moneyDiscount: 0,
        teacherPhoto: '',
        teacherName: '',
        teacherDesc: '',
        videoUrl: '',
        videoCoverUrl: '',
        posterUrl: '',
        date: [],
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
        tagKeys: []
      }
    }
  },
  mounted () {
    console.log(this.$route)
    getInfoToken().then(res => {
      this.token = res.data.token
    })
    getDisChannelList().then(res => {
      console.log(res)
      this.disChannels = res.data.channels.filter(c => {
        return c.title['zh-CN'].indexOf('直播') > -1
      })
    })
    this.langList = []
    getLangList({ 'pageNo': 0, 'pageSize': 999 }).then(res => {
      console.log(res)
      this.assetsUrl = res.data.assetsUrl
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
    this.flag = this.$route.query.flag
    if (this.flag === 'edit') {
      this.initEditInfo()
    }
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale,
      livePrices: state => state.course.livePrices
    })
  },
  methods: {
    initEditInfo () {
      let liveRooms = localStorage.getItem('storage_liveRooms')
      if (liveRooms) {
        liveRooms = JSON.parse(liveRooms)
        console.log(liveRooms)
        this.roomInfo = liveRooms.room
        this.code = this.roomInfo.code
        this.form.moduleName = this.roomInfo.module_name
        this.form.lanCode = this.roomInfo.lan_code
        this.form.tagKeys = this.roomInfo.tag_keys
        this.form.coverV2 = this.roomInfo.cover_v2
        this.form.money = this.roomInfo.money
        this.form.moneyDiscount = this.roomInfo.moneyDiscount
        this.form.teacherPhoto = this.roomInfo.liveInfo.tech_photo
        this.form.teacherName = this.roomInfo.liveInfo.tech_name
        this.form.teacherDesc = this.roomInfo.liveInfo.tech_desc
        this.form.videoUrl = this.roomInfo.liveInfo.videoUrl
        this.form.videoCoverUrl = this.roomInfo.liveInfo.videoCoverUrl
        this.form.posterUrl = this.roomInfo.liveInfo.posters[0]
        this.form.date.push(this.roomInfo.liveInfo.startDate)
        this.form.date.push(this.roomInfo.liveInfo.endDate)
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
        this.form.courses = liveRooms.courses
        this.generateCourses()
        console.log(this.roomInfo)
      }
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let courses = []
          let listOrder = 1
          this.form.courses.slice(0, this.form.courseSlice).forEach(item => {
            let startTime = (new Date(item.date + ' ' + moment(this.form.time[0]).format('HH:mm:ss'))).getTime() / 1000
            let endTime = (new Date(item.date + ' ' + moment(this.form.time[1]).format('HH:mm:ss'))).getTime() / 1000
            let obj = {
              EndTime: item.state === 0 ? endTime : item.EndTime,
              courseCode: this.code,
              cover: this.form.coverV2,
              date: item.date,
              lanCode: this.form.lanCode,
              listOrder: listOrder,
              startTime: item.state === 0 ? startTime : item.startTime,
              title: item.title,
              uuid: item.uuid,
              state: item.state
            }
            courses.push(obj)
            listOrder++
          })
          let weekDays = []
          this.form.liveRate.forEach(item => {
            if (item.selected) {
              weekDays.push(item.id)
            }
          })
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
                posters: [
                  this.form.posterUrl
                ],
                startDate: moment(this.form.date[0]).format('YYYY-MM-DD'),
                startTime: moment(this.form.time[0]).format('HH:mm:ss'),
                tech_desc: this.form.teacherDesc,
                tech_name: this.form.teacherName,
                tech_photo: this.form.teacherPhoto,
                videoUrl: this.form.videoUrl,
                videoCoverUrl: this.form.videoCoverUrl,
                weekDays: weekDays
              },
              module_name: this.form.moduleName,
              money: this.form.money,
              moneyDiscount: this.form.moneyDiscount,
              money_type: 'CNY',
              tag_keys: this.form.tagKeys
            }
          }
          console.log(params)
          if (this.flag === 'add') {
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
      if (this.form.courses.length && this.form.courses.filter(c => c.state === 0 || c.state === -1).length) {
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
      this.generateCourses()
    },
    changeDate () {
      console.log(this.form.date)
      this.generateCourses()
    },
    generateCourses () {
      if (this.form.date.length && this.form.liveRate.filter(item => { return item.selected }).length) {
        let startDate = new Date(this.form.date[0]).getTime()
        let endDate = new Date(this.form.date[1]).getTime()
        let count = 0
        for (let i = startDate; i <= endDate;) {
          console.log(moment(i).format('YYYY-MM-DD'), moment(i).day())
          if (this.form.liveRate.filter(item => { return item.selected && item.id === moment(i).day() + '' }).length) {
            if (this.form.courses.length > count) {
              this.form.courses[count].date = moment(i).format('YYYY-MM-DD')
              this.form.courses[count].week = moment(i).day()
            } else {
              let obj = {
                date: moment(i).format('YYYY-MM-DD'),
                week: moment(i).day(),
                title: '',
                uuid: ''
              }
              this.form.courses.push(obj)
            }
            count++
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
    async uploadOnchange (file) {
      let uploadIndexArr = this.uploadField.split(',')
      let dataFrom = uploadIndexArr[0]
      let feild = uploadIndexArr[1]
      let date = moment(new Date()).format('YYYY/MM/DD')
      let ext = file.name.split('.')[1]
      let url = ''
      if (dataFrom === 'audio') {
        url = 'live/sounds/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'image') {
        url = 'live/images/' + date + '/' + file.uid + '.' + ext
      } else if (dataFrom === 'video') {
        url = 'live/videos/' + date + '/' + file.uid + '.' + ext
      }
      let res = await uploadQiniu(file.raw, this.token, url)
      this.$set(this.form, feild, res.key)
    },
    isValidDate (date) {
      return date instanceof Date && !isNaN(date.getTime())
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
.el-input {
  width: 600px;
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
