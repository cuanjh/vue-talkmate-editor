<template>
  <transition name="fade">
    <div class="channel-sort-container" v-show="isShow">
      <div class="content-wrap">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <div class="item" v-for="item in groupChannels" :key="item.showPos">
            <el-divider>{{ item.showPos == "index" ? '发现首页排序' : '列表页排序' }}</el-divider>
            <div class="sort-container" :id="'sort-channel-' + item.showPos">
              <el-tag v-for="c in item.data" :key="c.uuid">{{ c.title['' + locale + '']}}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Sortable from 'sortablejs'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isShow: false,
      groupChannels: []
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
      let map = {}
      let dest = []
      for (let i = 0; i < params.length; i++) {
        let ai = params[i]
        if (!map[ai.showPos]) {
          dest.push({
            showPos: ai.showPos,
            data: [ai]
          })
          map[ai.showPos] = ai
        } else {
          for (let j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.showPos === ai.showPos) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
      this.groupChannels = []
      if (dest.length) {
        dest.forEach(d => {
          let obj = d
          obj.data = obj.data.sort((a, b) => {
            return a.listOrder - b.listOrder
          })
          this.groupChannels.push(obj)
          setTimeout(() => {
            this.resetSortable(obj.showPos)
          }, 100)
        })
      }
      console.log(this.groupChannels)
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.$emit('refresh')
    },
    resetSortable (showPos) {
      /* eslint-disable */
      let el = document.getElementById('sort-channel-' + showPos)
      let sortable = new Sortable(el, {
        animation: 150,
        onEnd: (evt) => {
          console.log(evt)
          let fromId = evt.from.id
          let toId = evt.to.id
          let showPos = toId.split('-').pop()
          let group = this.groupChannels.find(item => {
            return item.showPos === showPos
          })
          let dragObj = group.data[evt.oldIndex]
          let newOrder = dragObj.listOrder
          let listOrder = group.data[evt.newIndex].listOrder
          if (evt.newIndex < evt.oldIndex) {
            newOrder = listOrder - 1
          } else {
            newOrder = listOrder + 1
          }
          dragObj.listOrder = newOrder
          console.log(dragObj)
          // editCatalog(obj).then(res => {
          //   this.resetTrackData({ pUUID: pUUID, trackNum: trackNum })
          // })
        }
      })
      /* eslint-enable */
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
</style>
