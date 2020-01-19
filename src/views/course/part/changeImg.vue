<template>
<transition name="fade">
  <div class="change-part-img"  v-if="showChangImg">
    <div class="change-content">
      <div class="close" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <h1>更换图片</h1>
      <div class="head">
        <div class="left">
          <span class="text url">图片地址：</span>
          <input type="text">
          <a href="javascript:;">确定</a>
        </div>
        <div class="right">
          <a href="http://files.200h.com/" target="_blank">图库</a>
          <a href="javascript:;">编辑器内查找</a>
          <a href="javascript:;">
            <el-upload
              class="upload-img"
              action="#"
              accept="image/png,image/jpg,image/jpeg"
              :on-change="fileNative"
              :on-success="nativeSuccess"
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
      <div class="img">
        <div class="img-box">
          <img :src="nativeImg" alt="">
        </div>
      </div>
      <div class="btns">
        <a class="cancel" href="javascript:;" @click="close()">取消</a>
        <a class="determine active" href="javascript:;" @click="determine()">确定</a>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  data () {
    return {
      showChangImg: false,
      nativeImg: '',
      fileRaw: {}
    }
  },
  methods: {
    show () {
      this.showChangImg = true
    },
    close () {
      this.showChangImg = false
    },
    fileNative (file, fileList) {
      console.log(file)
      this.nativeImg = URL.createObjectURL(file.raw)
      console.log(this.nativeImg)
      this.fileRaw = file
    },
    nativeSuccess (res, file) {
      console.log(res, file)
      this.nativeImg = URL.createObjectURL(file.raw)
    },
    // 上传图片前的过滤
    handleBeforeUpload (file) {
      if (!(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
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
    determine () {}
  }
}
</script>

<style lang="scss" scoped>
.change-part-img {
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
  width:860px;
  height:570px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  padding: 40px 35px;
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
  .text {
    font-size:12px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:30px;
  }
  .url {
    font-size: 14px;
  }
  a {
    font-size:12px;
    font-weight:400;
    color:rgba(0,0,0,1);
    line-height:30px;
    &:hover {
      color: #007AFF;
    }
    &:nth-child(2) {
      padding: 0 30px;
    }
  }
  .head {
    display: flex;
    justify-content: space-between;
    .left {
      input {
        width:300px;
        height:30px;
        border-radius:2px;
        border:1px solid rgba(0,0,0,.1);
        background: #F5F6FA;
        margin-left: 5px;
        margin-right: 10px;
        &:focus {
          color: #007AFF;
        }
      }
    }
    .right {
      .upload-img {
        display: inline-block;
      }
    }
  }
  .img {
    padding: 26px 0 46px;
    .img-box {
      width:524px;
      height:284px;
      border-radius: 4px;
      background: #fff;
      margin: 0 auto;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    a {
      display: inline-block;
      width:150px;
      height:40px;
      line-height: 40px;
      font-size:14px;
      font-weight:400;
      border-radius:4px;
      color:rgba(0,122,255,1);
      border:1px solid rgba(0,122,255,1);
      margin-right: 48px;
      padding: 0;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
      &.active {
        color:rgba(255,255,255,1);
        background: #007AFF;
      }
    }
  }
}
</style>
