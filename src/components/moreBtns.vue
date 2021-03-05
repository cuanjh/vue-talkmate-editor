<template>
  <div class="more-container" @mouseenter="isShow = true" @mouseleave="isShow = false">
    <div class="more-wrap">
      <i class="el-icon-more"></i>
      <transition name="fade" mode="in-out">
        <ul class="btn-list" v-show="isShow">
          <li :class="['btn-item', h.cls]" v-for="h in handlers" :key="h.key" @click="handler(h)">{{h.text}}</li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  props: ['handlers', 'dataObj'],
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    handler (h) {
      this.$emit('handlerClick', {
        type: h.key,
        data: this.dataObj
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.more-container {
  position: absolute;
  cursor: pointer;
  z-index: 99;
  .more-wrap {
    position: relative;
    text-align: center;
  }
}

.btn-list {
  position: absolute;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.15);
  width: max-content;
  .btn-item {
    padding: 7px;
    border-bottom: 1px solid rgba(151,151,151,.2);
    font-size: 10px;
    font-weight: 400;
    color: #767474;
    line-height: 14px;
    cursor: pointer;
  }
  .error {
    color: #bd263c;
  }
}
</style>
