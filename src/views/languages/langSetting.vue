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
    <table>
      <thead>
        <tr>
          <th>序号</th>
          <th>编码</th>
          <th>名称<span>（中文）</span></th>
          <th>名称<span>（英文）</span></th>
          <th>是否热门</th>
          <th>图标</th>
        </tr>
      </thead>
      <tbody>
        <lang-item-comp v-for="item in tableData" :key="item.code + item.langIndex" :item="item"/>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import LangItemComp from './common/langItem'

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
      this.$bus.emit('addLangBox')
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
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
  table {
    width: 100%;
    tr {
      th {
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,1);
        line-height:20px;
        padding-bottom: 20px;
        text-align: left;
        &:nth-child(1) {
          // padding-right: 50px;
          width: 70px;
          padding-right: 20px;
        }
        &:nth-child(2) {
          width: 15%;
          padding-right: 30px;
        }
        &:nth-child(3) {
          width: 15%;
          padding-right: 30px;
        }
        &:nth-child(4) {
          // padding-right: 400px;
        }
        &:nth-child(5) {
          // padding-right: 400px;
          width: 160px;
        }
        &:nth-child(6) {
          width: 100px;
        }
        span {
          font-size: 10px;
        }
      }
    }
  }
  tbody {
    height: 600px;
  }
}
/*滚动条样式*/
tbody::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
tbody::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
tbody::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
