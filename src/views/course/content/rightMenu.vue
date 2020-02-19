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
        <div class="menu-group">
          <div class="menu-item" v-show="type == 'folder'">
            <div class="line"></div>
            <div class="name" @click="copy">复制</div>
          </div>
          <div class="menu-item">
            <div class="name" @click="paste">粘贴</div>
          </div>
          <div class="menu-item" v-show="type == 'folder'">
            <div class="name" @click="rename">重命名</div>
          </div>
          <div class="menu-item" v-show="type == 'folder'">
            <div class="name" @click="del">删除</div>
          </div>
          <div class="line"></div>
        </div>
        <div class="menu-group" v-show="type == 'folder'">
          <div class="menu-item">
            <div class="name" @click="editCatalog">信息编辑</div>
          </div>
        </div>
        <div class="menu-group" v-show="type == 'folder'">
          <div class="line"></div>
          <div class="menu-item" v-show="authorityUsers && authorityUsers.length" @mouseenter="isShowAuthority = true" @mouseleave="isShowAuthority = false">
            <div class="name">
              权限设置
              <i class="el-icon-caret-right"></i>
            </div>
            <transition name="fade">
              <div class="authority-container" v-show="isShowAuthority">
                <div class="authority-wrap" v-if="authorities.length">
                  <div class="user-item" v-for="item in authorityUsers" :key="item.uuid">
                    <div class="name">{{ item.nickName }}</div>
                    <el-radio-group v-model="authorities.find(a => { return a['user_uuid'] == item.uuid })['authority']">
                      <el-radio label="">无</el-radio>
                      <el-radio label="r">只读</el-radio>
                      <el-radio label="rw">可读可编辑</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="handler">
                    <el-button size="small" type="primary" @click="authoritySetFn">保存</el-button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
          <div class="menu-item" v-show="folder && folder.authorities && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid }) && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid })['auth'] == 'rw'">
            <div class="name" @click="submitAuthority">提交审核</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  setAuthority,
  submitExamin
} from '@/api/course'
import { mapState } from 'vuex'
export default {
  props: ['userList', 'authorityUsers', 'authorityList'],
  data () {
    return {
      isShow: false,
      isShowAuthority: false,
      editors: [],
      chiefEditors: [],
      authorities: [],
      left: 0,
      top: 0,
      folder: null,
      pUUID: '',
      type: '',
      trackNum: 0
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 当前用户的审核权限
    curUserAuthority () {
      let obj = null
      if (this.authorityList && this.authorityList.length) {
        obj = this.authorityList.find(item => {
          return item.authorityId === this.userInfo.authorityId
        })
      }
      return obj
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
        this.authorities = []
        if (this.authorityUsers && this.authorityUsers.length) {
          this.authorityUsers.forEach(item => {
            let auth = ''
            if (params.folder.authorities) {
              let a = params.folder.authorities.find(i => {
                return i.user_uuid === item.uuid
              })
              if (a) {
                auth = a['auth']
              }
            }
            let obj = {
              authority: auth,
              user_uuid: item.uuid
            }
            this.authorities.push(obj)
          })
        }
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
    copy () {
      let uuid = this.folder.uuid
      this.$emit('copy', uuid)
    },
    paste () {
      let num = this.trackNum
      if (this.type === 'other') {
        num = num + 1
      }
      this.$emit('paste', { trackNum: num })
    },
    del () {
      let num = this.trackNum
      this.$emit('del', { trackNum: num, folder: this.folder })
    },
    addFolder () {
      let uuid
      if (this.type === 'other') {
        uuid = this.pUUID
      } else {
        uuid = this.folder.uuid
      }
      this.$emit('editCatalog', { handler: 'add', type: 'catalog', uuid: uuid, trackNum: this.trackNum, clickType: this.type })
    },
    addDocument () {
      let uuid
      if (this.type === 'other') {
        uuid = this.pUUID
      } else {
        uuid = this.folder.uuid
      }
      this.$emit('editCatalog', { handler: 'add', type: 'content', uuid: uuid, trackNum: this.trackNum, clickType: this.type })
    },
    editCatalog () {
      let uuid = this.folder.uuid
      this.$emit('editCatalog', { handler: 'edit', type: this.folder.type, uuid: uuid, folder: this.folder, trackNum: this.trackNum, clickType: this.type })
    },
    // 权限设置
    authoritySetFn () {
      console.log(this.authorities)
      let obj = {
        authorities: this.authorities,
        type: 'catalog',
        uuid: this.folder.uuid
      }
      console.log(obj)
      setAuthority(obj).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('resetTrackData', { pUUID: this.folder.parent_uuid, trackNum: this.trackNum })
      })
    },
    // 提交审核
    submitAuthority () {
      this.$confirm('确认要提交审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = {
          catalog_uuid: this.folder.uuid
        }
        submitExamin(obj).then(res => {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.$emit('resetTrackData', { pUUID: this.folder.parent_uuid, trackNum: this.trackNum })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交审核'
        })
      })
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
      position: relative;
      padding: 3px 0;
      &:hover {
        background: #007AFF;
        color: #fff;
      }
      .name {
        padding-left: 10px;
        i {
          float: right;
          margin-right: 6px;
        }
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
.authority-container {
  position: absolute;
  background: #F5F6FA;
  box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
  margin-left: 110px;
  margin-top: -22px;
  border-radius: 4px;
  .authority-wrap {
    padding: 5px;
    .user-item {
      width: 400px;
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      .name {
        width: 100px;
        color: #000;
      }
    }
    .chief-user-item {
      width: 200px;
      margin: 20px;
    }
    .handler {
      text-align: center;
      .el-button {
        margin: 10px 0;
      }
    }
  }
}
</style>
