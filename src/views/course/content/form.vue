<template>
  <div class="form-container" @click="switchForm">
    <div class="form-type">
      <el-tag v-show="form.self_sign" size="small" effect="dark" :type="tagType">{{ typeName }}</el-tag>
      <span v-show="!form.self_sign">{{ typeName }}</span>
      <div class="icons">
        <el-tooltip effect="dark" content="复制" placement="top">
          <i class="el-icon-document-copy" @click="copyForm"></i>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
          <i class="el-icon-delete" @click="delForm"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="form-img">
      <el-image v-show="imgUrl" :src="imgUrl | urlFix('imageView2/1/format/jpg')" fit="cover" @click="play"></el-image>
    </div>
    <div :class="['text', form.type]" v-if="form.type == 'pictureSentence'">
      <div class="options" v-show="form.options.length">
        <div class="option" v-for="(item, index) in form.options" :key="index">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="text" v-else>
      <span v-text="form.type == 'fillGap' && form.options ? form.sentence.replace(form.options[0], '______') : form.sentence"></span>
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
      assetsDomain: state => state.course.assetsDomain,
      selfSigns: state => state.course.selfSigns,
      lowerRoleUser: state => state.user.lowerRoleUser
    }),
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
    typeName () {
      console.log(this.contentTypes)
      let obj = this.contentTypes.find(item => {
        return item.type === this.form.type
      })
      let name = ''
      if (obj) {
        name = obj.name
      }
      return name ? (this.formIndex + 1) + '. ' + obj.name : (this.formIndex + 1)
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
      if (!this.form.sound) return
      this.myAudio.src = this.assetsDomain + this.form.sound
      this.myAudio.play()
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
  width: 208px;
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
      cursor: pointer;
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

.pictureSentence {
  .options {
    display: flex;
    flex-direction: column;
    flex: 1;
    .option {
      background: rgba($color: #000000, $alpha: .1);
      margin-bottom: 5px;
      border-radius: 4px;
      padding: 5px;
    }
  }
}
</style>
