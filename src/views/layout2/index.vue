<template>
  <el-container class="layout-cont">
    <el-aside width="230px" class="aside-cont">
      <aside-comp />
    </el-aside>
    <el-container>
      <el-header class="header-cont">
        <div class="title">欢迎进入全球说课程编辑系统</div>
      </el-header>
      <el-main class="main-cont">
        <router-view></router-view>
        <!-- <version v-if="selLayer == 'project'" @switchVersion="switchVersion"/>
        <chapter v-if="selLayer == 'level'" />
        <module v-if="selLayer == 'chapter'" /> -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AsideComp from './aside/aside'
export default {
  data () {
    return {
    }
  },
  components: {
    AsideComp
  },
  mounted () {
    let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    this.levelHeight = h - 280
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
$headerHight: 60px;
$mainHight: 100vh;
.layout-cont {
  .aside-cont {
    height: $mainHight !important;
    overflow: visible;
    position: relative;
    background: #002742;
    box-shadow:0px 2px 3px 0px rgba(183,183,183,1);
  }
  .header-cont {
    height: $headerHight !important;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    line-height: $headerHight;
    .title {
      padding-left: 24px;
      font-size: 20px;
      font-weight: 400;
      color: #000;
    }
  }
  .main-cont {
    background: #F5F6FA;
    padding: 0px;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
  -webkit-transition: opacity .1s;
  -moz-transition: opacity .1s;
  -o-transition: opacity .1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
