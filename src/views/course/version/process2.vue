<template>
  <div class="process2" v-show="showProcess2">
    <div class="process-header">
      <span class="el-icon-arrow-left back" @click="back()"></span>
      <span class="title">第2步：创建Level</span>
    </div>
    <div class="level-lists">
      <div class="level-item" v-for="(item, index) in levelLists" :key="index">
        <div class="item-left">
          <span>{{'level ' + (index + 1)}}: </span>
          <span>{{item.text}}</span>
        </div>
        <div class="item-right">
          <span>{{'level ' + (index + 1)}}: </span>
          <input type="text"
            v-model="item.chapter">
        </div>
      </div>
    </div>
    <div class="btns">
      <a class="cancel" href="javascript:;" @click="cancel()">取消</a>
      <a class="determine active" href="javascript:;" @click="nextBtn()">下一步</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showProcess2: false,
      levelLists: [
        {
          text: '零基础发音',
          chapter: ''
        },
        {
          text: '零基础发音',
          chapter: ''
        },
        {
          text: '零基础发音',
          chapter: ''
        },
        {
          text: '零基础发音',
          chapter: ''
        },
        {
          text: '零基础发音',
          chapter: ''
        }
      ]
    }
  },
  created () {
    this.$bus.on('showProcess2', () => {
      this.showProcess2 = true
    })
  },
  methods: {
    cancel () {
      this.$bus.emit('closeAdd')
    },
    back () {
      this.showProcess2 = false
      this.$bus.emit('showProcess1')
    },
    nextBtn () {
      this.showProcess2 = false
      this.$bus.emit('showProcess3')
    }
  }
}
</script>

<style lang="scss" scoped>
.process2 {
  .process-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    .back {
      position: absolute;
      left: 0;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        color: #007AFF;
      }
    }
  }
  .title {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
  }
  .level-lists {
    padding: 0 60px;
    max-height: 240px;
    overflow-y: auto;
    .level-item {
      margin-bottom: 20px;
      text-align: center;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:last-child {
        margin-bottom: 0;
      }
    }
    span {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      margin-right: 10px;
    }
    input {
      width:50px;
      height:30px;
      border-radius:2px;
      border:1px solid rgba(0,0,0,.1);
      padding: 0 10px;
      background: #F5F6FA;
      &:focus {
        border: 1px solid #007AFF;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    a {
      display: inline-block;
      width:150px;
      height:40px;
      line-height: 40px;
      font-size:14px;
      font-weight:400;
      border-radius:4px;
      color:rgba(0,122,255,1);
      border:1px solid rgba(0,122,255,1);
      margin-right: 48px;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
      &.active {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
    }
  }
}
/*滚动条样式*/
.level-lists::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.level-lists::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.level-lists::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
