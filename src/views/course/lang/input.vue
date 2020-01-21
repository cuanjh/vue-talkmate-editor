<template>
  <div class="input-box">
    <el-input v-model="val" @input="updateInput"></el-input>
    <span>{{'(' + lang.name + ')'}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['lang', 'inputKey', 'text'],
  data () {
    return {
      val: ''
    }
  },
  mounted () {
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos
    })
  },
  methods: {
    updateInput () {
      console.log(this.val)
      this.$emit('updateInput', { inputKey: this.inputKey, val: this.val, langKey: this.lang.langKey })
    }
  },
  watch: {
    text (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.val = newVal
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
