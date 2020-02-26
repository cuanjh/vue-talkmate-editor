<template>
  <div
    :class="['folder', {'cur-active': !isShow}]"
    @mouseenter="offline = false"
    @mouseleave="offline = baseOffline"
    @contextmenu="contentmenu"
    @dblclick="dblclickFolder"
    @click="clickFolder">
    <div class="name">
      <div class="icon">
        <el-image
          v-show="folderFlagUrl"
          :src="folderFlagUrl"
          fit="cover"></el-image>
        <i class="el-icon-document" v-show="!folderFlagUrl && folder.type == 'content'"></i>
      </div>
      <div :class="['title', {
        'warning': folder.has_changed,
        'auth-state1': folder.authorities && folder.authorities.find(item => item.user_uuid && userInfo.uuid) && folder.authorities.find(item => item.user_uuid && userInfo.uuid)['examin_state'] == 1,
        'auth-state3': folder.authorities && folder.authorities.find(item => item.user_uuid && userInfo.uuid) && folder.authorities.find(item => item.user_uuid && userInfo.uuid)['examin_state'] == 3,
        'auth-state2': folder.authorities && folder.authorities.find(item => item.user_uuid && userInfo.uuid) && folder.authorities.find(item => item.user_uuid && userInfo.uuid)['examin_state'] == 2
        }]">
        <span v-show="isShow">{{ title }}</span>
        <input ref="input" type="text" v-show="!isShow" v-model="title" @blur="blurFolder">
      </div>
    </div>
    <div class="arror">
      <span class="isShow" v-show="!folder.is_show"></span>
      <i class="icon-offline" v-show="false" @click="updateOffline"></i>
      <i class="el-icon-caret-right" v-show="folder.type == 'catalog'"></i>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  editCatalog
} from '@/api/course'
let timer = null
export default {
  props: ['folder', 'trackNum', 'name'],
  data () {
    return {
      isShow: true,
      offline: this.folder.is_show,
      baseOffline: this.folder.is_show,
      title: this.name,
      timer: null
    }
  },
  watch: {
    name (newVal, oldVal) {
      this.title = newVal
    }
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      userInfo: state => state.user.userInfo
    }),
    folderFlagUrl () {
      let url = ''
      if (this.folder && this.folder.flag && this.folder.flag.length) {
        url = this.assetsDomain + this.folder.flag[0]
      }
      return url
    }
  },
  methods: {
    clickFolder () {
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.$emit('clickFolder', { trackNum: this.trackNum, folder: this.folder })
      }, 300)
    },
    dblclickFolder () {
      clearTimeout(timer)
      this.title = this.name
      this.isShow = false
      setTimeout(() => {
        this.$refs['input'].focus()
      }, 100)
    },
    blurFolder () {
      let obj = {
        catalog_info: {
          cover: this.folder.cover,
          desc: this.folder.desc,
          flag: this.folder.flag,
          has_changed: true,
          list_order: this.folder.list_order,
          name: this.title,
          tags: this.folder.tags,
          title: this.folder.title
        },
        uuid: this.folder.uuid
      }
      editCatalog(obj).then(res => {
        this.$emit('resetTrackData', { pUUID: this.folder.parent_uuid, trackNum: this.trackNum })
        this.isShow = true
      })
    },
    contentmenu (ev) {
      this.$emit('contentMenu', { event: ev, folder: this.folder, trackNum: this.trackNum })
    },
    updateOffline () {
      let flag = !this.folder.is_show
      this.offline = flag
      this.baseOffline = flag
      let obj = {
        catalog_info: {
          cover: this.folder.cover,
          desc: this.folder.desc,
          flag: this.folder.flag,
          is_show: flag,
          has_changed: true,
          list_order: this.folder.list_order,
          name: this.title,
          tags: this.folder.tags,
          title: this.folder.title
        },
        uuid: this.folder.uuid
      }
      editCatalog(obj).then(res => {
        this.$emit('resetTrackData', { pUUID: this.folder.parent_uuid, trackNum: this.trackNum })
        this.isShow = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.folder {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  border: 1px solid transparent;
  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
    .icon {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin: 0 5px 0 10px;
    }
    .title {
      font-size: 14px;
      font-weight: 400;
      color: #000;
      flex: 1;
      max-width: 110px;
      span {
        display: block;
        padding: 2px 0;
      }
      input {
        border: 0;
        padding: 2px 0;
        background: #fff;
        width: 100%;
      }
    }
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .danger {
      color: #F56C6C;
    }
    .warning {
      color: #E6A23C;
    }
    // 待审核
    .auth-state1 {
      color: #409EFF;
    }
    // 审核不通过
    .auth-state3 {
      color: #F56C6C;
    }
    // 审核通过
    .auth-state2 {
      color: #67C23A;
    }
  }
  .arror {
    margin-right: 18px;
    .icon-offline {
      display: inline-block;
      width: 12px;
      height: 9px;
      background-image: url('../../../assets/images/course/icon-offline.png');
      background-size: cover;
      background-repeat: no-repeat;
      margin-right: 10px;
      cursor: pointer;
    }
    .isShow {
      display: inline-block;
      margin-right: 5px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #F56C6C;
    }
    i {}
  }
}

.active {
  background: #DCDCDC;
}

.cur-active {
  background: #007AFF;
  .name {
    .title {
      color: #fff;
    }
  }
}
.right-active {
  border: 1px solid #007AFF;
}
</style>
