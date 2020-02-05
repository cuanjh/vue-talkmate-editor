<template>
  <div
    :class="['folder', {'cur-active': !isShow}]"
    @contextmenu="contentmenu"
    @dblclick="dblclickFolder"
    @click="clickFolder">
    <div class="name">
      <div class="icon">
        <el-image
          v-show="folderFlagUrl"
          :src="folderFlagUrl"
          lazy
          fit="cover"></el-image>
        <i class="el-icon-document" v-show="folder.type == 'content'"></i>
      </div>
      <div class="title">
        <span v-show="isShow">{{ title }}</span>
        <input ref="input" type="text" v-show="!isShow" v-model="title" @blur="blurFolder">
      </div>
    </div>
    <div class="arror">
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
      assetsDomain: state => state.course.assetsDomain
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
      }, 0)
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
      editCatalog(obj)
      this.isShow = true
    },
    contentmenu (ev) {
      this.$emit('contentMenu', { event: ev, folder: this.folder, trackNum: this.trackNum })
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
      border-radius: 50%;
    }
  }
  .arror {
    margin-right: 18px;
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
