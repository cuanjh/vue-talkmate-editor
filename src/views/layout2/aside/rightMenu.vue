<template>
  <transition name="fade">
    <div class="right-menu" v-show="isShow" :style="{left: left + 'px', top: top + 'px'}">
      <el-menu @select="handleSelect">
        <el-menu-item index="1" class="menuItem">
          <span slot="title">新建</span>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem">
          <span slot="title">修改</span>
        </el-menu-item>
        <el-menu-item index="3" class="menuItem">
          <span slot="title">删除</span>
        </el-menu-item>
      </el-menu>
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
    show (params) {
      this.isShow = true
      this.left = params.left - 20
      this.top = params.top + 20
    },
    hide () {
      this.isShow = false
    },
    handleSelect (key) {
      console.log(key)
    }
  }
}
</script>

<style lang="scss" scoped>
.right-menu {
  position: absolute;
}
</style>
