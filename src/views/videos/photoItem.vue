<template>
  <div class="picture-item" @mouseleave="isShow = false">
    <el-card :body-style="{ padding: '0px' }">
      <div class="img-wrap">
        <el-image v-if="picture.cover_url" :src="(domain + picture.cover_url) | urlFix('imageView2/1/format/jpg')" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="shade">
          <i class="el-icon-video-play" @click="playVideo(picture)"></i>
        </div>
      </div>
      <div style="padding: 14px;">
        <p><span>标题：</span>{{ picture.title['zh-CN'] + (picture.title['en'] ? '（' + picture.title['en'] + '）' : '') }}</p>
        <p><span>描述：</span>{{ picture.desc }}</p>
        <div class="bottom clearfix">
          <el-button type="text" class="button" @click="showEditPicture()">编辑</el-button>
          <el-button type="text" class="button" @click="delPicture()">删除</el-button>
          <el-button type="text" class="button" @click="download" v-show="false">下载</el-button>
          <el-tooltip class="item" effect="dark" :content="picture.video.mp4" placement="top">
            <el-button type="text" class="button btnLink" :id="`btnLink-${picture.uuid}-mp4`" @click="copyLink('mp4')">复制mp4</el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="picture.video.m3u8" placement="top">
            <el-button type="text" class="button btnLink" :id="`btnLink-${picture.uuid}-m3u8`" @click="copyLink('m3u8')">复制m3u8</el-button>
          </el-tooltip>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import {
  delVideo
} from '@/api/course'
export default {
  props: ['picture', 'domain'],
  data () {
    return {
      currentDate: new Date(),
      isShow: false,
      height: 0,
      width: 0,
      videoOptions: {}
    }
  },
  methods: {
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
    // 删除图片
    delPicture () {
      this.$confirm('此操作将永久删除该图片信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delVideo({ uuid: this.picture.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$emit('loadData')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 复制图片链接
    copyLink (ext) {
      let url = this.picture.video[ext]
      let clipboard = new Clipboard(`#btnLink-${this.picture.uuid}-${ext}`, {
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
    },
    playVideo (picture) {
      this.$emit('playVideo', picture.video)
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
  .img-wrap {
    position: relative;
    width: 100%;
    height: 165px;
    background: #f5f7fa;
    .shade {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba($color: #000000, $alpha: .1);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      i {
        color: #FFFFFF;
        font-size: 36px;
        cursor: pointer;
      }
    }
  }
  .el-image {
    width: 100%;
    height: 100%;
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
  .size {
    float: left;
    margin-top: 14px;
    font-size: 12px;
    color: #409EFF;
  }
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
