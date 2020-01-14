<template>
  <div class="letters">
    <ul>
      <li v-for="item in letters" :key="'letter-' + item">
        <a href="javascript:;"
          :class="{'active': activeLet == item}"
          @click="handleLetterClick(item)">{{item}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeLet: '热',
      letters: ['热', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  methods: {
    handleLetterClick (item) {
      // let letterId = document.getElementById('letter-' + item)
      // let contentId = document.getElementById('langs-lists')
      // let top = letterId.offsetTop
      // // console.log(letterId, contentId, top)
      // contentId.animate({ scrollTop: top }, 100, 'linear')
      // contentId.scrollTop(0, 380)
      this.activeLet = item
    }
  }
}
</script>

<style lang="scss" scoped>
.letters {
  margin-right: 72px;
  margin-top: 160px;
  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    li {
      a {
        font-size:10px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,.4);
        line-height:20px;
        letter-spacing:2px;
        &:hover {
          color: #007AFF;
        }
        &.active {
          color: rgba(0,0,0,1);
        }
      }
    }
  }
}
</style>
