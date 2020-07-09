<template>
  <el-dialog
    :title="'详情' + operateDesc"
    :visible.sync="dialogVisible"
    width="85%">
    <div class="content"  v-if="mold == '11' || mold == '12' || mold == '13'">
      <div class="data">
        <div class="title">更新后</div>
        <div class="list" v-if="newData && newData.length > 0">
          <el-card :body-style="{ padding: '10px' }" class="form" v-for="form in newData" :key="'new' + form.uuid">
            <div class="form-wrap">
              <div class="type">
                {{ typeDesc(form)}}
                <i v-show="form.sound" @click="playAudio(form.sound)"></i>
              </div>
              <div class="form-img">
                <el-image v-if="form.image" :src="assetsDomian + form.image | urlFix('imageView2/1/format/jpg')" fit="cover"></el-image>
              </div>
              <div class="text">
                {{ form.sentence }}
              </div>
            </div>
          </el-card>
        </div>
        <div class="list" v-else>
          无
        </div>
      </div>
      <div class="data">
        <div class="title">更新前</div>
        <div class="list" v-if="oldData && oldData.length > 0">
          <el-card :body-style="{ padding: '10px' }" class="form" v-for="form in oldData" :key="'old' + form.uuid">
            <div class="form-wrap">
              <div class="type">
                {{ typeDesc(form) }}
                <i v-show="form.sound" @click="playAudio(form.sound)"></i>
              </div>
              <div class="form-img">
                <el-image v-if="form.image" :src="assetsDomian + form.image | urlFix('imageView2/1/format/jpg')" fit="cover"></el-image>
              </div>
              <div class="text">
                {{ form.sentence }}
              </div>
            </div>
          </el-card>
        </div>
        <div class="list" v-else>
          无
        </div>
      </div>
    </div>
    <div class="catalog" v-else>
      <el-table
        :data="operateLogs"
        border
        style="width: 100%">
        <el-table-column
          width="80px"
          prop="sign">
        </el-table-column>
        <el-table-column
          label="分类">
          <template slot-scope="scope">
            <i :class="scope.row.type == 'content' ? 'el-icon-document' : 'el-icon-folder'"></i>
            <span v-if="scope.row.has_del">{{ ' (已删除)'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="目录名">
        </el-table-column>
        <el-table-column
          prop="list_order"
          label="目录序号">
        </el-table-column>
        <el-table-column
          width="150px"
          label="标题">
          <template slot-scope="scope">
            <div v-for="l in langInfos" :key="l.langKey">
              <span v-if="scope.row.title && scope.row.title['' + l.langKey + '']" v-text="l.name + ': ' + scope.row.title['' + l.langKey + '']"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="200px"
          label="描述">
          <template slot-scope="scope">
            <div v-for="l in langInfos" :key="l.langKey">
              <span v-if="scope.row.desc && scope.row.desc['' + l.langKey + '']" v-text="l.name + ': ' + scope.row.desc['' + l.langKey + '']"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="小图">
          <template slot-scope="scope">
            <div v-for="(f, index) in scope.row.flag" :key="'flag' + index">
              <el-image
                :lazy="true"
                v-if="f"
                style="width: 50px; height: 50px"
                :src="assetsDomian + f"
                fit="cover"></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="240px"
          label="大图">
          <template slot-scope="scope">
            <div class="cover-list">
              <el-image
                class="cover"
                v-for="(c, index) in scope.row.cover" :key="'cover' + index"
                :lazy="true"
                style="width: 100px; height: 50px"
                :src="assetsDomian + c"
                fit="cover"></el-image>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">关闭</el-button>
      <el-button type="primary" @click="rollback">回滚</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  findOperateLogDetails,
  rollbackOperateLog
} from '@/api/course'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dialogVisible: false,
      operateDesc: '',
      mold: '',
      reverseOL: [],
      operateLogs: [],
      newData: [],
      oldData: []
    }
  },
  computed: {
    ...mapState({
      assetsDomian: state => state.course.assetsDomain,
      contentTypes: state => state.course.contentTypes,
      langInfos: state => state.course.langInfos,
      courseOperateLogs: state => state.course.courseOperateLogs
    })
  },
  methods: {
    show (row) {
      console.log(row)
      this.mold = row.mold
      let operateDesc = this.formatMold(row)
      if (operateDesc) {
        this.operateDesc = ' (' + operateDesc + ')'
      }
      this.operateLogs = []
      let obj = {
        parent_uuid: row.parent_uuid,
        user_id: row.user_id,
        uuid: row.uuid,
        pattern: row.pattern
      }
      findOperateLogDetails(obj).then(res => {
        console.log(res)
        res.data.operate_log.forEach(i => {
          console.log(JSON.parse(i.content))
        })
        this.reverseOL = res.data.operate_log
        this.newData = JSON.parse(this.reverseOL[0].content)
        if (this.newData) {
          this.newData['sign'] = '更新后'
        }
        this.operateLogs.push(this.newData)
        if (res.data.operate_log.length === 2) {
          this.oldData = JSON.parse(this.reverseOL[1].content)
          if (this.oldData) {
            this.oldData['sign'] = '更新前'
          }
          this.operateLogs.push(this.oldData)
        }
      })
      this.dialogVisible = true
    },
    typeDesc (form) {
      let type = form.type
      let desc = ''
      let obj = this.contentTypes.find(i => {
        return i.type === type
      })
      if (obj) {
        desc = obj['name']
        if (form.has_del) {
          desc += ' (' + '已删除' + ')'
        }
      }
      return desc
    },
    formatMold (row) {
      let ret = ''
      let obj = this.courseOperateLogs.find(ol => {
        return ol.key === row.mold
      })
      if (obj) {
        ret = obj['name']
      }
      return ret
    },
    formatterIndex (row, column, cellValue, index) {
      let ret = '更新后'
      if (index === 1) {
        ret = '更新前'
      }
      return ret
    },
    rollback () {
      let row = this.reverseOL[1]
      console.log(row)
      this.$confirm('确认要回滚吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await rollbackOperateLog({ uuid: row.uuid })
        if (res.success) {
          this.$message({ type: 'success', message: '回滚成功' })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消回滚'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.data {
  .title {
    font-size: 16px;
    color: rgba(0, 0, 0, .8);
  }
  .list {
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    .form {
      width: 200px;
      height: 200px;
      margin: 5px;
      .form-wrap {
        .type {
          font-size: 13px;
          color: rgba(0, 0, 0, .6);
          margin-bottom: 5px;
           i {
            float: right;
            width: 13px;
            margin-left: 10px;
            height: 13px;
            background-image: url('../../../assets/images/course/icon-voice.png');
            background-repeat: no-repeat;
            background-size: cover;
            cursor: pointer;
          }
        }
        .text {
          font-size: 12px;
          padding: 5px 0;
        }
      }
    }
  }
}
.dialog-footer {
  text-align: center;
  display: block;
}

.cover-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 240px;
  .cover {
    margin: 5px;
  }
}
.form-img {
  height: 110px;
  background: rgba(0, 0, 0, .1);
  border-radius: 4px;
  overflow: hidden;
  .el-image {
    width: 100%;
  }
}
</style>
