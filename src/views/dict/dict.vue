<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'Dict',
  mounted () {
    this.$store.dispatch('course/getDictTags')
  }
}
</script>

<style lang="scss">
</style>
