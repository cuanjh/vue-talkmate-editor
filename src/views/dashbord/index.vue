<template>
  <div class="online-list">
    <div class="online-nav">
      <a @click='changeTab(true)' :class="{ 'active': activeTab === true }">版本上线数据</a>
      <a @click='changeTab(false)' :class="{ 'active': activeTab === false }">目录上线数据</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
// import echarts from 'echarts'

export default {
  data () {
    return {
      activeTab: true,
      versionList: [],
      catalogList: []
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    this.versionList = this.onlineList.filter((item) => {
      item.time = this.timeMoment(item.created_time)
      return item.online_type === 'content_version'
    })
    this.catalogList = this.onlineList.filter((item) => {
      return item.online_type === 'catalog'
    })
    console.log(this.versionList, this.catalogList)
  },
  computed: {
    ...mapState({
      onlineList: state => state.course.onlineList
    })
  },
  methods: {
    ...mapActions({
      getOnlineList: 'course/getOnlineList'
    }),
    timeMoment (time) {
      let t = time * 1000
      return moment(t).format('MM.DD')
    },
    initData () {
      this.getOnlineList({ pageNo: 0, pageSize: 0 })
    },
    changeTab (value) {
      this.activeTab = value
    }
  }
}
</script>

<style lang="scss" scoped>
.online-nav {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #6d6d6d;
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 30px;
  a {
    cursor: pointer;
    display: inline-block;
    float: left;
    height: 40px;
    font-size:16px;
    font-weight:500;
    color:#3C5B6FFF;
    text-align: center;
    margin-right: 50px;
    line-height: 40px;
    border-bottom: 3px solid transparent;
    transition: none;
    &:hover {
      color: #2A9FE4;
    }
    &.active {
      color: #0581D1;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 3px solid #2A9FE4FF;
    }
  }
  a:last-child {
    margin-right: 0;
  }
}
</style>
