<template>
<div class="content">
  <div class="lang-header">
    <router-link :to="{path: '/lang'}" class="back" href="javascript:;"><i class="font_family icon-leftrs"></i><span>选择课程语种</span></router-link>
    <h1>语种设置</h1>
    <div class="head-right">
      <a class="add-course" href="javascript:;" @click="addLang()">+新增语种</a>
      <input type="text" placeholder="输入内容关键字">
      <a class="search" href="javascript:;">搜索</a>
    </div>
  </div>
  <div class="lang-lists">
    <ul class="lists-content" v-show="false">
      <li>
        <div class="item">
          <div class="left">
            <span class="index">序号</span>
            <span class="code">编码</span>
            <span class="zh-name">名称<b>（中文）</b></span>
            <span class="en-name">名称<b>（英文）</b></span>
          </div>
          <div class="right">
            <span class="is-hot">是否热门</span>
            <span class="img">图标</span>
          </div>
        </div>
      </li>
      <li v-for="item in tableData" :key="item.code + item.langIndex">
        <div class="item">
          <div class="left">
            <span class="index"><input type="text" v-model="item.langIndex"></span>
            <span class="code"><input type="text" v-model="item.code"></span>
            <span class="zh-name"><input type="text" v-model="item.zhName"></span>
            <span class="en-name"><input type="text" v-model="item.enName"></span>
          </div>
          <div class="right">
            <span class="is-hot">
              <a href="javascript:;">是</a>
            </span>
            <span class="img">
              <img :src="item.flag" alt="">
            </span>
          </div>
        </div>
      </li>
    </ul>
    <table>
      <tr>
        <th>序号</th>
        <th>编码</th>
        <th>名称<span>（中文）</span></th>
        <th>名称<span>（英文）</span></th>
        <th>是否热门</th>
        <th>图标</th>
      </tr>
      <lang-item-comp v-for="item in tableData" :key="item.code + item.langIndex" :item="item"/>
    </table>
  </div>
</div>
</template>

<script>
import LangItemComp from './common/langItem'
import bus from '../../bus'

export default {
  data () {
    return {
      tableData: [
        {
          code: 'ENG-Basic',
          langIndex: 1,
          isHot: '是',
          zhName: '英语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        },
        {
          code: 'KOR-Basic',
          langIndex: 2,
          isHot: '是',
          zhName: '韩语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/KOR-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        },
        {
          code: 'JPN-Basic',
          langIndex: 3,
          isHot: '是',
          zhName: '英语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/JPN-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        },
        {
          code: 'FRE-Basic',
          langIndex: 4,
          isHot: '是',
          zhName: '英语',
          enName: 'English',
          flag: 'http://course-assets.talkmate.com/course/icons/FRE-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
        }
      ]
    }
  },
  components: {
    LangItemComp
  },
  mounted () {
  },
  methods: {
    addLang () {
      bus.$emit('addLangBox')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  padding-top: 30px;
}
.lang-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 42px;
  .back {
    font-size:12px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:22px;
  }
  h1 {
    font-size:20px;
    font-weight:600;
    color:rgba(0,0,0,1);
    text-align: center;
  }
  .head-right {
    .add-course {
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
  }
}
.lang-lists {
  height: 90%;
  overflow-y: auto;
  table {
    width: 100%;
    tr {
      th {
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,1);
        line-height:20px;
        padding-right: 72px;
        padding-bottom: 20px;
        text-align: left;
        &:nth-child(1) {
          padding-right: 50px;
        }
        &:nth-child(4) {
          padding-right: 400px;
        }
        span {
          font-size: 10px;
        }
      }
    }
    td {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      padding-bottom: 30px;
      &:nth-child(1) {
        input {
          width: 100px;
        }
      }
      a {
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        &:hover {
          color: #007AFF;
        }
      }
    }
    input {
      border: none;
      background: transparent;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 4px;
    }
  }
  .lists-content {
    width: 100%;
    .item {
      display: flex;
      justify-content: space-between;
      .left {
        background: pink;
      }
      .right {
        background: rgb(143, 187, 235);
      }
      span {
        display: inline-block;
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,1);
        line-height:20px;
        padding-right: 72px;
        padding-bottom: 20px;
        text-align: left;
        b {
          font-size: 10px;
        }
        &:last-child {
          margin-right: 0;
        }
      }
      .index {
        width: 50px;
      }
      .code {
        width: 100px;
      }
      .zh-name {
        width: 100px;
      }
      .en-name {
        width: 100px;
      }
      .is-hot {
        width: 70px;
      }
      a {
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,1);
        &:hover {
          color: #007AFF;
        }
      }
      input {
        width: 100%;
        border: none;
        background: transparent;
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 4px;
      }
    }
  }
}
/*滚动条样式*/
.lang-lists::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.lang-lists::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.lang-lists::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
