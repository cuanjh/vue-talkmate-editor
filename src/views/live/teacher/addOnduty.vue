<template>
  <el-dialog
    title="排班"
    :visible.sync="dialogVisible"
    @close="close"
    width="730px">
    <div class="list">
      <div class="item" v-for="(item, index) in list" :key="index">
        <div class="left">
          <el-select class="mr10" v-model="list[index]['teacher']" filterable placeholder="请选择值班老师">
            <el-option
              v-for="t in teachers"
              :key="t.user_id"
              :label="t.live_nickname"
              :value="t.user_id">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="list[index]['range']"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="right" v-show="flag == 'add'">
          <el-button @click="minusFeilds(index)" v-show="index == 1 || list.length > 1" class="icon-plus-sub-fields" icon="el-icon-minus" circle></el-button>
          <el-button @click="addFeilds()" v-show="list.length - 1 == index" class="icon-plus-sub-fields" icon="el-icon-plus" circle></el-button>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="save">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

import {
  addAttendances,
  updateAttendance
} from '@/api/course'

// import {
//   uploadQiniu
// } from '@/utils/uploadQiniu'

export default {
  data () {
    return {
      dialogVisible: false,
      teachers: [],
      list: [],
      flag: 'add',
      formJson: '',
      formItem: {
        teacher: '',
        range: ''
      },
      form: {
        date: '',
        EndTime: '',
        livePullUrl: '',
        livePushUrl: '',
        onlineNumber: 0,
        realEndTime: '',
        realStartTime: '',
        roomId: 0,
        startTime: '',
        state: 0,
        userId: '',
        uuid: ''
      }
    }
  },
  computed: {
    ...mapState({
      uploadfileDomain: state => state.course.uploadfileDomain
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.flag = params.flag
      this.teachers = params.teachers
      this.dialogVisible = true
      this.formJson = JSON.stringify(this.formItem)
      if (this.flag === 'add') {
        this.$set(this.list, 0, JSON.parse(this.formJson))
      } else {
        this.form = params.info
        this.list = [{
          teacher: this.form.userId,
          range: [new Date(this.form.startTime * 1000), new Date(this.form.EndTime * 1000)]
        }]
        console.log(this.form, this.list)
      }
    },
    changeUpload (file, fileList) {
      this.photoFile = file
      this.form.photo = URL.createObjectURL(file.raw)
    },
    async save () {
      console.log(this.list)
      if (this.list.length) {
        if (this.flag === 'add') {
          let arr = []
          this.list.forEach(item => {
            if (item.teacher && item.range && item.range.length > 1) {
              let obj = {
                date: moment(item.range[0]).format('YYYY-MM-DD'),
                EndTime: item.range[1].getTime() / 1000,
                startTime: item.range[0].getTime() / 1000,
                userId: item.teacher
              }
              arr.push(obj)
              console.log(obj)
            }
          })
          if (arr.length > 0) {
            addAttendances(arr).then(res => {
              console.log(res)
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                })
                this.dialogVisible = false
                this.$emit('loadData')
              }
            })
          }
        } else {
          let item = this.list[0]
          if (item.teacher && item.range && item.range.length > 1) {
            let obj = {
              date: moment(item.range[0]).format('YYYY-MM-DD'),
              endTime: item.range[1].getTime() / 1000,
              startTime: item.range[0].getTime() / 1000,
              userId: item.teacher
            }
            console.log(obj)
            this.form.date = obj.date
            this.form.EndTime = obj.endTime
            this.form.startTime = obj.startTime
            this.form.userId = obj.userId
          }
          updateAttendance(this.form).then(res => {
            console.log(res)
            if (res.success) {
              this.$message({
                type: 'success',
                message: '保存成功'
              })
              this.dialogVisible = false
              this.$emit('loadData')
            }
          })
        }
      }
    },
    addFeilds () {
      this.list.push(JSON.parse(this.formJson))
    },
    minusFeilds (index) {
      this.list.splice(index, 1)
    },
    close () {
      this.$emit('loadData')
    }
  }
}
</script>

<style lang="scss" scoped>
.identify-photo {
  .el-image {
    width: 160px;
    height: 90px;
    border-radius: 4px;
    margin-right: 20px;
  }
}

.list {
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid rgba($color: #000000, $alpha: .1);
    .left {
      display: flex;
      flex-direction: row;
    }
    .right {}
  }
}

.icon-plus-sub-fields {
  font-size: 12px;
  margin-left: 5px;
}

.dialog-footer {
  display: block;
  text-align: center;
}
</style>
