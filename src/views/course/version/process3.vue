<template>
  <div class="process3" v-show="showProcess3">
    <div class="process-header">
      <span class="el-icon-arrow-left back" @click="back()"></span>
      <span class="title">第3步：创建Level</span>
      <div class="right">
        <a href="javascript:;" class="reduce" @click="reduce()">－</a>
        <span class="num">{{processLists.length}}</span>
        <a href="javascript:;" class="add" @click="add()">＋</a>
      </div>
    </div>
    <div class="level-lists">
      <div class="level-item" v-for="(item, index) in processLists" :key="index">
        <span>{{index + 1}}: </span>
        <input type="text"
          v-model="item.text">
      </div>
    </div>
    <div class="btns">
      <a class="cancel" href="javascript:;" @click="cancel()">取消</a>
      <a class="determine active" href="javascript:;" @click="success()">完成</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showProcess3: false,
      processLists: [
        {
          text: ''
        },
        {
          text: ''
        },
        {
          text: ''
        },
        {
          text: ''
        },
        {
          text: ''
        }
      ]
    }
  },
  created () {
    this.$bus.on('showProcess3', () => {
      this.showProcess3 = true
    })
  },
  methods: {
    add () {
      let obj = { text: '' }
      this.processLists.push(obj)
    },
    reduce () {
      this.processLists.pop()
    },
    back () {
      this.showProcess3 = false
      this.$bus.emit('showProcess2')
    },
    cancel () {
      this.$bus.emit('closeAdd')
    },
    success () {
    }
  },
  beforeDestroy () {
    this.$bus.off('showProcess3')
  }
}
</script>

<style lang="scss" scoped>
.process3 {
  .process-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .title {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
  }
  .right {
    a {
      font-size:18px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      cursor: pointer;
      &:hover {
        color: #007AFF;
      }
    }
    .num {
      color: #007AFF;
      font-size: 20px;
      margin: 0 10px;
    }
  }
  .level-lists {
    max-height: 240px;
    overflow-y: auto;
    .level-item {
      margin-bottom: 20px;
      text-align: center;
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
      width:290px;
      height:30px;
      border-radius:2px;
      border:1px solid rgba(0,0,0,.1);
      padding: 0 10px;
      background: #F5F6FA;
      &:focus {
        border: 1px solid #007AFF;
        color: #007AFF;
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
