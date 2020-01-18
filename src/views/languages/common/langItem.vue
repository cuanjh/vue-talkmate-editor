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
tr {
  td {
    position: relative;
    font-size:14px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:20px;
    padding-bottom: 30px;
    &:nth-child(1) {
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
    &:nth-child(5) {
      // padding-right: 400px;
      width: 160px;
    }
    &:nth-child(6) {
      width: 100px;
    }
    a {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      &:hover {
        color: #007AFF;
      }
    }
    .img-box {
      cursor: pointer;
    }
    input {
      width: 100%;
      display: inline-block;
      border: none;
      background: transparent;
      &:focus {
        color: #007AFF;
      }
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
}
</style>
