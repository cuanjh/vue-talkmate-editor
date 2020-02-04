<template>
  <transition name="fade">
    <div class="right-menu-container" :style="{'left': left + 'px', 'top': top + 'px'}" v-show="isShow">
      <div class="menu">
        <div class="menu-group" v-show="type == 'folder'">
          <div class="menu-item">
            <div class="name">预览</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group" v-show="folder && folder.type == 'catalog' || type == 'other'">
          <div class="menu-item">
            <div class="name" @click="addFolder">{{ type == 'folder' ? '新建子目录' : '新建目录' }}</div>
          </div>
          <div class="menu-item">
            <div class="name" @click="addDocument">
              <span>新建文件</span>
            </div>
          </div>
        </div>
        <div class="menu-group" v-show="type == 'folder'">
          <div class="menu-item">
            <div class="line"></div>
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
            <div class="name" @click="editCatalog">信息编辑</div>
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
      pUUID: '',
      type: '',
      trackNum: 0
    }
  },
  methods: {
    show (params) {
      let ev = params.event
      this.left = ev.x + 20
      this.top = ev.y
      if (params.type === 'other') {
        this.pUUID = params.pUUID
      } else {
        this.folder = params.folder
      }
      console.log(params.folder)
      this.type = params.type
      this.trackNum = params.trackNum
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    rename () {
      let uuid = this.folder.uuid
      this.$emit('rename', uuid)
    },
    addFolder () {
      let uuid
      if (this.type === 'other') {
        uuid = this.pUUID
      } else {
        uuid = this.folder.uuid
      }
      this.$emit('editCatalog', { handler: 'add', type: 'catalog', uuid: uuid, trackNum: this.trackNum })
    },
    addDocument () {
      let uuid
      if (this.type === 'other') {
        uuid = this.pUUID
      } else {
        uuid = this.folder.uuid
      }
      this.$emit('editCatalog', { handler: 'add', type: 'content', uuid: uuid, trackNum: this.trackNum })
    },
    editCatalog () {
      let uuid = this.folder.uuid
      this.$emit('editCatalog', { handler: 'edit', type: this.folder.type, uuid: uuid, folder: this.folder, trackNum: this.trackNum })
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
