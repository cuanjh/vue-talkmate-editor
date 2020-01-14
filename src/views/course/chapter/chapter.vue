<template>
  <div class="chapter-container">
    <div class="chapter-header" @mouseleave="isShowTip = false">
      <div class="add-btn">
        <a class="add-course" href="javascript:;" @mouseenter="isShowTip = true" >+新增</a>
        <div class="tip-box" v-show="isShowTip" >
          <p @click="coreCourse()">核心课程</p>
          <p @click="intensify()">强化课程</p>
          <p @click="newly()">+新建目录</p>
        </div>
      </div>
      <input type="text" placeholder="输入内容关键字">
      <a class="search" href="javascript:;">搜索</a>
    </div>
    <div class="chapter-content">
      <div class="delete">
        <i></i>
        <span>拖拽至此处删除</span>
      </div>
      <div class="chapter">
        <span class="title">核心课程</span>
        <ul>
          <li v-for="(item, index) in coreList" :key="'core-' + index">
            <div class="core-img"></div>
            <span class="text">{{item.title}}</span>
            <input type="text"
              placeholder="点击输入"
              v-if="!item.title"
              v-model="coreText"
              @blur.prevent="blurCoreFn()">
          </li>
        </ul>
      </div>
      <div class="chapter">
        <span class="title">强化课程</span>
        <ul class="intensify">
          <li v-for="(item, index) in intensifyList" :key="'intensify-' + index">
            <div class="core-img"></div>
            <span class="text">{{item.title}}</span>
            <input type="text"
              placeholder="点击输入"
              v-if="!item.title"
              v-model="intensifyText"
              @blur.prevent="blurIntensifyFn()">
          </li>
        </ul>
      </div>
    </div>
    <add-classify />
  </div>
</template>

<script>
import bus from '../../../bus'
import AddClassify from './common/addClassify'

export default {
  data () {
    return {
      isShowTip: false,
      coreList: [
        {
          title: '核心1'
        },
        {
          title: '核心2'
        },
        {
          title: '核心3'
        },
        {
          title: '核心4'
        },
        {
          title: '核心5'
        }
      ],
      intensifyList: [
        {
          title: '听说'
        },
        {
          title: '语法'
        },
        {
          title: '对话'
        }
      ],
      coreText: '',
      intensifyText: ''
    }
  },
  components: {
    AddClassify
  },
  methods: {
    // 核心课程
    coreCourse () {
      let obj = { title: '' }
      this.coreList.push(obj)
    },
    blurCoreFn () {
      this.coreList.pop()
      let obj = { title: this.coreText }
      this.coreList.push(obj)
      console.log(this.coreList)
    },
    // 强化课程
    intensify () {
      let obj = { title: '' }
      this.intensifyList.push(obj)
    },
    blurIntensifyFn () {
      this.intensifyList.pop()
      let obj = { title: this.intensifyText }
      this.intensifyList.push(obj)
      console.log(this.intensifyList)
    },
    // 新建目录
    newly () {
      bus.$emit('addClassifyBox')
    }
  }
}
</script>

<style lang="scss" scoped>
.chapter-container {
  padding: 30px;
}
.chapter-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .add-course {
  position: relative;
    font-size:12px;
    font-weight:400;
    color:rgba(0,0,0,1);
  }
  input {
    width: 200px;
    height: 30px;
    border: none;
    background:rgba(255,255,255,1);
    border-radius:16px;
    padding: 0 20px;
    margin-right: 16px;
    margin: 0 16px 0 30px;
  }
  .search {
    font-size:12px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:26px;
  }
  .add-btn {
    position: relative;
  }
  .tip-box {
    position: absolute;
    left: -36px;
    top: 20px;
    background:rgba(0,39,66,1);
    border-radius:4px;
    box-sizing: border-box;
    display: inline-block;
    padding: 5px 0;
    z-index: 9999;
    p {
      cursor: pointer;
      font-size:10px;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
      text-align: center;
      padding: 0 12px;
      min-width: 76px;
      &:hover {
        background: #007AFF;
      }
    }
  }
}
.chapter-content {
  position: relative;
  padding: 50px 0 0;
  .title {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,.6);
    line-height:20px;
  }
  ul {
    padding: 30px 30px 44px;
    display: flex;
    align-items: center;
    li {
      cursor: pointer;
      text-align: center;
      margin-right: 70px;
      .core-img {
        width:80px;
        height:80px;
        background:linear-gradient(180deg,rgba(132,246,230,1) 0%,rgba(77,233,201,1) 100%);
        border-radius:11px;
        margin-bottom: 10px;
      }
      .text {
        font-size:18px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:25px;
      }
      input {
        width: 80px;
        border: none;
        font-size:18px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:25px;
        background: transparent;
        text-align: center;
      }
    }
  }
  .intensify {
    li {
      .core-img {
        background:rgba(114,164,255,1);
      }
    }
  }
  .delete {
    position: absolute;
    top: 30px;
    right: 0;
    width:140px;
    height:40px;
    border:1px solid rgba(0,0,0,.1);
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      display: inline-block;
      width:11px;
      height:15px;
      background:rgba(74,74,74,1);
      margin-right: 8px;
    }
    span {
      font-size:12px;
      font-weight:400;
      color:rgba(0,0,0,.4);
      line-height:17px;
    }
  }
}
</style>
