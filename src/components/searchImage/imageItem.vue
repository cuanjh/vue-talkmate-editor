<template>
  <div class="picture-item" @click="checked(picture)">
    <el-card :body-style="{ padding: '0px' }">
      <div class="img-wrap">
        <el-image v-if="picture.image_url" :src="(domain + picture.image_url) | urlFix('imageView2/1/format/jpg')" fit="cover">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="shade">
          <div class="checked" v-show="checkedUuid === picture._id">
            <i class="el-icon-check"></i>
          </div>
          <div class="desc">
            <el-tooltip :content="picture.desc">
              <p><span>描述：</span>{{ picture.desc }}</p>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  props: ['picture', 'domain', 'checkedUuid'],
  data () {
    return {
      currentDate: new Date(),
      height: 0,
      width: 0,
      videoOptions: {}
    }
  },
  methods: {
    checked (picture) {
      this.$emit('checked', picture)
    }
  }
}
</script>

<style lang="scss" scoped>
.picture-item {
  position: relative;
  width: 150px;
  background: #fff;
  margin: 15px;
  cursor: pointer;
  .img-box {
    position: relative;
  }
  .img-wrap {
    position: relative;
    width: 100%;
    height: 100px;
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
      .play {
        display: inline-block;
        color: #FFFFFF;
        font-size: 24px;
        cursor: pointer;
        margin: 0 auto;
      }
      .desc {
        position: absolute;
        width: 100%;
        bottom: 0;
        color: #FFFFFF;
        display: flex;
        flex-direction: column;
        justify-content: left;
        p {
          font-size: 12px;
          margin: 0 5px 2px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;/* for Opera */
          span {
            font-size: 12px;
          }
        }
      }
      .checked {
        position: absolute;
        top: -1px;
        right: 0;
        width: 25px;
        height: 25px;
        background: rgb(89, 216, 26);
        border-radius: 0 0 0 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        i {
          color: #FFFFFF;
          font-size: 20px;
        }
      }
    }
  }
  .el-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

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
