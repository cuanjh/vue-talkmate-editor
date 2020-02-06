<template>
  <div class="item" @mouseleave="isShow = false" @mouseenter="isShow = true">
    <el-image
      class="form-img"
      :src="assetsDomain + item['image_url']"
      fit="cover">
    </el-image>
    <div class="desc" v-html="item['desc'].replace(new RegExp(/\./, 'g'), '.<br/>').replace(new RegExp(/\?/, 'g'), '?<br/>')">
    </div>
    <div class="handler" v-show="isShow">
      <span @click="useImg">使用图片</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['item'],
  data () {
    return {
      isShow: false
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    useImg () {
      console.log(this.item.image_url)
      this.$emit('useImg', this.item.image_url)
    }
  }
}
</script>

<style lang="scss" scoped>
  .item {
    position: relative;
    width: 240px;
    height: 240px;
    background: #ffffff;
    border-radius: 15px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    .form-img {
      width: 210px;
      height: 120px;
      min-height: 120px;
      background: #D8D8D8;
      border-radius: 4px;
      margin-top: 15px;
    }
    .desc {
      width: 210px;
      height: 75px;
      margin-top: 10px;
      line-height: 18px;
      overflow: hidden;
    }
    .handler {
      position: absolute;
      background: #007AFF;
      height: 40px;
      width: 100%;
      bottom: 0;
      text-align: center;
      cursor: pointer;
      span {
        display: block;
        height: 40px;
        width: 100%;
        color: #fff;
        font-size: 14px;
        font-weight: 400;
      }
    }
  }
</style>
