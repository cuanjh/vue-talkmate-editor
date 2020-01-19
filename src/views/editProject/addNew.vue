<template>
<transition name="fade">
  <div class="add-new-container" v-show="showAddEditor">
    <div class="content">
      <div class="table-box">
        <table>
          <tr>
            <th>序号</th>
            <th>编码</th>
            <th>名称<b>（中文）</b></th>
            <th>名称<b>（英文）</b></th>
            <th>小图</th>
            <th>大图</th>
          </tr>
          <tr>
            <td class="langIndex"><input type="text" v-model="lang.langIndex"></td>
            <td class="langCode"><input type="text" v-model="lang.langCode"></td>
            <td class="langZhName"><input type="text" v-model="lang.langZhName"></td>
            <td class="langEnName"><input type="text" v-model="lang.langEnName"></td>
            <td class="upload">
              <el-upload
                class="upload-btn"
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="fileChangeSml"
                :on-success="handleAvatarSuccessSml"
                :before-upload="handleBeforeUpload"
                :show-file-list="false"
                :auto-upload="false">
                <div id="upload-btn">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>
              </el-upload>
            </td>
            <td class="upload">
              <el-upload
              class="upload-btn"
                action="#"
                accept="image/png,image/jpg,image/jpeg"
                :on-change="fileChangeBig"
                :on-success="handleAvatarSuccessBig"
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
        <div class="small-img-box">
          <img :src="smallImageUrl" alt="">
          <span>小图</span>
        </div>
        <div class="big-img-box">
          <img :src="bigImageUrl" alt="">
          <span>大图</span>
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
      showAddEditor: false,
      lang: {
        langIndex: '',
        langCode: '',
        langZhName: '',
        langEnName: ''
      },
      smallImageUrl: '',
      smallFileRaw: {},
      bigImageUrl: '',
      bigFileRaw: {}
    }
  },
  methods: {
    show () {
      this.showAddEditor = true
    },
    fileChangeSml (file, fileList) {
      console.log(file)
      this.smallImageUrl = URL.createObjectURL(file.raw)
      console.log(this.smallImageUrl)
      this.smallFileRaw = file
    },
    handleAvatarSuccessSml (res, file) {
      console.log(res, file)
      this.smallImageUrl = URL.createObjectURL(file.raw)
    },
    fileChangeBig (file, fileList) {
      console.log(file)
      this.bigImageUrl = URL.createObjectURL(file.raw)
      console.log(this.bigImageUrl)
      this.bigFileRaw = file
    },
    handleAvatarSuccessBig (res, file) {
      console.log(res, file)
      this.bigImageUrl = URL.createObjectURL(file.raw)
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
      this.showAddEditor = false
    },
    cancel () {
      this.showAddEditor = false
      this.smallImageUrl = ''
      this.smallFileRaw = {}
      this.bigImageUrl = ''
      this.bigFileRaw = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.add-new-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,.7);
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width:860px;
    height:530px;
    background:rgba(245,246,250,1);
    border-radius:4px;
  }
  .table-box {
    table {
      width: 100%;
      padding: 30px 38px 25px;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      th {
        padding-bottom: 20px;
        text-align: left;
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,1);
        line-height:20px;
        b {
          font-size: 10px;
          font-weight: 500;
        }
        &:nth-child(5) {
          width: 50px;
        }
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
      .upload {
        width: 30px;
        height: 30px;
        border-radius: 2px;
        text-align: center;
        .avatar-uploader-icon {
          line-height: 30px;
          color: #007AFF;
        }
        .upload-btn {
          width: 30px;
          height: 30px;
          border:1px solid rgba(0,0,0,.1);
        }
      }
    }
  }
  .bottom-content {
    padding: 70px 100px 0px;
    span {
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,.4);
      line-height:20px;
    }
    .small-img-box {
      display: inline-block;
      width:120px;
      border-radius:4px;
      text-align: center;
      margin-right: 120px;
      img {
        display: inline-block;
        width:120px;
        height:120px;
        object-fit: cover;
        border-radius:4px;
        margin-bottom: 20px;
        background: #EFEFEF;
      }
    }
    .big-img-box {
      display: inline-block;
      width:400px;
      border-radius:4px;
      text-align: center;
      img {
        display: inline-block;
        width:400px;
        height:120px;
        object-fit: cover;
        border-radius:4px;
        margin-bottom: 20px;
        background: #EFEFEF;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    margin-top: 98px;
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
