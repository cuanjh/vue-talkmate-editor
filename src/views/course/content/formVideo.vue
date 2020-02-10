<template>
  <div class="form-container" @click="switchForm">
    <div class="form-handler">
      <el-tooltip effect="dark" content="复制" placement="top">
        <i class="el-icon-document-copy" @click="copyForm"></i>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除" placement="top">
        <i v-show="form.uuid" class="el-icon-delete" @click="delForm"></i>
      </el-tooltip>
    </div>
    <div class="form">
      <video :id="'form-video-' + formIndex" :src="videoUrl" controls :poster="coverUrl"></video>
    </div>
    <div class="text" v-show="form.content">
      <span v-text="form.content"></span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: ['form', 'formIndex'],
  data () {
    return {
      myVideo: null
    }
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      assetsDomain: state => state.course.assetsDomain,
      version: state => state.course.version
    }),
    coverUrl () {
      let url = ''
      if (this.form && this.form.cover) {
        url = this.assetsDomain + this.form.cover
      }
      return url
    },
    videoUrl () {
      let url = ''
      if (this.form && this.form.video) {
        url = this.assetsDomain + this.form.video
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
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  width: 208px;
  border-radius: 15px;
  margin: 9px;
  padding: 10px 16px 16px;
  border: 1px solid #fff;
  .form-handler {
    height: 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba($color: #000000, $alpha: 0.4)
    }
    i {
      margin-left: 15px;
      cursor: pointer;
    }
  }
  .form {
    flex: 1;
    background: #F5F6FA;
    width: 100%;
    margin-top: 10px;
    border-radius: 4px;
    overflow: hidden;
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .text {
    height: 70px;
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
