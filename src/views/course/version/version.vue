<template>
  <div class="version-container">
    <div class="version-wrap">
      <div class="version-item create">
        <i class="el-icon-plus"></i>
        <span>创建新版本</span>
      </div>
      <div class="version-item" @click="switchVersion('V2')">
        <div class="online-flag">
          <span>线上</span>
        </div>
        <div class="content">
          <div class="title">版本V2</div>
          <ul>
            <li>创建时间：2018年6月1日</li>
            <li>最后修改时间：2020年1月1日</li>
            <li>Level：6</li>
            <li>Chapter：24</li>
          </ul>
        </div>
        <div class="operate">
          <span>下架</span>
        </div>
        <div class="operate-shade" v-show="false">
          <div class="desc">确定下架该版本吗？</div>
          <div class="btns">
            <span class="cancel">取消</span>
            <span class="ok">确定</span>
          </div>
        </div>
      </div>
      <div class="version-item" @click="switchVersion('V1')">
        <div class="content">
          <div class="title">版本V1</div>
          <ul>
            <li>创建时间：2016年6月1日</li>
            <li>最后修改时间：2019年10月1日</li>
            <li>Level：6</li>
            <li>Chapter：24</li>
          </ul>
        </div>
        <div class="operate">
          <span>发布上线</span>
        </div>
        <div class="operate-shade" v-show="false">
          <div class="desc">确定发布该版本吗？</div>
          <div class="btns">
            <span class="cancel">取消</span>
            <span class="ok">确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      outerVisible: false
    }
  },
  methods: {
    switchVersion (version) {
      this.$emit('switchVersion', version)
    }
  }
}
</script>

<style lang="scss" scoped>
.version-container {
  padding: 60px 0;
  .version-wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .version-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 240px;
    background: #fff;
    border-radius: 4px;
    margin-left: 30px;
    overflow: hidden;
    transition: all .3s ease;
    cursor: pointer;
    &:hover {
      box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    }
    &:active {
      box-shadow: 0px 9px 24px 0px rgba(0,0,0,0.12);
    }
  }
  .create {
    text-align: center;
    display: flex;
    flex-direction: column;
    i {
      margin-top: 88px;
      font-size: 24px;
      color: #007AFF;
    }
    span {
      color: #000000;
      font-size: 16px;
      font-weight: 400;
      margin-top: 10px;
    }
  }
  .online-flag {
    position: absolute;
    border: 45px solid;
    border-color: transparent transparent #007AFF transparent;
    transform: rotate(-45deg) translateY(-70px) translateX(0px);
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
  .content {
    min-height: 199px;
    border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
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
  .operate {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: all .3s ease;
    cursor: pointer;
    &:hover {
      background: rgba(0,122,255,.05);
    }
    &:active {
      background: rgba(0,122,255,1);
      span {
        color: #fff;
      }
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #007AFF;
      line-height: 20px;
    }
  }
  .operate-shade {
    position: absolute;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.7);
    top: 0;
    .desc {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      line-height: 22px;
    }
    .btns {
      margin-top: 28px;
      .cancel {
        display: inline-block;
        width: 90px;
        height: 30px;
        background: #fff;
        border-radius: 4px;
        color: #007AFF;
        font-size: 14px;
        font-weight: 400;
        margin: 0 20px;
        line-height: 30px;
      }
      .ok {
        display: inline-block;
        width: 90px;
        height: 30px;
        background: #007AFF;
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
        margin: 0 20px;
        line-height: 30px;
      }
    }
  }
}
</style>
