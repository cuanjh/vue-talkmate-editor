<template>
  <div class="form-container" @click="switchForm">
    <div class="form-type">
      <el-tag size="small" :effect="form.self_sign ? 'dark' : 'light'" :type="tagType">{{ typeName }}</el-tag>
      <div class="icons">
        <el-tooltip effect="dark" content="复制" placement="top">
          <i class="el-icon-document-copy" @click="copyForm"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
          <i class="el-icon-delete" @click="delForm"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="form">
      <div class="form-wrap">
        <div class="correct-area">
          <div class="wrap">
            <i @click="play(form.sound)"></i>
          </div>
        </div>
        <div class="options">
          <div class="option" v-for="(item, index) in form.options" :key="index">
            {{ item }}
          </div>
        </div>
      </div>
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
  components: {
  },
  computed: {
    ...mapState({
      contentTypes: state => state.course.contentTypes,
      selfSigns: state => state.course.selfSigns,
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
    tagType () {
      let obj = this.selfSigns.find(item => {
        return item.key === this.form.self_sign
      })
      let name = ''
      if (obj) {
        name = obj.type
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
    play (url) {
      if (url) {
        this.myAudio.src = this.assetsDomain + url
        this.myAudio.oncanplay = () => {
          this.myAudio.play()
        }
      }
    },
    delForm () {
      this.$emit('delForm', { form: this.form, formIndex: this.formIndex })
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
  // height: 220px;
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
      color: rgba($color: #000000, $alpha: 0.4);
      width: 200px;
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
      min-width: 15px;
      margin-left: 10px;
      height: 15px;
      display: inline-block;
      background-image: url('../../../../assets/images/course/icon-voice.png');
      background-repeat: no-repeat;
      background-size: cover;
      cursor: pointer;
    }
  }
}
.active {
  border: 1px solid #007AFF;
}
.form {
  margin-top: 16px;
  border-radius: 4px;
  background: #F5F6FA;
  padding-bottom: 20px;
  min-height: 220px;
  width: 260px;
  .correct-area {
    text-align: center;
    width: 100%;
    padding: 20px 0 10px;
    .wrap {
      background: #FFF;
      display: inline-block;
      padding: 10px 20px;
      border-radius: 20px;
      i {
        width: 15px;
        min-width: 15px;
        margin-right: 10px;
        vertical-align: middle;
        height: 15px;
        display: inline-block;
        background-image: url('../../../../assets/images/course/icon-voice.png');
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
      }
    }
  }
  .options {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin: 10px 20px;
    .option {
      background: #FFF;
      margin: 5px 0;
      padding: 5px;
      border-radius: 4px;
    }
  }
}

.chapter {
  height: 100%;
  vertical-align: middle;
  .correct-area {
    text-align: center;
    width: 100%;
    padding: 20px 0 10px;
    .wrap {
      span {
        margin-right: 5px;
      }
      i {
        width: 15px;
        min-width: 15px;
        margin-right: 10px;
        vertical-align: middle;
        height: 15px;
        display: inline-block;
        background-image: url('../../../../assets/images/course/icon-voice.png');
        background-repeat: no-repeat;
        background-size: cover;
        cursor: pointer;
      }
      display: inline-block;
      padding: 10px 20px;
      border-radius: 20px;
    }
  }
  .word {
    padding: 10px;
    text-align: left;
  }
}
</style>
