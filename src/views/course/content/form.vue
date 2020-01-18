<template>
  <div class="form-container">
    <div class="form-type">
      <span>{{ formTypes[form.formType] }}</span>
      <i></i>
    </div>
    <el-image :src="form.image" fit="cover"></el-image>
    <div class="text" v-text="form.sentence"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['form'],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      formTypes: state => state.course.formTypes
    })
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  background: #FFFFFF;
  width: 208px;
  height: 220px;
  border-radius: 15px;
  margin: 9px;
  padding: 10px 16px;
  .form-type {
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4)
    }
  }
  .el-image {
    margin-top: 10px;
    border-radius: 4px;
    width: 100%;
    height: 120px;
  }
  .text {
    margin-top: 10px;
    line-height: 20px;
    min-height: 40px;
  }
}
</style>
