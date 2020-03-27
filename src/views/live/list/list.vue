<template>
  <div class="live-container">
    <div class="top-bar">
      <el-button type="primary" icon="el-icon-plus" @click="add">添加专辑</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    add () {
      this.$router.push({ name: 'live-edit', query: { flag: 'add' } })
    }
  }
}
</script>

<style lang="scss" scoped>
.live-container {
  background: #f00;
}
.top-bar {
  margin: 20px 0;
  text-align: right;
}
</style>
