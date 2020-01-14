<template>
<transition name="fade">
  <div class="update-course-img" v-if="isSowUpImg">
    <div class="update-content">
      <h1>更改图标</h1>
      <div id="upload">
        <el-upload
          action="#"
          accept="image/png,image/jpg,image/jpeg"
          :on-change="fileChange"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="handleBeforeUpload"
          :auto-upload="false">
          <img class="avatar" :src="imageUrl">
          <div id="upload-btn">
            <a href="javascript:;">+本地上传</a>
          </div>
        </el-upload>
      </div>
      <div class="btns">
        <a class="cancel" href="javascript:;" @click="cancel()">取消</a>
        <a class="determine" href="javascript:;" @click="determine()">确定</a>
      </div>
    </div>
  </div>
</transition>
</template>

<script>

export default {
  data () {
    return {
      isSowUpImg: false,
      imageUrl: 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg',
      fileRaw: {}
    }
  },
  created () {
    this.$bus.on('showUpCourseImg', () => {
      this.isSowUpImg = true
    })
  },
  methods: {
    fileChange (file, fileList) {
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log(this.imageUrl)
      this.fileRaw = file
    },
    handleAvatarSuccess (res, file) {
      console.log(res, file)
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传图片前的过滤
    handleBeforeUpload (file) {
      if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'mp4')) {
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
    determine () {
      this.isSowUpImg = false
    },
    cancel () {
      this.isSowUpImg = false
      this.fileRaw = {}
      this.imageUrl = 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
    }
  },
  beforeDestroy () {
    this.$bus.off('showUpCourseImg')
  }
}
</script>

<style lang="scss" scoped>
.update-course-img {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
}
.update-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:500px;
  height:410px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 30px 70px 40px;
  box-sizing: border-box;
  h1 {
    font-size:18px;
    font-weight:600;
    color:rgba(0,0,0,1);
    line-height:25px;
    text-align: center;
  }
  #upload {
    margin: 48px auto 50px;
    text-align: center;
    .avatar {
      width:137px;
      height:137px;
      border-radius: 4px;
      object-fit: cover;
    }
    #upload-btn {
      padding-top: 14px;
      a {
        font-size:12px;
        font-weight:400;
        color:rgba(0,122,255,1);
        line-height:26px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: space-between;
    a {
      display: inline-block;
      width:150px;
      height:40px;
      line-height: 40px;
      font-size:14px;
      font-weight:400;
      border-radius:4px;
    }
    .cancel {
      color:rgba(0,122,255,1);
      border:1px solid rgba(0,122,255,1);
    }
    .determine {
      color:rgba(255,255,255,1);
      background: #007AFF;
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
