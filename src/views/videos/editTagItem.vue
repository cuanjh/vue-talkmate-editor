<template>
  <div class="edit-tag-item">
    <input type="text" :class="{'require': isRequire}"  v-model="tag.title">
    <a href="javascript:;" @click="editTag()">更新</a>
    <a href="javascript:;" @click="delTag()">删除</a>
  </div>
</template>

<script>
import {
  updateVideoTag,
  delVideoTag
} from '@/api/course'
export default {
  props: ['tag'],
  data () {
    return {
      isRequire: false
    }
  },
  watch: {
    tagKey () {
      if (this.tagKey) {
        this.isRequire = false
      } else {
        this.isRequire = true
      }
    }
  },
  computed: {
    tagKey () {
      return this.tag.TagKey
    }
  },
  methods: {
    editTag () {
      if (!this.tag.title) {
        this.isRequire = true
        return false
      }
      let params = {
        uuid: this.tag.uuid,
        title: this.tag.title
      }
      console.log(params)
      updateVideoTag(params).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.$emit('initData')
        } else {
          this.$message({
            message: '更新失败',
            type: 'warning'
          })
        }
      })
    },
    delTag () {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delVideoTag({ uuid: this.tag.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$emit('initData')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-tag-item {
  width: 418px;
  padding-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E2EBEF;
  input {
    font-size: 17px;
    color: #0A2B40;
    line-height: 24px;
    height: 24px;
    outline: none;
    width: 272px;
    padding: 4px;
    border: 1px solid rgba(0, 0, 0, .4)
  }
  a {
    font-size: 15px;
    font-weight: 400;
    color: #2C98F9;
    margin-left: 34px;
    &:last-child {
      color: #EE2759;
    }
  }
}
.require {
  border: 1px solid red;
}
</style>
