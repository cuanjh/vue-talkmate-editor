<template>
  <div class="online-list">
    <div id="main" style="width: 90%; height: 400px;"></div>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="50%">
      <el-table
      :data="itemLine"
      style="width: 100%">
      <el-table-column
        prop="created_time"
        label="日期"
        :formatter="formatterDate"
        width="180">
      </el-table-column>
      <el-table-column
        prop="job_name"
        label="上线任务名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="online_type"
        :formatter="formatterType"
        label="类型"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          <span>{{states[scope.row.state]}}</span>
        </template>
      </el-table-column>
    </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import echarts from 'echarts'

export default {
  data () {
    return {
      dialogVisible: false,
      itemLine: [],
      myChart: null,
      types: {
        '版本上线数据': 'content_version',
        '目录上线数据': 'catalog'
      },
      states: {
        '0': '还没执行',
        '1': '正在执行',
        '2': '执行完成'
      }
    }
  },
  created () {
  },
  mounted () {
    console.log(this.userInfo)
    if (this.userInfo.authorityId === '1') {
      this.initData()
      this.initEchart()
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      onlineList: state => state.course.onlineList
    })
  },
  methods: {
    ...mapActions({
      getOnlineList: 'course/getOnlineList'
    }),
    initEchart () {
      this.myChart = echarts.init(document.getElementById('main'))
      let b = this.addDate(new Date(), -29)
      let days = this.getDays(b, 29)
      console.log(days)
      let versionList = _.fill(Array(days.length), '')
      let catalogList = _.fill(Array(days.length), '')
      days.forEach((item, index) => {
        this.onlineList.forEach(el => {
          if (el.time === item) {
            if (el.online_type === 'content_version') {
              if (versionList[index] === '') {
                versionList[index] = 0
              }
              versionList[index] = versionList[index] + 1
            } else if (el.online_type === 'catalog') {
              if (catalogList[index] === '') {
                catalogList[index] = 0
              }
              catalogList[index] = catalogList[index] + 1
            }
          }
        })
      })
      console.log(versionList, catalogList)
      var option = {
        /* 柱状图颜色 */
        color: ['#06a45f', '#078ed6'],
        /* 四周边距(单位默认px，可以使用百分比) */
        grid: {
          left: 40,
          top: 60,
          right: 50,
          bottom: 30
        },
        /* 鼠标悬浮显示数据 */
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        /* 图例说明 */
        legend: {
          // 图例排项 vertical-"竖向"; horizontal-"横向"
          orient: 'horizontal',
          // 图例组件离容器左侧的距离
          right: 40,
          top: 0,
          // 图例文字的样式
          textStyle: {
            color: '#6ab2ec'
          },
          // 与series中每个name对应
          data: ['版本上线数据', '目录上线数据']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            name: '日期',
            // 设置轴线的属性
            axisLine: {
              lineStyle: {
                color: '#6ab2ec'
              }
            },
            data: days
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '上线次数',
            // 控制网格线是否显示
            splitLine: {
              show: true,
              // 改变轴线颜色
              lineStyle: {
                // 使用深浅的间隔色
                color: ['#132a6e']
              }
            },
            // 设置轴线的属性
            axisLine: {
              lineStyle: {
                color: '#6ab2ec'
              }
            }
          }
        ],
        series: [
          {
            name: '版本上线数据',
            type: 'bar',
            /* 柱子的显示宽度 */
            barWidth: '40%',
            data: versionList,
            /* 显示柱子数据 */
            label: {
              normal: {
                show: true,
                // 数据在柱子头部显示
                position: 'top',
                textStyle: {
                  color: '#5475c7',
                  fontSize: 12
                }
              }
            }
          },
          {
            name: '目录上线数据',
            type: 'bar',
            barWidth: '40%',
            data: catalogList,
            label: {
              normal: {
                show: true,
                // 数据在柱子头部显示
                position: 'top',
                textStyle: {
                  color: '#5475c7',
                  fontSize: 12
                }
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
      this.clickChart()
    },
    clickChart () {
      this.myChart.on('click', (params) => {
        console.log(params)
        let time = params.name
        let type = this.types[params.seriesName]
        console.log(time, type)
        this.itemLine = this.onlineList.filter(item => {
          return item.time === time && item.online_type === type
        }).sort((a, b) => {
          return b.created_time - a.created_time
        })
        // this.itemLine = list[0]
        console.log(this.itemLine)
        this.dialogVisible = true
      })
    },
    getDays (now, days) {
      let list = []
      list.push(this.formant(now))
      for (let i = 0; i < days; i++) {
        let a = this.formant(this.addDate(now, 1))
        list.push(a)
      }
      // while (--days >= 0) {
      //   let a = this.formant(this.addDate(now, 1))
      //   list.push(a)
      // }
      return list
    },
    initData () {
      this.getOnlineList({ pageNo: 0, pageSize: 999999 })
    },
    formant (nowDate) {
      let year = nowDate.getFullYear()
      let month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1
      let day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
      return year + '/' + month + '/' + day
    },
    addDate (date, days) {
      date.setDate(date.getDate() + days)
      return date
    },
    formatterDate (row, column, cellValue, index) {
      return moment(new Date(parseInt(cellValue) * 1000)).format('YYYY-MM-DD HH:mm')
    },
    formatterType (row, column, cellValue, index) {
      if (cellValue === 'catalog') {
        return '课程目录'
      } else {
        return '课程版本'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.online-list {
  width: 100%;
  padding-top: 50px;
}
.el-dialog span {
  display: block;
  padding: 10px 0;
  &:last-child {
    padding-bottom: 0;
  }
}
</style>
