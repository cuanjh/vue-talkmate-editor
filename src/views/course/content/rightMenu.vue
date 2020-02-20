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
          <div class="menu-item" v-show="folder && folder.authorities && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid }) && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid })['auth'] == 'rw'">
            <div class="name" @click="resetAuthority">重置审核状态</div>
          </div>
          <div class="menu-item" v-show="folder && folder.authorities && folder.authorities.filter(item => {return item.examin_state == 1 ||  item.examin_state == 3}).length" @mouseenter="isShowAuthority1 = true" @mouseleave="isShowAuthority1 = false">
            <div class="name">
              审核
              <i class="el-icon-caret-right"></i>
            </div>
            <transition name="fade">
              <div class="authority-container" v-show="isShowAuthority1">
                <div class="authority-wrap">
                  <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="是否通过">
                      <el-radio-group
                        v-model="form.examin_state"
                        :disabled="folder && folder.authorities && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid }) && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid })['examin_state'] !== 0">
                        <el-radio :label="2">通过</el-radio>
                        <el-radio :label="3">不通过</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item
                      v-show="form.examin_state == 3"
                      label="原因"
                      prop="comment"
                      :rules="{
                        required: true, message: '原因不能为空', trigger: 'blur'
                      }">
                      <el-input
                        type="textarea"
                        v-model="form.comment"
                        :disabled="folder && folder.authorities && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid }) && folder.authorities.find(item => {return item.user_uuid == userInfo.uuid })['examin_state'] !== 0">
                      </el-input>
                    </el-form-item>
                    <el-form-item v-show="authorityUsers && authorityUsers.length">
                      <el-button type="primary" size="small" @click="onExamin">确定</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  setAuthority,
  submitExamin,
  resetExamin,
  examin
} from '@/api/course'
import { mapState } from 'vuex'
export default {
  props: ['userList', 'authorityUsers', 'authorityList'],
  data () {
    return {
      isShow: false,
      isShowAuthority: false,
      isShowAuthority1: false,
      editors: [],
      chiefEditors: [],
      authorities: [],
      left: 0,
      top: 0,
      folder: null,
      pUUID: '',
      type: '',
      trackNum: 0,
      form: {
        examin_state: 2,
        comment: ''
      }
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

        if (params.folder.authorities) {
          let obj = params.folder.authorities.find(item => {
            return item.user_uuid === this.userInfo.uuid
          })
          if (obj) {
            this.form.examin_state = obj.examin_state
            this.form.comment = obj.examin_state_info.comment
          }
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
      if (this.form.examin_state === 3) {
        this.$message({
          type: 'warning',
          message: '需要重置审核状态'
        })
        return false
      }
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
    },
    // 审核状态重置
    resetAuthority () {
      let obj = {
        catalog_uuid: this.folder.uuid
      }
      resetExamin(obj).then(res => {
        this.$message({
          type: 'success',
          message: res.msg
        })
        this.$emit('resetTrackData', { pUUID: this.folder.parent_uuid, trackNum: this.trackNum })
      })
    },
    // 审核
    onExamin () {
      this.$refs['form'].validate((valid) => {
        if (valid || this.form.examin_state === 2) {
          let userUUID = ''
          this.authorityUsers.forEach(u => {
            let obj = this.folder.authorities.find(a => {
              return a.user_uuid === u.uuid
            })
            if (obj && obj['auth']) {
              userUUID = u.uuid
            }
          })
          let obj = {
            catalog_uuid: this.folder.uuid,
            comment: this.form.comment,
            examin_state: this.form.examin_state,
            user_uuid: userUUID
          }
          // console.log(obj)
          examin(obj).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.$emit('resetTrackData', { pUUID: this.folder.parent_uuid, trackNum: this.trackNum })
          })
        } else {
          this.$message({
            type: 'warning',
            message: '请填写不通过原因'
          })
          return false
        }
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
    .handler {
      text-align: center;
      .el-button {
        margin: 10px 0;
      }
    }
    .el-form {
      width: 350px;
      padding-right: 20px;
      .el-button {
        margin-left: 80px;
      }
    }
  }
}
</style>
