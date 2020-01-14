<template>
  <tr @mouseleave="isShowTip = false">
    <td><input type="text" v-model="item.langIndex"></td>
    <td><input type="text" v-model="item.code"></td>
    <td><input type="text" v-model="item.zhName"></td>
    <td><input type="text" v-model="item.enName"></td>
    <td >
      <a href="javascript:;" @mouseenter="isShowTip = true">{{hotText}}</a>
      <div class="tip-box" v-show="isShowTip" >
        <span v-for="(text, index) in options"
          :key="index"
          :class="{'active': hotText == text.value}"
          @click="checkText(text.value)">{{text.value}}</span>
      </div>
    </td>
    <td class="img-box" @click="changedImg()">
      <img :src="item.flag" alt="">
    </td>
  </tr>
</template>

<script>

export default {
  props: ['item'],
  data () {
    return {
      isShowTip: false,
      hotText: this.item.isHot,
      options: [
        {
          value: '是'
        },
        {
          value: '否'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
    checkText (params) {
      this.hotText = params
    },
    changedImg () {
      this.$bus.emit('showUpCourseImg')
    }
  }
}
</script>

<style lang="scss" scoped>
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
    position: relative;
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
  .img-box {
    cursor: pointer;
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
  .tip-box {
    position: absolute;
    left: -66px;
    top: 0;
    width:60px;
    height:50px;
    background:rgba(0,39,66,1);
    border-radius:4px;
    padding: 5px 0;
    box-sizing: border-box;
    span {
      cursor: pointer;
      display: block;
      font-size:10px;
      font-weight:400;
      color:rgba(255,255,255,1);
      line-height:20px;
      text-align: center;
      &:hover {
        background: rgba(0, 122, 255, .6);
      }
      &.active {
        background: #007AFF;
      }
    }
  }
}
</style>
