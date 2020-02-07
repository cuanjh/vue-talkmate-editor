<template>
  <div class="form-container" @click="switchForm">
    <div class="form-type">
      <span>{{ typeName }}</span>
      <i v-show="form.uuid" class="el-icon-delete" @click="delForm"></i>
    </div>
    <div class="form-img">
      <el-image v-show="imgUrl" :src="imgUrl" fit="cover"></el-image>
    </div>
    <div class="text">
      <span v-text="form.sentence"></span>
      <i v-show="form.sound" @click="play"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['form', 'formIndex'],
  data () {
    return {
      myAudio: new Audio()
    }
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
      let name = ''
      if (obj) {
        name = obj.name
      }
      return name
    },
    imgUrl () {
      let url = ''
      if (this.form && this.form.image) {
        url = this.assetsDomain + this.form.image
      }
      return url
    }
  },
  methods: {
    switchForm () {
      this.$emit('switchForm', { content: this.form, formIndex: this.formIndex })
    },
    play () {
      this.myAudio.src = this.assetsDomain + this.form.sound
      this.myAudio.play()
    },
    delForm () {
      this.$emit('delForm', this.form)
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
    height: 16px;
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
  .form-img {
    background: #F5F6FA;
    width: 100%;
    height: 120px;
    margin-top: 10px;
    border-radius: 4px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
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
      cursor: pointer;
    }
  }
}
.active {
  border: 1px solid #007AFF;
}
</style>
