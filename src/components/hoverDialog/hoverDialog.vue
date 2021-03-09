<template>
  <transition name="fade" mode="in-out">
    <div class="wrap" v-if="show" :style="styleObject">
      <ul class="btn-list">
        <li
          :class="['btn-item', h.cls]"
          v-for="h in handlers"
          :key="h.key"
          @click="handler(h)">
          {{h.text}}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    handler (h) {
      console.log(2, h)
      this.$bus.$emit('handlerClick', {
        type: h.key,
        data: this.dataObj
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  position: fixed;
  z-index: 999;
}

.btn-list {
  position: absolute;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.15);
  width: max-content;
  z-index: 1;
  .btn-item {
    padding: 7px;
    border-bottom: 1px solid rgba(151,151,151,.2);
    font-size: 10px;
    font-weight: 400;
    color: #767474;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: rgba(0,0,0,0.1);
    }
  }
  .error {
    color: #bd263c;
  }
}
</style>
