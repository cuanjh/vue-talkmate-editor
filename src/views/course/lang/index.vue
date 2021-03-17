<template>
  <div class="lang-manage">
    <div class="top-bar">
      <el-input v-model="searchKey" @input="search" clearable placeholder="请输入要查找的语言"></el-input>
      <div class="btn-area">
        <el-button style="outline:none;" type="primary" class="btnAdd" @click="addLang()">创建新语言</el-button>
        <el-button style="outline:none;" type="primary" class="btnSort" @click="previewSort()">语言排序</el-button>
        <el-button
            v-show="false"
            style="outline:none;"
            type="success"
            class="btnOnline"
            @click="onlineCourse">批量上线</el-button>
      </div>
    </div>
    <el-table
      height="700px"
      :data="langList"
      @select="select"
      @select-all="selectAll"
      style="width: 100%;">
      <el-table-column
        type="selection"
        :selectable="selectable"
        width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        width="50"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(pageRequest.pageNo - 1) * pageRequest.pageSize + 1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="排序号"
        width="80"
        prop="list_order">
      </el-table-column> -->
      <el-table-column
        label="编码"
        width="80"
        prop="lan_code">
      </el-table-column>
      <el-table-column
        label="名称">
        <template slot-scope="scope" v-if="Object.keys(scope.row.title).length">
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
      <!-- <el-table-column
        width="200"
        label="描述">
        <template slot-scope="scope" v-if="Object.keys(scope.row.desc).length">
          <div v-for="l in langInfos" :key="l.langKey">
            <el-tooltip :content="l.name + ': ' +  (scope.row.desc['' + l.langKey + ''] ? scope.row.desc['' + l.langKey + ''] : '') + ' '" width="300" placement="top" effect="light">
              <span>{{ l.name + ': ' +  (scope.row.desc['' + l.langKey + ''] ? scope.row.desc['' + l.langKey + ''] : '') + ' ' }}</span>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
        </template>
      </el-table-column> -->
      <el-table-column
        label="上线课程数"
        width="100"
        prop="total">
      </el-table-column>
      <el-table-column
        width="80"
        label="图标">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.flag.length > 0"
            class="lang-img"
            :src="(assetsUrl + scope.row.flag[scope.row.flag.length - 1]) | urlFix('imageView2/1/format/jpg')"
            fit="cover">
            <div slot="error"  >
              <el-image :lazy="true" fit="cover" :src="talkmateLogo">
              </el-image>
            </div>
          </el-image>
          <el-image
            v-else
            class="lang-img"
            :src="talkmateLogo"
            fit="cover"></el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="书写顺序">
        <template slot-scope="scope">
          {{scope.row.word_direction == 'l2r' ? '从左到右' : '从右到左'}}
        </template>
      </el-table-column> -->
      <el-table-column
        width="100"
        label="是否显示">
        <template slot-scope="scope">
          <i :class="scope.row.is_show ? 'icon-yes' : 'icon-no'"></i>
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="是否热门">
        <template slot-scope="scope">
          <i :class="scope.row.is_hot ? 'icon-yes' : 'icon-no'"></i>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageRequest.pageNo"
        :page-sizes="pageSizes"
        :page-size="pageRequest.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageRequest.total">
      </el-pagination>
    </div>
    <edit-comp ref="edit" @addNewLang="updateNewLang" :langInfos="langInfos" :langList="langList"/>
    <!-- <sort-course-comp ref="sorLang" @sortLang="updateNewLang"/> -->
    <sort-course-comp ref="sorLang" @sortLang="updateNewLang"/>
    <dialog-online ref="dialogOnline" @confirm="confirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLangList, delLang, editLang, onlineCourses } from '@/api/course'
import DialogOnline from '@/components/dialogOnline'
import TalkmateLogo from '@/assets/images/icons/talkmate-logo.png'
import EditComp from './edit'
import SortCourseComp from './sortCourse'

export default {
  data () {
    return {
      allLangs: [],
      langList: [],
      selLangList: [],
      talkmateLogo: TalkmateLogo,
      assetsUrl: '',
      searchKey: '',
      // 分页信息
      pageRequest: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    EditComp,
    SortCourseComp,
    DialogOnline
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      assetsDomain: state => state.course.assetsDomain,
      langInfos: state => state.course.langInfos,
      userInfo: state => state.user.userInfo,
      pageSizes: state => state.pageSizes
    })
  },
  methods: {
    // 添加新课程
    updateNewLang () {
      this.initData()
    },
    async initData () {
      let res = await getLangList({
        title: this.searchKey,
        pageNo: this.pageRequest.pageNo,
        pageSize: this.pageRequest.pageSize
      })
      if (res.success) {
        this.langList = res.data.list
        this.pageRequest.total = res.data.total
        this.assetsUrl = res.data.assetsUrl
        setTimeout(() => {
          document.querySelector('.admin-box').scrollTop = 0
          const scrollTblEle = document.querySelector('.el-table--scrollable-y .el-table__body-wrapper')
          if (scrollTblEle) {
            scrollTblEle.scrollTop = 0
          }
        }, 100)
      }
    },
    handleSizeChange (val) {
      this.pageRequest.pageSize = val
      this.initData()
    },
    handleCurrentChange (val) {
      this.pageRequest.pageNo = val
      this.initData()
    },
    search () {
      this.handleCurrentChange(1)
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
        delLang({ lan_code: code }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
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
      let obj = {
        allLangs: this.allLangs,
        assetsUrl: this.assetsUrl
      }
      this.$refs.sorLang.show(obj)
    },
    confirm (item) {
      let envDesc = '测试环境'
      if (item.dbEnv === 'online') {
        envDesc = '正式环境'
      }
      this.$confirm(`确定要上线${envDesc}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let arr = []
        if (this.selLangList.length) {
          this.selLangList.forEach(i => {
            arr.push(i.lan_code)
          })
        }
        onlineCourses({ onlineType: item.dbEnv, hasLangs: true, tagLangs: arr }).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '上线成功'
            })
            this.selCourseList = []
            this.initData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上线'
        })
      })
    },
    onlineCourse () {
      this.$refs['dialogOnline'].show()
    },
    select (selection, row) {
      this.selLangList = selection
    },
    selectAll (selection) {
      this.selLangList = selection
    },
    selectable (row, index) {
      if (row.total > 0) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
  max-width: 500px;
  line-height: 20px;
}
.lang-manage .el-table .cell {
  line-height: 26px;
}
</style>
