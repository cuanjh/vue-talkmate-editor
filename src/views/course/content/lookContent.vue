<template>
  <div class="look-content-container">
    <div class="search">
      <input type="text" v-model="words" @input="search" clearable placeholder="请输入内容...">
      <span>搜索</span>
    </div>
    <div class="result">
      <div class="list">
        <look-content-item
          v-for="(item, index) in searchResult"
          :key="index"
          :item="item"
          :activeFeild="activeFeild"
          @userSound="userSound"
          @userImg="userImg"/>
      </div>
    </div>
  </div>
</template>

<script>
import LookContentItem from './lookContentItem'
import { searchContent } from '@/api/course'
export default {
  props: ['contentModel', 'activeFeild'],
  data () {
    return {
      words: '',
      searchResult: []
    }
  },
  components: {
    LookContentItem
  },
  methods: {
    async search () {
      let res = await searchContent({ content_model: this.contentModel, words: this.words })
      console.log(res)
      this.searchResult = res.data.contents
    },
    // 使用声音
    userSound (sound) {
      console.log(sound)
      this.$emit('userSound', sound)
    },
    // 使用图片
    userImg (img) {
      console.log(img)
      this.$emit('userImg', img)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  font-size: 12px;
  font-weight: 400;
  input {
    width: 300px;
    height: 30px;
    border-radius: 15px;
    border: 1px solid rgba($color: #000000, $alpha: 0.1);
    color: #000;
    padding: 0 10px;
    margin-right: 15px;
  }
  span {
  }
}
.result {
  background: #F5F6FA;
  .list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}
</style>
