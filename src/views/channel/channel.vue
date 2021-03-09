<template>
  <div class="channel-container">
    <div class="channel-content">
      <div class="top-bar">
        <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的名称"></el-input>
        <div class="right">
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="addChannel()">添加</el-button>
          <el-button style="outline:none;" type="primary" class="btnAdd" @click="sortChannel()">排序</el-button>
        </div>
      </div>
      <el-table
        :data="channelList"
        style="width: 100%;">
        <el-table-column
          label="序号"
          width="80"
          type="index"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          width="300"
          label="uuid"
          prop="uuid">
        </el-table-column> -->
        <el-table-column
          label="名称">
          <template slot-scope="scope" v-if="Object.keys(scope.row.title).length">
            <div v-for="l in langInfos" :key="l.langKey">
              <span>{{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="是否展示">
          <template slot-scope="scope">
            {{ scope.row.isShow ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          :sort-method="sortPos"
          label="展示位置">
          <template slot-scope="scope">
            <el-tag :type="scope.row.showPos == 'index' ? 'success' : 'primary'">{{ scope.row.showPos == 'index' ? '发现首页' : '列表页' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="editChannel(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="deleteTag(scope.row.uuid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-comp ref="channelEdit" @refresh="initData"/>
    <sort-comp ref="channelSort" @refresh="initData"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  delDisChannel,
  getDisChannelList
} from '@/api/course'
import EditComp from './channelEdit'
import SortComp from './channelSort'

export default {
  data () {
    return {
      searchKey: '',
      allChannels: [],
      channelList: []
    }
  },
  components: {
    EditComp,
    SortComp
  },
  created () {
    this.initData()
  },
  computed: {
    ...mapState({
      langInfos: state => state.course.langInfos
    })
  },
  mounted () {
  },
  methods: {
    async initData () {
      let res = await getDisChannelList()
      this.allChannels = res.data.channels
      // .sort(this.sortPos).sort((a, b) => {
      //   return a.listOrder - b.listOrder
      // })
      this.channelList = this.allChannels.filter(item => {
        let flag = false
        this.langInfos.forEach(i => {
          flag = flag || (item.title['' + i.langKey + ''] && (item.title['' + i.langKey + ''].indexOf(this.searchKey) > -1))
        })
        return flag
      })
    },
    // 模糊搜索
    search () {
      let _this = this
      console.log(_this.searchKey)
      this.channelList = this.allChannels.filter(item => {
        let flag = false
        this.langInfos.forEach(i => {
          flag = flag || (item.title['' + i.langKey + ''] && (item.title['' + i.langKey + ''].indexOf(this.searchKey) > -1))
        })
        if (item.uuid.indexOf(this.searchKey) > -1) {
          flag = true
        }
        return flag
      })
    },
    // 添加
    addChannel () {
      let obj = {
        type: 'add',
        listOrder: this.allChannels.length + 1
      }
      this.$refs.channelEdit.show(obj)
    },
    // 添加
    sortChannel () {
      this.$refs.channelSort.show(this.allChannels)
    },
    // 编辑
    editChannel (row) {
      let obj = {
        type: 'edit',
        params: row
      }
      this.$refs.channelEdit.show(obj)
    },
    // 删除
    deleteTag (uuid) {
      this.$confirm('此操作将永久删除该频道, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delDisChannel({ uuid: uuid }).then(res => {
          if (res.success) {
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    sortPos (a, b) {
      if (a.showPos > b.showPos) {
        return 1
      } else if (a.showPos < b.showPos) {
        return -1
      } else {
        return 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.channel-container {
  overflow: auto;
  flex: 1;
  padding-bottom: 50px;
}
.top-bar {
  padding: 20px 0px 0;
  display: flex;
  justify-content: space-between;
}
.el-input {
  width: 300px;
}

</style>
<style>
.channel-container .el-table td, .el-table th {
  padding: 14px 0!important;
}

.channel-container .el-table td div {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 46px;
}
</style>
