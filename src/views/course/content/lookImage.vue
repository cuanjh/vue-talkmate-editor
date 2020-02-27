<template>
  <div class="look-image-container">
    <div class="search">
      <input type="text" v-model="words" @input="search" clearable placeholder="请输入...">
      <span @click="search">搜索</span>
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="result">
      <div class="list" v-if="searchResult">
        <look-image-item
          v-for="(item, index) in searchResult"
          :key="index"
          :item="item"
          @useImg="useImg"/>
      </div>
      <span v-else>没有找到相关项，请重新输入！</span>
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
  created () {
    this.$bus.on('closeImage', () => {
      this.close()
    })
  },
  methods: {
    async search () {
      if (this.words === '') {
        return false
      }
      let res = await searchImages({ words: this.words })
      this.searchResult = res.data.images
      console.log(this.searchResult)
    },
    // 使用图片
    useImg (img) {
      console.log(img)
      this.$emit('use', { type: 'image', flag: true, url: img })
      this.close()
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
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }
}
</style>
