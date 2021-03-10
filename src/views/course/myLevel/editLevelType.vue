<template>
  <el-dialog
    title="等级分类管理"
    :visible.sync="dialogVisible"
    width="500px">
    <div class="edit-tags">
      <div class="title">新建</div>
      <div :class="['add', {'require': isRequire}]">
        <input type="text" v-model="title" placeholder="请输入新的等级分类名称">
        <a href="javascript:;" @click="add()">保存</a>
      </div>
      <div class="title">编辑</div>
      <div class="tags">
        <div class="edit-tag-list" v-if="levelTypeList && levelTypeList.length">
          <level-type-item
            v-for="item in levelTypeList"
            :key="item.uuid"
            :item="item"/>
        </div>
        <div class="no-tags" v-else>没有更多分类</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import LevelTypeItem from './editLevelTypeItem'
import {
  createLevelType
} from '@/api/course'

export default {
  data () {
    return {
      isRequire: false,
      dialogVisible: false,
      list: [],
      title: ''
    }
  },
  components: {
    LevelTypeItem
  },
  watch: {
    title () {
      if (this.title.trim().length) {
        this.isRequire = false
      }
    }
  },
  computed: {
    ...mapState({
      levelTypeList: state => state.course.levelTypeList
    })
  },
  methods: {
    ...mapActions({
      getLevelTypeList: 'course/getLevelTypeList'
    }),
    show () {
      this.title = ''
      this.dialogVisible = true
    },
    // 添加分类
    async add () {
      if (!this.title.trim()) {
        this.isRequire = true
        return false
      }
      console.log(this.title)

      let i = this.levelTypeList.findIndex(item => {
        return item.title === this.title.trim()
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
          title: this.title
        }
        let res = await createLevelType(params)
        console.log(res)
        if (res.success) {
          this.title = ''
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getLevelTypeList({ pageNo: 1, pageSize: 99 })
        } else {
          this.$message({
            message: '添加失败',
            type: 'warning'
          })
        }
      } catch (e) {
        console.log(e)
      }
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
