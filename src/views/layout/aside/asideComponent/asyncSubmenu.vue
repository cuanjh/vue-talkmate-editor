<template>
  <el-submenu ref="subMenu" :index="routerInfo.name">
    <template slot="title">
      <i v-if="routerInfo.meta.icon.indexOf('icon') > -1" :class="['font_family', routerInfo.meta.icon]"></i>
      <i v-else :class="'el-icon-'+routerInfo.meta.icon"></i>
      <span slot="title">{{routerInfo.meta.title}}</span>
    </template>
    <slot></slot>
  </el-submenu>
</template>

<script>
export default {
  name: 'AsyncSubmenu',
  props: {
    routerInfo: {
      default: () => {
        return null
      },
      type: Object
    }
  }
}
</script>
<style lang="scss">
.el-submenu {
  .is-active {
    background-color: rgb(12, 49, 76) !important;
  }
}
</style>
