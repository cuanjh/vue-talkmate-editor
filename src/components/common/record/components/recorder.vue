<template>
  <div class="record-container" v-if="showRecorder">
    <div class="recorder-handler">
      <el-button type="primary" size="small" :disabled="isRecording" @click="startRecorder">开始录音</el-button>
      <el-button type="primary" size="small" :disabled="!isRecording" @click="stopRecorder">结束录音</el-button>
    </div>
    <div class="record-duration">{{ recordedTime }}</div>
    <div class="player">
      <audio-player :src="recorderUrl" :record="recorder"/>
    </div>
    <div class="btn-handler">
      <el-button type="primary" size="small" @click="resetRecorder">重置</el-button>
      <el-button type="primary" size="small" @click="downloadRecorder">下载</el-button>
      <el-button type="success" size="small" @click="saveRecorder">保存</el-button>
    </div>
  </div>
</template>

<script>
import Recorder from 'js-audio-recorder'
import { convertTimeMMSS, convertToMp3 } from '../lib/utils'

export default {
  data () {
    return {
      recorder: null,
      isHaveRecorderPermission: false,
      isRecording: false,
      time: 2, // 限制录音时长 minuts
      recorderUrl: '',
      // mp3: '/demo/example.mp3',
      showRecorder: false,
      headers: {
        'X-Custom-Header': 'some data'
      }
    }
  },
  mounted () {
    this.recorder = new Recorder()
  },
  computed: {
    recordedTime () {
      if (!this.recorder) return convertTimeMMSS(0)
      if (this.time && this.recorder.duration >= this.time * 60) {
        this.stopRecorder()
      }
      return convertTimeMMSS(this.recorder.duration)
    }
  },
  methods: {
    // 获取麦克风权限
    getPermission () {
      Recorder.getPermission().then(() => {
        console.log('给权限了')
        this.isHaveRecorderPermission = true
      }, (error) => {
        console.log(`${error.name} : ${error.message}`)
        this.isHaveRecorderPermission = false
        // this.$message({
        //   type: 'warning',
        //   message: '请打开使用你的麦克风'
        // })
      })
    },
    // 开始录音
    startRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      this.isRecording = true
      this.recorder.start().then(() => {
        // 开始录音
      }, (error) => {
        console.log(`${error.name} : ${error.message}`)
      })
    },
    // 暂停录音
    pauseRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      this.recorder.pause()
    },
    // 继续录音
    resumeRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      this.recorder.resume()
    },
    // 结束录音
    stopRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      this.isRecording = false
      this.recorder.stop()
      let blob = this.recorder.getWAVBlob()
      this.recorderUrl = window.URL.createObjectURL(blob)
    },
    destroyRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      this.recorder.destroy().then(() => {
        this.recorder = null
      })
    },
    toggle () {
      this.getPermission()
      this.showRecorder = !this.showRecorder
    },
    resetRecorder () {
      this.destroyRecorder()
      this.recorderUrl = ''
    },
    downloadRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      let filename = (new Date()).getTime()
      this.recorder.downloadWAV(filename)
    },
    saveRecorder () {
      if (!this.isHaveRecorderPermission) {
        this.$message({
          type: 'warning',
          message: '请打开使用你的麦克风'
        })
        return false
      }
      const reader = new FileReader()
      reader.onload = () => {
        let wavDataView = new DataView(reader.result)
        let mp3BlobData = convertToMp3(this.recorder, wavDataView)
        this.$emit('saveRecorder', mp3BlobData)
      }
      reader.readAsArrayBuffer(this.recorder.getWAVBlob())
    }
  },
  destroyed () {
    this.recorder = null
  }
}
</script>

<style lang="scss">
  .record-container {
    padding: 20px;
    background: #FFFFFF;
    border-radius: 5px;
  }

  .player {
    margin-top: 20px;
  }

  .record-duration {
    color: #AEAEAE;
    font-size: 32px;
    font-weight: 500;
    margin-top: 20px;
    margin-bottom: 16px;
    text-align: center;
  }

  .btn-handler {
    margin-top: 20px;
    text-align: center;
  }
</style>
