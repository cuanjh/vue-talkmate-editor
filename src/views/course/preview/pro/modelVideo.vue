<template>
  <div class="model-video">
    <div class="model-content">
      <form-video v-for="(form, index) in slideForms" :key="index" :form="form" :index="index"/>
    </div>
  </div>
</template>

<script>
import FormVideoComp from '../form/formVideo'

export default {
  props: ['slideForms'],
  created () {
    this.$on('init', () => {
      console.log('video init', this.slideForms)
    })
  },
  components: {
    'formVideo': FormVideoComp
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
.model-video {
  width: 100%;
  height: 100%;
  .model-content {
    width: 100%;
    height: 100%;
  }
}
</style>
