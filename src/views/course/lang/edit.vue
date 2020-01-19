<template>
<transition name="fade">
  <div class="edit-container" v-show="showEdit">
    <div class="edit-content"></div>
  </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      showEdit: false
    }
  },
  mounted () {
  },
  methods: {
    show () {
      this.showEdit = true
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  z-index: 999;
}
.edit-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:860px;
  max-height:530px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  overflow-y: auto;
}
</style>
