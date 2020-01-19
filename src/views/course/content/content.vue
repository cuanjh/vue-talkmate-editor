<template>
  <el-container class="content-container">
    <el-header height="70px">
      <div class="top-bar">
        <div class="left">
          <div class="icon-logo"></div>
          <el-select v-model="selLang" size="small" placeholder="请选择语言">
            <el-option
              v-for="item in langs"
              :key="item.code"
              :label="item.text"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="selProject" size="small" placeholder="请选择项目">
            <el-option
              v-for="item in projects"
              :key="item.code"
              :label="item.text"
              :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="selVersion" size="small" placeholder="请选择版本">
            <el-option
              v-for="item in versions"
              :key="item.code"
              :label="item.text"
              :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="right">
          <div class="back">
            <span>返回主页</span>
          </div>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="track-container">
        <div class="track-wrap">
          <div class="track-item">
            <ul>
              <folder class="active" :name="'初级A1'"/>
              <folder :name="'初级A2'"/>
              <folder :name="'中级B1'"/>
              <folder :name="'中级B2'"/>
              <folder :name="'高级C1'"/>
              <folder :name="'高级C2'"/>
            </ul>
          </div>
          <div class="track-item">
            <ul>
              <folder :name="'课程1'"/>
              <folder :name="'课程2'"/>
              <folder :name="'课程3'"/>
              <folder :name="'课程4'"/>
              <folder :name="'课程5'"/>
              <folder :name="'课程6'"/>
              <folder :name="'课程7'"/>
              <folder :name="'课程8'"/>
              <folder :name="'...'"/>
              <folder :name="'课程24'"/>
            </ul>
          </div>
          <div class="track-item">
            <ul>
              <folder :name="'PRO'"/>
            </ul>
          </div>
          <div class="track-item">
            <ul>
              <folder :name="'核心1'"/>
              <folder :name="'核心2'"/>
              <folder :name="'...'"/>
              <folder :name="'写作'"/>
              <folder :name="'听说'"/>
            </ul>
          </div>
        </div>
        <div class="track-content">
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
    <right-menu></right-menu>
  </el-container>
</template>

<script>
import Folder from './folder'
import Slide from './slide'
import RightMenu from './rightMenu'
export default {
  data () {
    return {
      isShow: false,
      langs: [{
        code: 'ENG',
        text: '英语'
      }, {
        code: 'FRN',
        text: '法语'
      }],
      selLang: 'ENG',
      projects: [{
        code: 0,
        text: 'PRO'
      }, {
        code: 3,
        text: 'KID'
      }],
      selProject: 0,
      versions: [{
        code: 1,
        text: 'V1'
      }, {
        code: 2,
        text: 'V2'
      }],
      selVersion: 1,
      selSlide: '1',
      slideHeight: 0
    }
  },
  components: {
    Folder,
    Slide,
    RightMenu
  },
  mounted () {
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.slideHeight = h - 130
    document.oncontextmenu = (e) => {
      e.preventDefault()
    }
  },
  methods: {
    show (params) {
      this.selLang = params.langCode
      this.selProject = params.courseType
      this.selVersion = 1
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    switchSlide (num) {
      this.selSlide = num
    }
  }
}
</script>

<style lang="scss" scoped>
.content-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 999;
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
    width: 50%;
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
    width: 50%;
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
</style>
