<template>
  <el-dialog
    title="在线人数实时统计"
    :visible.sync="dialogVisible"
    @close="close"
    width="80%">
    <div id="main" style="width: 90%; height: 400px;"></div>
  </el-dialog>
</template>

<script>
import {
  onlineLiveUserCount
} from '@/api/course'

import echarts from 'echarts'
import moment from 'moment'

export default {
  data () {
    return {
      myChart: null,
      date: '',
      interval: null,
      dialogVisible: false
    }
  },
  methods: {
    show (row) {
      this.loadData(row)
      this.interval = setInterval(() => {
        this.loadData(row)
      }, 1000 * 60)
      this.dialogVisible = true
    },
    loadData (row) {
      onlineLiveUserCount({ course_uuid: row.uuid }).then(res => {
        if (res.success) {
          this.initChartData(res.data.result)
        }
        console.log(res)
      })
    },
    initChartData (result) {
      this.myChart = echarts.init(document.getElementById('main'))
      let xData = []
      let yData = []
      if (result && result.length > 0) {
        this.date = moment(result[0].created_on).format('YYYY/MM/DD')
        result.forEach(item => {
          xData.push(moment(item.created_on).format('HH:mm:ss'))
          yData.push(item.number)
        })
      }
      let xName = '时间'
      if (this.date) {
        xName += ' (' + this.date + ')'
      }
      let option = {
        /* 鼠标悬浮显示数据 */
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          name: xName,
          nameLocation: 'middle',
          nameTextStyle: {
            lineHeight: 56
          },
          data: xData
        },
        yAxis: {
          minInterval: 1,
          splitNumber: 5,
          name: '人数',
          type: 'value'
        },
        series: [{
          data: yData,
          type: 'line'
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    close () {
      clearInterval(this.interval)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
