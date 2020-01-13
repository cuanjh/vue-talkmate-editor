<template>
  <div class="level-container">
    <div class="search">
      <input type="text" v-model="searchKey" placeholder="输入内容关键字">
      <span>搜索</span>
    </div>
    <div class="chapter-list test" :style="{'height': height + 'px'}">
      <div class="chapter-item" v-for="item in chapters" :key="item.index">
        <div class="more" @mouseleave="isShow = false">
          <i class="el-icon-more" @mouseenter="isShow = true"></i>
          <ul class="operate" v-show="isShow">
            <li><i class="el-icon-edit"></i>编辑</li>
            <li><i class="el-icon-view"></i>预览</li>
            <li><i class="el-icon-error"></i>删除</li>
          </ul>
        </div>
        <div class="content">
          <div class="row">
            <el-image class="flag" :src="item.flag" fit="cover"></el-image>
            <div class="info">
              <div class="name">{{'课程' + item.index}}</div>
              <div class="title">{{item.title['zh-cn']}}</div>
            </div>
          </div>
          <div class="row">
            <el-image class="cover" :src="item.cover" fit="cover"></el-image>
            <div class="desc">{{item.desc['zh-cn']}}</div>
          </div>
        </div>
        <div class="num">{{item.index}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchKey: '',
      chapters: [],
      height: 0,
      isShow: false
    }
  },
  mounted () {
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.height = h - 150
    this.chapters = []
    for (let i = 1; i <= 24; i++) {
      let obj = {}
      obj['index'] = i
      obj['title'] = {
        'zh-cn': '瞧！这是一只猫。',
        'en': 'Look! This is a cat.'
      }
      obj['desc'] = {
        'zh-cn': '学会打招呼，描述人与动物',
        'en': 'greeting. human and animal'
      }
      obj['flag'] = 'http://course-assets.talkmate.com/course/images/icon/200x200/Level1-Unit1-Chapter1.jpg?v=qoiuoiewurpooo'
      obj['cover'] = 'http://course-assets.talkmate.com/course/images/icon/1700*130/1.jpg?v=qoiuoiewurpooo'
      this.chapters.push(obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.level-container {
  padding-top: 20px;
}
.search {
  text-align: right;
  padding-right: 40px;
  input {
    width: 200px;
    height: 30px;
    background: #fff;
    border-radius: 16px;
    border: 0;
    padding-left: 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 14px;
    color: #000;
    margin-right: 16px;
  }
  input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba($color: #000000, $alpha: 0.4);
  }
  input::-ms-input-placeholder { /* Microsoft Edge */
    color: rgba($color: #000000, $alpha: 0.4);
  }
}
.chapter-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
  margin-right: 10px;
  padding-left: 20px;
  overflow: auto;
  .chapter-item {
    position: relative;
    margin: 0 10px 10px;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 190px;
      height: 110px;
      background: #fff;
      border-radius: 4px;
      padding: 10px 10px 17px;
      .row {
        position: relative;
        display: flex;
        flex-direction: row;
        .flag {
          width: 30px;
          height: 30px;
          background: #D8D8D8;
          border: 1px solid #979797;
          border-radius: 50%;
        }
        .cover {
          width: 188px;
          height: 60px;
          background: #D8D8D8;
          border-radius: 2px;
        }
        .desc {
          position: absolute;
          margin-top: 7px;
          margin-left: 10px;
          font-size: 12px;
          font-weight: 60;
          color: #fff;
        }
        .info {
          margin-left: 10px;
          .name {
            font-size: 14px;
            font-weight: 400;
            color: #000;
            line-height: 20px;
          }
          .title {
            font-size: 12px;
            font-weight: 400;
            color: rgba($color: #000000, $alpha: 0.6);
            line-height: 14px;
          }
        }
      }
    }
    .num {
      margin-top: 10px;
      margin-bottom: 16px;
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4)
    }
    .more {
      position: absolute;
      transform: rotate(0deg);
      right: 6px;
      top: 10px;
      cursor: pointer;
      z-index: 99;
      transition: all ease .3s;
      &:hover {
        transform: rotate(0)
      }
      i {
        color: rgba($color: #000000, $alpha: 0.6)
      }
      .operate {
        position: absolute;
        background: #002742;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 60px;
        height: 70px;
        margin-left: -22px;
        li {
          padding: 3px 0;
          font-size: 12px;
          font-weight: 400;
          color: #fff;
          text-align: center;
          cursor: pointer;
          &:hover {
            background: #007AFF;
          }
          i {
            color: #fff;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
.chapter-list::-webkit-scrollbar {
  width: 2px;
  background: rgba($color: #D8D8D8, $alpha: 0.1)
}

.chapter-list::-webkit-scrollbar-thumb {
  background: rgba($color: #000000, $alpha: 0.4);
}
</style>
