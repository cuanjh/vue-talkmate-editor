<template>
  <div class="step-one">
    <div class="swiper-btn">
      <div class="icon el-icon-arrow-left"></div>
      <div class="icon el-icon-arrow-right"></div>
    </div>
    <div class="swiper-container swiper-no-swiping" id="editor-in-container" >
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="online-flag">
            <span>线上</span>
          </div>
          <input
            class="radio"
            type="radio"
            v-model="radioVal"
            value="版本V2"
            @change="getRadioVal">
          <div class="content">
            <div class="title">版本V2</div>
            <ul>
              <li>创建时间：2018年6月1日</li>
              <li>最后修改时间：2020年1月1日</li>
              <li>Level：6</li>
              <li>Chapter：24</li>
            </ul>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="content">
            <div class="title">版本V2</div>
            <ul>
              <li>创建时间：2018年6月1日</li>
              <li>最后修改时间：2020年1月1日</li>
              <li>Level：6</li>
              <li>Chapter：24</li>
            </ul>
          </div>
        </div>
        <div class="swiper-slide">
          <div class="content">
            <div class="title">版本V2</div>
            <ul>
              <li>创建时间：2018年6月1日</li>
              <li>最后修改时间：2020年1月1日</li>
              <li>Level：6</li>
              <li>Chapter：24</li>
            </ul>
          </div>
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
import Swiper from 'swiper'
import 'swiper/css/swiper.css'

export default {
  data () {
    return {
      radioVal: '版本V2'
    }
  },
  mounted () {
    this.initSwiper()
  },
  methods: {
    initSwiper () {
      /* eslint-disable */
      this.$nextTick(() => {
        let mySwiper = new Swiper ('#editor-in-container', {
          loop: false,
          autoplay: false,
          speed: 500,
          slidesPerView: 'auto',
          slidesOffsetAfter : 30,
          navigation: {
            prevEl: '.el-icon-arrow-left',
            nextEl: '.el-icon-arrow-right'
          }
        })
        console.log(mySwiper)
      })
      /* eslint-enable */
    },
    cancel () {
      this.$emit('closeModel')
    },
    nextBtn () {
      this.$emit('clickNextBtn')
    },
    getRadioVal () {
      console.log(this.radioVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.step-one {
  position: relative;
  .swiper-btn {
    position: relative;
    text-align: right;
    padding: 20px 30px 30px;
    .icon {
      outline: none;
      font-size: 16px;
      color: rgba(0, 0, 0, .24);
      &:hover {
        cursor: pointer;
        color: #777D90;
      }
    }
  }
}
.swiper-container {
  padding-left: 40px;
  .swiper-wrapper {
  }
  .swiper-slide {
    position: relative;
    width:280px;
    height:200px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    margin-right: 30px;
    cursor: pointer;
    .content {
      min-height:200px;
      .title {
        padding-top: 16px;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        line-height:22px;
        color: #000;
      }
      ul {
        padding-top: 10px;
        padding-left: 30px;
        li {
          font-size: 12px;
          line-height:17px;
          font-weight: 400;
          color: #000;
          padding-top: 13px;
        }
      }
    }
    .online-flag {
      position: absolute;
      border: 45px solid;
      border-color: transparent transparent #007AFF transparent;
      transform: rotate(-45deg) translateY(-70px) translateX(0px);
      -webkit-transform: rotate(-45deg) translateY(-70px) translateX(0px);
      -moz-transform: rotate(-45deg) translateY(-70px) translateX(0px);
      -ms-transform: rotate(-45deg) translateY(-70px) translateX(0px);
      span {
        position: absolute;
        width: 100px;
        margin-top: 23px;
        margin-left: -13px;
        font-size: 12px;
        font-weight: 400;
        color: #fff;
      }
    }
    .radio {
      position: absolute;
      right: 10px;
      top: 10px;
      width:20px;
      height:20px;
      border:1px solid rgba(0,0,0,.4);
      border-radius: 50%;
    }
  }
}
.editor-in .btns {
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
</style>
