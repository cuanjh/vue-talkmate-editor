<template>
  <div class="look-image-container">
    <div class="search">
      <input v-if="false" type="text" v-model="words" @input="search" clearable placeholder="请输入...">
      <el-autocomplete
        class="inline-input"
        v-model="words"
        :fetch-suggestions="querySearch"
        @change="search"
        placeholder="请输入内容"
        @select="handleSelect"
      ></el-autocomplete>
      <el-switch
        v-model="searchType"
        @change="search"
        active-text="精确搜索"
        inactive-text="模糊搜索">
      </el-switch>
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
      searchResult: [],
      searchHistory: [],
      searchType: 0
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
  mounted () {
  },
  methods: {
    async search () {
      if (this.words === '') {
        return false
      }
      let history = []
      if (localStorage.getItem('searchCourseImgsHistory')) {
        history = JSON.parse(localStorage.getItem('searchCourseImgsHistory'))
      }
      if (history.length > 9) {
        history.splice(0, 1)
        history.push({ value: this.words })
      } else {
        history.push({ value: this.words })
      }
      localStorage.setItem('searchCourseImgsHistory', JSON.stringify(history))

      let res = await searchImages({ words: this.words, searchType: this.searchType ? 1 : 0 })
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
    },
    querySearch (queryString, cb) {
      this.searchHistory = []
      if (localStorage.getItem('searchCourseImgsHistory')) {
        this.searchHistory = JSON.parse(localStorage.getItem('searchCourseImgsHistory'))
      }
      var results = queryString ? this.searchHistory.filter(this.createFilter(queryString)) : this.searchHistory
      // 调用 callback 返回建议列表的数据
      results = results.reverse()
      cb(results)
    },
    createFilter (queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.search()
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
.inline-input {
  width: 400px;
  margin-right: 20px;
}
</style>
