<template>
  <div class="picture-item" @mouseleave="isShow = false">
    <!-- <div class="img-box">
      <img :src="domain + picture.image_url" :key="picture._id" alt="" @click="lookPic()" @mousemove="isShow = true">
      <a href="javascript:;" class="icon edit" @click="showEditPicture()" v-show="isShow"><i></i></a>
      <a :href="domain + picture.image_url" download="" class="icon download" v-show="isShow"><i></i></a>
    </div>
    <el-popover
      v-show="picture.desc"
      ref="popover1"
      placement="top-start"
      width="260"
      trigger="hover">
      <div class="popover-content" v-html="picture.desc.replace(/(\r\n)|(\n)/g,'<br>')"></div>
    </el-popover>
    <p class="desc" v-show="picture.desc" v-popover:popover1 >{{picture.desc.split('\r\n')[0]}}</p> -->
    <el-card :body-style="{ padding: '0px' }">
      <el-image :src="(domain + picture.image_url) | urlFix('imageView2/1/format/jpg')" fit="cover" :preview-src-list="[domain + picture.image_url]">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <div style="padding: 14px;">
        <el-tooltip class="item" effect="dark" :content="picture.desc" placement="top">
          <div class="picture-desc" v-html="picture.desc.replace(/(\r\n)|(\n)/g,'<br>')"></div>
        </el-tooltip>
        <!-- <el-popover
          v-show="picture.desc"
          ref="popover1"
          placement="top-start"
          width="260"
          trigger="hover">
          <div class="popover-content" v-html="picture.desc.replace(/(\r\n)|(\n)/g,'<br>')"></div>
        </el-popover> -->
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="showEditPicture()">编辑</el-button>
          <el-button type="text" class="button" @click="download" v-show="false">下载</el-button>
          <el-button type="text" class="button btnLink" @click="copyLink">复制链接</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  props: ['picture', 'domain'],
  data () {
    return {
      currentDate: new Date(),
      isShow: false
    }
  },
  methods: {
    // ...mapActions([
    //   'getOnePicture'
    // ]),
    showEditPicture () {
      this.$emit('showEditPicture', this.picture)
    },
    // 查看大图图片
    lookPic () {
      console.log(this.picture)
      this.$emit('lookPic', this.picture)
    },
    // 下载图片
    download () {
      window.location.href = this.domain + this.picture.image_url
    },
    // 复制图片链接
    copyLink () {
      let url = this.picture.image_url
      let clipboard = new Clipboard('.btnLink', {
        text: () => {
          return url
        }
      })
      clipboard.on('success', e => {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      })
      clipboard.on('error', e => {
        this.$message({
          type: 'error',
          message: '复制失败'
        })
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.picture-item {
  position: relative;
  width: 300px;
  background: #fff;
  margin: 15px;
  .img-box {
    position: relative;
  }
  .el-image {
    width: 100%;
    height: 165px;
    object-fit: cover;
  }
  .desc {
    padding-top: 10px;
    font-size: 14px;
    color: #3C5B6F;
    max-width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin: 0;
    &:hover {
      cursor: pointer;
      color: #4b9be6;
    }
  }
  .icon {
    position: absolute;
    bottom: 20px;
  }
  .edit {
    width: 41px;
    height: 40px;
    right: 70px;
    i {
      display: inline-block;
      width: 100%;
      height: 100%;
      // background-image: url('../assets/images/icon-edit.svg');
      background-repeat: no-repeat;
      background-size: cover;
    }
    &:hover {
      opacity: .8;
    }
  }
  .download {
    width: 40px;
    height: 40px;
    right: 20px;
    i {
      display: inline-block;
      width: 100%;
      height: 100%;
      // background-image: url('../assets/images/icon-download.svg');
      background-repeat: no-repeat;
      background-size: cover;
    }
    &:hover {
      opacity: .8;
    }
  }
}

.bottom {
  margin-top: 10px;
  line-height: 12px;
  text-align: right;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.picture-desc {
  width: 250px;
  height: 18px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>

<style lang="css">
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}
</style>
