<template>
  <transition name="fade">
    <div class="right-menu-container" :style="{'left': left + 'px', 'top': top + 'px'}">
      <div class="menu">
        <div class="menu-group">
          <div class="menu-item">
            <div class="name">预览</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group">
          <div class="menu-item">
            <div class="name">新建子目录</div>
          </div>
          <div class="menu-item">
            <div class="name">
              <span>新建文件</span>
              <i class="el-icon-caret-right"></i>
            </div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group">
          <div class="menu-item">
            <div class="name">复制</div>
          </div>
          <div class="menu-item">
            <div class="name">粘贴</div>
          </div>
          <div class="menu-item">
            <div class="name">重命名</div>
          </div>
          <div class="menu-item">
            <div class="name">删除</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group">
          <div class="menu-item">
            <div class="name">信息编辑</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      left: 0,
      top: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.right-menu-container {
  position: absolute;
  background: #F5F6FA;
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  border-radius:4px;
  font-size: 12px;
  font-weight: 400;
  color: #000;
  padding: 3px 0;
  .menu {
    width: 110px;
    .menu-item {
      padding: 3px 0;
      .name {
        padding-left: 10px;
      }
    }
    .line {
      width: 100%;
      height: 1px;
      margin: 2px 0;
      background: rgba($color: #000000, $alpha: 0.05)
    }
  }
}
</style>
