<template>
  <div class="lang-manage">
    <div class="top-bar">
      <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的语言"></el-input>
      <div class="btn-area">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addLang()">添加</el-button>
        <el-button style="outline:none;" type="primary" class="btnSort" @click="previewSort()">预览排序</el-button>
      </div>
    </div>
    <el-table
      :data="showTableData"
      style="width: 100%;">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageRequest.pageNum - 1) * pageRequest.pageSize + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="排序号"
        width="80"
        prop="list_order">
      </el-table-column>
      <el-table-column
        label="编码"
        width="80"
        prop="lan_code">
      </el-table-column>
      <el-table-column
        width="150"
        label="名称">
        <template slot-scope="scope">
          <!-- <div v-for="l in langInfos" :key="l.langKey">
            {{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}
          </div> -->
          <div v-for="l in langInfos" :key="l.langKey">
            <el-tooltip :content="l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' '" width="300" placement="top" effect="light">
              <span>{{ l.name + ': ' +  (scope.row.title['' + l.langKey + ''] ? scope.row.title['' + l.langKey + ''] : '') + ' ' }}</span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        label="描述">
        <template slot-scope="scope" v-if="Object.keys(scope.row.desc).length">
          <!-- <div v-for="l in langInfos" :key="l.langKey">{{ l.name + ': ' +  (scope.row.desc['' + l.langKey + ''] ? scope.row.desc['' + l.langKey + ''] : '') + ' ' }}</div> -->
          <div v-for="l in langInfos" :key="l.langKey">
            <el-tooltip :content="l.name + ': ' +  (scope.row.desc['' + l.langKey + ''] ? scope.row.desc['' + l.langKey + ''] : '') + ' '" width="300" placement="top" effect="light">
              <span>{{ l.name + ': ' +  (scope.row.desc['' + l.langKey + ''] ? scope.row.desc['' + l.langKey + ''] : '') + ' ' }}</span>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="图标">
        <template slot-scope="scope">
          <el-image
            class="lang-img"
            :src="(scope.row.flag ? (assetsUrl + scope.row.flag[0]) : '') | urlFix('imageView2/1/format/jpg')"
            fit="cover">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="书写顺序">
        <template slot-scope="scope">
          {{scope.row.word_direction == 'l2r' ? '从左到右' : '从右到左'}}
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="是否热门">
        <template slot-scope="scope">
          {{scope.row.is_hot ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="是否显示">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.is_show">是</el-tag>
          <el-tag type="dange" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="300" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            @click="editLang(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            plain
            type="warning"
            @click="handleEdit(scope.row)">{{scope.row.is_show ? '隐藏' : '显示'}}</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="deleteLang(scope.row.lan_code)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box">
      <el-pagination
        background layout="prev, pager, next"
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="langList.length"
        >
      </el-pagination>
    </div>
    <edit-comp ref="edit" @addNewLang="updateNewLang" :langInfos="langInfos" :langList="langList"/>
    <sort-course-comp ref="sorLang" @sortLang="updateNewLang"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getLangList, delLang, editLang } from '@/api/course'
import EditComp from './edit'
import SortCourseComp from './sortCourse'

export default {
  data () {
    return {
      allLangs: [],
      langList: [],
      showTableData: [],
      assetsUrl: '',
      searchKey: '',
      // 分页信息
      pageRequest: {
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  components: {
    EditComp,
    SortCourseComp
  },
  created () {
    this.getConfigInfo()
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos
    })
  },
  methods: {
    ...mapActions({
      getConfigInfo: 'course/getConfigInfo'
    }),
    // 添加新课程
    updateNewLang () {
      this.initData()
      console.log(this.pageRequest.pageSize)
    },
    async initData () {
      let res = await getLangList({ 'pageNo': 0, 'pageSize': 999 })
      if (res.success) {
        let sortLangs = res.data.langs.sort((a, b) => {
          return a.list_order - b.list_order
        })
        this.allLangs = sortLangs
        this.langList = sortLangs
        this.handleCurrentChange(this.pageRequest.pageNum)
        this.assetsUrl = res.data.assetsUrl
      }
    },
    search () {
      let _this = this
      console.log(_this.searchKey)
      this.langList = this.allLangs.filter(item => {
        let flag = false
        this.langInfos.forEach(i => {
          flag = flag || (item.title['' + i.langKey + ''] && (item.title['' + i.langKey + ''].indexOf(_this.searchKey) > -1))
        })
        return flag
      })
      console.log(this.langList)
      console.log(this.showTableData)
      this.handleCurrentChange(1)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageRequest.pageSize = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageRequest.pageNum = val
      let starNum = (val - 1) * this.pageRequest.pageSize
      let endNum = val * this.pageRequest.pageSize
      this.showTableData = this.langList.slice(starNum, endNum)
    },
    // 编辑
    editLang (lang) {
      console.log(lang)
      this.$refs.edit.show('edit', lang)
    },
    // 添加
    addLang () {
      this.$refs.edit.show('add')
    },
    // 删除
    deleteLang (code) {
      console.log(code)
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        delLang({ lan_code: code }).then(res => {
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
    handleEdit (row) {
      console.log(row)
      let obj = {
        'lang_info': {}
      }
      obj['lan_code'] = row.lan_code
      obj.lang_info['desc'] = row.desc ? row.desc : {}
      obj.lang_info['flag'] = row.flag ? row.flag : []
      obj.lang_info['is_hot'] = row.is_hot
      obj.lang_info['is_show'] = !row.is_show
      obj.lang_info['list_order'] = row.list_order
      obj.lang_info['title'] = row.title ? row.title : {}
      obj.lang_info['word_direction'] = row.word_direction
      console.log(obj)
      editLang(obj).then(res => {
        console.log(res)
        if (res.success) {
          this.initData()
        }
      })
    },
    // 预览排序
    previewSort () {
      this.$refs.sorLang.show()
    }
  }
}
</script>

<style scoped lang="scss">
  .pagination-box {
    text-align: center;
    padding-top: 20px;
  }
  .lang-manage {
    padding: 20px;
  }
  .el-table {
    margin-top: 20px;
  }
  .el-input {
    width: 300px;
  }
  .btn-area {
    float: right;
  }
  .btnAdd {
    width: 100px;
    margin-right: 10px;
  }
  .btnSort {
    width: 100px;
    margin-right: 10px;
  }
  .lang-img {
    width: 50px;
    height: 50px;
    border-radius: 4px;
  }
  .el-table td div {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 46px;
  }

</style>
<style>
.el-tooltip__popper {
  max-width: 300px;
  max-height: 300px;
  overflow-y: auto;
  line-height: 20px;
}
</style>
