<template>
  <div class="look-content-container">
    <div class="search">
      <input type="text" v-model="words" clearable placeholder="请输入...">
      <span @click="search">搜索</span>
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="result">
      <div class="list">
        <look-content-item
          v-for="(item, index) in searchResult"
          :key="index"
          :item="item"
          @use="use"/>
      </div>
    </div>
  </div>
</template>

<script>
import LookContentItem from './lookContentItem'
import { searchContent } from '@/api/course'
export default {
  props: ['contentModel'],
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
    // 使用图片（声音）
    use (params) {
      this.$emit('use', params)
    },
    close () {
      this.$emit('close')
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
    cursor: pointer;
  }
  i {
    float: right;
    font-size: 20px;
    margin-top: 12px;
    cursor: pointer;
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
