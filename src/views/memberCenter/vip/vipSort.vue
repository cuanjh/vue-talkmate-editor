<template>
  <transition name="fade">
    <div class="vip-sort-container" v-show="isShow">
      <div class="content-wrap">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <div class="sort-container" id="sortVip">
            <el-tag :data-id="index" v-for="(c, index) in sortList" :key="c.uuid">{{ (index + 1) + '、' + c.name['' + locale + '']}}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
import {
  updateAdvantage
} from '@/api/course'

export default {
  data () {
    return {
      isShow: false,
      list: [],
      sortable: {},
      sortContents: {}
    }
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale
    }),
    sortList () {
      let arr = this.list
      arr = arr.sort((a, b) => {
        return a.listOrder - b.listOrder
      })
      return arr
    }
  },
  methods: {
    show (params) {
      console.log(params)
      this.list = params
      setTimeout(() => {
        this.resetSortable()
      }, 100)
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.$emit('refresh')
    },
    resetSortable (showPos) {
      /* eslint-disable */
      let el = document.getElementById('sortVip')
      this.sortable = new Sortable(el, {
        animation: 0,
        onEnd: (evt) => {
          let newIndex = evt.newIndex
          let oldIndex = evt.oldIndex
          let newListOrder = 0
          // 向前移动
          if (newIndex < oldIndex) {
            newListOrder = this.list[newIndex].listOrder - 1
          } else {
            newListOrder = this.list[newIndex].listOrder + 1
          }
          let obj = this.list[oldIndex]
          obj.listOrder = newListOrder
          updateAdvantage(obj)
          this.$set(this.list, oldIndex, obj)
        }
      })
      /* eslint-enable */
    }
  }
}
</script>

<style lang="scss" scoped>
.vip-sort-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 999;
}
.content-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  width:800px;
  background:#FFFFFF;
  border-radius:4px;
  padding: 50px 30px 40px;
  box-sizing: border-box;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
}

.sort-container {
  .el-tag {
    margin: 20px;
  }
}
</style>
