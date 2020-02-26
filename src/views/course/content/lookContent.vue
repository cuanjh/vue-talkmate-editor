<template>
  <div class="look-content-container">
    <div class="search">
      <input type="text" v-model="words" clearable @keyup.enter="search" placeholder="请输入...">
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
      if (!this.words) {
        this.$message({
          showClose: true,
          message: '请输入您要查找的内容！',
          type: 'warning'
        })
        return false
      }
      let res = await searchContent({ content_model: this.contentModel, words: this.words })
      console.log(res)
      if (!res.data.contents) {
        this.$message({
          showClose: true,
          message: '没有找到相关项，请重新输入！',
          type: 'warning'
        })
      }
      this.searchResult = res.data.contents
      console.log(this.searchResult)
    },
    // 使用图片（声音）
    use (params) {
      this.$emit('use', params)
    },
    close () {
      this.words = ''
      this.searchResult = []
      this.$emit('close')
    },
    reset () {
      this.words = ''
      this.searchResult = []
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
    &:hover {
      color: #409EFF;
    }
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
