<template>
  <el-dialog
  title="图片裁剪"
  :visible.sync="dialogVisible"
  custom-class="cropper-dialog"
  width="50%"
  @open="show"
  @close="close">
  <div class="cropper-container">
    <section class="cropper-area">
      <el-form ref="form" :model="form" label-width="80px" size="small">
        <el-form-item label="裁剪尺寸">
          宽：<el-input-number v-model="form.cropperWidth" :min="0"></el-input-number>
          高：<el-input-number v-model="form.cropperHeight" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="裁剪倍数" v-show="false">
          <el-radio-group v-model="form.times">
            <el-radio :label="2">2倍</el-radio>
            <el-radio :label="3">3倍</el-radio>
          </el-radio-group>
        </el-form-item>
        <vue-cropper
          ref="cropper"
          :ready="cropperReady"
          :aspectRatio="form.cropperWidth / form.cropperHeight"
          :cropBoxResizable="false"
          dragMode="none"
          :src="form.imgUrl">
        </vue-cropper>
        <el-button-group class="cropper-actions">
          <el-button type="primary" icon="el-icon-back" size="small" @click.prevent="move(-10, 0)">左移</el-button>
          <el-button type="primary" icon="el-icon-right" size="small" @click.prevent="move(10, 0)">右移</el-button>
          <el-button type="primary" icon="el-icon-top" size="small" @click.prevent="move(0, -10)">上移</el-button>
          <el-button type="primary" icon="el-icon-bottom" size="small" @click.prevent="move(0, 10)">下移</el-button>
          <el-button type="primary" icon="el-icon-zoom-in" size="small" @click.prevent="zoom(0.2)">放大</el-button>
          <el-button type="primary" icon="el-icon-zoom-out" size="small" @click.prevent="zoom(-0.2)">缩小</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="small" @click.prevent="reset">重置</el-button>
        </el-button-group>
      </el-form>
    </section>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="success" @click.prevent="saveCropper">保 存</el-button>
  </div>
</el-dialog>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import { convertBase64ToBlob, uploadQiniu } from '../../utils/uploadQiniu'
import moment from 'moment'
export default {
  data () {
    return {
      dialogVisible: false,
      token: '',
      form: {
        imgSrc: '',
        cropperWidth: 303,
        cropperHeight: 310,
        times: 2
      }
    }
  },
  components: {
    VueCropper
  },
  created () {
    this.$bus.on('showCropperDialog', (params) => {
      this.form.imgSrc = params.url
      this.token = params.token
      this.dialogVisible = true
    })
  },
  watch: {
    'form.cropperWidth' () {
      if (this.form.cropperWidth > 0) {
        this.$refs.cropper.setCropBoxData({ width: this.form.cropperWidth, height: this.form.cropperHeight })
      }
    },
    'form.cropperHeight' () {
      if (this.form.cropperHeight) {
        this.$refs.cropper.setCropBoxData({ width: this.form.cropperWidth, height: this.form.cropperHeight })
      }
    }
  },
  methods: {
    show () {
      this.$nextTick(() => {
        this.$refs.cropper.replace(this.form.imgSrc)
      })
    },
    // 上下左右移动
    move (offsetX, offsetY) {
      this.$refs.cropper.move(offsetX, offsetY)
    },
    // 放大、缩小
    zoom (percent) {
      this.$refs.cropper.relativeZoom(percent)
    },
    // 重置
    reset () {
      this.form.cropperHeight = 310
      this.form.cropperWidth = 303
      this.$refs.cropper.reset()
    },
    // 保存裁剪图片
    async saveCropper () {
      let cropBoxData = this.$refs.cropper.getCropBoxData()
      let width = Math.round(cropBoxData.width)
      let height = Math.round(cropBoxData.height)
      let times = [2, 3]
      let date = moment(new Date()).format('YYYYMMDDHHmmss')
      let urls = []
      for (let i = 0; i < times.length; i++) {
        let url = 'course/images/icon/' + (width * times[i]) + '*' + (height * times[i]) + '/' + date + '@' + times[i] + 'x.png'
        let $imgData = this.$refs.cropper.getCroppedCanvas({ width: width * times[i], height: height * times[i] })
        let base64 = $imgData.toDataURL('image/png')
        let blobData = convertBase64ToBlob(base64)
        await uploadQiniu(blobData, this.token, url)
        urls.push(url)
      }
      this.$bus.$emit('uploadCopperImages', urls)
      this.dialogVisible = false
    },
    close () {
      this.form.imgSrc = ''
      this.form.cropperWidth = 303
      this.form.cropperHeight = 310
      this.form.times = 2
    },
    cropperReady () {
      this.$refs.cropper.setCropBoxData({ width: this.form.cropperWidth, height: this.form.cropperHeight })
    }
  },
  beforeDestroy () {
    this.$bus.off('showCropperDialog')
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 800px;
  height: 500px;
}
.cropper-container {
  .cropper-area {
    // width: 614px;
  }
  // .preview-area {
  //   width: 307px;
  // }
  .el-input-number {
    margin-right: 10px;
  }
}

.cropper-actions {
  margin-top: 10px;
}
.dialog-footer {
  text-align: center;
}
</style>
