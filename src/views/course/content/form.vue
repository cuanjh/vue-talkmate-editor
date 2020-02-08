<template>
  <div class="form-container" @click="switchForm">
    <div class="form-type">
      <span>{{ typeName }}</span>
      <div class="icons">
        <el-tooltip effect="dark" content="复制" placement="top">
          <i class="el-icon-document-copy" @click="copyForm"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
          <i v-show="form.uuid" class="el-icon-delete" @click="delForm"></i>
        </el-tooltip>
      </div>
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
import { mapState, mapMutations } from 'vuex'
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
      console.log(this.contentTypes)
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
    ...mapMutations({
      updateVersion: 'course/updateVersion'
    }),
    switchForm () {
      this.$emit('switchForm', { content: this.form, formIndex: this.formIndex })
    },
    play () {
      this.myAudio.src = this.assetsDomain + this.form.sound
      this.myAudio.play()
    },
    delForm () {
      this.$emit('delForm', this.form)
    },
    copyForm () {
      let obj = this.form
      let copyFormStr = JSON.stringify(obj)
      this.updateVersion({ key: 'copyForm', val: copyFormStr })
      this.$message({
        type: 'success',
        message: '复制成功',
        showClose: true
      })
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
    .icons {
      i {
        margin-left: 15px;
        cursor: pointer;
      }
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
