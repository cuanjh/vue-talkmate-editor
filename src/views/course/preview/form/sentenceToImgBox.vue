<template>
  <div :class="['form', form.type]">
    <a class="img-box" @click="check">
      <img :src="assetsDomain + form.image" alt="">
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form', 'index'],
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  created () {
    this.$on('init', () => {
      console.log('speakToImgBox init')
      this.$parent.$emit('curFormPlay')
    })
  },
  methods: {
    check () {
      let obj = {
        form: this.form,
        index: this.index
      }
      this.$parent.$emit('check', obj)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
