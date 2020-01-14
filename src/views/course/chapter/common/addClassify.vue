<template>
<transition name="fade">
  <div class="add-classify" v-if="isShowAddClassify">
    <div class="add-content">
      <div class="directory-name">
        <span>目录名称：</span>
        <input type="text" placeholder="请输入目录名称">
      </div>
      <h1>选择合适的图标<br/>（图标仅为编辑器内示意，不与线上同步）</h1>
      <div class="img-lists">
        <ul>
          <li>
            <label class="radio1">
              <input type="radio" v-model="radioImg" value="1" checked='1' >
            </label>
          </li>
          <li>
            <label class="radio2">
              <input type="radio" v-model="radioImg" value="2" checked='1'>
            </label>
          </li>
          <li>
            <label class="radio3">
              <input type="radio" v-model="radioImg" value="3" checked='1'>
            </label>
          </li>
          <li>
            <label class="radio4">
              <input type="radio" v-model="radioImg" value="4" checked='1'>
            </label>
          </li>
        </ul>
      </div>
      <div class="number">
        <span class="title">确定单元数量与名称</span>
        <div class="right">
          <a href="javascript:;" class="reduce" @click="reduce()">－</a>
          <span class="num">{{numLists.length}}</span>
          <a href="javascript:;" class="add" @click="add()">＋</a>
        </div>
      </div>
      <div class="num-lists">
        <div class="num-item" v-for="(item, index) in numLists" :key="index">
          <span>{{index + 1}}: </span>
          <input type="text" v-model="item.text">
        </div>
      </div>
      <div class="btns">
        <a class="cancel" href="javascript:;" @click="cancel()">取消</a>
        <a class="determine" href="javascript:;" @click="determine()">确定</a>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import bus from '../../../../bus'
export default {
  data () {
    return {
      radioImg: '1',
      isShowAddClassify: false,
      numLists: [
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
    bus.$on('addClassifyBox', () => {
      this.isShowAddClassify = true
    })
  },
  methods: {
    reduce () {
      this.numLists.pop()
    },
    add () {
      let obj = { text: '' }
      this.numLists.push(obj)
    },
    determine () {
      this.isShowAddClassify = false
    },
    cancel () {
      this.isShowAddClassify = false
    }
  }
}
</script>

<style lang="scss" scoped>
.add-classify {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
}
.add-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:538px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 30px 50px;
  box-sizing: border-box;
  .directory-name {
    text-align: center;
    span {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:30px;
    }
    input {
      width:290px;
      height:30px;
      border-radius:2px;
      border:1px solid rgba(0,0,0,.1);
      padding: 0 10px;
    }
  }
  h1 {
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
    padding: 20px 0;
    text-align: center;
  }
  .img-lists {
    ul {
    display: flex;
    justify-content: space-between;
      li {
        label {
          position: relative;
          display: inline-block;
          width:80px;
          height:80px;
          border-radius:11px;
          text-align: right;
        }
        .radio1 {
          background:rgba(255,179,114,1);
        }
        .radio2 {
          background:rgba(114,121,255,1);
        }
        .radio3 {
          background:rgba(169,114,255,1);
        }
        .radio4 {
          background:rgba(255,125,114,1);
        }
      }
      input {
        width:20px;
        height:20px;
        background:rgba(26,219,31,1);
        border-radius: 50%;
        margin: 10px 10px 0 0;
      }
    }
    i {
      display: inline-block;
      width:80px;
      height:80px;
      border-radius:11px;
    }
    .radio1 {
      background:rgba(255,179,114,1);
    }
    .radio2 {
      background:rgba(114,121,255,1);
    }
    .radio3 {
      background:rgba(169,114,255,1);
    }
    .radio4 {
      background:rgba(255,125,114,1);
    }
  }
  .number {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 30px 0 15px;
    .title {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      line-height:20px;
      margin-right: 128px;
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
    }
    .num {
      color: #007AFF;
      font-size: 20px;
      margin: 0 10px;
    }
  }
  .num-lists {
    .num-item {
      margin-bottom: 20px;
      text-align: center;
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
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    a {
      display: inline-block;
      width:150px;
      height:40px;
      line-height: 40px;
      font-size:14px;
      font-weight:400;
      border-radius:4px;
    }
    .cancel {
      color:rgba(0,122,255,1);
      border:1px solid rgba(0,122,255,1);
      margin-right: 48px;
    }
    .determine {
      color:rgba(255,255,255,1);
      background: #007AFF;
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
