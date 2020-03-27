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
          <el-select v-model="form.region" filterable placeholder="请选择活动区域">
            <el-option v-for="lang in langList" :key="lang.lan_key" :label="lang.title['' + locale + '']" :value="lang.lan_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专辑封面" prop="coverV2"
          :rules="[
            { required: true, message: '专辑封面不能为空'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.coverV2" :src="form.coverV2" class="cover">
            <i v-else class="el-icon-plus cover-uploader-icon"></i>
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
            <el-tag type="warning">注：折后价必须小于等于原价，折后价等于原价说明”不打折“，折后价等于0说明”0元限免“</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="讲师照片" prop="teacherPhoto"
          :rules="[
            { required: true, message: '讲师照片不能为空'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.teacherPhoto" :src="form.teacherPhoto" class="teacher">
            <i v-else class="el-icon-plus teacher-uploader-icon"></i>
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
          <el-input type="textarea" v-model="form.teacherDesc" maxlength="120" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="宣传视频" prop="videoUrl"
          :rules="[
            { required: true, message: '请上传宣传视频'}
          ]">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-button type="primary" icon="el-icon-upload">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程海报" prop="posterUrl"
          :rules="[
            { required: true, message: '请上传课程海报'}
          ]">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.posterUrl" :src="form.posterUrl" class="cover">
            <i v-else class="el-icon-plus cover-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="直播日期">
          <el-date-picker
            v-model="form.date1"
            @change="changeDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="直播时间">
          <el-time-picker
            is-range
            v-model="form.date2"
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
      <div class="course-info" v-show="form.date1 && form.liveRate.filter(item => {return item.selected === true}).length">
        <div class="title">课程信息</div>
        <el-form-item
          label-width="200px"
          :label="course.date + ' 周' + form.liveRate.find(item => { return item.id == course.week })['text'] + ' 第' + (index + 1) + '课'"
          v-for="(course, index) in form.courses.slice(0, form.courseSlice)"
          :key="'course' + index" >
          <el-input v-model="form.courses[index].title"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="btn-area">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import {
  getLangList
} from '@/api/course'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      langList: [],
      form: {
        moduleName: '',
        coverV2: '', // 大图
        money: 0,
        moneyDiscount: 0,
        teacherPhoto: '',
        teacherName: '',
        teacherDesc: '',
        videoUrl: '',
        posterUrl: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        cover: '',
        photo: '',
        price: '',
        salePrice: '',
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
        courseSlice: 0
      }
    }
  },
  mounted () {
    this.langList = []
    getLangList({ 'pageNo': 0, 'pageSize': 999 }).then(res => {
      console.log(res)
      this.langList.push({
        lan_code: '',
        title: {
          'en': 'All',
          'zh-CN': '所有语种'
        }
      })
      this.langList = [...this.langList, ...res.data.langs]
    })
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale,
      livePrices: state => state.course.livePrices
    })
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    selLiveRate (item) {
      let index = parseInt(item.id)
      let selected = item.selected
      this.form.liveRate[index - 1].selected = !selected
      this.generateCourses()
    },
    changeDate () {
      console.log(this.form.date1)
      this.generateCourses()
    },
    generateCourses () {
      if (this.form.date1 && this.form.liveRate.filter(item => { return item.selected }).length) {
        let startDate = new Date(this.form.date1[0]).getTime()
        let endDate = new Date(this.form.date1[1]).getTime()
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
                title: ''
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

.avatar {
  width: 378px;
  height: 178px;
  display: block;
}

.price-item {
  margin: 10px;
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
}
</style>
