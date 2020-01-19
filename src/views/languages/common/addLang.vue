<template>
  <transition name="fade">
    <div class="add-lang-container" v-if="isShowAddLang">
      <div class="add-lang-content">
        <div class="table-box">
          <table>
            <tr>
              <th>序号</th>
              <th>编码</th>
              <th>名称<b>(中文)</b></th>
              <th>名称<b>(英文)</b></th>
              <th>是否热门</th>
              <th>图标</th>
            </tr>
            <tr>
              <td class="langIndex"><input type="text" v-model="lang.langIndex"></td>
              <td class="langCode"><input type="text" v-model="lang.langCode"></td>
              <td class="langZhName"><input type="text" v-model="lang.langZhName"></td>
              <td class="langEnName"><input type="text" v-model="lang.langEnName"></td>
              <td class="isHot"><input type="text" v-model="lang.isHot"></td>
              <td class="upload">
                <el-upload
                  action="#"
                  accept="image/png,image/jpg,image/jpeg"
                  :on-change="fileChange"
                  :on-success="handleAvatarSuccess"
                  :before-upload="handleBeforeUpload"
                  :show-file-list="false"
                  :auto-upload="false">
                  <div id="upload-btn">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </div>
                </el-upload>
              </td>
            </tr>
          </table>
        </div>
        <div class="bottom-content">
          <div class="img-box">
            <img :src="imageUrl" alt="">
            <span>图标</span>
          </div>
        </div>
        <div class="btns">
          <a class="cancel" href="javascript:;" @click="cancel()">取消</a>
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
      isShowAddLang: false,
      lang: {
        langIndex: '',
        langCode: '',
        langZhName: '',
        langEnName: '',
        isHot: ''
      },
      imageUrl: 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg',
      fileRaw: {}
    }
  },
  created () {
    this.$bus.on('addLangBox', () => {
      this.isShowAddLang = true
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
    determine () {
      this.isShowAddLang = false
    },
    cancel () {
      this.isShowAddLang = false
      this.fileRaw = {}
      this.imageUrl = 'http://course-assets.talkmate.com/course/icons/ENG-3x.webp?v=4&imageView2/0/w/200/h/200/format/jpg'
    }
  },
  beforeDestroy () {
    this.$bus.off('addLangBox')
  }
}
</script>

<style lang="scss" scoped>
.add-lang-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
}
.add-lang-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:860px;
  height:530px;
  background:rgba(245,246,250,1);
  border-radius:4px;
  table {
    padding: 30px 38px 25px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    th {
      padding-bottom: 20px;
      text-align: left;
      &:nth-child(4) {
        padding-right: 200px;
      }
    }
    input {
      width:120px;
      height:30px;
      border-radius:2px;
      border:1px solid rgba(0,0,0,.1);
      margin-right: 10px;
      padding: 0 10px;
      background: #F5F6FA;
    }
    .langIndex {
      input {
        width: 20px;
        margin-right: 20px;
      }
    }
    .isHot {
      input {
        width: 40px;
        margin-right: 40px;
      }
    }
    .upload {
      display: block;
      width: 30px;
      height: 30px;
      border:1px solid rgba(0,0,0,.1);
      border-radius: 2px;
      text-align: center;
      .avatar-uploader-icon {
        line-height: 30px;
        color: #007AFF;
      }
    }
  }
  .bottom-content {
    padding: 30px 0 40px;
    .img-box {
      width:210px;
      height:210px;
      background:rgba(239,239,239,1);
      border-radius:4px;
      margin: 0 auto;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin-bottom: 20px;
      }
      span {
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,.4);
        line-height:20px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 40px;
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
