<template>
  <div class="more-container" @mouseenter="show">
    <div class="more-wrap">
      <i class="el-icon-more"></i>
    </div>
  </div>
</template>

<script>
let flag = false
export default {
  props: ['handlers', 'dataObj'],
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show (e) {
      console.log(e)
      if (flag) return
      let data = {
        x: e.x,
        y: e.y,
        handlers: this.handlers,
        dataObj: this.dataObj
      }
      flag = true
      this.$hoverDialog({ data, show: true })
      setTimeout(() => {
        flag = false
      }, 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.more-container {
  position: absolute;
  cursor: pointer;
  z-index: 1;
  .more-wrap {
    position: relative;
    text-align: center;
  }
}
</style>
