<template>
  <div class="look-image-container">
    <div class="search">
      <input type="text" v-model="words" @input="search" clearable placeholder="请输入...">
      <span>搜索</span>
    </div>
    <div class="result">
      <div class="list">
        <look-image-item
          v-for="(item, index) in searchResult"
          :key="index"
          :item="item"
          @userImg="userImg"/>
      </div>
    </div>
  </div>
</template>

<script>
import LookImageItem from './lookImageItem'
import { searchImages } from '@/api/course'
export default {
  data () {
    return {
      words: '',
      searchResult: []
    }
  },
  components: {
    LookImageItem
  },
  methods: {
    async search () {
      let res = await searchImages({ words: this.words })
      this.searchResult = res.data.images
      console.log(res)
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
