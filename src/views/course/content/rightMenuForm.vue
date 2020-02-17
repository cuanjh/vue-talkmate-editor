<template>
  <transition name="fade">
    <div class="right-menu-container" :style="{'left': left + 'px', 'top': top + 'px'}" v-show="isShow">
      <div class="menu">
        <div class="menu-group">
          <div class="menu-item">
            <div class="name" @click="paste">粘贴</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      left: 0,
      top: 0
    }
  },
  methods: {
    show (ev) {
      this.left = ev.x - 30
      this.top = ev.y
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    paste () {
      this.$emit('paste')
    }
  }
}
</script>

<style lang="scss" scoped>
.right-menu-container {
  position: absolute;
  background: #F5F6FA;
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  border-radius:4px;
  font-size: 12px;
  font-weight: 400;
  color: #000;
  padding: 3px 0;
  .menu {
    width: 110px;
    .menu-item {
      padding: 3px 0;
      &:hover {
        background: #007AFF;
        color: #fff;
      }
      .name {
        padding-left: 10px;
      }
    }
    .line {
      width: 100%;
      height: 1px;
      margin: 2px 0;
      background: rgba($color: #000000, $alpha: 0.05)
    }
  }
}
</style>
