<template>
  <el-dialog
    title="标签分类"
    :visible.sync="dialogVisible"
    @close="close"
    width="30%">
    <div class="edit-tags">
      <div class="title">新建分类</div>
      <div :class="['add', {'require': isRequire}]">
        <input type="text" v-model="tagText" placeholder="请输入新的分类名称">
        <a href="javascript:;" @click="addTag()">保存</a>
      </div>
      <div class="title">编辑分类</div>
      <div class="tags">
        <div class="edit-tag-list" v-if="tags.length">
          <edit-tag-item
            v-for="tag in tags"
            :key="'aa' + tag.TagKey"
            @initData="initData()"
            :tag="tag"/>
        </div>
        <div class="no-tags" v-else>没有更多标签分类</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import EditTagItem from './editTagItem'
// import { compare } from '../assets/js/utils'
import {
  imagesTags,
  addImageTag
} from '@/api/course'

export default {
  data () {
    return {
      isRequire: false,
      dialogVisible: false,
      tags: [],
      tagText: ''
    }
  },
  components: {
    EditTagItem
  },
  watch: {
    tagText () {
      if (this.tagText.trim().length) {
        this.isRequire = false
      }
    }
  },
  methods: {
    ...mapActions([
      'addOneTag'
    ]),
    initData () {
      imagesTags().then(res => {
        if (res.success && res.data.tags && res.data.tags.length > 0) {
          this.tags = res.data.tags
        }
      })
    },
    show () {
      this.tagText = ''
      this.initData()
      this.dialogVisible = true
    },
    // 添加分类
    async addTag () {
      if (!this.tagText.trim()) {
        this.isRequire = true
        return false
      }
      console.log(this.tagText)

      let i = this.tags.findIndex(item => {
        return item.TagName === this.tagText.trim()
      })
      if (i > -1) {
        this.$notify({
          title: '警告',
          message: '分类已经存在',
          type: 'warning'
        })
        return false
      }
      try {
        let params = {
          tagKey: this.tagText
        }
        let res = await addImageTag(params)
        console.log(res)
        if (res.success) {
          this.tagText = ''
          this.initData()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加失败',
            type: 'warning'
          })
        }
      } catch (e) {
        console.log(e)
      }
    },
    close () {
      this.$emit('loadTags')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-tags {
  .title {
    margin-top: 10px;
    font-size: 12px;
    color: #0A2B40;
    line-height: 17px;
  }
  .add {
    margin-top: 10px;
    width: 410px;
    height: 40px;
    border-radius: 2px;
    border: 1px solid #A6B2BC;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    input {
      flex-grow: 1;
      outline: none;
      border: 0;
      font-size: 12px;
      margin-left: 20px;
    }
    a {
      width: 30px;
      margin-right: 20px;
      font-size: 15px;
      font-weight: 400;
      color: #2C98F9;
    }
  }
  .require {
    border-color: red;
  }
  .tags {
    padding-right: 30px;
    .edit-tag-list {
    }
  }
}

.no-tags {
  text-align: center;
  padding-top: 30px;
}
</style>

<style>
.el-dialog {
  min-width: 460px;
}
</style>
