<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style lang="scss">
// 引入初始化样式
@import './assets/scss/main.scss';
@import './assets/scss/base.scss';
@import './assets/scss/self.scss';

#app {
  background: #F5F6FA;
  height: 100vh;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  -webkit-transition: opacity .5s;
  -moz-transition: opacity .5s;
  -o-transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.icon-yes {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url('./assets/images/icons/icon-yes.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.icon-no {
  display: inline-block;
  width: 24px;
  height: 24px;
  background-image: url('./assets/images/icons/icon-no.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
