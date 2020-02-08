<template>
  <div :class="['form', form.type]">
    <a @click="check">
      <img :src="assetsDomain + form.image" alt="">
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['form'],
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain
    })
  },
  methods: {
    check () {
      this.$parent.$emit('check', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.sentenceToImg {
  width: 100%;
  height: 207px;
}
a {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 207px;
    object-fit: cover;
    border-radius:16px;
  }
}
</style>
