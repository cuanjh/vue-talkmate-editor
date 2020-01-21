<template>
  <transition name="fade">
    <div class="right-menu-container" :style="{'left': left + 'px', 'top': top + 'px'}" v-show="isShow">
      <div class="menu">
        <div class="menu-group">
          <div class="menu-item">
            <div class="name">预览</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group">
          <div class="menu-item">
            <div class="name">{{ type == 'folder' ? '新建子目录' : '新建目录' }}</div>
          </div>
          <div class="menu-item">
            <div class="name">
              <span>新建文件</span>
              <i class="el-icon-caret-right"></i>
            </div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group" v-show="type == 'folder'">
          <div class="menu-item">
            <div class="name">复制</div>
          </div>
          <div class="menu-item">
            <div class="name">粘贴</div>
          </div>
          <div class="menu-item">
            <div class="name" @click="rename">重命名</div>
          </div>
          <div class="menu-item">
            <div class="name">删除</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group" v-show="type == 'folder'">
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
      isShow: false,
      left: 0,
      top: 0,
      folder: null,
      type: ''
    }
  },
  methods: {
    show (params) {
      let ev = params.event
      this.left = ev.x + 20
      this.top = ev.y
      this.folder = params.folder
      this.type = params.type
      this.isShow = true
      console.log(params)
    },
    hide () {
      this.isShow = false
    },
    rename () {
      let uuid = this.folder.uuid
      this.$emit('rename', uuid)
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
      &:hover {
        background: #007AFF;
        color: #fff;
      }
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
