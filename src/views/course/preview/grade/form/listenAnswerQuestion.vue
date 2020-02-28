<template>
  <div></div>
</template>

<script>
export default {
  props: ['form', 'slideForms', 'contentTypes', 'assetsDomain'],
  created () {
    this.$on('init', () => {
      console.log('listenAnswerQuestion init', this.form, this.slideForms)
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
