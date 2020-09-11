<template>
  <transition name="fade">
    <div class="channel-sort-container" v-show="isShow">
      <div class="content-wrap">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <div class="item">
            <div class="sort-container" id="sort-words">
              <el-tag :data-id="index" v-for="(item, index) in allWords" :key="item.uuid">{{ item.word }}</el-tag>
            </div>
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
import { mapState } from 'vuex'
import {
  sortSearchWord
} from '@/api/course'

export default {
  data () {
    return {
      isShow: false,
      sortable: {},
      allWords: [],
      sortContents: []
    }
  },
  computed: {
    ...mapState({
      locale: state => state.course.locale
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.sortContents = []
      this.allWords = params.allWords
      if (this.allWords.length) {
        setTimeout(() => {
          this.resetSortable()
        }, 100)
      }
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.$emit('refresh')
    },
    resetSortable () {
      /* eslint-disable */
      let el = document.getElementById('sort-words')
      this.sortable = new Sortable(el, {
        animation: 0,
        onEnd: (evt) => {
          this.sortContents = []
          let toId = evt.to.id
          let copyContents = this.allWords
          console.log(copyContents)
          let indexArr = this.sortable.toArray()
          console.log(indexArr)
          let time = parseInt((new Date()).getTime() / 1000)
          indexArr.forEach((item, index) => {
            let obj = copyContents[parseInt(item)]
            this.sortContents.push({
              uuid: obj.uuid,
              word: obj.word,
              listOrder: time--
            })
          })
          console.log(this.sortContents)
        }
      })
      /* eslint-enable */
    },
    save () {
      sortSearchWord(this.sortContents).then(res => {
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
.channel-sort-container {
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
