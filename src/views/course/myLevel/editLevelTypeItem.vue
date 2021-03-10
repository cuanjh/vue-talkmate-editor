<template>
  <div class="edit-tag-item">
    <input type="text" :class="{'require': isRequire}"  v-model="item.title">
    <a href="javascript:;" @click="edit()">更新</a>
    <a href="javascript:;" @click="delTag()">删除</a>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  updateLevelType,
  delLevelType
} from '@/api/course'
export default {
  props: ['item'],
  data () {
    return {
      isRequire: false
    }
  },
  watch: {
    title () {
      if (this.title) {
        this.isRequire = false
      } else {
        this.isRequire = true
      }
    }
  },
  computed: {
    title () {
      return this.item.title
    }
  },
  methods: {
    ...mapActions({
      getLevelTypeList: 'course/getLevelTypeList',
      updateLevelType: 'course/updateLevelType'
    }),
    loadData () {
      this.getLevelTypeList({ pageNo: 1, pageSize: 99 })
    },
    edit () {
      console.log(this.item)
      if (!this.item.title) {
        this.isRequire = true
        return false
      }
      let params = {
        title: this.item.title,
        uuid: this.item.uuid
      }
      console.log(params)
      updateLevelType(params).then(res => {
        if (res.success) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.loadData()
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
        delLevelType({ uuid: this.item.uuid }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.loadData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
  border: 1px solid red !important;
}
</style>
