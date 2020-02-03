<template>
<transition name="fade">
  <div class="sort-lang" v-show="showSortLang">
    <div class="sort-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <h1>语种排序</h1>
      <div class="langs-lists" id="langs-lists">
        <div class="lang-item" v-for="item in allLangs" :key="item.lan_code">
          <a href="javascript:;">
            <div class="img-box">
              <img :src="item.flag ? assetsUrl + item.flag[0] : ''" alt="">
              <p class="list-order">{{item.list_order}}</p>
            </div>
            <p class="title">{{item.title ? item.title['zh-CN'] : ''}}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import { getLangList, editLang } from '@/api/course'
import Sortable from 'sortablejs'

export default {
  // props: ['allLangs', 'assetsUrl'],
  data () {
    return {
      showSortLang: false,
      allLangs: [],
      assetsUrl: ''
    }
  },
  mounted () {
    this.initData()
    console.log(this.allLangs)
    let $chapterList = document.getElementById('langs-lists')
    let sortable = new Sortable($chapterList, {
      swapThreshold: 1,
      animation: 150,
      onEnd: (evt) => {
        console.log(evt)
        console.log(this.allLangs)
        console.log('evt.newIndex - 1', this.allLangs[evt.newIndex - 1])
        console.log('evt.newIndex', this.allLangs[evt.newIndex])
        console.log('evt.oldIndex', this.allLangs[evt.oldIndex])
        let lang = this.allLangs[evt.oldIndex]
        let order = 0
        if (this.allLangs[evt.newIndex].list_order > this.allLangs[evt.oldIndex].list_order) {
          order = this.allLangs[evt.newIndex].list_order + 1
        } else {
          order = this.allLangs[evt.newIndex].list_order >= 1 ? this.allLangs[evt.newIndex].list_order - 1 : 0
        }
        let obj = {
          'lang_info': {}
        }
        obj['lan_code'] = lang.lan_code
        obj.lang_info['desc'] = lang.desc ? lang.desc : {}
        obj.lang_info['flag'] = lang.flag ? lang.flag : []
        obj.lang_info['is_hot'] = lang.is_hot
        obj.lang_info['is_show'] = lang.is_show
        obj.lang_info['list_order'] = order
        obj.lang_info['title'] = lang.title ? lang.title : {}
        obj.lang_info['word_direction'] = lang.word_direction
        console.log(obj)
        editLang(obj).then(res => {
          if (res.success) {
            console.log(res)
            // this.$emit('sortLang')
            this.initData()
          }
        })
      }
    })
    console.log(sortable)
  },
  methods: {
    async initData () {
      let res = await getLangList({ 'pageNo': 0, 'pageSize': 999 })
      if (res.success) {
        let sortLangs = res.data.langs.sort((a, b) => {
          return a.list_order - b.list_order
        })
        this.allLangs = sortLangs
        this.assetsUrl = res.data.assetsUrl
        console.log(this.allLangs)
      }
    },
    show () {
      this.showSortLang = true
    },
    close () {
      this.showSortLang = false
      this.$emit('sortLang')
    }
  }
}
</script>

<style lang="scss" scoped>
.sort-lang {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 999;
}
.sort-content {
  width: 80%;
  height: 80%;
  background: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  h1 {
    font-size:20px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:28px;
    text-align: center;
    padding-bottom: 20px;
  }
  .langs-lists {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    overflow-y: auto;
    .lang-item {
      padding-right: 40px;
      padding-bottom: 30px;
      a {
        display: inline-block;
        width: 90px;
        height: 100%;
        .img-box {
          position: relative;
          width: 58px;
          height: 58px;
          background: #e1e1e1;
          border-radius: 8px;
          margin: 0 auto;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
          .list-order {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0,.6);
            border-radius: 8px;
            width: 100%;
            height: 100%;
            text-align: center;
            font-size: 18px;
            color: #fff;
            line-height: 58px;
          }
        }
        .title {
          font-size:14px;
          font-weight:400;
          color:rgba(0,0,0,1);
          line-height:20px;
          text-align: center;
          padding-top: 12px;
        }
      }
    }
  }
}
/*滚动条样式*/
.langs-lists::-webkit-scrollbar {/*滚动条整体样式*/
  position: relative;
  width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.langs-lists::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  position: absolute;
  width: 6px;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
  background: rgba(0, 0, 0, .4);
  padding: 20px;
}
.langs-lists::-webkit-scrollbar-track {/*滚动条里面轨道*/
  width: 4px;
  width:2px;
  background:rgba(216,216,216,1);
  border-radius:1px;
  opacity:0.1;
}
</style>
