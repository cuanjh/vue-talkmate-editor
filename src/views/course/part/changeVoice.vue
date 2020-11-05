<template>
  <transition name="fade">
    <div class="change-voice" v-if="showChangVoice">
      <div class="change-content">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="top-box">
          <div class="play" @click="playAudio()">
            <audio id="audio" :src="audioUrl"></audio>
            <i class="font_family icon-play"></i>
          </div>
          <div class="right">
            <h1>更换声音</h1>
            <div class="banner">
              <a href="javascript:;" :class="{'active': isActive == 1}" @click="changeBanner(1)">编辑器内查找</a>
              <a href="javascript:;" :class="{'active': isActive == 2}" @click="changeBanner(2)">
                <el-upload
                    id="audioUpload"
                    action="#"
                    accept="audio/mp3"
                    :on-change="fileAudio"
                    :on-success="audioSuccess"
                    :before-upload="handleBeforeUpload"
                    :show-file-list="false"
                    :auto-upload="false">
                  <div id="upload-text">
                    <span>+本地上传</span>
                  </div>
                </el-upload>
              </a>
            </div>
          </div>
        </div>
        <div v-show="isActive == 1">
          <editor-in-comp ref="editorIn" @closeEditorModel="close"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import EditorInComp from './editorIn'

export default {
  data () {
    return {
      isActive: -1,
      showChangVoice: false,
      audioUrl: '',
      fileRaw: {}
    }
  },
  components: {
    EditorInComp
  },
  methods: {
    show () {
      this.showChangVoice = true
    },
    close () {
      this.showChangVoice = false
      this.isActive = -1
    },
    fileAudio (file, fileList) {
      console.log(file, fileList)
      this.audioUrl = URL.createObjectURL(file.raw)
      console.log(this.audioUrl)
      this.fileRaw = file
    },
    audioSuccess (res, file) {
      console.log(res, file)
      this.audioUrl = URL.createObjectURL(file.raw)
      console.log(this.audioUrl)
    },
    // 上传图片前的过滤
    handleBeforeUpload (file) {
      if (!(file.type === 'audio/mp3')) {
        this.$alert(`请上传正确的图片格式`, '温馨提示!', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return false
      }
    },
    playAudio () {
      let audio = document.getElementById('audio')
      audio.src = this.audioUrl
      audio.play()
    },
    changeBanner (params) {
      this.isActive = params
      if (params === 1) {
        this.$refs.editorIn.showStepOne()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.change-voice {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
}
.change-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  width:860px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 40px 0;
  box-sizing: border-box;
  .close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  h1 {
    font-size:18px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:25px;
    text-align: center;
    padding-bottom: 40px;
  }
  .top-box {
    position: relative;
    padding: 0 54px;
    .play {
      position: absolute;
      left: 54px;
      width: 62px;
      height: 62px;
      background: #007AFF;
      border-radius: 50%;
      text-align: center;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
      i {
        color: #fff;
        font-size: 22px;
        line-height: 62px;
      }
    }
    .right {
      margin: 0 auto;
      #audioUpload {
        display: inline-block;
      }
    }
    .banner {
      text-align: center;
      a {
        font-size:12px;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:17px;
        margin-right: 30px;
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          color: #007AFF;
        }
        &.active {
          color: #007AFF;
        }
      }
    }
  }
}
</style>
