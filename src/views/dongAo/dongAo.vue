<template>
  <div class="dongao-container" ref="content" @scroll="handlerScroll">
    <div class="top-bar">
      <el-row>
        <el-col :span="24">
          <el-input v-model="school" placeholder="请输入想要查找的学校" @change="handlerSearch"></el-input>
          <el-input v-model="name" placeholder="请输入想要查找的姓名" @change="handlerSearch"></el-input>
          <el-input v-model="entroll_no" placeholder="请输入想要查找的编号" @change="handlerSearch"></el-input>
          <el-input v-model="phone" placeholder="请输入想要查找的手机号" @change="handlerSearch"></el-input>
          <el-select v-model="selLang" filterable placeholder="请选择语言" @change="handlerSearch">
            <el-option label="所有语言" value=""></el-option>
            <el-option label="中文" value="中文"></el-option>
            <el-option label="英文" value="英文"></el-option>
          </el-select>
          <el-select v-model="selGroup" filterable placeholder="请选择分组" @change="handlerSearch">
            <el-option label="所有分组" value=""></el-option>
            <el-option label="小学组" value="小学组"></el-option>
            <el-option label="中学组" value="中学组"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" class="mt10">
          为你查找到{{ list.length }}名小使者
        </el-col>
        <el-col :span="10">
          <div class="sort" @click="sort">
            <i class="el-icon-sort"></i>
            <span>编号{{ sortType == 1 ? '倒序' : '升序' }}排列</span>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="download">下载</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table">
      <div class="tb-header">
        <el-row>
          <el-col class="center" :span="3">编号</el-col>
          <el-col class="center" :span="10">报名信息</el-col>
          <el-col class="center" :span="3">指导老师</el-col>
          <el-col class="center" :span="5">参赛视频</el-col>
          <el-col class="center" :span="3"></el-col>
        </el-row>
      </div>
      <div class="tb-body" v-if="list.length > 0">
        <div class="item" v-for="(item, index) in list" :key="index">
          <el-row class="item-row">
            <el-col class="center" :span="3">{{ item.entroll_no }}</el-col>
            <el-col class="center" :span="10">
              <div class="info">
                <div class="left">
                  <p>姓名：{{ item.name }}</p>
                  <p>电话：{{ item.phone }}</p>
                  <p>班级：{{ item.class }}</p>
                  <p>学校：{{ item.school }}</p>
                </div>
                <div class="right">
                  <p>{{ item.lang }}</p>
                  <p>{{ item.group }}</p>
                  <p>{{ item.project }}</p>
                </div>
              </div>
            </el-col>
            <el-col class="center" :span="3">{{ item.teacher }}</el-col>
            <el-col class="center" :span="5">
              <video-item
                v-if="item.dynamics && item.dynamics.length > 0"
                :url="item.dynamics[0]['video_url']"
                :num="item.dynamics.length"
                @openVideo="openVideo"/>
            </el-col>
            <el-col class="center" :span="3">
              <div class="handler">
                <i
                  :class="['el-icon-arrow-up', 'is-expand', item.isExpand ? 'rotate' : '']"
                  v-if="item.dynamics && item.dynamics.length > 1"
                  @click="expandRow(index)"></i>
                <el-button v-if="userInfo.authorityId == '1'" size="small" class="btn-del" type="danger" @click="del(item)">删除</el-button>
                <el-upload
                  v-if="userInfo.authorityId == '1'"
                  class="upload-demo"
                  action="#"
                  accept="video/mp4"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleChange">
                  <el-button size="small" type="primary" @click="setSelItem(item)">上传</el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <transition name="fade">
            <div class="videos" :data-index="index" v-if="item.dynamics && item.dynamics.length > 0 && item.isExpand">
              <video-item
                class="mr50 mb10"
                v-for="(v, i) in item.dynamics"
                :key="i"
                :url="v['video_url']"
                :num="item.dynamics.length - i"
                @openVideo="openVideo"/>
            </div>
          </transition>
        </div>
      </div>
      <div class="tb-body" v-else>
        <el-row class="no-data">
          <el-col :span="24" class="no-data-desc center">暂无数据</el-col>
        </el-row>
      </div>
    </div>
    <video-comp ref="video"/>
  </div>
</template>

<script>
import VideoItem from './videoItem.vue'
import VideoComp from './video.vue'

import {
  getDongAoList,
  delDongAo,
  getInfoTokenUploadFile,
  createDynamic
  // ,
  // downloadDongAoList
} from '@/api/course'
import { uploadQiniu } from '@/utils/uploadQiniu'

import { mapState } from 'vuex'
import moment from 'moment'

let onlyOne = true

export default {
  data () {
    return {
      searchKey: '',
      school: '',
      name: '',
      entroll_no: '',
      phone: '',
      selLang: '',
      selGroup: '',
      list: [],
      currentPage: 1,
      pageSize: 9999999,
      sortType: -1,
      scrollTop: 0,
      selItem: {}
    }
  },
  components: {
    VideoItem,
    VideoComp
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    handlerScroll (e) {
      if (e.target.scrollTop + e.target.offsetHeight === e.target.scrollHeight && onlyOne) {
        this.scrollTop = e.target.scrollHeight - e.target.offsetHeight
        onlyOne = false
        this.currentPage++
        this.initData()
      }
    },
    handlerSearch () {
      this.currentPage = 1
      this.initData()
    },
    setSelItem (item) {
      this.selItem = item
    },
    async handleChange (e) {
      console.log(e)
      const res = await getInfoTokenUploadFile()
      const token = res.data.token
      let date = moment(new Date()).format('YYYY/MM/DD')
      let url = 'feed/video/' + date + '/' + e.uid + '.mp4'
      let res1 = await uploadQiniu(e.raw, token, url)
      createDynamic({
        content: '#冬奥会语言服务小使者#',
        topic_key: 'dongAo',
        type_info: 'video',
        user_id: this.selItem.user_id,
        video_url: res1.key
      }).then(r => {
        if (r.success) {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.handlerSearch()
        }
      })
    },
    initData () {
      getDongAoList({
        school: this.school,
        name: this.name,
        entroll_no: this.entroll_no ? parseInt(this.entroll_no) : null,
        phone: this.phone,
        lang: this.selLang,
        group: this.selGroup,
        page_index: this.currentPage,
        page_size: this.pageSize,
        text_field: 'entroll_no',
        sort_type: this.sortType
      }).then((res) => {
        console.log(res)
        if (res.success && res.data) {
          let arr = []
          res.data.map(item => {
            let obj = item
            obj['isExpand'] = false
            arr.push(obj)
          })
          if (this.currentPage === 1) {
            this.list = arr
          } else {
            let copy = this.list.slice()
            this.list = copy.concat(arr)
          }
          setTimeout(() => {
            if (this.currentPage === 1) {
              this.$refs['content'].scrollTop = 0
            } else {
              this.$refs['content'].scrollTop = this.scrollTop
            }
            onlyOne = true
          }, 0)
        } else {
          if (this.currentPage === 1) {
            this.list = []
          }
        }
      })
    },
    openVideo (url) {
      this.$refs['video'].show(url)
    },
    expandRow (index) {
      this.list[index]['isExpand'] = !this.list[index]['isExpand']
    },
    sort () {
      if (this.sortType === -1) {
        this.sortType = 1
      } else {
        this.sortType = -1
      }
      this.currentPage = 1
      this.initData()
    },
    del (item) {
      console.log(item)
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDongAo({ user_id: item.user_id }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })

            let findex = this.list.findIndex(f => {
              return f.user_id === item.user_id
            })
            this.list.splice(findex, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    download () {
      const obj = {
        school: this.school,
        name: this.name,
        entroll_no: this.entroll_no ? parseInt(this.entroll_no) : null,
        phone: this.phone,
        lang: this.selLang,
        group: this.selGroup,
        page_index: this.currentPage,
        page_size: this.pageSize,
        text_field: 'entroll_no',
        sort_type: this.sortType
      }
      let objStr = ''
      Object.keys(obj).forEach(key => {
        objStr += `${key}=${obj[key]}&`
      })
      const url = `/editor/dong_ao/download?${objStr}`
      window.location.href = process.env.VUE_APP_BASE_API + url
      // downloadDongAoList(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.dongao-container {
  padding: 20px 20px 50px;
  flex: 1;
  overflow: auto;
}

.el-input {
  margin-right: 10px;
  width: 180px;
}
.el-select {
  width: 100px;
}

.top-bar {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.sort {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-top: 4px;
  i {
    font-size: 30px;
    margin-right: 4px;
  }
  span {
    font-size: 18px;
  }
}

.el-pagination {
  text-align: center;
  margin-top: 30px;
}

.table {
  .tb-header {
    padding: 15px 0;
    border-bottom: 1px solid #efefef;
  }
}

.center {
  text-align: center;
}

.no-data {
  padding: 15px 0;
  border-bottom: 1px solid #efefef;
  .no-data-desc {
    color: #909399;
  }
}

.item {
  .item-row {
    padding: 30px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

.info {
  display: flex;
  flex-direction: row;
  .left {
    width: 312px;
    padding: 10px 23px;
    display: flex;
    flex-direction: column;
    background: rgba(0,70,201,.1);
    border-radius: 10px;
    p {
      padding: 4px 0;
      font-size: 14px;
      font-weight: 400;
      text-align: left;
      color: #000000;
      line-height: 20px;
    }
  }
  .right {
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 105px;
      padding: 7px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      border-radius: 6px;
      word-break: break-all;
      &:nth-child(1) {
        background: rgba(7,137,130,.1);
        color: rgba(7,137,130,1);
      }
      &:nth-child(2) {
        background: rgba(255,134,12,.1);
        color: rgba(255,134,12,1);
      }
      &:nth-child(3) {
        background: rgba(231,238,250,1);
        color: rgba(4,46,117,1)
      }
    }
  }
}

.videos {
  padding: 30px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: wrap;
  border-bottom: 1px solid #efefef;
}

.is-expand {
  cursor: pointer;
  transition: all linear .3s;
  -webkit-transition: all linear .3s;
  -moz-transition: all linear .3s;
}

.rotate {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
}

.btn-del {
  margin: 15px;
}

.handler {
  width: 140px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
