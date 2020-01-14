<template>
  <transition name="fade">
    <div class="add-version-container" v-show="isShow">
      <div class="add-version-wrap">
        <div class="close" @click="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="content">
          <div class="title">创建新版本</div>
          <table>
            <tr>
              <td>版本号：</td>
              <td>
                <input type="text" v-model="version">
                <a href="javascript:;">修改</a>
              </td>
            </tr>
            <tr>
              <td>课程内容：</td>
              <td>
                <div class="btn">复制现有版本<small>（适用于现有版本基础上的修改）</small></div>
                <div class="btn">重新编写内容<small>（适用于重建或较大的修改）</small></div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      version: 'V3'
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    close () {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.add-version-container {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.7);
  .add-version-wrap {
    position: relative;
    width: 500px;
    min-height: 300px;
    border-radius: 4px;
    background: #F5F6FA;
    .close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
    }
    .content {
      padding: 0 70px;
      .title {
        color: #000;
        font-size: 18px;
        font-weight: 600;
        line-height: 25px;
        text-align: center;
        margin-top: 40px;
      }
      table {
        width: 100%;
      }
    }
  }
}
</style>
