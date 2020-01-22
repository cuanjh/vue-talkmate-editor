<template>
  <div class="form-container" @click="switchForm">
    <div class="form-type">
      <span>{{ typeName }}</span>
      <i class="el-icon-delete"></i>
    </div>
    <el-image :src="assetsDomain + form.image" fit="cover"></el-image>
    <div class="text">
      <span v-text="form.sentence"></span>
      <i></i>
    </div>
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
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain
    }),
    typeName () {
      let obj = this.contentTypes.find(item => {
        return item.type === this.form.type
      })
      return obj.name
    }
  },
  methods: {
    switchForm () {
      this.$emit('switchForm', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  display: inline-block;
  background: #FFFFFF;
  width: 208px;
  height: 220px;
  border-radius: 15px;
  margin: 9px;
  padding: 10px 16px;
  border: 1px solid #fff;
  .form-type {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4)
    }
    i {
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span {}
    i {
      width: 15px;
      height: 15px;
      display: inline-block;
      background-image: url('../../../assets/images/course/icon-voice.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
.active {
  border: 1px solid #007AFF;
}
</style>
