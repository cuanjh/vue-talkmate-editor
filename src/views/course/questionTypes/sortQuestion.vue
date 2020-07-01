<template>
  <transition name="fade">
    <div class="question-sort-container" v-show="isShow">
      <div class="content-wrap">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <div class="sort-container" id="sort-question">
            <el-tag :data-id="index" v-for="(c, index) in sortContents" :key="index">{{ c.name }}</el-tag>
          </div>
        </div>
        <div class="btns">
          <el-button
            class="determine active"
            type="primary"
            @click="save" >确定</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Sortable from 'sortablejs'
import {
  sortContentType
} from '@/api/course'

export default {
  data () {
    return {
      isShow: false,
      sortable: {},
      sortContents: [],
      sortObjs: []
    }
  },
  methods: {
    show (params) {
      console.log(params)
      this.sortContents = params
      this.resetSortable()
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.$emit('initData')
    },
    resetSortable () {
      /* eslint-disable */
      let el = document.getElementById('sort-question')
      this.sortable = new Sortable(el, {
        animation: 150,
        onEnd: (evt) => {
          let toId = evt.to.id
          let showPos = toId.split('-').pop()
          let copyContents = this.sortContents
          let indexArr = this.sortable.toArray()
          indexArr.forEach((item, index) => {
            let obj = copyContents[parseInt(item)]
            this.sortObjs.push({
              type: obj.type,
              list_order: index + 1
            })
          })
          console.log(this.sortObjs)
        }
      })
      /* eslint-enable */
    },
    save () {
      sortContentType(this.sortObjs).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.question-sort-container {
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

.btns {
  margin-top: 30px;
}
</style>
